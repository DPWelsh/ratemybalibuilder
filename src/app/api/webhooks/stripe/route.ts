import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Use service role for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || '0', 10);

    if (!userId || !credits) {
      console.error('Missing metadata in session:', session.id);
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    console.log(`Processing payment for user ${userId}: +${credits} credits`);

    // Add credits to user's account
    const { error: creditError } = await supabaseAdmin.rpc('add_credits', {
      p_user_id: userId,
      p_amount: credits,
      p_type: 'credit_purchase',
      p_payment_reference: session.id,
    });

    if (creditError) {
      console.error('Failed to add credits:', creditError);
      return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
    }

    console.log(`Successfully added ${credits} credits to user ${userId}`);
  }

  return NextResponse.json({ received: true });
}
