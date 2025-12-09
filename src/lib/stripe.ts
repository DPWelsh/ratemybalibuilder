import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Credit pack configurations matching pricing.ts
export const CREDIT_PACKS = {
  starter: {
    credits: 50,
    priceInCents: 5000, // $50
    name: 'Starter Pack',
    description: '50 credits - $1.00 per credit',
  },
  value: {
    credits: 120,
    priceInCents: 10000, // $100
    name: 'Value Pack',
    description: '120 credits - $0.83 per credit (Most Popular)',
  },
  pro: {
    credits: 300,
    priceInCents: 20000, // $200
    name: 'Pro Pack',
    description: '300 credits - $0.67 per credit (Best Value)',
  },
} as const;

export type CreditPackId = keyof typeof CREDIT_PACKS;
