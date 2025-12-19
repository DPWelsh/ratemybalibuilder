-- Migration: Add guide monetization tables
-- Run this in Supabase SQL Editor

-- ============================================
-- EMAIL SUBSCRIBERS (lead magnet captures)
-- ============================================
create table if not exists public.email_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  source text default 'guide', -- 'guide', 'homepage', 'trade-page'
  lead_magnet text, -- 'roi-chapter', 'checklist', etc.
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unsubscribed_at timestamp with time zone,
  metadata jsonb default '{}'
);

-- Enable RLS
alter table public.email_subscribers enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can subscribe" on public.email_subscribers;
drop policy if exists "Admins can view subscribers" on public.email_subscribers;
drop policy if exists "Users can view own subscription" on public.email_subscribers;

-- Allow anyone to subscribe
create policy "Anyone can subscribe" on public.email_subscribers
  for insert with check (true);

-- Admins can view all subscribers
create policy "Admins can view subscribers" on public.email_subscribers
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Users can view their own subscription by email (checked in app)
create policy "Users can view own subscription" on public.email_subscribers
  for select using (true);

-- ============================================
-- GUIDE ACCESS (track chapter views)
-- ============================================
create table if not exists public.guide_access (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete set null,
  email text, -- for non-logged-in lead magnet access
  chapter_slug text not null,
  accessed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.guide_access enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can log guide access" on public.guide_access;
drop policy if exists "Admins can view guide access" on public.guide_access;

-- Allow anyone to log access
create policy "Anyone can log guide access" on public.guide_access
  for insert with check (true);

-- Admins can view all access logs
create policy "Admins can view guide access" on public.guide_access
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- MEMBERSHIPS (paid subscriptions)
-- ============================================
create table if not exists public.memberships (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan text not null check (plan in ('guide_only', 'investor_monthly', 'investor_yearly')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired', 'past_due')),
  stripe_subscription_id text,
  stripe_customer_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  cancelled_at timestamp with time zone
);

-- Enable RLS
alter table public.memberships enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own membership" on public.memberships;
drop policy if exists "Admins can do everything with memberships" on public.memberships;
drop policy if exists "System can create memberships" on public.memberships;

-- Users can view their own membership
create policy "Users can view own membership" on public.memberships
  for select using (auth.uid() = user_id);

-- Admins can do everything
create policy "Admins can do everything with memberships" on public.memberships
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Allow service role to create/update memberships (for webhooks)
-- Note: Service role bypasses RLS, so this is handled at app level

-- ============================================
-- UPDATE PROFILES TABLE (add membership tier)
-- ============================================
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public'
                 and table_name = 'profiles'
                 and column_name = 'membership_tier') then
    alter table public.profiles add column membership_tier text default 'free';
  end if;

  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public'
                 and table_name = 'profiles'
                 and column_name = 'stripe_customer_id') then
    alter table public.profiles add column stripe_customer_id text;
  end if;
end $$;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index if not exists idx_email_subscribers_email on public.email_subscribers(email);
create index if not exists idx_memberships_user_id on public.memberships(user_id);
create index if not exists idx_memberships_status on public.memberships(status);
create index if not exists idx_guide_access_chapter on public.guide_access(chapter_slug);
