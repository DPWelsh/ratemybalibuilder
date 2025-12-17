-- Migration: Add search_logs and builder_reports tables
-- Run this in Supabase SQL Editor

-- ============================================
-- SEARCH LOGS (track all searches for analytics)
-- ============================================
create table if not exists public.search_logs (
  id uuid default uuid_generate_v4() primary key,
  phone text,
  trade_type text,
  user_id uuid references auth.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.search_logs enable row level security;

-- Drop existing policies if they exist (for re-running migration)
drop policy if exists "Anyone can create search logs" on public.search_logs;
drop policy if exists "Admins can view search logs" on public.search_logs;

-- Allow anonymous inserts (anyone can log a search)
create policy "Anyone can create search logs" on public.search_logs
  for insert with check (true);

-- Only admins can view search logs
create policy "Admins can view search logs" on public.search_logs
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- BUILDER REPORTS (user reports for blacklist review)
-- ============================================
create table if not exists public.builder_reports (
  id uuid default uuid_generate_v4() primary key,
  builder_id uuid references public.builders on delete set null,
  builder_name text,
  builder_phone text,
  reason text not null,
  details text,
  user_id uuid references auth.users on delete set null,
  status text default 'pending' check (status in ('pending', 'reviewed', 'actioned', 'dismissed')),
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.builder_reports enable row level security;

-- Drop existing policies if they exist (for re-running migration)
drop policy if exists "Anyone can create builder reports" on public.builder_reports;
drop policy if exists "Users can view own reports" on public.builder_reports;
drop policy if exists "Admins can do everything with reports" on public.builder_reports;

-- Allow anyone to submit reports (even anonymous)
create policy "Anyone can create builder reports" on public.builder_reports
  for insert with check (true);

-- Users can view their own reports
create policy "Users can view own reports" on public.builder_reports
  for select using (auth.uid() = user_id);

-- Admins can do everything with reports
create policy "Admins can do everything with reports" on public.builder_reports
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- UPDATE BUILDERS TABLE RLS
-- Allow anyone to read builders (freemium model)
-- ============================================
drop policy if exists "Anyone can view builders" on public.builders;

create policy "Anyone can view builders" on public.builders
  for select using (true);

-- Allow anyone to insert builders (for add-builder feature)
drop policy if exists "Anyone can create builders" on public.builders;

create policy "Anyone can create builders" on public.builders
  for insert with check (true);
