import { createClient } from './server';

export type BuilderStatus = 'recommended' | 'unknown' | 'blacklisted';

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

  // Clean phone number for search (remove spaces, dashes, parentheses)
  const cleanPhone = phone?.replace(/[\s\-\(\)]/g, '') || '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let builders: any[] = [];

  if (cleanPhone) {
    // Search by phone - check primary phone AND phones JSONB array
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
      .or(`phone.ilike.%${cleanPhone}%`);

    if (error) {
      console.error('Error searching builders:', error);
      return [];
    }

    builders = data || [];

    // Also search in phones JSONB array using text search
    // This is a fallback since Supabase doesn't support JSONB array text search easily
    const { data: allBuilders } = await supabase
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

    if (allBuilders) {
      for (const b of allBuilders) {
        // Check if already in results
        if (builders.find(existing => existing.id === b.id)) continue;

        // Check phones JSONB array
        const phones = b.phones as PhoneEntry[] || [];
        const matchesPhone = phones.some(p => {
          const normalizedNumber = p.number.replace(/[\s\-\(\)]/g, '');
          return normalizedNumber.includes(cleanPhone) || cleanPhone.includes(normalizedNumber.slice(-8));
        });

        if (matchesPhone) {
          builders.push(b);
        }
      }
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
