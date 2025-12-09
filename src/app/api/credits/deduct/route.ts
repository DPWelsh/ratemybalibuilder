import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PRICING } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, builderId } = body as {
      type: 'search' | 'unlock';
      builderId: string;
    };

    // Validate type
    if (!type || !['search', 'unlock'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    // Check if user already has access (prevent double charging)
    if (builderId) {
      const { data: existingSearch } = await supabase
        .from('searches')
        .select('level')
        .eq('user_id', user.id)
        .eq('builder_id', builderId)
        .single();

      // If unlocking but already unlocked, don't charge
      if (type === 'unlock' && existingSearch?.level === 'full') {
        return NextResponse.json({
          success: true,
          message: 'Already unlocked',
          alreadyPaid: true
        });
      }

      // If searching but already searched, don't charge
      if (type === 'search' && existingSearch) {
        return NextResponse.json({
          success: true,
          message: 'Already searched',
          alreadyPaid: true
        });
      }
    }

    const amount = type === 'search' ? PRICING.search : PRICING.unlock;

    // Check current balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('credit_balance')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credit_balance < amount) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: amount,
          balance: profile?.credit_balance || 0
        },
        { status: 402 } // Payment Required
      );
    }

    // Deduct credits using the database function
    const { data: success, error: deductError } = await supabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: amount,
      p_type: type,
      p_builder_id: builderId || null,
    });

    if (deductError || !success) {
      console.error('Failed to deduct credits:', deductError);
      return NextResponse.json(
        { error: 'Failed to deduct credits' },
        { status: 500 }
      );
    }

    // Record the search/unlock access
    if (builderId) {
      const level = type === 'unlock' ? 'full' : 'basic';

      await supabase
        .from('searches')
        .upsert({
          user_id: user.id,
          builder_id: builderId,
          level: level,
        }, {
          onConflict: 'user_id,builder_id',
        });
    }

    // Get updated balance
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('credit_balance')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      charged: amount,
      newBalance: updatedProfile?.credit_balance || 0,
    });
  } catch (error) {
    console.error('Credit deduction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
