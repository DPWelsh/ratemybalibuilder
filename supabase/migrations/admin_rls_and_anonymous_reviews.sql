-- ============================================
-- ADMIN RLS POLICIES FOR BUILDERS
-- Allow admins to update and delete builders
-- ============================================

-- Allow admins to update builders
DROP POLICY IF EXISTS "Admins can update builders" ON public.builders;
CREATE POLICY "Admins can update builders" ON public.builders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Allow admins to delete builders
DROP POLICY IF EXISTS "Admins can delete builders" ON public.builders;
CREATE POLICY "Admins can delete builders" ON public.builders
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- ADMIN RLS POLICIES FOR REVIEWS
-- Allow admins to update and delete reviews
-- ============================================

-- Allow admins to view all reviews (not just approved)
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
CREATE POLICY "Admins can view all reviews" ON public.reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Allow admins to update reviews
DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
CREATE POLICY "Admins can update reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Allow admins to delete reviews
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews" ON public.reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- ADD ANONYMOUS REVIEWS COLUMN
-- ============================================
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN public.reviews.is_anonymous IS 'If true, only the star rating shows publicly. The written review is kept private for admin verification.';
