import React, { useState, useEffect } from 'react';
import { Sparkles, X, Gift, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { api } from '../lib/api';

export const OfferPopup = ({ onClaimOffer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [offerData, setOfferData] = useState(null);

  useEffect(() => {
    const fetchAndSchedule = async () => {
      // Fetch the active offer from Supabase
      const offer = await api.getActiveOffer();

      // If no active offer exists, or the popup is disabled, do not show
      if (!offer || !offer.popup_enabled) return;

      setOfferData({
        badge: offer.title,
        title: offer.title,
        discountText: offer.discount_percentage ? `Up to ${offer.discount_percentage}% OFF` : offer.title,
        validTill: offer.valid_until ? `Offer valid till: ${new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Limited Period Offer',
        description: offer.description,
        ctaText: offer.cta_text || 'Claim Offer',
        ctaUrl: offer.cta_url
      });

      try {
        const hasSeenOffer = sessionStorage.getItem('hasSeenSeasonalOffer_v2');
        if (!hasSeenOffer) {
          const timer = setTimeout(() => {
            setIsOpen(true);
            sessionStorage.setItem('hasSeenSeasonalOffer_v2', 'true');
          }, 2200);
          return () => clearTimeout(timer);
        }
      } catch {
        // ignore sessionStorage errors
      }
    };

    fetchAndSchedule();
  }, []);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('modal-open');
      return;
    }
    document.body.classList.add('modal-open');
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Only render if we have offer data and popup is open
  if (!isOpen || !offerData) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    handleClose();
    if (onClaimOffer) {
      onClaimOffer(offerData.ctaUrl || 'General Enquiry');
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '440px' }}
      >
        {/* Header */}
        <div className="modal-header offer-theme">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              border: '1px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Gift size={20} />
            </div>
            <div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                color: '#fbbf24',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Festival Special
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', lineHeight: 1.2 }}>
                {offerData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="modal-close-btn"
            aria-label="Dismiss offer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ textAlign: 'center', padding: '1.75rem 1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px dashed var(--accent-gold)',
            marginBottom: '1.25rem'
          }}>
            <h4 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: 'var(--accent-gold-dark)',
              marginBottom: '0.35rem'
            }}>
              {offerData.discountText}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {offerData.validTill}
            </p>
          </div>

          <p style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1.5rem'
          }}>
            {offerData.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleClaim}
              className="btn btn-gold"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Sparkles size={18} />
              <span>{offerData.ctaText}</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={handleClose}
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
