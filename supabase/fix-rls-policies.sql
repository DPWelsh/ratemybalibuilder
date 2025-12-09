-- Fix RLS policies to allow public read access to builders
-- Run this in your Supabase SQL Editor

-- Allow anyone to read builders (public directory)
CREATE POLICY "Anyone can view builders" ON public.builders
  FOR SELECT
  USING (true);

-- Allow anyone to read approved reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT
  USING (status = 'approved');
