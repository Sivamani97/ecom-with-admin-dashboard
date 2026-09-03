import { supabase } from './supabase';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/products';

export const api = {
  // Products & Categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error || !data || data.length === 0) {
        if (error) console.error('Error fetching categories from Supabase, using fallback:', error);
        return PRODUCT_CATEGORIES.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.id,
          icon: c.icon,
          desc: c.desc
        }));
      }
      return data;
    } catch (err) {
      console.error('Exception fetching categories:', err);
      return PRODUCT_CATEGORIES.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.id,
        icon: c.icon,
        desc: c.desc
      }));
    }
  },

  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('is_visible', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error || !data || data.length === 0) {
        if (error) console.error('Error fetching products from Supabase, using fallback:', error);
        return PRODUCTS;
      }
      return data;
    } catch (err) {
      console.error('Exception fetching products:', err);
      return PRODUCTS;
    }
  },

  // Reviews
  async getApprovedReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
    return data;
  },

  // Offers
  async getActiveOffer() {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('config_key', 'global')
      .eq('is_active', true)
      .single();
      
    if (error) {
      // It's normal to have no active offer, so we don't spam console if code is PGRST116 (0 rows)
      if (error.code !== 'PGRST116') {
        console.error('Error fetching active offer:', error);
      }
      return null;
    }
    return data;
  },

  // Business Settings
  async getBusinessSettings() {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('config_key', 'business')
      .single();
      
    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error fetching business settings:', error);
      }
      return null;
    }
    return data;
  }
};
