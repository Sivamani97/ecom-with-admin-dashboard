import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  PhoneCall, 
  Star, 
  Armchair, 
  ChefHat, 
  Tv, 
  CheckCircle2, 
  ShoppingBag, 
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';
import { SEO } from '../components/SEO';
import { BrandMarquee } from '../components/BrandMarquee';
import { SITE_CONFIG } from '../config/siteConfig';
import { REVIEWS } from '../data/reviews';
import { PRODUCT_CATEGORIES } from '../data/products';

export const HomePage = ({ onOpenEnquiry }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = showAllReviews ? REVIEWS : REVIEWS.slice(0, 3);

  const categoryIcons = {
    furniture: <Armchair size={28} color="var(--primary)" />,
    'kitchen-appliances': <ChefHat size={28} color="var(--primary)" />,
    'home-appliances': <Tv size={28} color="var(--primary)" />
  };

  const categoryImages = {
    furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    'kitchen-appliances': "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    'home-appliances': "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80"
  };

  return (
    <>
      <SEO
        title="Home - Quality Products & Best Prices"
        description="Serving Jayankondam since 1949 with trusted home electronics, kitchen appliances, and quality furniture. Visit our showroom near Bus Stand, Jayankondam."
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <ShieldCheck size={16} />
                <span>Trusted in Jayankondam Since 1949</span>
              </div>

              <h1 className="hero-title">
                {SITE_CONFIG.tagline.split('.')[0]}.<br />
                <span className="hero-title-gradient">{SITE_CONFIG.tagline.split('.')[1]}.</span><br />
                {SITE_CONFIG.tagline.split('.')[2]}
              </h1>

              <p className="hero-subtagline">
                {SITE_CONFIG.subTagline}
              </p>

              <div className="hero-cta-group">
                <Link to="/products" className="btn btn-primary btn-lg">
                  <ShoppingBag size={20} />
                  <span>Explore All Products</span>
                  <ArrowRight size={18} />
                </Link>

                <button
                  onClick={() => onOpenEnquiry && onOpenEnquiry('General Product Enquiry')}
                  className="btn btn-whatsapp btn-lg"
                >
                  <span>Quick WhatsApp Enquiry</span>
                </button>
              </div>

              {/* Trust Stats Strip */}
              <div className="hero-stats-strip">
                <div className="stat-item">
                  <span className="stat-value">{SITE_CONFIG.yearsOfTrust}</span>
                  <span className="stat-label">Years of Unbroken Trust</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">10,000+</span>
                  <span className="stat-label">Happy Families Served</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">25+</span>
                  <span className="stat-label">Leading National Brands</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="hero-visual-card">
              <div className="hero-image-frame">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80"
                  alt="Aruna Radios & Furniture Showroom Showcase"
                  loading="eager"
                />
              </div>

              <div className="hero-floating-pill">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold-dark)'
                  }}>
                    <Flame size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Jayankondam's No. 1 Choice</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cots, Beros, Mixies, TVs &amp; Inverters</p>
                  </div>
                </div>

                <Link to="/products" className="btn btn-gold btn-sm">
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rotating Brand Logo Marquee */}
      <BrandMarquee />

      {/* Category Preview Showcase */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Product Categories</span>
            <h2 className="section-title">Everything for Your Dream Home</h2>
            <p className="section-desc">
              Browse our wide selection of certified home appliances, heavy-duty electronics, and durable furniture crafted for longevity.
            </p>
          </div>

          <div className="category-grid">
            {PRODUCT_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="category-card"
              >
                <div className="category-img-wrap">
                  <img
                    src={categoryImages[cat.id]}
                    alt={`${cat.name} Collection`}
                    loading="lazy"
                  />
                  <div className="category-badge-chip">
                    {cat.count} Items
                  </div>
                </div>

                <div className="category-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    {categoryIcons[cat.id]}
                    <h3 className="category-card-title" style={{ marginBottom: 0 }}>{cat.name}</h3>
                  </div>
                  <p className="category-card-desc">{cat.desc}</p>
                  <span className="category-link-btn">
                    <span>Browse {cat.name}</span>
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Short About Us Teaser */}
      <section className="section-padding">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div className="section-badge">Our Legacy Since 1949</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Serving Jayankondam with Trust for Over 7 Decades
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.75rem', maxWidth: '880px' }}>
              Serving Jayankondam with trust since 1949, <strong>Aruna Radios &amp; Furniture</strong> is a trusted destination for quality home appliances, electronics, and furniture. From modern home appliances and the latest electronics to stylish and comfortable furniture, we offer everything you need to make your home smarter, more comfortable, and more beautiful.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link to="/about" className="btn btn-primary">
                <span>Read Our Full Story</span>
                <ArrowRight size={16} />
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-dark)', fontWeight: 700, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} />
                <span>100% Genuine Warranty &amp; Local Service Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section (3 default + View More toggle) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Customer Testimonials</span>
            <h2 className="section-title">What Our Customers in Jayankondam Say</h2>
            <p className="section-desc">
              Real reviews from generations of families who rely on Aruna Radios &amp; Furniture for their homes.
            </p>
          </div>

          <div className="reviews-grid">
            {displayedReviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <h3 className="review-title">"{rev.title}"</h3>
                <p className="review-comment">"{rev.comment}"</p>
                <div className="reviewer-meta">
                  <div className="reviewer-avatar">
                    {rev.name.charAt(0)}
                  </div>
                  <div className="reviewer-info">
                    <span className="reviewer-name">{rev.name}</span>
                    <span className="reviewer-loc">{rev.location} • {rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More / View Less Reviews Control */}
          <div className="reviews-action-wrap">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="btn btn-secondary"
            >
              <span>{showAllReviews ? 'Show Fewer Reviews' : `View More Reviews (${REVIEWS.length - 3} more)`}</span>
              {showAllReviews ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </section>

      {/* Map, Address, Directions & Instagram Showcase */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Visit Our Showroom</span>
            <h2 className="section-title">Conveniently Located in Jayankondam</h2>
            <p className="section-desc">
              Step into our spacious store to experience furniture comfort and test live appliances before you buy.
            </p>
          </div>

          <div className="contact-grid">
            {/* Address Details */}
            <div className="contact-info-card">
              <div className="info-row">
                <div className="info-icon-box">
                  <MapPin size={22} />
                </div>
                <div className="info-content">
                  <span className="info-label">Store Address</span>
                  <span className="info-value">
                    {SITE_CONFIG.contact.address.line1}<br />
                    {SITE_CONFIG.contact.address.line2}<br />
                    {SITE_CONFIG.contact.address.city}, {SITE_CONFIG.contact.address.state} - {SITE_CONFIG.contact.address.pincode}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    ({SITE_CONFIG.contact.address.landmark})
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-box">
                  <PhoneCall size={22} />
                </div>
                <div className="info-content">
                  <span className="info-label">Direct Phone &amp; Support</span>
                  <a href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`} className="info-value">
                    {SITE_CONFIG.contact.phone}
                  </a>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Alt: {SITE_CONFIG.contact.altPhone}
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-box">
                  <Clock size={22} />
                </div>
                <div className="info-content">
                  <span className="info-label">Showroom Working Hours</span>
                  <span className="info-value">{SITE_CONFIG.contact.hours.weekday}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {SITE_CONFIG.contact.hours.sunday}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a
                  href={SITE_CONFIG.contact.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <MapPin size={18} />
                  <span>Get Directions</span>
                </a>

                <a
                  href={SITE_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon size={18} color="#E1306C" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="map-container" style={{ height: '360px' }}>
              <iframe
                title="Aruna Radios & Furniture Location Map Jayankondam"
                src={SITE_CONFIG.contact.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
