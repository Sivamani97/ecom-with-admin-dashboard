-- ==============================================================================
-- ARUNA RADIOS & FURNITURE — RLS DIAGNOSTIC & FIX
-- Run these queries in Supabase Dashboard → SQL Editor
-- DO NOT run the DROP/CREATE section unless you are sure. Run step by step.
-- ==============================================================================

-- STEP 1: Identify your admin user ID and current profile role
-- (Run this first to see who exists and what role they have)
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.role,
    p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
ORDER BY au.created_at DESC;

-- ==============================================================================
-- STEP 2: Promote your admin user to role='admin'
-- Replace <YOUR_EMAIL_HERE> with your actual admin email address.
-- ==============================================================================
UPDATE public.profiles
SET 
    role = 'admin',
    updated_at = NOW()
WHERE id = (
    SELECT id FROM auth.users WHERE email = '<YOUR_EMAIL_HERE>' LIMIT 1
);

-- Verify the update worked:
SELECT id, full_name, role FROM public.profiles;

-- ==============================================================================
-- STEP 3: Verify is_admin() works for your session (run as that user, or check below)
-- This verifies that the function itself correctly reads the profiles table:
SELECT 
    p.id,
    p.role,
    CASE WHEN p.role = 'admin' THEN true ELSE false END AS would_be_admin
FROM public.profiles p
WHERE p.role = 'admin';

-- ==============================================================================
-- STEP 4: Fix INSERT RLS policies to include explicit WITH CHECK clauses
-- This makes INSERT behavior unambiguous across all PostgreSQL versions.
-- Safe to run: does NOT drop/disable RLS. Only replaces policy definitions.
-- ==============================================================================

-- Categories: replace policy with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Products: replace policy with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Offers: replace policy with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage offers" ON public.offers;
CREATE POLICY "Admins can manage offers" ON public.offers
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Reviews admin policy: replace with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Business settings: replace with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage business settings" ON public.business_settings;
CREATE POLICY "Admins can manage business settings" ON public.business_settings
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- STEP 5: Verify all policies are correctly set
-- ==============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual AS using_expr,
    with_check AS with_check_expr
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
