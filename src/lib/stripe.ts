import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
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

// Membership plans for Bali Investment Guide
export const MEMBERSHIP_PLANS = {
  guide_only: {
    name: 'Bali Investment Guide',
    description: 'Full access to all 19 chapters (web + PDF)',
    priceInCents: 4900, // $49 USD
    currency: 'usd',
    mode: 'payment' as const, // One-time payment
    features: [
      'All 19 chapters',
      'Downloadable PDF',
      'Lifetime access',
    ],
  },
  investor_monthly: {
    name: 'Investor Membership',
    description: 'Full guide + supplier contacts + priority verification',
    priceInCents: 1900, // $19 USD/month
    currency: 'usd',
    mode: 'subscription' as const,
    interval: 'month' as const,
    features: [
      'All 19 chapters',
      'Downloadable PDF',
      '67+ trusted supplier contacts',
      'Priority builder verification',
      'ROI calculator tool',
    ],
  },
  investor_yearly: {
    name: 'Investor Membership (Annual)',
    description: 'Full guide + supplier contacts + priority verification - Save 35%',
    priceInCents: 14900, // $149 USD/year
    currency: 'usd',
    mode: 'subscription' as const,
    interval: 'year' as const,
    features: [
      'All 19 chapters',
      'Downloadable PDF',
      '67+ trusted supplier contacts',
      'Priority builder verification',
      'ROI calculator tool',
      'Save 35% vs monthly',
    ],
  },
} as const;

export type MembershipPlanId = keyof typeof MEMBERSHIP_PLANS;
