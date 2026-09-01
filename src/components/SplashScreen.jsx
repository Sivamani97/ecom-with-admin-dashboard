import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';
import logoImg from '../images/logo/logo.jpeg';

export const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem('hasSeenSplash_v2');
      if (!hasSeen) {
        setVisible(true);
        sessionStorage.setItem('hasSeenSplash_v2', 'true');

        const timer1 = setTimeout(() => {
          setFadeOut(true);
        }, 1600);

        const timer2 = setTimeout(() => {
          setVisible(false);
          if (onFinish) onFinish();
        }, 2100);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      } else {
        if (onFinish) onFinish();
      }
    } catch {
      if (onFinish) onFinish();
    }
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className={`splash-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* Brand Logo with Golden Aura */}
        <div className="splash-logo-wrap">
          <img src={logoImg} alt="Aruna Radios & Furniture Logo" className="splash-logo-img" />
        </div>

        <h1 className="splash-title">ARUNA RADIOS &amp; FURNITURE</h1>
        <div className="splash-location">JAYANKONDAM</div>

        {/* Big 1949 & 75 Years Highlight */}
        <div className="splash-heritage-highlight">
          <span className="splash-heritage-year">1949</span>
          <span className="splash-heritage-divider" />
          <span className="splash-heritage-years">75+ YEARS OF UNBROKEN TRUST</span>
        </div>

        <p className="splash-tagline">
          &ldquo;{SITE_CONFIG.tagline}&rdquo;
        </p>
      </div>
    </div>
  );
};
