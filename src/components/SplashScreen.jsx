import React, { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

export const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem('hasSeenSplash');
      if (!hasSeen) {
        setVisible(true);
        sessionStorage.setItem('hasSeenSplash', 'true');

        // Start fade out after 1.5 seconds
        const timer1 = setTimeout(() => {
          setFadeOut(true);
        }, 1500);

        // Remove from DOM after transition completes
        const timer2 = setTimeout(() => {
          setVisible(false);
          if (onFinish) onFinish();
        }, 2000);

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
        <div className="splash-emblem">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="24" fill="#1e3a8a" />
            <circle cx="50" cy="50" r="42" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
            {/* Retro Radio + Modern Sofa Silhouette */}
            <rect x="22" y="36" width="56" height="38" rx="8" stroke="#fbbf24" strokeWidth="3" fill="#0f172a" />
            <circle cx="38" cy="55" r="10" fill="#fbbf24" />
            <circle cx="38" cy="55" r="4" fill="#0f172a" />
            <line x1="56" y1="48" x2="70" y2="48" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="56" y1="55" x2="70" y2="55" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="56" y1="62" x2="70" y2="62" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="36" x2="42" y2="20" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <circle cx="43" cy="19" r="3" fill="#fbbf24" />
          </svg>
        </div>

        <h1 className="splash-title">ARUNA RADIOS &amp; FURNITURE</h1>
        <div className="splash-location">JAYANKONDAM</div>
        <p className="splash-tagline">"{SITE_CONFIG.tagline}"</p>

        <div className="splash-badge-1949">
          <span>★</span>
          <span>ESTABLISHED 1949</span>
          <span>★</span>
        </div>
      </div>
    </div>
  );
};
