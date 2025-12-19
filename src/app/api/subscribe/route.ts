import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source, lead_magnet } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Try to insert, or update if email exists
    const { data, error } = await supabase
      .from('email_subscribers')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          source: source || 'guide',
          lead_magnet: lead_magnet || null,
          subscribed_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Subscription error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    // Log guide access if lead_magnet is provided
    if (lead_magnet) {
      await supabase.from('guide_access').insert({
        email: email.toLowerCase().trim(),
        chapter_slug: lead_magnet,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully',
    });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
