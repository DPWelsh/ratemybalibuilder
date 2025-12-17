import { createAdminClient, createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Format phone number with dashes: +62 812-3456-7890
function formatPhone(phone: string): string {
  // Remove all non-digits except leading +
  let digits = phone.replace(/[^\d+]/g, '');

  // Ensure starts with +62
  if (digits.startsWith('62')) digits = '+' + digits;
  if (!digits.startsWith('+62')) return phone;

  // Get the number part after +62
  const numberPart = digits.substring(3);

  // Format: +62 xxx-xxxx-xxxx
  if (numberPart.length >= 10) {
    return '+62 ' + numberPart.substring(0, 3) + '-' + numberPart.substring(3, 7) + '-' + numberPart.substring(7);
  } else if (numberPart.length >= 7) {
    return '+62 ' + numberPart.substring(0, 3) + '-' + numberPart.substring(3, 7) + (numberPart.length > 7 ? '-' + numberPart.substring(7) : '');
  }

  return phone;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, trade_type, location, company_name, status, review_text, rating } = body;

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

    // Format the phone number consistently
    const formattedPhone = formatPhone(phone.trim());

    // Use admin client to bypass RLS for builder creation
    const supabase = createAdminClient();

    // Check if builder already exists with this phone
    const { data: existing } = await supabase
      .from('builders')
      .select('id, name')
      .eq('phone', formattedPhone)
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
        phone: formattedPhone,
        trade_type: trade_type || 'General Contractor',
        location: location || 'Other',
        company_name: company_name?.trim() || null,
        status: status || 'unknown',
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

    // Create the review if provided
    if (review_text && rating) {
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          builder_id: builder.id,
          user_id: null, // Anonymous submission
          rating: rating,
          review_text: review_text.trim(),
          status: 'pending', // Requires admin approval
          photos: [],
        });

      if (reviewError) {
        console.error('Error creating review:', reviewError);
        // Don't fail the whole request, builder was created successfully
      }
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const builderId = searchParams.get('id');

    if (!builderId) {
      return NextResponse.json(
        { error: 'Builder ID is required' },
        { status: 400 }
      );
    }

    // Check if user is admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Use admin client to delete
    const adminSupabase = createAdminClient();

    // Delete associated reviews first
    await adminSupabase
      .from('reviews')
      .delete()
      .eq('builder_id', builderId);

    // Delete the builder
    const { error } = await adminSupabase
      .from('builders')
      .delete()
      .eq('id', builderId);

    if (error) {
      console.error('Error deleting builder:', error);
      return NextResponse.json(
        { error: 'Failed to delete builder' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in builders DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
