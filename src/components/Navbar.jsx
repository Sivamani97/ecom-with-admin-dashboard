import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PhoneCall, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { ThemeToggle } from './ThemeToggle';
import logoImg from '../images/logo/logo.jpeg';

export const Navbar = () => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo & Since 1949 Badge */}
        <Link to="/" className="brand-logo-link" aria-label="Aruna Radios & Furniture Home">
          <div className="brand-logo-img-wrap">
            <img src={logoImg} alt="Aruna Radios & Furniture" className="brand-logo-img" />
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
            <Sparkles size={15} color="#d97706" /> Offers
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </nav>

        {/* Header Actions: Theme Toggle & Call Button */}
        <div className="header-actions">
          <ThemeToggle />
          
          <a
            href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`}
            className="sticky-call-btn"
            title="Call Store Now"
          >
            <PhoneCall size={14} />
            <span>Call Now</span>
          </a>
        </div>
      </div>
    </header>
  );
};
