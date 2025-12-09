-- Waitlist table for email capture
-- Run this in your Supabase SQL Editor

create table if not exists public.waitlist (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow anonymous inserts (for users who aren't logged in)
create policy "Anyone can join waitlist" on public.waitlist
  for insert with check (true);

-- Only authenticated users can view the waitlist (you can restrict further in Supabase dashboard)
create policy "Authenticated users can view waitlist" on public.waitlist
  for select using (auth.role() = 'authenticated');
