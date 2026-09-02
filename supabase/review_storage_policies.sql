-- ==============================================================================
-- ARUNA RADIOS & FURNITURE
-- STORAGE BUCKET RLS POLICIES FOR CUSTOMER REVIEW IMAGES
-- Run this in: Supabase Dashboard → SQL Editor
-- ==============================================================================

-- 1. Create review-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop old review storage policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Public can read review images"     ON storage.objects;
DROP POLICY IF EXISTS "Public can upload review images"   ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage review images"   ON storage.objects;

-- 3. Public can view review photos (for approved reviews displayed on website)
CREATE POLICY "Public can read review images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'review-images');

-- 4. Public can upload review photos when submitting feedback (max size checked client side)
CREATE POLICY "Public can upload review images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'review-images');

-- 5. Admins can update/delete review photos if necessary
CREATE POLICY "Admins can manage review images"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'review-images'
    AND public.is_admin()
)
WITH CHECK (
    bucket_id = 'review-images'
    AND public.is_admin()
);
