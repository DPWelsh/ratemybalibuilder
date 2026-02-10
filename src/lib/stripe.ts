import Stripe from 'stripe';

// Server-side Stripe client - DO NOT import on client side
// Lazy init to avoid build errors when STRIPE_SECRET_KEY is not set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// Keep backward-compatible export (lazy getter)
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Re-export config types for server-side usage
export {
  CREDIT_PACKS,
  MEMBERSHIP_PLANS,
  type CreditPackId,
  type MembershipPlanId,
} from './stripe-config';
