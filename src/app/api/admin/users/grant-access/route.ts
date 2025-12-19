import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, type } = body as { userId: string; type: 'guide' | 'investor' };

    if (!userId || !type) {
      return NextResponse.json({ error: 'Missing userId or type' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    if (type === 'guide') {
      // Grant free guide access
      const { error } = await adminClient
        .from('profiles')
        .update({
          has_free_guide_access: true,
          free_guide_granted_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Error granting guide access:', error);
        return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 });
      }
    } else if (type === 'investor') {
      // Grant investor membership
      const { error: profileError } = await adminClient
        .from('profiles')
        .update({
          membership_tier: 'investor',
          has_free_guide_access: true, // Investor includes guide
          free_guide_granted_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Error granting investor access:', profileError);
        return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 });
      }

      // Also create a membership record
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      await adminClient.from('memberships').insert({
        user_id: userId,
        plan: 'investor_yearly',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: oneYearFromNow.toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Grant access error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
