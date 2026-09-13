import { useEffect } from 'react';

export const SEO = ({
  title,
  description,
  image,
  canonicalUrl,
  noindex = false
}) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Aruna Radios & Furniture – Jayankondam`
      : 'Aruna Radios & Furniture | Electronics & Furniture in Jayankondam';

    const defaultDescription =
      'Aruna Radios & Furniture is a trusted electronics, home appliances and furniture showroom in Jayankondam, Tamil Nadu. Shop TVs, refrigerators, washing machines, furniture and more.';

    const defaultImage =
      'https://www.arunafurnitures.in/logo.png';

    document.title = fullTitle;

    // Helper to update existing meta tags
    const setMetaTag = (selector, attributeName, value) => {
      if (!value) return;

      const tag = document.querySelector(selector);

      if (tag) {
        tag.setAttribute(attributeName, value);
      }
    };

    const metaDescription = description || defaultDescription;
    const metaImage = image || defaultImage;

    // Standard Meta
    setMetaTag(
      "meta[name='description']",
      'content',
      metaDescription
    );
// Robots Meta
setMetaTag(
  "meta[name='robots']",
  'content',
  noindex ? 'noindex, nofollow' : 'index, follow'
);
    // Open Graph
    setMetaTag(
      "meta[property='og:title']",
      'content',
      fullTitle
    );

    setMetaTag(
      "meta[property='og:description']",
      'content',
      metaDescription
    );

    setMetaTag(
      "meta[property='og:image']",
      'content',
      metaImage
    );

    // Twitter
    setMetaTag(
      "meta[name='twitter:title']",
      'content',
      fullTitle
    );

    setMetaTag(
      "meta[name='twitter:description']",
      'content',
      metaDescription
    );

    setMetaTag(
      "meta[name='twitter:image']",
      'content',
      metaImage
    );

    // Canonical
    const canonicalTag =
      document.querySelector("link[rel='canonical']");

    if (canonicalTag) {
      const canonical =
        canonicalUrl ||
        `${window.location.origin}${window.location.pathname}`;

      canonicalTag.setAttribute('href', canonical);
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [title, description, image, canonicalUrl,noindex]);

  return null;
};