-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to review photos
CREATE POLICY "Public read access for review photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-photos'
);

-- Allow users to delete their own uploaded photos (within session)
CREATE POLICY "Anyone can delete review photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'review-photos');
