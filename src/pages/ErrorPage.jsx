import React from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, PhoneCall, ShoppingBag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { SITE_CONFIG } from '../config/siteConfig';

export const ErrorPage = () => {
  return (
    <>
      <SEO
        title="Page Not Found - Aruna Radios & Furniture"
        description="The page you are looking for might have been moved or is temporarily unavailable. Return to Aruna Radios & Furniture home."
      />

      <section className="section-padding" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
          {/* Branded Vintage Emblem Illustration */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--primary) 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.75rem auto',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <span className="section-badge">404 • Page Not Found</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Looking for something specific?
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            The page you requested is unavailable, but our showroom in Jayankondam is always open with thousands of quality products.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary btn-lg">
              <Home size={18} />
              <span>Return to Home</span>
            </Link>

            <Link to="/products" className="btn btn-secondary btn-lg">
              <ShoppingBag size={18} />
              <span>Browse Catalog</span>
            </Link>

            <a
              href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`}
              className="btn btn-outline btn-lg"
            >
              <PhoneCall size={18} />
              <span>Call Store Directly</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
