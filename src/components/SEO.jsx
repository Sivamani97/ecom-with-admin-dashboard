import { useEffect } from 'react';

export const SEO = ({ title, description, keywords, image, canonicalUrl }) => {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} | Aruna Radios & Furniture – Jayankondam`
      : 'Aruna Radios & Furniture – Jayankondam | Since 1949';

    document.title = fullTitle;

    // Update Meta Tag function helper
    const setMetaTag = (selector, attributeName, value) => {
      if (!value) return;
      let tag = document.querySelector(selector);
      if (tag) {
        tag.setAttribute(attributeName, value);
      }
    };

    // Standard Meta Tags
    setMetaTag("meta[name='description']", 'content', description);
    setMetaTag("meta[name='keywords']", 'content', keywords);

    // Open Graph Tags
    setMetaTag("meta[property='og:title']", 'content', fullTitle);
    setMetaTag("meta[property='og:description']", 'content', description);
    setMetaTag("meta[property='og:image']", 'content', image || 'https://arunaradiosandfurniture.com/logo.png');

    // Twitter Card Tags
    setMetaTag("meta[name='twitter:title']", 'content', fullTitle);
    setMetaTag("meta[name='twitter:description']", 'content', description);
    setMetaTag("meta[name='twitter:image']", 'content', image || 'https://arunaradiosandfurniture.com/logo.png');

    // Canonical Tag
    let canonicalTag = document.querySelector("link[rel='canonical']");
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonicalUrl || window.location.href);
    }

    // Smooth Scroll to Top on route change
    window.scrollTo(0, 0);
  }, [title, description, keywords, image, canonicalUrl]);

  return null;
};
