import React from 'react';
import { Sparkles, Gift, Tag, ArrowRight, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { BackButton } from '../components/BackButton';
import { SITE_CONFIG } from '../config/siteConfig';

export const OffersPage = ({ onOpenEnquiry }) => {
  const offersList = [
    {
      id: 'festive-combo',
      title: 'Grand Festival Home Combo',
      badge: 'Bestseller Offer',
      discount: 'Save Up To ₹12,000',
      desc: 'Complete bedroom upgrade: Solid Queen Bed + Duroflex Mattress + Steel Bero + Tabletop Grinder combo at special package price.',
      validity: 'Limited stock for wedding & festive season'
    },
    {
      id: 'appliance-exchange',
      title: 'Old Appliance Exchange Mela',
      badge: 'Exchange Bonus',
      discount: 'Extra ₹2,500 Exchange Value',
      desc: 'Bring in your old working/non-working mixie, iron box, fan or gas stove and get maximum exchange value on brand-new Preethi, Prestige or Crompton appliances.',
      validity: 'Valid across all categories'
    },
    {
      id: 'emi-offer',
      title: 'Zero Downpayment & Easy EMI',
      badge: 'Flexible Finance',
      discount: '0% Interest EMI Plans',
      desc: 'Instant loan approval on Bajaj Finserv, TVS Credit, and major credit/debit cards on all purchases above ₹5,000.',
      validity: 'Available in-store with instant documentation'
    }
  ];

  return (
    <>
      <SEO
        title="Festival Offers & Deals - Aruna Radios & Furniture"
        description="Exclusive festive discounts, appliance exchange schemes, and wedding furniture combo deals at Aruna Radios & Furniture Jayankondam."
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
            {offersList.map((offer) => (
              <div
                key={offer.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{
                    backgroundColor: 'var(--accent-gold-light)',
                    color: 'var(--accent-gold-dark)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.8rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {offer.badge}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {offer.validity}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {offer.title}
                  </h3>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    {offer.discount}
                  </span>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {offer.desc}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onOpenEnquiry && onOpenEnquiry(offer.title)}
                    className="btn btn-whatsapp"
                  >
                    <MessageCircle size={18} />
                    <span>Claim Offer via WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`}
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
