-- ============================================================
-- RateMyBaliBuilder - Complete Database Setup
-- Run this in the Supabase SQL Editor after creating a new project
-- ============================================================

-- ============================================================
-- PART 1: EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PART 2: ENUM TYPES
-- ============================================================
DO $$ BEGIN
  CREATE TYPE builder_status AS ENUM ('recommended', 'unknown', 'blacklisted');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE search_level AS ENUM ('basic', 'full');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE builder_location AS ENUM ('Canggu', 'Seminyak', 'Ubud', 'Uluwatu', 'Sanur', 'Denpasar', 'Tabanan', 'Other', 'Bali Wide');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_type AS ENUM ('Villas', 'Renovations', 'Pools', 'Commercial', 'Landscaping', 'Interior Fit-out');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('credit_purchase', 'search', 'unlock', 'review_reward');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- PART 3: CORE TABLES
-- ============================================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text,
  credit_balance integer NOT NULL DEFAULT 0,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  has_free_guide_access boolean DEFAULT false,
  free_guide_granted_at timestamp with time zone,
  membership_tier text DEFAULT 'free',
  stripe_customer_id text,
  approved_builders_count integer DEFAULT 0,
  approved_reviews_count integer DEFAULT 0,
  pending_contributions_count integer DEFAULT 0,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- BUILDERS
CREATE TABLE IF NOT EXISTS public.builders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  aliases text[] DEFAULT '{}'::text[],
  status builder_status NOT NULL DEFAULT 'unknown',
  company_name text,
  instagram text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  location builder_location DEFAULT 'Other',
  trade_type text DEFAULT 'General Contractor',
  project_types project_type[] DEFAULT '{}'::project_type[],
  website text,
  google_reviews_url text,
  phones jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT true,
  submitted_by uuid,
  CONSTRAINT builders_pkey PRIMARY KEY (id),
  CONSTRAINT builders_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES auth.users(id)
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  builder_id uuid NOT NULL,
  user_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  photos text[] DEFAULT '{}'::text[],
  status review_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_anonymous boolean DEFAULT false,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_builder_id_fkey FOREIGN KEY (builder_id) REFERENCES public.builders(id) ON DELETE CASCADE,
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- SEARCHES
CREATE TABLE IF NOT EXISTS public.searches (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  builder_id uuid NOT NULL,
  level search_level NOT NULL DEFAULT 'basic',
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT searches_pkey PRIMARY KEY (id),
  CONSTRAINT searches_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT searches_builder_id_fkey FOREIGN KEY (builder_id) REFERENCES public.builders(id),
  CONSTRAINT searches_user_builder_unique UNIQUE (user_id, builder_id)
);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  type transaction_type NOT NULL,
  amount integer NOT NULL,
  builder_id uuid,
  payment_reference text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT transactions_builder_id_fkey FOREIGN KEY (builder_id) REFERENCES public.builders(id)
);

-- SAVED BUILDERS
CREATE TABLE IF NOT EXISTS public.saved_builders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  builder_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT saved_builders_pkey PRIMARY KEY (id),
  CONSTRAINT saved_builders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT saved_builders_builder_id_fkey FOREIGN KEY (builder_id) REFERENCES public.builders(id)
);

-- ============================================================
-- PART 4: ADDITIONAL TABLES
-- ============================================================

-- WAITLIST
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SEARCH LOGS
CREATE TABLE IF NOT EXISTS public.search_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone text,
  trade_type text,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BUILDER REPORTS
CREATE TABLE IF NOT EXISTS public.builder_reports (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  builder_id uuid REFERENCES public.builders ON DELETE SET NULL,
  builder_name text,
  builder_phone text,
  reason text NOT NULL,
  details text,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  admin_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CONTRIBUTIONS
CREATE TABLE IF NOT EXISTS public.contributions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  contribution_type text NOT NULL CHECK (contribution_type IN ('builder', 'review')),
  reference_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  approved_at timestamp with time zone
);

-- EMAIL SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'guide',
  lead_magnet text,
  subscribed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  unsubscribed_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'
);

-- GUIDE ACCESS
CREATE TABLE IF NOT EXISTS public.guide_access (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  email text,
  chapter_slug text NOT NULL,
  accessed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  plan text NOT NULL CHECK (plan IN ('guide_only', 'investor_monthly', 'investor_yearly')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  stripe_subscription_id text,
  stripe_customer_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  cancelled_at timestamp with time zone,
  CONSTRAINT memberships_user_id_unique UNIQUE (user_id)
);

-- GUIDE PROGRESS
CREATE TABLE IF NOT EXISTS public.guide_progress (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  chapter_slug text NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT guide_progress_pkey PRIMARY KEY (id),
  CONSTRAINT guide_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT guide_progress_unique UNIQUE (user_id, chapter_slug)
);

-- ============================================================
-- PART 5: INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_builders_phones ON public.builders USING GIN (phones);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON public.contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_reference ON public.contributions(reference_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON public.contributions(status);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships(status);
CREATE INDEX IF NOT EXISTS idx_guide_access_chapter ON public.guide_access(chapter_slug);
CREATE INDEX IF NOT EXISTS guide_progress_user_id_idx ON public.guide_progress(user_id);

-- ============================================================
-- PART 6: ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART 7: RLS POLICIES
-- ============================================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- BUILDERS
CREATE POLICY "Anyone can view builders" ON public.builders
  FOR SELECT USING (true);
CREATE POLICY "Anyone can create builders" ON public.builders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update builders" ON public.builders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admins can delete builders" ON public.builders
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- REVIEWS
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Admins can view all reviews" ON public.reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Admins can delete reviews" ON public.reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- SEARCHES
CREATE POLICY "Users can view own searches" ON public.searches
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create searches" ON public.searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own searches" ON public.searches
  FOR UPDATE USING (auth.uid() = user_id);

-- TRANSACTIONS
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (true);

-- SAVED BUILDERS
CREATE POLICY "Users can view own saved builders" ON public.saved_builders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save builders" ON public.saved_builders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave builders" ON public.saved_builders
  FOR DELETE USING (auth.uid() = user_id);

-- WAITLIST
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view waitlist" ON public.waitlist
  FOR SELECT USING (auth.role() = 'authenticated');

-- SEARCH LOGS
CREATE POLICY "Anyone can create search logs" ON public.search_logs
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view search logs" ON public.search_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- BUILDER REPORTS
CREATE POLICY "Anyone can create builder reports" ON public.builder_reports
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own reports" ON public.builder_reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything with reports" ON public.builder_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- CONTRIBUTIONS
CREATE POLICY "Users can view own contributions" ON public.contributions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert contributions" ON public.contributions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage contributions" ON public.contributions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- EMAIL SUBSCRIBERS
CREATE POLICY "Anyone can subscribe" ON public.email_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.email_subscribers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "Users can view own subscription" ON public.email_subscribers
  FOR SELECT USING (true);

-- GUIDE ACCESS
CREATE POLICY "Anyone can log guide access" ON public.guide_access
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view guide access" ON public.guide_access
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- MEMBERSHIPS
CREATE POLICY "Users can view own membership" ON public.memberships
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything with memberships" ON public.memberships
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- GUIDE PROGRESS
CREATE POLICY "Users can view own guide progress" ON public.guide_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own guide progress" ON public.guide_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own guide progress" ON public.guide_progress
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PART 8: FUNCTIONS
-- ============================================================

-- Handle new user signup (create profile with 50 free credits)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credit_balance)
  VALUES (new.id, new.email, 50);

  INSERT INTO public.transactions (user_id, type, amount, payment_reference)
  VALUES (new.id, 'credit_purchase', 50, 'early_promotion_bonus');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Deduct credits from user
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_builder_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_balance integer;
BEGIN
  SELECT credit_balance INTO v_balance
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_balance IS NULL OR v_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE public.profiles
  SET credit_balance = credit_balance - p_amount,
      updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO public.transactions (user_id, type, amount, builder_id)
  VALUES (p_user_id, p_type::transaction_type, -p_amount, p_builder_id);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add credits to user
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_payment_reference text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET credit_balance = credit_balance + p_amount,
      updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO public.transactions (user_id, type, amount, payment_reference)
  VALUES (p_user_id, p_type::transaction_type, p_amount, p_payment_reference);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search builders by phone number
CREATE OR REPLACE FUNCTION search_builders_by_phone(search_phone TEXT)
RETURNS SETOF public.builders AS $$
BEGIN
  search_phone := regexp_replace(search_phone, '[\s\-\(\)]', '', 'g');
  RETURN QUERY
  SELECT * FROM public.builders
  WHERE
    regexp_replace(phone, '[\s\-\(\)]', '', 'g') LIKE '%' || search_phone || '%'
    OR EXISTS (
      SELECT 1 FROM jsonb_array_elements(phones) AS p
      WHERE regexp_replace(p->>'number', '[\s\-\(\)]', '', 'g') LIKE '%' || search_phone || '%'
    );
END;
$$ LANGUAGE plpgsql;

-- Get user contribution counts
CREATE OR REPLACE FUNCTION public.get_user_contribution_counts(p_user_id uuid)
RETURNS TABLE(approved_builders bigint, approved_reviews bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.contributions WHERE user_id = p_user_id AND contribution_type = 'builder' AND status = 'approved')::bigint AS approved_builders,
    (SELECT count(*) FROM public.contributions WHERE user_id = p_user_id AND contribution_type = 'review' AND status = 'approved')::bigint AS approved_reviews;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check and grant free guide access
CREATE OR REPLACE FUNCTION public.check_and_grant_free_guide_access(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  v_approved_builders bigint;
  v_approved_reviews bigint;
  v_has_access boolean;
BEGIN
  SELECT has_free_guide_access INTO v_has_access
  FROM public.profiles WHERE id = p_user_id;

  IF v_has_access = true THEN RETURN true; END IF;

  SELECT approved_builders, approved_reviews INTO v_approved_builders, v_approved_reviews
  FROM public.get_user_contribution_counts(p_user_id);

  IF v_approved_builders >= 5 OR v_approved_reviews >= 5 THEN
    UPDATE public.profiles
    SET has_free_guide_access = true, free_guide_granted_at = now()
    WHERE id = p_user_id;
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function: auto-check after contribution approval
CREATE OR REPLACE FUNCTION public.on_contribution_approved()
RETURNS trigger AS $$
BEGIN
  IF new.status = 'approved' AND (old.status IS DISTINCT FROM 'approved') THEN
    new.approved_at := now();
    PERFORM public.check_and_grant_free_guide_access(new.user_id);
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PART 9: TRIGGERS
-- ============================================================

-- Create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-check contribution approval
DROP TRIGGER IF EXISTS trigger_contribution_approved ON public.contributions;
CREATE TRIGGER trigger_contribution_approved
  BEFORE UPDATE ON public.contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.on_contribution_approved();

-- ============================================================
-- PART 10: STORAGE
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for review photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-photos');

CREATE POLICY "Anyone can delete review photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'review-photos');

-- ============================================================
-- PART 11: SEED DATA - BUILDERS
-- ============================================================

-- Original real scraped builders (from seed.sql)
INSERT INTO public.builders (name, phone, aliases, status, company_name, instagram, location, trade_type, project_types, notes, website) VALUES
('Bali Construction', '+62 000-0000-0001', ARRAY['BC Bali'], 'unknown', 'Bali Construction', '@bali_construction', 'Uluwatu', 'General Contractor', ARRAY['Villas', 'Commercial', 'Renovations']::project_type[], 'Luxury villas, 15+ years experience. Projects: Uluwatu Surf Villas, The River House.', NULL),
('Justin - 888 Design & Build', '+62 813-3836-7208', ARRAY['888 Design Build', '888DB', 'Justin'], 'unknown', '888 Design & Build', '@888designbuild', 'Uluwatu', 'General Contractor', ARRAY['Villas']::project_type[], 'Australian-owned. 10-year structural warranty. 20+ projects. Free design on 200+m2 builds.', NULL),
('Akura Villas', '+62 817-9727-273', ARRAY['Akura'], 'unknown', 'Akura Villas', '@akuravillas', 'Canggu', 'General Contractor', ARRAY['Villas']::project_type[], 'Villa development & investment. Projects in Canggu and Uluwatu. Sustainable focus.', NULL),
('Kingswood Bali', '+62 000-0000-0002', ARRAY['Kingswood', 'Bali Villas By Kingswood'], 'unknown', 'Kingswood Bali', NULL, 'Other', 'General Contractor', ARRAY['Villas']::project_type[], 'Australian-owned and managed. Custom villa developments.', NULL),
('Bogdan Gheonu - Yolla Group', '+62 822-6622-0431', ARRAY['Yolla', 'Yolla Villas', 'Bogdan'], 'unknown', 'PT Yolla Investment Group', NULL, 'Uluwatu', 'General Contractor', ARRAY['Villas']::project_type[], '100 villas built. 85% avg occupancy. Founded 2022. Projects in Bingin & Nyang Nyang.', NULL),
('Kadek Agus Saputra - Gahing Karya', '+62 852-0595-9776', ARRAY['Gahing Karya', 'Kadek Agus', 'GKJA'], 'unknown', 'Gahing Karya Jaya Abadi', NULL, 'Other', 'General Contractor', ARRAY['Villas', 'Commercial', 'Renovations']::project_type[], '50+ projects. Based in Nusa Penida. Projects: Deep Roots Villa, Syama Beach Resort.', NULL),
('Bali Handyman Services', '+62 877-1901-5093', ARRAY['Bali Handyman', 'Best Bali Handyman'], 'unknown', 'Best Bali Handyman Services', NULL, 'Other', 'Renovation Specialist', ARRAY['Renovations']::project_type[], 'Home repairs, maintenance, villa renovations. WhatsApp contact preferred.', NULL);

-- Supplier database builders (from Bali Gate Keeper)
INSERT INTO public.builders (name, phone, trade_type, location, notes, status) VALUES
('Ida Bagus', '6282144126627', 'General Contractor', 'Other', 'Word-of-mouth referral. Source: Brandy (Bali Gate Keeper)', 'unknown'),
('Kang Rian', '6282121444433', 'General Contractor', 'Other', 'Word-of-mouth referral. Source: Reynard (Bali Gate Keeper)', 'unknown'),
('Brian R', '6287862502798', 'General Contractor', 'Other', 'Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown'),
('Pa Agus', '6287898139727', 'General Contractor', 'Other', 'Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown'),
('Suraji', '6281237925177', 'General Contractor', 'Other', 'Community-verified 5-star builder. Source: Johanna (Bali Gate Keeper)', 'recommended'),
('Guntur', '6281236326966', 'General Contractor', 'Other', 'Community-verified 5-star builder. Source: Blossom (Bali Gate Keeper)', 'recommended'),
('Nyoman Yuda', '6281353343278', 'Handyman', 'Other', 'Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown'),
('Pak (Electrician)', '6282144426495', 'Electrician', 'Other', 'Word-of-mouth referral. Source: Reynard (Bali Gate Keeper)', 'unknown'),
('Agus (Electrician)', '6282144632083', 'Electrician', 'Uluwatu', 'Word-of-mouth referral. Source: Depiik (Bali Gate Keeper)', 'unknown'),
('Khairul Anwar Pompa', '6281558090909', 'Plumber', 'Other', 'Word-of-mouth referral. Source: Reynard (Bali Gate Keeper)', 'unknown'),
('Ariel (Pool Specialist)', '6285333570600', 'Pool Specialist', 'Other', 'Villa 10 Samani. Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown'),
('Sadus Tiles', '6282340774073', 'Tiles & Stone', 'Other', 'Word-of-mouth referral. Source: Ulu Buy, Sell, Swap (Bali Gate Keeper)', 'unknown'),
('Jack (Landscaper)', '6281237897352', 'Landscaping', 'Uluwatu', 'Great work, speaks good English, highly recommended by expat community. Source: Ulu Girls (Bali Gate Keeper)', 'recommended'),
('Hiro (Carpenter)', '6281333493004', 'Carpenter', 'Other', 'Good work but may not always answer. Source: Bali Gate Keeper', 'unknown'),
('Omingbudi''s Woodwork', '6285937019888', 'Carpenter', 'Uluwatu', 'Specializes in pooldeck, wood-flooring, wood-ceiling, facade and doors. Source: Bali Gate Keeper', 'unknown'),
('Cisco (Interior Designer)', '6281237312295', 'Interior Designer', 'Other', 'Interior designer of the Bohemian Villa. Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown');

-- Builders from CSV data collection (web scraped)
INSERT INTO public.builders (name, phone, company_name, location, trade_type, notes, website) VALUES
('Bali Home Builder', '+62 812 3815 4049', 'PT. Bangun Huni Bestari', 'Other', 'General Contractor', 'Jalan Raya Tuban 62, Kuta', 'https://balihomebuilder.com'),
('Bali Contractor', '+62 81 810 88 08', 'Construction Bali', 'Other', 'General Contractor', 'Jalan Patih Jelantik, Central Park, Kuta', 'https://bali-contractor.com'),
('Amari Bali Ananta', '+62 81999547122', 'Contractor Bali', 'Denpasar', 'General Contractor', 'Also +62 812 3891 622 (English)', 'https://www.contractorbali.com'),
('Kubu Bali Construction', '+62 361 8483745', 'Kubu Bali', 'Denpasar', 'General Contractor', 'A-grade commercial projects', 'https://kububaliconstruction.net'),
('Raga Pool', '+62 812 3058 6662', 'Raga Pool', 'Bali Wide', 'Pool Builder', '5yr construction warranty', 'https://www.ragapool.co.id'),
('Tropical Pool & Spa', '+62 822 3696 6965', 'Tropical Pool', 'Sanur', 'Pool Builder', 'Building pools since 1988', 'https://tropicalpoolbali.com'),
('Esparindo Pools', '+62 82 273185566', 'Esparindo', 'Other', 'Pool Builder', 'Jl. Dewi Sri 88, Legian', 'https://esparindopools.com'),
('Mimba Pool & Spa', '+62 821 3331 1435', 'Mimba Pool', 'Other', 'Pool Builder', 'Also in Sanur. Kerobokan based.', 'https://mimbapool.com'),
('Bali Builders', '+62 81919277779', 'Bali Builders', 'Bali Wide', 'General Contractor', 'Instagram: @bali_builder', NULL),
('Design Bali Architect', '+62 812 463 4536', 'Design Bali', 'Denpasar', 'Architect', 'JL. Sekar Tunjung, Gatot Subroto', 'https://www.designbali.com'),
('Balivestor', '+62 813 3705 6318', 'Balivestor', 'Bali Wide', 'Architect', '10+ years experience', 'https://www.balivestor.com'),
('BNP Architect', '+62 821 4639 5459', 'BNP Bali', 'Denpasar', 'Architect', 'Pendidikan Street, Sidakarya', 'https://bnparchitect.com'),
('Bali Design Solutions', '+62 361 844 6716', 'BDS', 'Denpasar', 'Interior Designer', '25 years experience', 'https://balidesignsolutions.com'),
('Rupa Rupa Studio', '+62 823 3174 0543', 'Rupa Rupa', 'Denpasar', 'Interior Designer', 'Sesetan, Denpasar Selatan', 'https://www.ruparupastudio.id'),
('Kareya Interior', '+62 811 3802 531', 'Kareya', 'Bali Wide', 'Interior Designer', 'Residential and commercial', 'https://kareya-interior.com'),
('MBLA Studio', '+62 811 3880 4050', 'CV Rimbun Arana', 'Denpasar', 'Landscaper', 'Jalan Letda Made Putra No 18/8', 'https://www.mblastudio.com'),
('Bali Landscape Company', '+62 361 8975105', 'Bali Landscape', 'Canggu', 'Landscaper', 'Jalan Batu Mejan 32AB', 'https://www.balilandscapecompany.com'),
('PT Kizuna Jepang', '+62 819 0749 2872', 'Kizuna Jepang', 'Denpasar', 'General Contractor', 'Japanese technology, apartments/villas', 'https://kizunajepang.com'),
('Gedong Bali', '+62 81337191777', 'Gedong Bali', 'Denpasar', 'General Contractor', 'Jl. Tukad Badung No.234, Renon', 'https://gedongbali.com'),
('WAK Bali', '+62 813 3755 4147', 'Wahana Adi Karya', 'Denpasar', 'General Contractor', 'Founded 2016, interior design + contractor', 'https://wakbali.com'),
('Balitecture', '+62 811 3909 045', 'Balitecture', 'Other', 'General Contractor', 'Australian-owned, 1M+ followers. Tibubeneng.', 'https://www.balitecture.com'),
('Mr Fixit Bali', '+62 81558 000 860', 'Mr Fixit', 'Sanur', 'Renovation Specialist', 'Property maintenance, renovation. Office: +62 361 288 789', 'https://www.mrfixitbali.com'),
('Bali Villa Construction', '+62 81 810 88 08', 'Villa Bali Tropic', 'Seminyak', 'General Contractor', 'Best contractor in Bali claim', 'https://constructionbali.com'),
('Greenwise Constructions', '', 'Greenwise', 'Seminyak', 'General Contractor', 'Bali, Lombok, Sumbawa', 'https://www.greenwise-constructions.com'),
('IDL Bali Construction', '', 'IDL Bali', 'Bali Wide', 'General Contractor', '600+ workers, 24/7 monitoring', 'https://baliconstruction.id'),
('Bali Contractors', '', 'Bali Contractors', 'Bali Wide', 'General Contractor', '10+ years, 95% satisfaction', 'https://balicontractors.com'),
('Image Bali Contractors', '', 'Image Bali', 'Bali Wide', 'General Contractor', 'Est. 1997, hotels/villas/resorts', 'https://contractor.imagebali.com'),
('Nata Nusa', '', 'Nata Nusa', 'Bali Wide', 'General Contractor', 'Villa construction, renovation', 'https://www.natanusa.id'),
('Bali General Contractor', '', 'Bali General', 'Bali Wide', 'General Contractor', 'Commercial and residential', 'https://www.baligeneralcontractor.com'),
('May & Lou International', '', 'May & Lou', 'Seminyak', 'General Contractor', 'Building contractor', 'https://www.mayloubalibuilder.com'),
('Sunar Jaya Group', '', 'Sunar Jaya', 'Bali Wide', 'General Contractor', 'Leading contractor', 'https://sunarjayagroup.com'),
('Archiola', '', 'Archiola', 'Bali Wide', 'Architect', 'Architect, interior, contractor', 'https://archiola.com'),
('iLot Property Bali', '', 'iLot Property', 'Bali Wide', 'Architect', 'Award-winning architecture', 'https://ilotpropertybali.com'),
('Bali Interiors', '', 'Bali Interiors', 'Bali Wide', 'Interior Designer', 'Interior design', 'https://www.bali-interiors.com'),
('Kapi Nala Landscape', '', 'Kapi Nala', 'Bali Wide', 'Landscaper', 'Landscape and garden', 'https://www.kapinala.com'),
('Bali Landscaping', '', 'Bali Landscaping', 'Other', 'Landscaper', 'Family owned, vertical gardens. Gianyar.', 'https://www.balilandscaping.com'),
('Rasita Karya Bali', '', 'Rasita Karya', 'Bali Wide', 'General Contractor', 'Villas from Ubud to Canggu', 'https://rasitakaryabali.com'),
('Bali Villa Kontraktor', '', 'CV Bali Villa', 'Bali Wide', 'General Contractor', 'Design, contractor, interior', 'https://balivillakontraktor.com'),
('HAVEN Contractor', '', 'HAVEN', 'Bali Wide', 'General Contractor', 'Highly recommended by expats', NULL),
('Populaire', '', 'Populaire', 'Bali Wide', 'General Contractor', '50+ years, 700+ homes', NULL),
('Construct Bali', '', 'Construct Bali', 'Bali Wide', 'General Contractor', 'Top-quality, professional', NULL),
('Kingswood', '', 'Kingswood', 'Other', 'General Contractor', 'Australian-standard precision. Jimbaran.', NULL),
('Karyanusa Asia', '', 'Karyanusa', 'Bali Wide', 'General Contractor', 'Turnkey solutions, 10+ years', 'https://karyanusa.asia'),
('Asali Bali', '', 'Asali Bali', 'Bali Wide', 'Architect', 'Boutique architecture + construction', NULL),
('ODISEA Bali', '', 'ODISEA', 'Bali Wide', 'General Contractor', 'Very reliable - expat recommended', NULL);

-- ============================================================
-- PART 12: SEED DATA - COMMUNITY REVIEWS
-- ============================================================

-- Review for Suraji
INSERT INTO public.reviews (builder_id, user_id, rating, review_text, status)
SELECT id, NULL, 5, 'Community-verified builder from Bali Gate Keeper database. Highly recommended by Johanna and the expat community. Word-of-mouth referral with excellent reputation.', 'approved'
FROM public.builders WHERE phone = '6281237925177' AND name = 'Suraji'
LIMIT 1;

-- Review for Guntur
INSERT INTO public.reviews (builder_id, user_id, rating, review_text, status)
SELECT id, NULL, 5, 'Community-verified builder from Bali Gate Keeper database. Highly recommended by Blossom and the expat community. Word-of-mouth referral with excellent reputation.', 'approved'
FROM public.builders WHERE phone = '6281236326966' AND name = 'Guntur'
LIMIT 1;

-- Review for Jack (Landscaper)
INSERT INTO public.reviews (builder_id, user_id, rating, review_text, status)
SELECT id, NULL, 5, 'Community-verified landscaper from Bali Gate Keeper database. Jack is highly recommended by the Ulu Girls community - "Jack is so sweet and did the most amazing job of our garden. He speaks really good English." Word-of-mouth referral.', 'approved'
FROM public.builders WHERE phone = '6281237897352' AND name = 'Jack (Landscaper)'
LIMIT 1;

-- ============================================================
-- DONE! Your database is ready.
-- Next steps:
-- 1. Configure Auth -> URL Configuration in Supabase dashboard
-- 2. Update your .env / Vercel env vars with new keys
-- 3. Deploy
-- ============================================================
