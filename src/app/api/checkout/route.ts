import { NextRequest, NextResponse } from 'next/server';
import { stripe, CREDIT_PACKS, CreditPackId } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { packId } = body as { packId: CreditPackId };

    // Validate pack ID
    if (!packId || !CREDIT_PACKS[packId]) {
      return NextResponse.json(
        { error: 'Invalid credit pack' },
        { status: 400 }
      );
    }

    const pack = CREDIT_PACKS[packId];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pack.name,
              description: pack.description,
            },
            unit_amount: pack.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchase=success&credits=${pack.credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/buy-credits?cancelled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        packId: packId,
        credits: pack.credits.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
