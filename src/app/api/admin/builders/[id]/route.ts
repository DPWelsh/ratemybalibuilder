import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verify user is admin
    const supabase = await createClient();
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

    const { name, phone, trade_type, location, website, google_reviews_url } = body;

    const updateData: Record<string, string | null> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (trade_type !== undefined) updateData.trade_type = trade_type;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website || null;
    if (google_reviews_url !== undefined) updateData.google_reviews_url = google_reviews_url || null;

    const { data, error } = await adminClient
      .from('builders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating builder:', error);
      return NextResponse.json({ error: 'Failed to update builder' }, { status: 500 });
    }

    return NextResponse.json({ success: true, builder: data });
  } catch (error) {
    console.error('Error in builder update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
