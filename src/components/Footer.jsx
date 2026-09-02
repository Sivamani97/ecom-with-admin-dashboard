import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { useBusinessSettings } from '../context/BusinessSettingsContext';

export const Footer = () => {
  const { settings } = useBusinessSettings();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand story & trust */}
          <div>
            <div className="brand-logo-link" style={{ marginBottom: '0.85rem' }}>
              <div className="brand-logo-img-wrap">
                <img src="/logo.png" alt="Aruna Radios & Furniture" className="brand-logo-img" />
              </div>
              <div className="brand-info">
                <span className="brand-name">ARUNA</span>
                <span className="brand-subtitle">Radios &amp; Furniture</span>
              </div>
            </div>

            <p className="footer-tagline-text">
              Quality Products. Best Prices. Serving Jayankondam and surrounding regions with authentic products, competitive prices, and trusted service since 1949.
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem' }}>
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
                aria-label="Follow Aruna Radios on Instagram"
              >
                <InstagramIcon size={15} color="#E1306C" />
                <span>Instagram</span>
              </a>

              <a
                href={settings.google_maps_directions_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
                aria-label="Get Directions to Store"
              >
                <MapPin size={15} color="#d97706" />
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
            <ul className="footer-nav-list" style={{ gap: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  {settings.address_line1}, {settings.address_line2}, {settings.city} - {settings.pincode}
                </span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <a href={`tel:${(settings.phone_primary || '').replace(/\s+/g, '')}`} style={{ fontWeight: 700 }}>
                  {settings.phone_primary}
                </a>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Clock size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p>{settings.hours_weekday}</p>
                  <p>{settings.hours_sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Verbatim Line */}
        <div className="footer-bottom">
          <p className="footer-bottom-line">
            Since 1949 | Quality • Trust • Value • Customer Satisfaction — Bringing Quality and Comfort to Every Home.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Aruna Radios &amp; Furniture – Jayankondam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
