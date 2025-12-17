import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, trade_type } = body;

    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // Get user if authenticated (optional)
    const { data: { user } } = await supabase.auth.getUser();

    // Log the search using admin client to bypass RLS
    const { error } = await adminSupabase
      .from('search_logs')
      .insert({
        phone: phone || null,
        trade_type: trade_type || null,
        user_id: user?.id || null,
      });

    if (error) {
      console.error('Error logging search:', error);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in search-logs:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
