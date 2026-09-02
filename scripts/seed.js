import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../src/data/products.js';
import { REVIEWS } from '../src/data/reviews.js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

if (supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabaseUrl) {
  console.error("Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Additional showroom models for categories that were previously grouped
const EXTRA_SHOWROOM_MODELS = [
  {
    name: "4K Ultra HD Smart LED TV (43\" / 55\" / 65\")",
    categorySlug: "tv",
    description: "Dolby Vision Atmos, HDR10+, bezel-less smart screen with Google TV",
    tag: "Trending",
    features: ["4K HDR Cinema Display", "Google TV with Voice Remote", "Dolby Atmos 30W Sound", "ALLM Game Mode"],
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
    popularBrands: ["Samsung", "LG", "Sony", "TCL"],
    warranty: "3 Years Comprehensive Warranty"
  },
  {
    name: "5-Star Inverter Split AC (1 Ton / 1.5 Ton / 2 Ton)",
    categorySlug: "ac",
    description: "100% Copper condenser with convertible cooling and anti-viral PM 2.5 filter",
    tag: "Top Energy Saver",
    features: ["Dual Inverter Heavy Compressor", "Stabilizer Free Operation", "Rapid 4-Way Swing Cooling", "Ocean Black Anti-Corrosion Shield"],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    popularBrands: ["Voltas", "LG", "Daikin", "Blue Star", "Carrier"],
    warranty: "10 Years Compressor Warranty"
  },
  {
    name: "Smart Inverter Front & Top Load Washing Machine (7kg - 10kg)",
    categorySlug: "washing-machine",
    description: "AI Direct Drive with steam wash, smart diagnosis and zero friction motor",
    tag: "Family Special",
    features: ["6 Motion Direct Drive Tech", "Turbowash 59 mins cycle", "In-built water heater", "Child lock & Auto Restart"],
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
    popularBrands: ["LG", "Samsung", "IFB", "Whirlpool", "Bosch"],
    warranty: "10 Years Motor Warranty"
  },
  {
    name: "Frost-Free Double Door Refrigerator (240L - 450L)",
    categorySlug: "refrigerator",
    description: "Convertible multi-mode inverter compressor with deodorizing vegetable crisper",
    tag: "Freshness Preserver",
    features: ["Smart Inverter Compressor", "Door Cooling+ Technology", "Multi Air Flow System", "Toughened Glass Shelves up to 175kg"],
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80",
    popularBrands: ["LG", "Samsung", "Whirlpool", "Haier", "Godrej"],
    warranty: "10 Years Compressor Warranty"
  }
];

async function seedCategoriesAndProducts() {
  console.log("Fetching exact 7 categories from Supabase...");
  const { data: categories, error: catError } = await supabase.from('categories').select('id, slug, name');
  
  if (catError || !categories || categories.length === 0) {
    console.error("Failed to fetch categories. Did you run schema.sql in the Supabase SQL Editor first?", catError);
    return;
  }

  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.slug] = c.id; });

  const getCategoryId = (legacyProduct) => {
    const type = (legacyProduct.itemType || '').toLowerCase();
    const name = legacyProduct.name.toLowerCase();
    const cat = legacyProduct.category;
    
    if (type.includes('tv') || name.includes('tv')) return categoryMap['tv'];
    if (type.includes('ac') || name.includes('ac') || name.includes('air conditioner')) return categoryMap['ac'];
    if (type.includes('washing machine')) return categoryMap['washing-machine'];
    if (type.includes('refrigerator') || name.includes('fridge')) return categoryMap['refrigerator'];
    if (cat === 'kitchen-appliances') return categoryMap['kitchen-appliances'];
    if (cat === 'home-appliances') return categoryMap['home-appliances'];
    if (cat === 'furniture') return categoryMap['furniture'];
    
    return categoryMap['home-appliances'] || categories[0].id;
  };

  console.log(`Seeding ${PRODUCTS.length} legacy catalog products...`);
  
  for (const product of PRODUCTS) {
    const categoryId = getCategoryId(product);
    if (!categoryId) continue;

    const { error } = await supabase
      .from('products')
      .upsert({
        name: product.name,
        description: product.highlight,
        category_id: categoryId,
        image_url: product.image,
        tag: product.tag,
        features: product.features,
        warranty: product.warranty,
        is_visible: true,
        featured: false,
        brand: (product.popularBrands || []).join(", ")
      }, { onConflict: 'name' });

    if (error) {
      console.error(`Error inserting product "${product.name}":`, error.message);
    }
  }

  console.log(`Seeding additional showroom models for TV, AC, Washing Machine, Refrigerator...`);
  for (const extra of EXTRA_SHOWROOM_MODELS) {
    const categoryId = categoryMap[extra.categorySlug];
    if (!categoryId) continue;

    const { error } = await supabase
      .from('products')
      .upsert({
        name: extra.name,
        description: extra.description,
        category_id: categoryId,
        image_url: extra.image,
        tag: extra.tag,
        features: extra.features,
        warranty: extra.warranty,
        is_visible: true,
        featured: true,
        brand: (extra.popularBrands || []).join(", ")
      }, { onConflict: 'name' });

    if (error) {
      console.error(`Error inserting showcase product "${extra.name}":`, error.message);
    }
  }
  
  console.log("Categories and products seeding completed successfully.");
}

async function seedReviews() {
  console.log(`Seeding ${REVIEWS.length} customer reviews (saved as 'pending' for moderation)...`);
  
  const { data: existingReviews } = await supabase.from('reviews').select('customer_name, review_text');
  
  for (const review of REVIEWS) {
    const exists = existingReviews?.find(r => r.customer_name === review.name && r.review_text === review.comment);
    if (exists) continue;
    
    const { error } = await supabase
      .from('reviews')
      .insert({
        customer_name: review.name,
        rating: review.rating,
        review_text: review.comment,
        status: 'pending', // Moderation requirement: initial customer reviews stay pending until admin approved
        location: review.location,
        role: review.role,
        title: review.title,
        avatar_url: review.avatarImage
      });
      
    if (error) {
      console.error(`Error inserting review from ${review.name}:`, error.message);
    }
  }
  
  console.log("Customer reviews seeded.");
}

async function seedBusinessSettings() {
  console.log("Checking for existing Business Settings...");
  const { data: existingSettings } = await supabase.from('business_settings').select('id').limit(1);
  
  if (existingSettings && existingSettings.length > 0) {
    console.log("Business settings already exist. Skipping seed.");
    return;
  }
  
  console.log("Seeding verified Business Settings...");
  const { error } = await supabase.from('business_settings').insert({
    business_name: "Aruna Radios & Furniture",
    address_line1: "103A, Bazaar Street",
    address_line2: "Near Bus Stand",
    city: "Jayankondam",
    state: "Tamil Nadu",
    pincode: "621802",
    phone_primary: "+91 9597589230",
    phone_secondary: "+91 98424 12345",
    whatsapp_number: "919597589230",
    email: "arunaradios.jayankondam@gmail.com",
    hours_weekday: "Monday – Saturday: 9:00 AM – 9:00 PM",
    hours_sunday: "Sunday: 10:00 AM – 8:00 PM",
    instagram_url: "https://www.instagram.com/aruna_radios_furnitures",
    google_maps_directions_url: "https://maps.google.com/?q=Jayankondam+Aruna+Radios+Furniture",
    google_maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655.45422896585!2d79.3400!3d11.2189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54d5bfa7106095%3A0xb5b79e27c1a84f33!2sJayankondam%2C%20Tamil%20Nadu%20621802!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  });
  
  if (error) {
    console.error("Error inserting business settings:", error.message);
  } else {
    console.log("Business settings seeded.");
  }
}

async function run() {
  await seedCategoriesAndProducts();
  await seedReviews();
  await seedBusinessSettings();
  console.log("All seed routines finished!");
}

run();
