import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
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

    // Use admin client to bypass RLS and get ALL users
    const adminClient = createAdminClient();

    // Get all users with their profiles
    const { data: users, error } = await adminClient
      .from('profiles')
      .select('id, email, created_at, credit_balance, is_admin, has_free_guide_access, free_guide_granted_at, membership_tier, approved_builders_count, approved_reviews_count, pending_contributions_count')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Add counts to users from profile fields
    const usersWithCounts = (users || []).map(u => ({
      ...u,
      contributions: {
        builders: u.approved_builders_count || 0,
        reviews: u.approved_reviews_count || 0,
        pending: u.pending_contributions_count || 0,
      },
    }));

    return NextResponse.json({ users: usersWithCounts });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
