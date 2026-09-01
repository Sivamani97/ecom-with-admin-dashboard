import React, { useState, useEffect } from 'react';
import { Sparkles, X, Gift, ArrowRight } from 'lucide-react';
import { SHOW_OFFER_POPUP, SITE_CONFIG } from '../config/siteConfig';

export const OfferPopup = ({ onClaimOffer }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If switch is disabled in siteConfig, do not render or execute timer
    if (!SHOW_OFFER_POPUP) return;

    try {
      const hasSeenOffer = sessionStorage.getItem('hasSeenSeasonalOffer_v1');
      if (!hasSeenOffer) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('hasSeenSeasonalOffer_v1', 'true');
        }, 2200);

        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
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

  if (!SHOW_OFFER_POPUP || !isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    handleClose();
    if (onClaimOffer) {
      onClaimOffer(SITE_CONFIG.seasonalOffer.ctaProduct);
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
                {SITE_CONFIG.seasonalOffer.badge}
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', lineHeight: 1.2 }}>
                {SITE_CONFIG.seasonalOffer.title}
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
              {SITE_CONFIG.seasonalOffer.discountText}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {SITE_CONFIG.seasonalOffer.validTill}
            </p>
          </div>

          <p style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1.5rem'
          }}>
            {SITE_CONFIG.seasonalOffer.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleClaim}
              className="btn btn-gold"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Sparkles size={18} />
              <span>{SITE_CONFIG.seasonalOffer.ctaText}</span>
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
