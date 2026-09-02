import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { SITE_CONFIG } from '../config/siteConfig';

// Fallback to siteConfig if Supabase is not yet configured
const fallbackSettings = {
  business_name: "Aruna Radios & Furniture",
  address_line1: SITE_CONFIG.contact.address.line1,
  address_line2: SITE_CONFIG.contact.address.line2,
  city: SITE_CONFIG.contact.address.city,
  state: SITE_CONFIG.contact.address.state,
  pincode: SITE_CONFIG.contact.address.pincode,
  phone_primary: SITE_CONFIG.contact.phone,
  phone_secondary: SITE_CONFIG.contact.altPhone,
  whatsapp_number: SITE_CONFIG.contact.whatsapp,
  email: SITE_CONFIG.contact.email,
  hours_weekday: SITE_CONFIG.contact.hours.weekday,
  hours_sunday: SITE_CONFIG.contact.hours.sunday,
  instagram_url: SITE_CONFIG.contact.instagramUrl,
  google_maps_embed_url: SITE_CONFIG.contact.googleMapsEmbedUrl,
  google_maps_directions_url: SITE_CONFIG.contact.googleMapsDirectionsUrl
};

const BusinessSettingsContext = createContext({
  settings: fallbackSettings,
  loading: true
});

export const BusinessSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await api.getBusinessSettings();
      if (data) setSettings(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <BusinessSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </BusinessSettingsContext.Provider>
  );
};

export const useBusinessSettings = () => useContext(BusinessSettingsContext);
