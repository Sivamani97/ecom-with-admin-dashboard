-- ==============================================================================
-- ARUNA RADIOS & FURNITURE
-- STEP 1: Promote your admin user to role='admin'
--
-- Run this in: Supabase Dashboard → SQL Editor
-- Replace your-email@example.com with the email you sign in with.
-- ==============================================================================

-- Check current users and their roles:
SELECT au.id, au.email, p.role, p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
ORDER BY au.created_at DESC;

-- Promote your account to admin (replace email below):
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE id = (
    SELECT id FROM auth.users
    WHERE email = 'your-email@example.com'
    LIMIT 1
);

-- Confirm it worked (should show role = 'admin'):
SELECT id, full_name, role FROM public.profiles;

-- ==============================================================================
-- STEP 2: Verify is_admin() now returns true for that user
-- (Run as that user via the Supabase JS client or just trust the profile update)
-- ==============================================================================

-- Manual check — look for the admin row:
SELECT * FROM public.profiles WHERE role = 'admin';

-- ==============================================================================
-- DONE — After running Step 1, sign out and sign back in to the admin dashboard.
-- The session token caches the JWT; a fresh login picks up the updated role.
-- ==============================================================================
