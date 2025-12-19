import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        approved_builders: 0,
        approved_reviews: 0,
        pending_builders: 0,
        pending_reviews: 0,
        has_free_guide_access: false,
        total_approved: 0,
        progress: 0,
        target: 5,
      });
    }

    // Get contribution counts
    const { data: contributions } = await supabase
      .from('contributions')
      .select('contribution_type, status')
      .eq('user_id', user.id);

    const counts = {
      approved_builders: 0,
      approved_reviews: 0,
      pending_builders: 0,
      pending_reviews: 0,
    };

    for (const c of contributions || []) {
      if (c.contribution_type === 'builder') {
        if (c.status === 'approved') counts.approved_builders++;
        else if (c.status === 'pending') counts.pending_builders++;
      } else if (c.contribution_type === 'review') {
        if (c.status === 'approved') counts.approved_reviews++;
        else if (c.status === 'pending') counts.pending_reviews++;
      }
    }

    // Check if user has free guide access
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_free_guide_access')
      .eq('id', user.id)
      .single();

    const total_approved = counts.approved_builders + counts.approved_reviews;
    const target = 5;

    return NextResponse.json({
      ...counts,
      has_free_guide_access: profile?.has_free_guide_access || false,
      total_approved,
      progress: Math.min(total_approved / target, 1),
      target,
    });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
}
