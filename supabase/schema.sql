-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.builders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  aliases ARRAY DEFAULT '{}'::text[],
  status USER-DEFINED NOT NULL DEFAULT 'unknown'::builder_status,
  company_name text,
  instagram text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  location USER-DEFINED DEFAULT 'Other'::builder_location,
  trade_type text DEFAULT 'General Contractor'::text,
  project_types ARRAY DEFAULT '{}'::project_type[],
  website text,
  google_reviews_url text,
  phones jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT true,
  CONSTRAINT builders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  credit_balance integer NOT NULL DEFAULT 0,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  builder_id uuid NOT NULL,
  user_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  photos ARRAY DEFAULT '{}'::text[],
  status USER-DEFINED NOT NULL DEFAULT 'pending'::review_status,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_builder_id_fkey FOREIGN KEY (builder_id) REFERENCES public.builders(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.saved_builders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  builder_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT saved_builders_pkey PRIMARY KEY (id),
  CONSTRAINT saved_builders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT saved_builders_builder_id_fkey FOREIGN KEY (builder_id) REFERENCES public.builders(id)
);
CREATE TABLE public.search_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  phone text,
  trade_type text,
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT search_logs_pkey PRIMARY KEY (id),
  CONSTRAINT search_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.searches (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  builder_id uuid NOT NULL,
  level USER-DEFINED NOT NULL DEFAULT 'basic'::search_level,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT searches_pkey PRIMARY KEY (id),
  CONSTRAINT searches_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT searches_builder_id_fkey FOREIGN KEY (builder_id) REFERENCES public.builders(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  type USER-DEFINED NOT NULL,
  amount integer NOT NULL,
  builder_id uuid,
  payment_reference text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT transactions_builder_id_fkey FOREIGN KEY (builder_id) REFERENCES public.builders(id)
);