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

    // Use admin client to bypass RLS
    const adminClient = createAdminClient();

    // Get all builders
    const { data: builders, error: buildersError } = await adminClient
      .from('builders')
      .select('*')
      .order('is_published', { ascending: true })
      .order('created_at', { ascending: false });

    if (buildersError) {
      console.error('Error fetching builders:', buildersError);
      return NextResponse.json({ error: 'Failed to fetch builders' }, { status: 500 });
    }

    // Get contributions to find submitters
    const { data: contributions } = await adminClient
      .from('contributions')
      .select('reference_id, user_id')
      .eq('contribution_type', 'builder');

    // Get profiles to map user_id to email
    const { data: profiles } = await adminClient
      .from('profiles')
      .select('id, email');

    // Create lookup maps
    const contributionMap: Record<string, string> = {};
    for (const c of contributions || []) {
      if (c.reference_id && c.user_id) {
        contributionMap[c.reference_id] = c.user_id;
      }
    }

    const profileMap: Record<string, string> = {};
    for (const p of profiles || []) {
      if (p.id && p.email) {
        profileMap[p.id] = p.email;
      }
    }

    // Add submitter email to builders
    const buildersWithSubmitter = (builders || []).map(b => ({
      ...b,
      submitted_by_email: contributionMap[b.id]
        ? profileMap[contributionMap[b.id]] || null
        : null,
    }));

    return NextResponse.json({ builders: buildersWithSubmitter });
  } catch (error) {
    console.error('Admin builders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
