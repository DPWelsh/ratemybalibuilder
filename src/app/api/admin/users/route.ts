import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Get all users with their profiles
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email, created_at, credit_balance, is_admin, has_free_guide_access, free_guide_granted_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Add default membership_tier (not in DB yet)
    const usersWithDefaults = (users || []).map(u => ({
      ...u,
      membership_tier: u.has_free_guide_access ? 'guide' : null,
    }));

    return NextResponse.json({ users: usersWithDefaults });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
