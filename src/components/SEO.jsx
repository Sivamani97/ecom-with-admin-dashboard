import { useEffect } from 'react';

export const SEO = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update Title
    if (title) {
      document.title = `${title} | Aruna Radios & Furniture – Jayankondam`;
    }

    // Update Meta Description
    if (description) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }

    // Update Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // Scroll to top on page switch
    window.scrollTo(0, 0);
  }, [title, description, keywords]);

  return null;
};
