-- Migration: Add free guide via contributions tracking
-- Users can earn free guide access by submitting 5 approved builders OR 5 approved reviews
-- Contributions are tracked anonymously - no public link between user and submission

-- ============================================
-- CONTRIBUTIONS TABLE (private/de-identified tracking)
-- This table is only used internally to count contributions
-- It is NOT exposed publicly or linked to public builder/review data
-- ============================================
create table if not exists public.contributions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  contribution_type text not null check (contribution_type in ('builder', 'review')),
  reference_id uuid not null, -- builder_id or review_id
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  approved_at timestamp with time zone
);

-- Enable RLS - users can only see their own contributions
alter table public.contributions enable row level security;

-- Users can view their own contributions (for progress tracking)
drop policy if exists "Users can view own contributions" on public.contributions;
create policy "Users can view own contributions" on public.contributions
  for select using (auth.uid() = user_id);

-- System/admin can insert contributions
drop policy if exists "System can insert contributions" on public.contributions;
create policy "System can insert contributions" on public.contributions
  for insert with check (true);

-- Admins can update contributions
drop policy if exists "Admins can manage contributions" on public.contributions;
create policy "Admins can manage contributions" on public.contributions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Indexes for efficient queries
create index if not exists idx_contributions_user_id on public.contributions(user_id);
create index if not exists idx_contributions_reference on public.contributions(reference_id);
create index if not exists idx_contributions_status on public.contributions(status);

-- ============================================
-- ADD has_free_guide_access TO PROFILES TABLE
-- ============================================
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public'
                 and table_name = 'profiles'
                 and column_name = 'has_free_guide_access') then
    alter table public.profiles add column has_free_guide_access boolean default false;
  end if;

  -- Track when free access was granted
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public'
                 and table_name = 'profiles'
                 and column_name = 'free_guide_granted_at') then
    alter table public.profiles add column free_guide_granted_at timestamp with time zone;
  end if;
end $$;

-- ============================================
-- FUNCTION: Count approved contributions for a user
-- ============================================
create or replace function public.get_user_contribution_counts(p_user_id uuid)
returns table(approved_builders bigint, approved_reviews bigint) as $$
begin
  return query
  select
    (select count(*) from public.contributions where user_id = p_user_id and contribution_type = 'builder' and status = 'approved')::bigint as approved_builders,
    (select count(*) from public.contributions where user_id = p_user_id and contribution_type = 'review' and status = 'approved')::bigint as approved_reviews;
end;
$$ language plpgsql security definer;

-- ============================================
-- FUNCTION: Check and grant free guide access
-- Called after builder/review approval to auto-grant access
-- ============================================
create or replace function public.check_and_grant_free_guide_access(p_user_id uuid)
returns boolean as $$
declare
  v_approved_builders bigint;
  v_approved_reviews bigint;
  v_has_access boolean;
begin
  -- Skip if user already has free access
  select has_free_guide_access into v_has_access
  from public.profiles
  where id = p_user_id;

  if v_has_access = true then
    return true;
  end if;

  -- Get contribution counts
  select approved_builders, approved_reviews into v_approved_builders, v_approved_reviews
  from public.get_user_contribution_counts(p_user_id);

  -- Grant access if user has 5+ approved builders OR 5+ approved reviews
  if v_approved_builders >= 5 or v_approved_reviews >= 5 then
    update public.profiles
    set has_free_guide_access = true,
        free_guide_granted_at = now()
    where id = p_user_id;
    return true;
  end if;

  return false;
end;
$$ language plpgsql security definer;

-- ============================================
-- TRIGGER: Auto-check after contribution approval
-- When admin approves a contribution, check if user qualifies for free guide
-- ============================================
create or replace function public.on_contribution_approved()
returns trigger as $$
begin
  -- When a contribution gets approved, check if user qualifies for free access
  if new.status = 'approved' and (old.status is distinct from 'approved') then
    -- Update approved_at timestamp
    new.approved_at := now();
    -- Check and grant free guide access if eligible
    perform public.check_and_grant_free_guide_access(new.user_id);
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trigger_contribution_approved on public.contributions;
create trigger trigger_contribution_approved
  before update on public.contributions
  for each row
  execute function public.on_contribution_approved();
