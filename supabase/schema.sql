-- RateMyBaliBuilder Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  credit_balance integer default 0 not null,
  is_admin boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- BUILDERS
-- ============================================
create type builder_status as enum ('blacklisted', 'unknown', 'recommended');

create table public.builders (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  aliases text[] default '{}',
  status builder_status default 'unknown' not null,
  company_name text,
  instagram text,
  notes text, -- admin-only internal notes
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on phone for fast lookups
create index builders_phone_idx on public.builders (phone);
create index builders_name_idx on public.builders using gin (to_tsvector('english', name));

-- Enable RLS
alter table public.builders enable row level security;

-- Builders policies (admins can do everything, users can only see via paid searches)
create policy "Admins can do everything with builders" on public.builders
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- REVIEWS
-- ============================================
create type review_status as enum ('pending', 'approved', 'rejected');

create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  builder_id uuid references public.builders on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  review_text text not null,
  photos text[] default '{}',
  status review_status default 'pending' not null,
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Reviews policies
create policy "Users can create reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "Users can view own reviews" on public.reviews
  for select using (auth.uid() = user_id);

create policy "Admins can do everything with reviews" on public.reviews
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- TRANSACTIONS
-- ============================================
create type transaction_type as enum ('search', 'unlock', 'credit_purchase', 'review_reward');

create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type transaction_type not null,
  amount integer not null, -- positive for credits added, negative for spent
  builder_id uuid references public.builders on delete set null,
  payment_reference text, -- external payment ID from Xendit/DOKU
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Transactions policies
create policy "Users can view own transactions" on public.transactions
  for select using (auth.uid() = user_id);

create policy "Admins can view all transactions" on public.transactions
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- SEARCHES (tracks what users have access to)
-- ============================================
create type search_level as enum ('basic', 'full');

create table public.searches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  builder_id uuid references public.builders on delete cascade not null,
  level search_level default 'basic' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, builder_id)
);

-- Enable RLS
alter table public.searches enable row level security;

-- Searches policies
create policy "Users can view own searches" on public.searches
  for select using (auth.uid() = user_id);

create policy "Users can create own searches" on public.searches
  for insert with check (auth.uid() = user_id);

create policy "Users can update own searches" on public.searches
  for update using (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to deduct credits and record transaction
create or replace function public.deduct_credits(
  p_user_id uuid,
  p_amount integer,
  p_type transaction_type,
  p_builder_id uuid default null
)
returns boolean as $$
declare
  v_balance integer;
begin
  -- Get current balance
  select credit_balance into v_balance
  from public.profiles
  where id = p_user_id
  for update;

  -- Check if sufficient balance
  if v_balance < p_amount then
    return false;
  end if;

  -- Deduct credits
  update public.profiles
  set credit_balance = credit_balance - p_amount,
      updated_at = now()
  where id = p_user_id;

  -- Record transaction
  insert into public.transactions (user_id, type, amount, builder_id)
  values (p_user_id, p_type, -p_amount, p_builder_id);

  return true;
end;
$$ language plpgsql security definer;

-- Function to add credits (for purchases or review rewards)
create or replace function public.add_credits(
  p_user_id uuid,
  p_amount integer,
  p_type transaction_type,
  p_payment_reference text default null
)
returns boolean as $$
begin
  -- Add credits
  update public.profiles
  set credit_balance = credit_balance + p_amount,
      updated_at = now()
  where id = p_user_id;

  -- Record transaction
  insert into public.transactions (user_id, type, amount, payment_reference)
  values (p_user_id, p_type, p_amount, p_payment_reference);

  return true;
end;
$$ language plpgsql security definer;

-- Function to search builders by name and/or phone
create or replace function public.search_builders(
  p_name text default null,
  p_phone text default null
)
returns table (
  id uuid,
  name text,
  phone text,
  status builder_status,
  review_count bigint
) as $$
begin
  return query
  select
    b.id,
    b.name,
    b.phone,
    b.status,
    count(r.id) filter (where r.status = 'approved') as review_count
  from public.builders b
  left join public.reviews r on r.builder_id = b.id
  where
    (p_phone is null or b.phone like '%' || p_phone || '%')
    and (p_name is null or b.name ilike '%' || p_name || '%' or p_name = any(b.aliases))
  group by b.id, b.name, b.phone, b.status;
end;
$$ language plpgsql security definer;
