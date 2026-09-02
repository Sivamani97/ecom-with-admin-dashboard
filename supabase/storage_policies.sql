-- ==============================================================================
-- ARUNA RADIOS & FURNITURE
-- STORAGE BUCKET RLS POLICIES
-- Run this in: Supabase Dashboard → SQL Editor
--
-- Context:
-- The schema creates the 'product-images' bucket as public (public reads work).
-- BUT Supabase enables RLS on storage.objects by default.
-- Without these policies, authenticated admin users CANNOT upload (INSERT blocked).
-- This script creates the upload/update/delete policies for admin users.
--
-- SAFE: Does NOT disable RLS. Does NOT drop the bucket. Does NOT touch app tables.
-- ==============================================================================


-- 1. Drop old policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Public can read product images"     ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images"   ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images"   ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images"   ON storage.objects;


-- 2. Anyone can READ images from the product-images bucket (public CDN)
CREATE POLICY "Public can read product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');


-- 3. Authenticated admins can UPLOAD (INSERT) new images
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
);


-- 4. Authenticated admins can REPLACE (UPDATE) existing images
CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND public.is_admin()
)
WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
);


-- 5. Authenticated admins can DELETE images
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND public.is_admin()
);


-- ==============================================================================
-- VERIFY: Show all storage.objects policies after running above
-- ==============================================================================
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;


-- ==============================================================================
-- REMINDER: If you still see RLS errors on upload:
--   1. Confirm your profile has role = 'admin':
--      SELECT role FROM public.profiles WHERE id = auth.uid();
--   2. Sign out and sign back in to refresh your session JWT.
-- ==============================================================================
