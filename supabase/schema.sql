-- ==============================================================================
-- ARUNA RADIOS & FURNITURE — CORRECTED SUPABASE ARCHITECTURE SCHEMA
-- This script cleanly resets previous development tables and sets up strict RBAC,
-- the exact 7 categories, structured business settings, offers, and storage policies.
-- ==============================================================================

-- 1. SAFE CLEANUP (Resets fresh development tables safely without affecting auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.offers CASCADE;
DROP TABLE IF EXISTS public.store_config CASCADE;
DROP TABLE IF EXISTS public.business_settings CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- 2. CREATE PROFILES TABLE & ADMIN AUTHORIZATION (RBAC)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to automatically create a profile for every new signup (defaults to 'user')
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email), 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper function to check if the caller is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- 3. CREATE CATEGORIES TABLE (Exactly 7 categories)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. CREATE PRODUCTS TABLE (Linked to categories via foreign key)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(10, 2),
    brand TEXT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Preserved UI fields required by existing cards and modal
    tag TEXT,
    features TEXT[] DEFAULT '{}',
    warranty TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 5. CREATE REVIEWS TABLE (Customer moderation flow)
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- Preserved UI fields
    location TEXT,
    role TEXT,
    title TEXT,
    avatar_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 6. CREATE OFFERS TABLE (Global / Singleton Seasonal Configuration)
CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage INTEGER,
    popup_enabled BOOLEAN DEFAULT true,
    combo_offer_enabled BOOLEAN DEFAULT false,
    combo_offer_details TEXT,
    cta_text TEXT,
    cta_url TEXT,
    image_url TEXT,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 7. CREATE BUSINESS SETTINGS TABLE (Structured Store Information)
CREATE TABLE public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    phone_primary TEXT NOT NULL,
    phone_secondary TEXT,
    whatsapp_number TEXT NOT NULL,
    email TEXT,
    hours_weekday TEXT NOT NULL,
    hours_sunday TEXT,
    instagram_url TEXT,
    google_maps_embed_url TEXT,
    google_maps_directions_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 8. INDEXES FOR FAST QUERYING
CREATE INDEX idx_products_category_visible ON public.products(category_id, is_visible);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_display_order ON public.products(display_order);
CREATE INDEX idx_reviews_status_created ON public.reviews(status, created_at DESC);
CREATE INDEX idx_categories_active_order ON public.categories(is_active, display_order);


-- 9. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;


-- 9a. PROFILES POLICIES
-- Users can view their own profile; admins can view & manage all profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE USING (public.is_admin());


-- 9b. CATEGORIES POLICIES
-- Public can read active categories; admins have full CRUD
CREATE POLICY "Public can read active categories" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (public.is_admin());


-- 9c. PRODUCTS POLICIES
-- Public can only read visible products; admins have full CRUD
CREATE POLICY "Public can read visible products" ON public.products
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (public.is_admin());


-- 9d. REVIEWS POLICIES
-- Public can read approved reviews, and submit new reviews (strictly forced to 'pending')
-- Only admins can change status, approve, reject, edit, or delete
CREATE POLICY "Public can read approved reviews" ON public.reviews
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can insert pending reviews" ON public.reviews
    FOR INSERT WITH CHECK (status = 'pending');

CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL USING (public.is_admin());


-- 9e. OFFERS POLICIES
-- Public can read active offers; admins have full CRUD
CREATE POLICY "Public can read active offers" ON public.offers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage offers" ON public.offers
    FOR ALL USING (public.is_admin());


-- 9f. BUSINESS SETTINGS POLICIES
-- Public can read store settings; admins have full CRUD
CREATE POLICY "Public can read business settings" ON public.business_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage business settings" ON public.business_settings
    FOR ALL USING (public.is_admin());


-- 10. SETUP STORAGE BUCKET FOR PRODUCT IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage product images" ON storage.objects;

CREATE POLICY "Public can read product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can manage product images" ON storage.objects
    FOR ALL USING (bucket_id = 'product-images' AND public.is_admin());


-- 11. SEED INITIAL REQUIRED 7 CATEGORIES
INSERT INTO public.categories (name, slug, description, display_order, is_active) VALUES
('TV', 'tv', 'Smart TVs, 4K Ultra HD displays, and home entertainment setups.', 1, true),
('AC', 'ac', 'Split, window, and inverter energy-saving air conditioners.', 2, true),
('Washing Machine', 'washing-machine', 'Front load, top load, and semi-automatic washing machines.', 3, true),
('Refrigerator', 'refrigerator', 'Single door, double door, frost-free, and convertible refrigerators.', 4, true),
('Home Appliances', 'home-appliances', 'BLDC fans, water heaters, air coolers, stabilizers, and inverters.', 5, true),
('Kitchen Appliances', 'kitchen-appliances', 'Heavy-duty mixies, tabletop wet grinders, gas stoves, and induction cooktops.', 6, true),
('Furniture', 'furniture', 'Teakwood cots, luxury sofas, storage steel beros, dining sets, and ergonomic chairs.', 7, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;


-- 12. SEED INITIAL VERIFIED BUSINESS SETTINGS
INSERT INTO public.business_settings (
    business_name,
    address_line1,
    address_line2,
    city,
    state,
    pincode,
    phone_primary,
    phone_secondary,
    whatsapp_number,
    email,
    hours_weekday,
    hours_sunday,
    instagram_url,
    google_maps_directions_url,
    google_maps_embed_url
) VALUES (
    'Aruna Radios & Furniture',
    '103A, Bazaar Street',
    'Near Bus Stand',
    'Jayankondam',
    'Tamil Nadu',
    '621802',
    '+91 9597589230',
    '+91 98424 12345',
    '919597589230',
    'arunaradios.jayankondam@gmail.com',
    'Monday – Saturday: 9:00 AM – 9:00 PM',
    'Sunday: 10:00 AM – 8:00 PM',
    'https://www.instagram.com/aruna_radios_furnitures',
    'https://maps.google.com/?q=Jayankondam+Aruna+Radios+Furniture',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655.45422896585!2d79.3400!3d11.2189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54d5bfa7106095%3A0xb5b79e27c1a84f33!2sJayankondam%2C%20Tamil%20Nadu%20621802!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
);


-- 13. SEED INITIAL GLOBAL SEASONAL OFFER
INSERT INTO public.offers (
    title,
    description,
    discount_percentage,
    popup_enabled,
    combo_offer_enabled,
    combo_offer_details,
    cta_text,
    cta_url,
    is_active
) VALUES (
    'Grand Festive Home Upgrade Bonanza!',
    'Exchange your old appliances, get zero-cost EMI options, and enjoy free local delivery on major home electronics and bedroom sets.',
    35,
    true,
    true,
    'Solid Queen Bed + Duroflex Mattress + Steel Bero + Tabletop Grinder combo at special package price.',
    'Claim Festive Offer',
    'Festival Mega Offer 2026',
    true
);
