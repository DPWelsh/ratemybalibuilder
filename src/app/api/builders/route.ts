import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, trade_type, location, company_name } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!phone || !phone.startsWith('+62')) {
      return NextResponse.json(
        { error: 'Phone must be an Indonesian number starting with +62' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS for builder creation
    const supabase = createAdminClient();

    // Check if builder already exists with this phone
    const { data: existing } = await supabase
      .from('builders')
      .select('id, name')
      .eq('phone', phone)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `A builder with this phone number already exists: ${existing.name}`, existingId: existing.id },
        { status: 409 }
      );
    }

    // Create the builder
    const { data: builder, error } = await supabase
      .from('builders')
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        trade_type: trade_type || 'General Contractor',
        location: location || 'Other',
        company_name: company_name?.trim() || null,
        status: 'unknown',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating builder:', error);
      return NextResponse.json(
        { error: 'Failed to create builder' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, builder });
  } catch (error) {
    console.error('Error in builders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
