import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { PRICING } from '@/lib/pricing';

// Use service role for admin operations
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body as { action: 'approve' | 'reject' };

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get the review
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .select('user_id, status')
      .eq('id', id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.status !== 'pending') {
      return NextResponse.json({ error: 'Review already processed' }, { status: 400 });
    }

    // Update review status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const { error: updateError } = await supabaseAdmin
      .from('reviews')
      .update({ status: newStatus })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }

    // If approved, award credits to the reviewer
    if (action === 'approve') {
      const { error: creditError } = await supabaseAdmin.rpc('add_credits', {
        p_user_id: review.user_id,
        p_amount: PRICING.reviewCredit,
        p_type: 'review_reward',
        p_payment_reference: `review_${id}`,
      });

      if (creditError) {
        console.error('Failed to award review credits:', creditError);
        // Don't fail the whole request, just log it
      } else {
        console.log(`Awarded ${PRICING.reviewCredit} credits to user ${review.user_id} for review ${id}`);
      }
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      creditsAwarded: action === 'approve' ? PRICING.reviewCredit : 0,
    });
  } catch (error) {
    console.error('Review update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
