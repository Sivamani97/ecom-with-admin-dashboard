import React from 'react';
import { BRANDS } from '../data/brands';
import { Award } from 'lucide-react';

export const BrandMarquee = () => {
  // Duplicate array for seamless infinite marquee loop
  const marqueeItems = [...BRANDS, ...BRANDS];

  return (
    <section className="marquee-section" aria-label="Authorized Brand Partners">
      <div className="container" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
        <p className="marquee-header">
          <Award size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px', color: '#d97706' }} />
          Authorized Dealer for India's Most Trusted Brands
        </p>
      </div>

      <div className="marquee-track-container">
        <div className="marquee-track">
          {marqueeItems.map((brand, idx) => (
            <div key={`${brand.id}-${idx}`} className="brand-chip">
              <span
                className="brand-chip-dot"
                style={{ backgroundColor: brand.color || '#2563eb' }}
              />
              <span className="brand-chip-name">{brand.name}</span>
              <span className="brand-chip-tag">• {brand.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
