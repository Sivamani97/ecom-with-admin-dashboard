import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { SITE_CONFIG } from '../config/siteConfig';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand story & trust */}
          <div>
            <div className="brand-logo-link" style={{ marginBottom: '1rem' }}>
              <div className="brand-logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" stroke="#fbbf24" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" stroke="#ffffff" />
                  <circle cx="12" cy="12" r="2" fill="#fbbf24" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" stroke="#ffffff" />
                  <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" stroke="#fbbf24" />
                </svg>
              </div>
              <div className="brand-info">
                <span className="brand-name">ARUNA</span>
                <span className="brand-subtitle">Radios &amp; Furniture</span>
              </div>
            </div>

            <p className="footer-tagline-text">
              {SITE_CONFIG.subTagline} Serving Jayankondam and surrounding regions with authentic products, competitive prices, and trusted service since 1949.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <a
                href={SITE_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
                aria-label="Follow Aruna Radios on Instagram"
              >
                <InstagramIcon size={16} color="#E1306C" />
                <span>Instagram</span>
              </a>

              <a
                href={SITE_CONFIG.contact.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
                aria-label="Get Directions to Store"
              >
                <MapPin size={16} color="#d97706" />
                <span>Directions</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="footer-heading">Explore Catalog</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/products?category=furniture">Furniture &amp; Cots</Link>
              </li>
              <li>
                <Link to="/products?category=kitchen-appliances">Kitchen Appliances</Link>
              </li>
              <li>
                <Link to="/products?category=home-appliances">Home Electronics &amp; Fans</Link>
              </li>
              <li>
                <Link to="/offers">Festive Offers &amp; Discounts</Link>
              </li>
              <li>
                <Link to="/about">Our 75+ Year Heritage</Link>
              </li>
              <li>
                <Link to="/contact">Store Location &amp; Hours</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div>
            <h4 className="footer-heading">Store Visit &amp; Enquiries</h4>
            <ul className="footer-nav-list" style={{ gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  {SITE_CONFIG.contact.address.line1}, {SITE_CONFIG.contact.address.line2}, {SITE_CONFIG.contact.address.city} - {SITE_CONFIG.contact.address.pincode}
                </span>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <a href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`} style={{ fontWeight: 600 }}>
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <Clock size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p>{SITE_CONFIG.contact.hours.weekday}</p>
                  <p>{SITE_CONFIG.contact.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Verbatim Line */}
        <div className="footer-bottom">
          <p className="footer-bottom-line">
            {SITE_CONFIG.footerLine}
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Aruna Radios &amp; Furniture – Jayankondam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
