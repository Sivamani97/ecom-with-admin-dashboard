import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PhoneCall, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({ onOpenEnquiry }) => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo & Since 1949 Badge */}
        <Link to="/" className="brand-logo-link" aria-label="Aruna Radios & Furniture Home">
          <div className="brand-logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" stroke="#fbbf24" />
              <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" stroke="#ffffff" />
              <circle cx="12" cy="12" r="2" fill="#fbbf24" />
              <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" stroke="#ffffff" />
              <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" stroke="#fbbf24" />
            </svg>
          </div>
          <div className="brand-info">
            <span className="brand-name">ARUNA</span>
            <span className="brand-subtitle">
              Radios &amp; Furniture <span className="brand-year">• 1949</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Products
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/offers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Sparkles size={16} color="#d97706" /> Offers
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </nav>

        {/* Header Actions: Call CTA, Theme Toggle */}
        <div className="header-actions">
          <ThemeToggle />
          
          <a
            href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`}
            className="sticky-call-btn"
            title="Direct Call to Store"
          >
            <PhoneCall size={16} />
            <span>Call Now</span>
          </a>

          <button
            onClick={() => onOpenEnquiry && onOpenEnquiry()}
            className="btn btn-gold btn-sm d-none-mobile"
            style={{ display: 'none' }}
          >
            Enquire Now
          </button>
        </div>
      </div>
    </header>
  );
};
