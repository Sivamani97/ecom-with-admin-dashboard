import React from 'react';
import { BRANDS } from '../data/brands';
import { Award } from 'lucide-react';

export const BrandMarquee = () => {
  // Helper to extract 2-letter initials for luxury round badge
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Render one full set of brand cards
  const renderCards = (prefix) =>
    BRANDS.map((brand) => {
      const brandColor = brand.color || '#2563eb';
      return (
        <div key={`${prefix}-${brand.id}`} className="brand-rounded-card">
          <div
            className="brand-circle-placeholder"
            style={{
              borderColor: `${brandColor}40`,
              boxShadow: `0 4px 12px ${brandColor}25`
            }}
          >
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="brand-logo-img"
              loading="lazy"
              onError={(e) => {
                // Fallback to text initials if image ever fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="brand-initials-badge"
              style={{
                display: 'none',
                background: `linear-gradient(135deg, ${brandColor} 0%, #0f172a 100%)`
              }}
            >
              {brand.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <span className="brand-rounded-name">{brand.name}</span>
        </div>
      );
    });

  return (
    <section className="marquee-section" aria-label="Authorized Brand Partners">
      <div className="container">
        <p className="marquee-header">
          <Award size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px', color: '#d97706' }} />
          Authorized Dealer for India's Most Trusted Brands
        </p>
      </div>

      {/* aria-hidden: decorative animation, content is supplementary */}
      <div className="marquee-track-container" aria-hidden="true">
        {/* Two identical tracks animate in sync — when the first exits, the second seamlessly takes over */}
        <div className="marquee-track">
          {renderCards('a')}
        </div>
        <div className="marquee-track" aria-hidden="true">
          {renderCards('b')}
        </div>
      </div>
    </section>
  );
};
