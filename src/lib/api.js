import { supabase } from './supabase';

export const api = {
  // Products & Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data;
  },

  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data;
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
