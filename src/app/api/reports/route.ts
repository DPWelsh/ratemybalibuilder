import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { builder_id, builder_name, builder_phone, reason, details } = body;

    // Validation
    if (!reason) {
      return NextResponse.json(
        { error: 'Please select a reason for the report' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user if authenticated (optional)
    const { data: { user } } = await supabase.auth.getUser();

    // Create the report
    const { error } = await supabase
      .from('builder_reports')
      .insert({
        builder_id: builder_id || null,
        builder_name: builder_name || null,
        builder_phone: builder_phone || null,
        reason,
        details: details || null,
        user_id: user?.id || null,
      });

    if (error) {
      console.error('Error creating report:', error);
      return NextResponse.json(
        { error: 'Failed to submit report' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in reports API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
