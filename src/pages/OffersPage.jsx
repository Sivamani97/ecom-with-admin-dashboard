import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Tag, ArrowRight, ShieldCheck, CheckCircle2, MessageCircle, Calendar, ImageOff } from 'lucide-react';
import { SEO } from '../components/SEO';
import { BackButton } from '../components/BackButton';
import { useBusinessSettings } from '../context/BusinessSettingsContext';
import { api } from '../lib/api';

export const OffersPage = ({ onOpenEnquiry }) => {
  const { settings } = useBusinessSettings();
  const [activeDbOffer, setActiveDbOffer] = useState(null);
  const [bannerImgError, setBannerImgError] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      const offer = await api.getActiveOffer();
      if (offer) {
        setActiveDbOffer(offer);
      }
    };
    fetchOffer();
  }, []);

  const storeOffers = [
    {
      id: 'appliance-exchange',
      title: 'Old Appliance Exchange Mela',
      badge: 'Exchange Bonus',
      discount: 'Extra ₹2,500 Exchange Value',
      desc: 'Bring in your old working/non-working mixie, iron box, fan or gas stove and get maximum exchange value on brand-new Preethi, Prestige or Crompton appliances.',
      validity: 'Valid across all categories',
    },
    {
      id: 'emi-offer',
      title: 'Zero Downpayment & Easy EMI',
      badge: 'Flexible Finance',
      discount: '0% Interest EMI Plans',
      desc: 'Instant loan approval on Bajaj Finserv, TVS Credit, and major credit/debit cards on all purchases above ₹5,000.',
      validity: 'Available in-store with instant documentation',
    },
  ];

  return (
    <>
      <SEO
  title="Festival Offers & Deals"
  description="Discover current festive offers, appliance exchange schemes and furniture deals at Aruna Radios & Furniture in Jayankondam, Tamil Nadu."
/>

      <BackButton label="Back to Home" to="/" />

      <section className="section-padding" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">
              <Gift size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
              Exclusive Store Deals
            </span>
            <h1 className="section-title">Special Seasonal Offers</h1>
            <p className="section-desc">
              Upgrade your home with maximum savings. Take advantage of our seasonal combo packages, old appliance exchange offers, and zero-cost EMI plans.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* ── Live Supabase Global Offer ── */}
            {activeDbOffer && (
              <div className="offer-featured-card">
                {/* Offer banner image — only rendered when image_url is present */}
                {activeDbOffer.image_url && !bannerImgError && (
                  <div className="offer-banner-img-wrap">
                    <img
                      src={activeDbOffer.image_url}
                      alt={`${activeDbOffer.title} offer banner`}
                      className="offer-banner-img"
                      loading="lazy"
                      onError={() => setBannerImgError(true)}
                    />
                  </div>
                )}

                {/* Offer content */}
                <div className="offer-featured-body">
                  {/* Top row: badge + validity */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <span className="offer-featured-badge">
                      ⭐ Featured Live Festival Deal
                    </span>
                    {activeDbOffer.valid_until && (
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        Valid till{' '}
                        {new Date(activeDbOffer.valid_until).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Title + discount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <h2 className="offer-featured-title">{activeDbOffer.title}</h2>
                    {activeDbOffer.discount_percentage && (
                      <span className="offer-discount-pill">
                        Up to {activeDbOffer.discount_percentage}% OFF
                      </span>
                    )}
                  </div>

                  {activeDbOffer.description && (
                    <p style={{ fontSize: '0.97rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem' }}>
                      {activeDbOffer.description}
                    </p>
                  )}

                  {activeDbOffer.combo_offer_enabled && activeDbOffer.combo_offer_details && (
                    <div className="offer-combo-box">
                      🎁 <strong>Combo Package Bonus:</strong> {activeDbOffer.combo_offer_details}
                    </div>
                  )}

                  {/* CTAs */}
                  <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onOpenEnquiry && onOpenEnquiry(activeDbOffer.cta_url || activeDbOffer.title)}
                      className="btn btn-gold"
                    >
                      <Sparkles size={17} />
                      <span>{activeDbOffer.cta_text || 'Claim Festive Offer via WhatsApp'}</span>
                    </button>
                    <a
                      href={`tel:${(settings.phone_primary || '').replace(/\s+/g, '')}`}
                      className="btn btn-secondary"
                    >
                      <span>Call Store For Details</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ── Standard Store Offers ── */}
            {storeOffers.map((offer) => (
              <div key={offer.id} className="offer-standard-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <span className="offer-standard-badge">{offer.badge}</span>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {offer.validity}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <h3 className="offer-standard-title">{offer.title}</h3>
                  <span className="offer-standard-discount">{offer.discount}</span>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  {offer.desc}
                </p>

                <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onOpenEnquiry && onOpenEnquiry(offer.title)}
                    className="btn btn-whatsapp"
                  >
                    <MessageCircle size={17} />
                    <span>Claim Offer via WhatsApp</span>
                  </button>
                  <a
                    href={`tel:${(settings.phone_primary || '').replace(/\s+/g, '')}`}
                    className="btn btn-secondary"
                  >
                    <span>Call Store For Details</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
