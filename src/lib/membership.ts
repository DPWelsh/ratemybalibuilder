import { createClient } from '@/lib/supabase/server';

export type MembershipTier = 'free' | 'guide' | 'investor';

export interface MembershipStatus {
  tier: MembershipTier;
  hasGuideAccess: boolean;
  hasSupplierAccess: boolean;
  hasPriorityVerification: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export async function getMembershipStatus(): Promise<MembershipStatus> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      tier: 'free',
      hasGuideAccess: false,
      hasSupplierAccess: false,
      hasPriorityVerification: false,
      plan: null,
      expiresAt: null,
    };
  }

  // Get profile with membership tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('membership_tier')
    .eq('id', user.id)
    .single();

  // Get active membership
  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  const tier = (profile?.membership_tier || 'free') as MembershipTier;

  return {
    tier,
    hasGuideAccess: tier === 'guide' || tier === 'investor',
    hasSupplierAccess: tier === 'investor',
    hasPriorityVerification: tier === 'investor',
    plan: membership?.plan || null,
    expiresAt: membership?.current_period_end || null,
  };
}

// Client-side version (expects membership_tier from profile)
export function checkMembershipAccess(membershipTier: string | null): MembershipStatus {
  const tier = (membershipTier || 'free') as MembershipTier;

  return {
    tier,
    hasGuideAccess: tier === 'guide' || tier === 'investor',
    hasSupplierAccess: tier === 'investor',
    hasPriorityVerification: tier === 'investor',
    plan: null,
    expiresAt: null,
  };
}
