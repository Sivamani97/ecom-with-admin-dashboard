import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getAdminSession, interpretSupabaseError } from '../../lib/adminAuth';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Check, 
  AlertCircle, 
  Save, 
  RefreshCw,
  MessageSquare,
  Share2,
  Lock,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Password change state
  const [passState, setPassState] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passSaving, setPassSaving] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState(null);

  // Business settings state
  const [settings, setSettings] = useState({
    id: null,
    business_name: 'Aruna Radios & Furniture',
    address_line1: '103A, Bazaar Street',
    address_line2: 'Near Bus Stand',
    city: 'Jayankondam',
    state: 'Tamil Nadu',
    pincode: '621802',
    phone_primary: '+91 9597589230',
    phone_secondary: '+91 98424 12345',
    whatsapp_number: '919597589230',
    email: 'arunaradios.ars@gmail.com',
    hours_weekday: 'Monday – Saturday: 9:00 AM – 9:00 PM',
    hours_sunday: 'Sunday: 10:00 AM – 8:00 PM',
    instagram_url: 'https://www.instagram.com/aruna_radios_furnitures',
    google_maps_directions_url: 'https://maps.google.com/?q=Jayankondam+Aruna+Radios+Furniture',
    google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655.45422896585!2d79.3400!3d11.2189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54d5bfa7106095%3A0xb5b79e27c1a84f33!2sJayankondam%2C%20Tamil%20Nadu%20621802!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
  });

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('business_settings')
        .select('*')
        .eq('config_key', 'business')
        .single();

      if (fetchErr && fetchErr.code !== 'PGRST116') {
        throw fetchErr;
      }

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error loading business settings:', err);
      setError(interpretSupabaseError(err) || 'Failed to load business settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const authCheck = await getAdminSession();
      if (!authCheck.isAdmin) {
        setError(authCheck.error || 'Admin authorization required. Please log in again.');
        setSaving(false);
        return;
      }

      const payload = {
        config_key: 'business',
        business_name: settings.business_name.trim(),
        address_line1: settings.address_line1.trim(),
        address_line2: settings.address_line2 ? settings.address_line2.trim() : null,
        city: settings.city.trim(),
        state: settings.state.trim(),
        pincode: settings.pincode.trim(),
        phone_primary: settings.phone_primary.trim(),
        phone_secondary: settings.phone_secondary ? settings.phone_secondary.trim() : null,
        whatsapp_number: settings.whatsapp_number.trim(),
        email: settings.email ? settings.email.trim() : null,
        hours_weekday: settings.hours_weekday.trim(),
        hours_sunday: settings.hours_sunday ? settings.hours_sunday.trim() : null,
        instagram_url: settings.instagram_url ? settings.instagram_url.trim() : null,
        google_maps_directions_url: settings.google_maps_directions_url ? settings.google_maps_directions_url.trim() : null,
        google_maps_embed_url: settings.google_maps_embed_url ? settings.google_maps_embed_url.trim() : null,
        updated_at: new Date().toISOString()
      };

      const { data: upserted, error: upsertErr } = await supabase
        .from('business_settings')
        .upsert(payload, { onConflict: 'config_key' })
        .select()
        .single();

      if (upsertErr) throw upsertErr;
      if (upserted) setSettings(upserted);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving business settings:', err);
      setError(interpretSupabaseError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassSaving(true);
    setPassSuccess(false);
    setPassError(null);

    if (passState.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      setPassSaving(false);
      return;
    }

    if (passState.newPassword !== passState.confirmPassword) {
      setPassError('New password and confirm password do not match.');
      setPassSaving(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        throw new Error('Could not identify active user session. Please sign out and sign in again.');
      }

      // Verify old password by attempting re-authentication
      const { error: verifyErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passState.oldPassword
      });

      if (verifyErr) {
        setPassError('Current / Old password is incorrect. Please double check your current password.');
        setPassSaving(false);
        return;
      }

      // Update user password in Supabase Auth
      const { error: updateErr } = await supabase.auth.updateUser({
        password: passState.newPassword
      });

      if (updateErr) throw updateErr;

      setPassSuccess(true);
      setPassState({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPassSuccess(false), 4500);
    } catch (err) {
      setPassError(err.message || 'Failed to update admin password.');
    } finally {
      setPassSaving(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Business Settings &amp; Security</h1>
          <p>Update store details, contact info, working hours, and change admin account password</p>
        </div>

        <div className="admin-page-actions">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="admin-btn admin-btn-primary"
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="spin-anim" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="admin-card" style={{ marginBottom: '1.25rem', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={18} />
          <strong style={{ fontSize: '0.9rem' }}>Business settings updated and synced with the public website!</strong>
        </div>
      )}

      {error && (
        <div className="admin-card" style={{ marginBottom: '1.25rem', backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <strong style={{ fontSize: '0.9rem' }}>{error}</strong>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Business Information */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)' }}>
            <Building2 size={20} color="var(--admin-primary-accent)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>1. Business Information &amp; Address</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Business Name *</label>
              <input
                type="text"
                required
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Address Line 1 *</label>
              <input
                type="text"
                required
                value={settings.address_line1}
                onChange={(e) => setSettings({ ...settings, address_line1: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Address Line 2 / Landmark</label>
              <input
                type="text"
                value={settings.address_line2 || ''}
                onChange={(e) => setSettings({ ...settings, address_line2: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">City *</label>
              <input
                type="text"
                required
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">State *</label>
              <input
                type="text"
                required
                value={settings.state}
                onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Pincode *</label>
              <input
                type="text"
                required
                value={settings.pincode}
                onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & WhatsApp */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)' }}>
            <Phone size={20} color="var(--admin-primary-accent)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>2. Contact &amp; WhatsApp Numbers</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Primary Phone *</label>
              <input
                type="text"
                required
                placeholder="+91 9597589230"
                value={settings.phone_primary}
                onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Secondary Phone</label>
              <input
                type="text"
                placeholder="+91 98424 12345"
                value={settings.phone_secondary || ''}
                onChange={(e) => setSettings({ ...settings, phone_secondary: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">WhatsApp Number (with country code, no +) *</label>
              <input
                type="text"
                required
                placeholder="919597589230"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Store Email</label>
              <input
                type="email"
                placeholder="arunaradios.jayankondam@gmail.com"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Business Hours */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)' }}>
            <Clock size={20} color="var(--admin-primary-accent)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>3. Business Hours</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Weekday Hours (Mon–Sat) *</label>
              <input
                type="text"
                required
                placeholder="Monday – Saturday: 9:00 AM – 9:00 PM"
                value={settings.hours_weekday}
                onChange={(e) => setSettings({ ...settings, hours_weekday: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Sunday Hours</label>
              <input
                type="text"
                placeholder="Sunday: 10:00 AM – 8:00 PM"
                value={settings.hours_sunday || ''}
                onChange={(e) => setSettings({ ...settings, hours_sunday: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social Links & Google Maps */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)' }}>
            <Share2 size={20} color="var(--admin-primary-accent)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>4. Social Links &amp; Google Maps</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Instagram Profile URL</label>
              <input
                type="url"
                placeholder="https://www.instagram.com/aruna_radios_furnitures"
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Google Maps Directions / Short URL</label>
              <input
                type="url"
                placeholder="https://maps.google.com/?q=Jayankondam+Aruna+Radios+Furniture"
                value={settings.google_maps_directions_url || ''}
                onChange={(e) => setSettings({ ...settings, google_maps_directions_url: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Google Maps Embed URL (iframe src)</label>
              <input
                type="text"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={settings.google_maps_embed_url || ''}
                onChange={(e) => setSettings({ ...settings, google_maps_embed_url: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Submit Business Info */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ minWidth: '180px' }}
          >
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Section 5: Admin Account Security & Password Change */}
      <div className="admin-card" style={{ marginTop: '2rem', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)' }}>
          <KeyRound size={20} color="var(--admin-primary-accent)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>5. Admin Security: Change Account Password</h2>
        </div>

        {passSuccess && (
          <div style={{ marginBottom: '1.25rem', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', padding: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #a7f3d0' }}>
            <Check size={18} />
            <strong style={{ fontSize: '0.9rem' }}>Password updated successfully! Use your new password for your next login.</strong>
          </div>
        )}

        {passError && (
          <div style={{ marginBottom: '1.25rem', backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', padding: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #fecaca' }}>
            <AlertCircle size={18} />
            <strong style={{ fontSize: '0.9rem' }}>{passError}</strong>
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Current / Old Password *</label>
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={passState.oldPassword}
                onChange={(e) => setPassState({ ...passState, oldPassword: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={passState.newPassword}
                onChange={(e) => setPassState({ ...passState, newPassword: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Confirm New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Re-enter new password"
                value={passState.confirmPassword}
                onChange={(e) => setPassState({ ...passState, confirmPassword: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={passSaving}
              className="admin-btn admin-btn-primary"
            >
              {passSaving ? (
                <>
                  <RefreshCw size={16} className="spin-anim" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
