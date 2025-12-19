import { NextRequest, NextResponse } from 'next/server';
import { stripe, MembershipPlanId } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Use service role for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const credits = parseInt(session.metadata?.credits || '0', 10);

  // Handle credit purchase
  if (credits > 0 && userId) {
    console.log(`Processing credit purchase for user ${userId}: +${credits} credits`);

    const { error: creditError } = await supabaseAdmin.rpc('add_credits', {
      p_user_id: userId,
      p_amount: credits,
      p_type: 'credit_purchase',
      p_payment_reference: session.id,
    });

    if (creditError) {
      console.error('Failed to add credits:', creditError);
      throw new Error('Failed to add credits');
    }

    console.log(`Successfully added ${credits} credits to user ${userId}`);
    return;
  }

  // For subscriptions, the subscription webhook handles it
  if (session.mode === 'subscription') {
    console.log('Subscription checkout completed, waiting for subscription webhook');
    return;
  }

  console.log('Checkout completed but no action taken:', session.id);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId as MembershipPlanId;

  if (!userId || !planId) {
    console.error('Missing metadata in subscription:', subscription.id);
    return;
  }

  console.log(`Processing subscription for user ${userId}, plan: ${planId}`);

  // Get period info from subscription items (Clover API structure)
  const subAny = subscription as unknown as Record<string, unknown>;
  const periodStart = subAny.current_period_start as number | undefined;
  const periodEnd = subAny.current_period_end as number | undefined;

  // Create or update membership record
  const { error: membershipError } = await supabaseAdmin
    .from('memberships')
    .upsert({
      user_id: userId,
      plan: planId,
      status: 'active',
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : new Date().toISOString(),
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    }, {
      onConflict: 'user_id',
    });

  if (membershipError) {
    console.error('Failed to create/update membership:', membershipError);
    throw new Error('Failed to create/update membership');
  }

  // Update profile membership tier
  await supabaseAdmin
    .from('profiles')
    .update({ membership_tier: 'investor' })
    .eq('id', userId);

  console.log(`Successfully activated investor membership for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  // Get period info from subscription (Clover API structure)
  const subAny = subscription as unknown as Record<string, unknown>;
  const periodStart = subAny.current_period_start as number | undefined;
  const periodEnd = subAny.current_period_end as number | undefined;
  const canceledAt = subAny.canceled_at as number | undefined;

  // Map Stripe status to our status
  let status: 'active' | 'cancelled' | 'expired' | 'past_due' = 'active';
  if (subscription.status === 'canceled') status = 'cancelled';
  else if (subscription.status === 'past_due') status = 'past_due';
  else if (subscription.status === 'unpaid') status = 'expired';

  const updateData = {
    status,
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : undefined,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : undefined,
    cancelled_at: canceledAt ? new Date(canceledAt * 1000).toISOString() : null,
  };

  if (!userId) {
    // Try to find user by subscription ID
    const { data: membership } = await supabaseAdmin
      .from('memberships')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!membership) {
      console.error('Could not find user for subscription:', subscription.id);
      return;
    }

    await supabaseAdmin
      .from('memberships')
      .update(updateData)
      .eq('stripe_subscription_id', subscription.id);

    // Update profile tier if cancelled
    if (status === 'cancelled' || status === 'expired') {
      await supabaseAdmin
        .from('profiles')
        .update({ membership_tier: 'free' })
        .eq('id', membership.user_id);
    }

    return;
  }

  await supabaseAdmin
    .from('memberships')
    .update(updateData)
    .eq('user_id', userId);

  // Update profile tier if cancelled
  if (status === 'cancelled' || status === 'expired') {
    await supabaseAdmin
      .from('profiles')
      .update({ membership_tier: 'free' })
      .eq('id', userId);
  }

  console.log(`Updated subscription status for user ${userId}: ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  // Update membership to cancelled
  const { data: membership } = await supabaseAdmin
    .from('memberships')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
    .select('user_id')
    .single();

  if (membership) {
    await supabaseAdmin
      .from('profiles')
      .update({ membership_tier: 'free' })
      .eq('id', membership.user_id);

    console.log(`Revoked membership for user ${membership.user_id}`);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Received Stripe event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed for invoice:', invoice.id);
        // Could send email notification here
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
