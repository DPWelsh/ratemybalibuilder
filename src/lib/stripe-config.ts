// Stripe configuration - safe to import on client side
// Note: This file contains NO secrets, only public pricing config

// Credit pack configurations
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
  investor_monthly: {
    name: 'Monthly',
    description: 'Full guide access + supplier contacts + priority verification',
    priceInCents: 1900, // $19 USD/month
    currency: 'usd',
    mode: 'subscription' as const,
    interval: 'month' as const,
    features: [
      'Complete Bali Investment Guide (19 chapters)',
      'Downloadable PDF',
      'Searchable Supplier Directory (100+ contacts)',
      'Priority builder verification',
      'ROI calculator tool',
    ],
  },
  investor_yearly: {
    name: 'Yearly',
    description: 'Save 35% with annual billing',
    priceInCents: 14900, // $149 USD/year
    currency: 'usd',
    mode: 'subscription' as const,
    interval: 'year' as const,
    features: [
      'Complete Bali Investment Guide (19 chapters)',
      'Downloadable PDF',
      'Searchable Supplier Directory (100+ contacts)',
      'Priority builder verification',
      'ROI calculator tool',
    ],
  },
} as const;

export type MembershipPlanId = keyof typeof MEMBERSHIP_PLANS;
