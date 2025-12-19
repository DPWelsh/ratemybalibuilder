import Stripe from 'stripe';

// Server-side Stripe client - DO NOT import on client side
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Re-export config types for server-side usage
export {
  CREDIT_PACKS,
  MEMBERSHIP_PLANS,
  type CreditPackId,
  type MembershipPlanId,
} from './stripe-config';
