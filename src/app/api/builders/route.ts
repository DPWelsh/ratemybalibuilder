import { createAdminClient, createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Normalize and format phone number: +62 812-3456-7890
function formatPhone(phone: string): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');

  // Handle common Indonesian formats
  if (digits.startsWith('0')) {
    digits = '62' + digits.substring(1);
  } else if (digits.startsWith('8') && digits.length >= 9 && digits.length <= 12) {
    // Starts with 8, likely missing country code
    digits = '62' + digits;
  }

  // Must have enough digits
  if (digits.length < 10) return phone;

  // Get the number part after 62
  const numberPart = digits.startsWith('62') ? digits.substring(2) : digits;

  // Format: +62 xxx-xxxx-xxxx
  if (numberPart.length >= 10) {
    return '+62 ' + numberPart.substring(0, 3) + '-' + numberPart.substring(3, 7) + '-' + numberPart.substring(7);
  } else if (numberPart.length >= 7) {
    return '+62 ' + numberPart.substring(0, 3) + '-' + numberPart.substring(3, 7) + (numberPart.length > 7 ? '-' + numberPart.substring(7) : '');
  }

  return '+62 ' + numberPart;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, trade_type, location, company_name, status, rating, review_text, is_anonymous } = body;

    // Get current user (optional - for tracking contributions)
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();
    const userId = user?.id || null;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Validate phone has enough digits
    const phoneDigits = phone?.replace(/\D/g, '') || '';
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Validate review fields - rating and review text are required
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!review_text || review_text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Review must be at least 50 characters' },
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
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        builder_id: builder.id,
        rating: rating,
        review_text: review_text.trim(),
        status: 'pending', // Reviews need admin approval
        is_anonymous: is_anonymous || false,
      })
      .select('id')
      .single();

    if (reviewError) {
      console.error('Error creating review:', reviewError);
      // Builder was created but review failed - still return success
      // The review can be submitted separately
    }

    // Track contributions for free guide access (anonymous - separate table)
    if (userId) {
      // Track builder submission
      await supabase.from('contributions').insert({
        user_id: userId,
        contribution_type: 'builder',
        reference_id: builder.id,
        status: 'pending',
      });

      // Track review submission if created
      if (review?.id) {
        await supabase.from('contributions').insert({
          user_id: userId,
          contribution_type: 'review',
          reference_id: review.id,
          status: 'pending',
        });
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
