import { createAdminClient } from '@/lib/supabase/server';
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
    const { name, phone, trade_type, location, company_name, status, rating, review_text } = body;

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

    // Validate review fields
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!review_text || review_text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Review must be at least 20 characters' },
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

    // Create the builder (unpublished by default - needs admin approval)
    const { data: builder, error } = await supabase
      .from('builders')
      .insert({
        name: name.trim(),
        phone: formattedPhone,
        trade_type: trade_type || 'General Contractor',
        location: location || 'Other',
        company_name: company_name?.trim() || null,
        status: status || 'unknown',
        is_published: false, // Requires admin approval
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

    // Create the review (pending approval)
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({
        builder_id: builder.id,
        rating: rating,
        review_text: review_text.trim(),
        status: 'pending', // Reviews need admin approval
      });

    if (reviewError) {
      console.error('Error creating review:', reviewError);
      // Builder was created but review failed - still return success
      // The review can be submitted separately
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
