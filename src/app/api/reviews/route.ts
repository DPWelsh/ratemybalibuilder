import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Use service role for creating builders if needed
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Normalize phone number to just digits for comparison
function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

// Find builder by phone with fuzzy matching
async function findBuilderByPhone(phone: string): Promise<{ id: string } | null> {
  const normalizedPhone = normalizePhone(phone);
  const shortPhone = normalizedPhone.slice(-10); // Last 10 digits

  // Get all builders and match in JS for fuzzy matching
  const { data: builders } = await supabaseAdmin
    .from('builders')
    .select('id, phone, phones');

  if (!builders) return null;

  for (const builder of builders) {
    // Check primary phone
    const builderPhoneDigits = normalizePhone(builder.phone || '');
    if (builderPhoneDigits.includes(shortPhone) || shortPhone.includes(builderPhoneDigits.slice(-10))) {
      return { id: builder.id };
    }

    // Check phones array
    const phones = (builder.phones || []) as { number: string }[];
    for (const p of phones) {
      const pDigits = normalizePhone(p.number);
      if (pDigits.includes(shortPhone) || shortPhone.includes(pDigits.slice(-10))) {
        return { id: builder.id };
      }
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get user if authenticated (optional for freemium)
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { builderName, builderPhone, rating, reviewText, photos } = body as {
      builderName: string;
      builderPhone: string;
      rating: number;
      reviewText: string;
      photos: string[];
    };

    // Validate input
    if (!builderName || builderName.length < 2) {
      return NextResponse.json({ error: 'Builder name is required' }, { status: 400 });
    }

    if (!builderPhone || !builderPhone.startsWith('+62')) {
      return NextResponse.json({ error: 'Valid Indonesian phone number required' }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (!reviewText || reviewText.length < 50) {
      return NextResponse.json({ error: 'Review must be at least 50 characters' }, { status: 400 });
    }

    // Check if builder exists (by phone number with fuzzy matching)
    const existingBuilder = await findBuilderByPhone(builderPhone);

    let builderId: string;

    if (existingBuilder) {
      builderId = existingBuilder.id;
    } else {
      // Create a new builder (status: unknown, pending admin review)
      const { data: newBuilder, error: builderError } = await supabaseAdmin
        .from('builders')
        .insert({
          name: builderName,
          phone: builderPhone,
          status: 'unknown',
          location: 'Other',
          trade_type: 'General Contractor',
          project_types: [],
        })
        .select('id')
        .single();

      if (builderError || !newBuilder) {
        console.error('Failed to create builder:', builderError);
        return NextResponse.json({ error: 'Failed to create builder' }, { status: 500 });
      }

      builderId = newBuilder.id;
    }

    // Create the review (status: pending)
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .insert({
        builder_id: builderId,
        user_id: user?.id || null,
        rating,
        review_text: reviewText,
        photos: photos || [],
        status: 'pending',
      })
      .select('id')
      .single();

    if (reviewError || !review) {
      console.error('Failed to create review:', reviewError);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reviewId: review.id,
      builderId,
      message: 'Review submitted for approval. You\'ll receive credits once approved!',
    });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
