import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={`Switch to ${isDark ? 'Day' : 'Night'} Mode`}
      aria-label="Toggle light and dark theme"
    >
      <div className="thematic-bulb-glow" />
      {/* Thematic Filament Bulb SVG Animation */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: 'all 0.3s ease',
          transform: isDark ? 'scale(1.05)' : 'scale(1)',
          color: isDark ? '#fbbf24' : '#64748b'
        }}
      >
        {isDark ? (
          // Glowing Vintage Bulb when Dark
          <>
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17h8v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z" fill="#f59e0b" fillOpacity="0.25" stroke="#fbbf24" />
            <path d="M10 9l2 3 2-3" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="12" y1="1" x2="12" y2="3" stroke="#fbbf24" />
            <line x1="20" y1="9" x2="22" y2="9" stroke="#fbbf24" />
            <line x1="2" y1="9" x2="4" y2="9" stroke="#fbbf24" />
          </>
        ) : (
          // Daylight Sun Bulb when Light
          <>
            <circle cx="12" cy="12" r="4" fill="#f59e0b" stroke="#d97706" />
            <path d="M12 2v2" stroke="#d97706" />
            <path d="M12 20v2" stroke="#d97706" />
            <path d="M4.93 4.93l1.41 1.41" stroke="#d97706" />
            <path d="M17.66 17.66l1.41 1.41" stroke="#d97706" />
            <path d="M2 12h2" stroke="#d97706" />
            <path d="M20 12h2" stroke="#d97706" />
            <path d="M4.93 19.07l1.41-1.41" stroke="#d97706" />
            <path d="M17.66 6.34l1.41-1.41" stroke="#d97706" />
          </>
        )}
      </svg>
    </button>
  );
};
