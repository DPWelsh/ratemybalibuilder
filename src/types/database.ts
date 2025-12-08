export type BuilderStatus = 'blacklisted' | 'unknown' | 'recommended';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type TransactionType = 'search' | 'unlock' | 'credit_purchase' | 'review_reward';
export type SearchLevel = 'basic' | 'full';

export interface Profile {
  id: string;
  email: string | null;
  credit_balance: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Builder {
  id: string;
  name: string;
  phone: string;
  aliases: string[];
  status: BuilderStatus;
  company_name: string | null;
  instagram: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  builder_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  photos: string[];
  status: ReviewStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  builder_id: string | null;
  payment_reference: string | null;
  created_at: string;
}

export interface Search {
  id: string;
  user_id: string;
  builder_id: string;
  level: SearchLevel;
  created_at: string;
}

// Search result from the search_builders function
export interface BuilderSearchResult {
  id: string;
  name: string;
  phone: string;
  status: BuilderStatus;
  review_count: number;
}

// Builder with reviews for full unlock view
export interface BuilderWithReviews extends Builder {
  reviews: Review[];
}
