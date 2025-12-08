// Centralized pricing configuration
// Easy to adjust for phased rollout

export const PRICING = {
  // User actions
  search: 10,           // $10 per search
  unlock: 20,           // $20 to unlock full details
  reviewCredit: 20,     // +$20 credit for approved review

  // Credit packs
  creditPacks: [
    { id: 'starter', credits: 50, price: 50, label: 'Starter Pack', popular: false },
    { id: 'value', credits: 120, price: 100, label: 'Value Pack', popular: true, savings: 20 },
    { id: 'pro', credits: 300, price: 200, label: 'Pro Pack', popular: false, savings: 100 },
  ],

  // Future: Builder subscriptions (Phase 2)
  builderPlans: {
    verified: {
      id: 'verified',
      name: 'Verified Builder',
      price: 300,
      interval: 'month',
      features: [
        'Verified badge on profile',
        'Respond to reviews',
        'See who searched for you',
        'Profile boosted in results',
        'Monthly lead report',
      ],
    },
    premium: {
      id: 'premium',
      name: 'Premium Builder',
      price: 500,
      interval: 'month',
      features: [
        'Everything in Verified',
        'Featured placement',
        'Sponsored results',
        'Advanced analytics',
        'Priority support',
      ],
    },
  },
} as const;

// Helper functions
export function formatPrice(amount: number): string {
  return `$${amount}`;
}

export function getCreditPackById(id: string) {
  return PRICING.creditPacks.find((pack) => pack.id === id);
}
