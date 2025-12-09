import { createClient } from './server';

export type BuilderStatus = 'recommended' | 'unknown' | 'blacklisted';

export interface BuilderSearchResult {
  id: string;
  name: string;
  phone: string;
  status: BuilderStatus;
  company_name: string | null;
  review_count: number;
  avg_rating: number;
}

export async function searchBuilders(name?: string, phone?: string): Promise<BuilderSearchResult[]> {
  const supabase = await createClient();

  let query = supabase
    .from('builders')
    .select(`
      id,
      name,
      phone,
      status,
      company_name,
      aliases,
      reviews!left (
        rating,
        status
      )
    `);

  // Build search conditions
  if (name && name.trim()) {
    query = query.ilike('name', `%${name.trim()}%`);
  }

  if (phone && phone.trim()) {
    // Clean phone number for search
    const cleanPhone = phone.replace(/\s/g, '');
    query = query.ilike('phone', `%${cleanPhone}%`);
  }

  const { data: builders, error } = await query.order('name');

  if (error) {
    console.error('Error searching builders:', error);
    return [];
  }

  // Also search by aliases if name provided
  let aliasResults: typeof builders = [];
  if (name && name.trim()) {
    const { data: aliasMatches } = await supabase
      .from('builders')
      .select(`
        id,
        name,
        phone,
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
      aliasResults = aliasMatches;
    }
  }

  // Merge and dedupe results
  const allResults = [...(builders || [])];
  for (const alias of aliasResults) {
    if (!allResults.find(b => b.id === alias.id)) {
      allResults.push(alias);
    }
  }

  // Calculate stats for each builder
  return allResults.map((builder) => {
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
