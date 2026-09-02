import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getAdminSession, interpretSupabaseError } from '../../lib/adminAuth';
import { ImageCropModal } from '../../components/admin/ImageCropModal';
import { 
  Gift, 
  Sparkles, 
  Save, 
  Check, 
  Upload, 
  Calendar, 
  Smartphone, 
  Monitor, 
  Tag, 
  Layers, 
  AlertCircle,
  RefreshCw,
  Eye,
  Percent,
  ArrowRight,
  Package
} from 'lucide-react';

export const OffersManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Offer Form State synced directly to Supabase public.offers
  const [offer, setOffer] = useState({
    id: null,
    title: 'Grand Festive Home Upgrade Bonanza!',
    description: 'Exchange your old appliances, get zero-cost EMI options, and enjoy free local delivery on major home electronics and bedroom sets.',
    discount_percentage: 35,
    popup_enabled: true,
    combo_offer_enabled: true,
    combo_offer_details: 'Solid Queen Bed + Duroflex Mattress + Steel Bero + Tabletop Grinder combo at special package price.',
    cta_text: 'Claim Festive Offer',
    cta_url: 'Festival Mega Offer 2026',
    image_url: '',
    valid_from: '',
    valid_until: '',
    is_active: true
  });

  const loadOffer = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('offers')
        .select('*')
        .eq('config_key', 'global')
        .single();

      if (fetchErr && fetchErr.code !== 'PGRST116') {
        throw fetchErr;
      }

      if (data) {
        setOffer({
          ...data,
          discount_percentage: data.discount_percentage || 0,
          valid_from: data.valid_from ? data.valid_from.split('T')[0] : '',
          valid_until: data.valid_until ? data.valid_until.split('T')[0] : ''
        });
      }
    } catch (err) {
      console.error('Error loading offer:', err);
      setError(err.message || 'Failed to fetch offer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffer();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const authCheck = await getAdminSession();
      if (!authCheck.isAdmin) {
        setError(authCheck.error || 'Admin authorization required.');
        setSaving(false);
        return;
      }

      const payload = {
        config_key: 'global',
        title: offer.title.trim(),
        description: offer.description ? offer.description.trim() : null,
        discount_percentage: offer.discount_percentage ? parseInt(offer.discount_percentage, 10) : null,
        popup_enabled: !!offer.popup_enabled,
        combo_offer_enabled: !!offer.combo_offer_enabled,
        combo_offer_details: offer.combo_offer_enabled ? (offer.combo_offer_details ? offer.combo_offer_details.trim() : null) : null,
        cta_text: offer.cta_text ? offer.cta_text.trim() : 'Claim Offer',
        cta_url: offer.cta_url ? offer.cta_url.trim() : 'General Enquiry',
        image_url: offer.image_url || null,
        valid_from: offer.valid_from ? new Date(offer.valid_from).toISOString() : null,
        valid_until: offer.valid_until ? new Date(offer.valid_until).toISOString() : null,
        is_active: !!offer.is_active,
        updated_at: new Date().toISOString()
      };

      // Upsert on config_key — works whether the row exists or not
      const { data: upserted, error: upsertErr } = await supabase
        .from('offers')
        .upsert(payload, { onConflict: 'config_key' })
        .select()
        .single();

      if (upsertErr) throw upsertErr;
      if (upserted) setOffer(prev => ({
        ...prev,
        id: upserted.id,
        config_key: upserted.config_key
      }));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving offer:', err);
      setError(interpretSupabaseError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Seasonal Offer & Campaign Manager</h1>
          <p>Configure store discounts, combo packages, website popup promo, and view live previews</p>
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
                <span>Saving Offer...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Offer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="admin-card" style={{ marginBottom: '1.25rem', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={18} />
          <strong style={{ fontSize: '0.9rem' }}>Offer updated successfully and live across the store & popup!</strong>
        </div>
      )}

      {error && (
        <div className="admin-card" style={{ marginBottom: '1.25rem', backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <strong style={{ fontSize: '0.9rem' }}>{error}</strong>
        </div>
      )}

      {/* ================= 10. LIVE INTERACTIVE OFFER PREVIEW ================= */}
      <div className="admin-card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} color="var(--admin-primary-accent)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Live Offer Preview (Customer View)</h3>
          </div>

          {/* Device Toggle */}
          <div style={{ display: 'flex', backgroundColor: 'var(--admin-surface-subtle)', padding: '0.2rem', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: previewDevice === 'desktop' ? '#ffffff' : 'transparent',
                color: previewDevice === 'desktop' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Monitor size={14} />
              <span>Desktop View</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: previewDevice === 'mobile' ? '#ffffff' : 'transparent',
                color: previewDevice === 'mobile' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Smartphone size={14} />
              <span>Mobile View</span>
            </button>
          </div>
        </div>

        {/* The rendered preview card */}
        <div style={{
          maxWidth: previewDevice === 'mobile' ? '380px' : '100%',
          margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(37, 99, 235, 0.06) 100%)',
          borderRadius: '16px',
          border: '2px solid #f59e0b',
          padding: previewDevice === 'mobile' ? '1.25rem' : '1.75rem',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.1)',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}>
          {/* Top badge row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{
              backgroundColor: '#f59e0b',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ⭐ Featured Festival Deal
            </span>

            {offer.valid_until && (
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} />
                Valid till {new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: previewDevice === 'mobile' ? 'column' : 'row', gap: '1.25rem', alignItems: 'center' }}>
            {/* Offer Image if present */}
            {offer.image_url && (
              <div style={{ width: previewDevice === 'mobile' ? '100%' : '140px', height: '110px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#ffffff' }}>
                <img src={offer.image_url} alt="Offer banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: previewDevice === 'mobile' ? '1.25rem' : '1.5rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#0f172a' }}>
                  {offer.title || 'Grand Festive Offer'}
                </h2>
                {offer.discount_percentage > 0 && (
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                    UP TO {offer.discount_percentage}% OFF
                  </span>
                )}
              </div>

              <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                {offer.description || 'Exclusive festival discounts and special combo packages.'}
              </p>

              {/* Combo Offer Preview Box */}
              {offer.combo_offer_enabled && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px dashed #f59e0b',
                  borderRadius: '10px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    <Layers size={14} />
                    <span>Special Package Combo Included:</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                    {offer.combo_offer_details || 'Solid Queen Bed + Mattress + Steel Bero + Grinder'}
                  </div>
                </div>
              )}

              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                style={{ width: previewDevice === 'mobile' ? '100%' : 'auto' }}
              >
                <span>{offer.cta_text || 'Claim Offer'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= OFFER CONFIGURATION FORM ================= */}
      <form onSubmit={handleSave} className="admin-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>Offer Details & Controls</h3>

        {/* Controls Row: 3 Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Offer Active ON/OFF */}
          <label className="admin-toggle-wrap">
            <div className="admin-toggle-info">
              <span className="admin-toggle-title">Offer Active</span>
              <span className="admin-toggle-desc">Display on public Offers page</span>
            </div>
            <div className="admin-switch">
              <input
                type="checkbox"
                checked={offer.is_active}
                onChange={(e) => setOffer({ ...offer, is_active: e.target.checked })}
              />
              <span className="admin-slider" />
            </div>
          </label>

          {/* Popup Enabled ON/OFF */}
          <label className="admin-toggle-wrap">
            <div className="admin-toggle-info">
              <span className="admin-toggle-title">Popup Promo Enabled</span>
              <span className="admin-toggle-desc">Show as greeting modal on website</span>
            </div>
            <div className="admin-switch">
              <input
                type="checkbox"
                checked={offer.popup_enabled}
                onChange={(e) => setOffer({ ...offer, popup_enabled: e.target.checked })}
              />
              <span className="admin-slider" />
            </div>
          </label>

          {/* Combo Offer ON/OFF */}
          <label className="admin-toggle-wrap">
            <div className="admin-toggle-info">
              <span className="admin-toggle-title">Combo Offer</span>
              <span className="admin-toggle-desc">Enable multi-appliance package</span>
            </div>
            <div className="admin-switch">
              <input
                type="checkbox"
                checked={offer.combo_offer_enabled}
                onChange={(e) => setOffer({ ...offer, combo_offer_enabled: e.target.checked })}
              />
              <span className="admin-slider" />
            </div>
          </label>
        </div>

        {/* 9. Conditional Combo Offer Details */}
        {offer.combo_offer_enabled && (
          <div className="admin-form-group" style={{ backgroundColor: '#fffbeb', border: '1.5px solid #fde68a', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <label className="admin-label" style={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} />
              <span>Combo Offer Package Details *</span>
            </label>
            <textarea
              required={offer.combo_offer_enabled}
              placeholder="e.g., Solid Queen Bed + Duroflex Mattress + Steel Bero + Tabletop Grinder combo at special package price."
              value={offer.combo_offer_details || ''}
              onChange={(e) => setOffer({ ...offer, combo_offer_details: e.target.value })}
              className="admin-textarea"
              style={{ backgroundColor: '#ffffff' }}
            />
            <span style={{ fontSize: '0.78rem', color: '#92400e' }}>
              This combo description will be highlighted in the festival deal preview and website cards.
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Offer Title */}
          <div className="admin-form-group">
            <label className="admin-label">Offer Campaign Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Grand Festive Home Upgrade Bonanza!"
              value={offer.title}
              onChange={(e) => setOffer({ ...offer, title: e.target.value })}
              className="admin-input"
            />
          </div>

          {/* Discount Percentage */}
          <div className="admin-form-group">
            <label className="admin-label">Discount Percentage (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g., 35"
              value={offer.discount_percentage || ''}
              onChange={(e) => setOffer({ ...offer, discount_percentage: e.target.value })}
              className="admin-input"
            />
          </div>

          {/* CTA Text */}
          <div className="admin-form-group">
            <label className="admin-label">CTA Button Text</label>
            <input
              type="text"
              placeholder="e.g., Claim Festive Offer"
              value={offer.cta_text || ''}
              onChange={(e) => setOffer({ ...offer, cta_text: e.target.value })}
              className="admin-input"
            />
          </div>

          {/* CTA URL / Enquiry Keyword */}
          <div className="admin-form-group">
            <label className="admin-label">CTA WhatsApp Subject Tag</label>
            <input
              type="text"
              placeholder="e.g., Festival Mega Offer 2026"
              value={offer.cta_url || ''}
              onChange={(e) => setOffer({ ...offer, cta_url: e.target.value })}
              className="admin-input"
            />
          </div>

          {/* Valid From */}
          <div className="admin-form-group">
            <label className="admin-label">Valid From</label>
            <input
              type="date"
              value={offer.valid_from || ''}
              onChange={(e) => setOffer({ ...offer, valid_from: e.target.value })}
              className="admin-input"
            />
          </div>

          {/* Valid Until */}
          <div className="admin-form-group">
            <label className="admin-label">Valid Until</label>
            <input
              type="date"
              value={offer.valid_until || ''}
              onChange={(e) => setOffer({ ...offer, valid_until: e.target.value })}
              className="admin-input"
            />
          </div>
        </div>

        {/* Offer Description */}
        <div className="admin-form-group">
          <label className="admin-label">Offer Description</label>
          <textarea
            placeholder="Detailed terms or highlights of this festival promotion..."
            value={offer.description || ''}
            onChange={(e) => setOffer({ ...offer, description: e.target.value })}
            className="admin-textarea"
          />
        </div>

        {/* Offer Banner Image */}
        <div className="admin-form-group">
          <label className="admin-label">Offer Banner Image (Optional)</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              onClick={() => setIsCropModalOpen(true)}
              style={{
                width: '100px',
                height: '75px',
                borderRadius: '8px',
                border: '1.5px dashed var(--admin-border)',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              {offer.image_url ? (
                <img src={offer.image_url} alt="Offer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Upload size={22} color="var(--admin-text-muted)" />
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => setIsCropModalOpen(true)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                <Upload size={14} />
                <span>{offer.image_url ? 'Replace Offer Photo' : 'Upload Offer Photo'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Submit Button */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            {saving ? 'Publishing...' : 'Save & Publish Offer'}
          </button>
        </div>
      </form>

      {/* Image Editor Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        initialImageUrl={offer.image_url}
        onImageProcessed={(publicUrl) => {
          setOffer((prev) => ({ ...prev, image_url: publicUrl }));
        }}
      />
    </div>
  );
};
