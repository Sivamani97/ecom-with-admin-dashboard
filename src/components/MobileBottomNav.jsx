import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Gift, Phone, Info } from 'lucide-react';

export const MobileBottomNav = () => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        end
      >
        {({ isActive }) => (
          <>
            {isActive && <div className="mobile-nav-indicator" />}
            <Home size={20} />
            <span>Home</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/products"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        {({ isActive }) => (
          <>
            {isActive && <div className="mobile-nav-indicator" />}
            <Package size={20} />
            <span>Products</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/offers"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        {({ isActive }) => (
          <>
            {isActive && <div className="mobile-nav-indicator" />}
            <Gift size={20} />
            <span>Offers</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/contact"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        {({ isActive }) => (
          <>
            {isActive && <div className="mobile-nav-indicator" />}
            <Phone size={20} />
            <span>Contact</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        {({ isActive }) => (
          <>
            {isActive && <div className="mobile-nav-indicator" />}
            <Info size={20} />
            <span>About</span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
