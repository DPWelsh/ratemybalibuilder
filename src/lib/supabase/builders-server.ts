import { createClient } from './server';

export type BuilderStatus = 'recommended' | 'unknown' | 'blacklisted';

// Calculate similarity between two phone number strings (0-1)
function phoneNumberSimilarity(phone1: string, phone2: string): number {
  if (!phone1 || !phone2) return 0;

  // Get just the digits
  const digits1 = phone1.replace(/[^\d]/g, '');
  const digits2 = phone2.replace(/[^\d]/g, '');

  if (!digits1 || !digits2) return 0;

  // Compare last 8-10 digits (most significant part)
  const compare1 = digits1.slice(-10);
  const compare2 = digits2.slice(-10);

  // Check if one contains the other
  if (compare1.includes(compare2) || compare2.includes(compare1)) {
    return 1;
  }

  // Calculate matching digits from the end
  let matchCount = 0;
  const minLen = Math.min(compare1.length, compare2.length);
  for (let i = 1; i <= minLen; i++) {
    if (compare1[compare1.length - i] === compare2[compare2.length - i]) {
      matchCount++;
    } else {
      break;
    }
  }

  // If at least 7 digits match from the end, consider it a close match
  if (matchCount >= 7) {
    return matchCount / minLen;
  }

  // Also check for matches with 1-2 digit typos
  let diffCount = 0;
  for (let i = 0; i < minLen; i++) {
    if (compare1[compare1.length - 1 - i] !== compare2[compare2.length - 1 - i]) {
      diffCount++;
    }
  }

  // Allow up to 2 digit differences in 10 digit number
  if (diffCount <= 2 && minLen >= 8) {
    return (minLen - diffCount) / minLen;
  }

  return 0;
}

export interface PhoneEntry {
  number: string;
  type: 'primary' | 'whatsapp' | 'office' | 'mobile';
  label: string;
}

export interface BuilderSearchResult {
  id: string;
  name: string;
  phone: string;
  phones?: PhoneEntry[];
  status: BuilderStatus;
  company_name: string | null;
  review_count: number;
  avg_rating: number;
}

export async function searchBuilders(name?: string, phone?: string): Promise<BuilderSearchResult[]> {
  const supabase = await createClient();

  // Clean phone number for search - remove all non-digits
  const cleanPhone = phone?.replace(/[^\d]/g, '') || '';
  // Also try with just the last 8-10 digits for partial matching
  const shortPhone = cleanPhone.length > 8 ? cleanPhone.slice(-10) : cleanPhone;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let builders: any[] = [];

  if (cleanPhone) {
    // Get all builders and search in JS for better phone matching
    const { data: allBuilders, error } = await supabase
      .from('builders')
      .select(`
        id,
        name,
        phone,
        phones,
        status,
        company_name,
        aliases,
        reviews!left (
          rating,
          status
        )
      `);

    if (error) {
      console.error('Error searching builders:', error);
      return [];
    }

    // Store potential fuzzy matches with their similarity scores
    const fuzzyMatches: { builder: typeof allBuilders[0]; similarity: number }[] = [];

    if (allBuilders) {
      for (const b of allBuilders) {
        // Normalize the builder's phone number (remove all non-digits)
        const builderPhoneDigits = b.phone?.replace(/[^\d]/g, '') || '';

        // Check for exact/substring match first
        const matchesPrimary =
          builderPhoneDigits.includes(cleanPhone) ||
          cleanPhone.includes(builderPhoneDigits) ||
          builderPhoneDigits.includes(shortPhone) ||
          shortPhone.includes(builderPhoneDigits.slice(-10));

        if (matchesPrimary) {
          builders.push(b);
          continue;
        }

        // Check phones JSONB array for exact match
        const phones = b.phones as PhoneEntry[] || [];
        const matchesSecondary = phones.some(p => {
          const normalizedNumber = p.number.replace(/[^\d]/g, '');
          return normalizedNumber.includes(cleanPhone) ||
                 cleanPhone.includes(normalizedNumber) ||
                 normalizedNumber.includes(shortPhone);
        });

        if (matchesSecondary) {
          builders.push(b);
          continue;
        }

        // If no exact match, calculate fuzzy similarity
        const primarySimilarity = phoneNumberSimilarity(cleanPhone, builderPhoneDigits);
        const phonesMaxSimilarity = Math.max(
          0,
          ...phones.map(p => phoneNumberSimilarity(cleanPhone, p.number))
        );
        const maxSimilarity = Math.max(primarySimilarity, phonesMaxSimilarity);

        if (maxSimilarity >= 0.7) {
          fuzzyMatches.push({ builder: b, similarity: maxSimilarity });
        }
      }
    }

    // If no exact matches found, add fuzzy matches sorted by similarity
    if (builders.length === 0 && fuzzyMatches.length > 0) {
      fuzzyMatches.sort((a, b) => b.similarity - a.similarity);
      builders = fuzzyMatches.slice(0, 10).map(m => m.builder);
    }
  } else if (name && name.trim()) {
    // Search by name
    const { data, error } = await supabase
      .from('builders')
      .select(`
        id,
        name,
        phone,
        phones,
        status,
        company_name,
        aliases,
        reviews!left (
          rating,
          status
        )
      `)
      .ilike('name', `%${name.trim()}%`);

    if (error) {
      console.error('Error searching builders:', error);
      return [];
    }

    builders = data || [];

    // Also search by aliases
    const { data: aliasMatches } = await supabase
      .from('builders')
      .select(`
        id,
        name,
        phone,
        phones,
        status,
        company_name,
        aliases,
        reviews!left (
          rating,
          status
        )
      `)
      .contains('aliases', [name.trim()]);

    if (aliasMatches) {
      for (const alias of aliasMatches) {
        if (!builders.find(b => b.id === alias.id)) {
          builders.push(alias);
        }
      }
    }
  }

  // Calculate stats for each builder
  return builders.map((builder) => {
    const approvedReviews = (builder.reviews || []).filter(
      (r: { status: string }) => r.status === 'approved'
    );
    const reviewCount = approvedReviews.length;
    const avgRating = reviewCount > 0
      ? approvedReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
      : 0;

    return {
      id: builder.id,
      name: builder.name,
      phone: builder.phone,
      phones: builder.phones as PhoneEntry[] || [],
      status: builder.status as BuilderStatus,
      company_name: builder.company_name,
      review_count: reviewCount,
      avg_rating: Math.round(avgRating * 10) / 10,
    };
  });
}

export async function getBuilderByIdServer(id: string) {
  const supabase = await createClient();

  const { data: builder, error } = await supabase
    .from('builders')
    .select(`
      *,
      reviews!left (
        id,
        rating,
        review_text,
        photos,
        status,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching builder:', error);
    return null;
  }

  // Filter to only approved reviews
  const approvedReviews = (builder.reviews || []).filter(
    (r: { status: string }) => r.status === 'approved'
  );

  const reviewCount = approvedReviews.length;
  const avgRating = reviewCount > 0
    ? approvedReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
    : 0;

  return {
    ...builder,
    reviews: approvedReviews,
    review_count: reviewCount,
    avg_rating: Math.round(avgRating * 10) / 10,
  };
}

export async function checkUserAccess(userId: string, builderId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('searches')
    .select('level')
    .eq('user_id', userId)
    .eq('builder_id', builderId)
    .single();

  return {
    hasSearched: !!data,
    hasUnlocked: data?.level === 'full',
  };
}
