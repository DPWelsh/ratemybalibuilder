import { createClient } from './client';

export type BuilderStatus = 'recommended' | 'unknown' | 'blacklisted';
export type Location = 'Canggu' | 'Seminyak' | 'Ubud' | 'Uluwatu' | 'Sanur' | 'Denpasar' | 'Tabanan' | 'Other';
export type TradeType = 'General Contractor' | 'Pool Builder' | 'Architect' | 'Interior Designer' | 'Landscaper' | 'Renovation Specialist';
export type ProjectType = 'Villas' | 'Renovations' | 'Pools' | 'Commercial' | 'Landscaping' | 'Interior Fit-out';

export interface Builder {
  id: string;
  name: string;
  phone: string;
  aliases: string[];
  status: BuilderStatus;
  company_name: string | null;
  instagram: string | null;
  location: Location;
  trade_type: TradeType;
  project_types: ProjectType[];
  created_at: string;
  updated_at: string;
}

export interface BuilderWithStats extends Builder {
  review_count: number;
  avg_rating: number;
}

export async function getBuilders(): Promise<BuilderWithStats[]> {
  const supabase = createClient();

  // Get builders with review stats
  const { data: builders, error } = await supabase
    .from('builders')
    .select(`
      *,
      reviews!left (
        rating,
        status
      )
    `)
    .order('name');

  if (error) {
    console.error('Error fetching builders:', error);
    return [];
  }

  // Calculate stats for each builder
  return (builders || []).map((builder) => {
    const approvedReviews = (builder.reviews || []).filter(
      (r: { status: string }) => r.status === 'approved'
    );
    const reviewCount = approvedReviews.length;
    const avgRating = reviewCount > 0
      ? approvedReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
      : 0;

    // Remove the nested reviews from the return object
    const { reviews, ...builderData } = builder;

    return {
      ...builderData,
      review_count: reviewCount,
      avg_rating: Math.round(avgRating * 10) / 10,
    };
  });
}

export async function getBuilderById(id: string): Promise<Builder | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('builders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching builder:', error);
    return null;
  }

  return data;
}

export async function getReviewsForBuilder(builderId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('builder_id', builderId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

export async function getBuilderStats() {
  const supabase = createClient();

  const { data: builders, error } = await supabase
    .from('builders')
    .select('status');

  if (error) {
    console.error('Error fetching builder stats:', error);
    return { total: 0, recommended: 0, blacklisted: 0 };
  }

  return {
    total: builders?.length || 0,
    recommended: builders?.filter((b) => b.status === 'recommended').length || 0,
    blacklisted: builders?.filter((b) => b.status === 'blacklisted').length || 0,
  };
}

// Filter options
export const locations: Location[] = [
  'Canggu',
  'Seminyak',
  'Ubud',
  'Uluwatu',
  'Sanur',
  'Denpasar',
  'Tabanan',
  'Other',
];

export const tradeTypes: TradeType[] = [
  'General Contractor',
  'Pool Builder',
  'Architect',
  'Interior Designer',
  'Landscaper',
  'Renovation Specialist',
];

export const projectTypes: ProjectType[] = [
  'Villas',
  'Renovations',
  'Pools',
  'Commercial',
  'Landscaping',
  'Interior Fit-out',
];

export function maskPhone(phone: string): string {
  const parts = phone.split(' ');
  if (parts.length >= 4) {
    return `${parts[0]} ${parts[1]} •••• ••••`;
  }
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.length > 8) {
    return cleaned.slice(0, 8) + ' •••• ••••';
  }
  return phone;
}
