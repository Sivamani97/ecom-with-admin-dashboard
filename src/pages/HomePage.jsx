import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Gift,
  ChevronDown,
  ChevronUp,
  LayoutGrid
} from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';
import { SEO } from '../components/SEO';
import { BrandMarquee } from '../components/BrandMarquee';
import { SITE_CONFIG } from '../config/siteConfig';
import { REVIEWS } from '../data/reviews';
import { PRODUCT_CATEGORIES } from '../data/products';
const logoImg = "/logo.png";

export const HomePage = ({ onOpenEnquiry }) => {
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedHeroCategory, setSelectedHeroCategory] = useState('all');

  const displayedReviews = showAllReviews ? REVIEWS : REVIEWS.slice(0, 3);

  const heroCategoryOptions = [
    { id: 'all', name: 'All Products', label: 'All Products', count: '34 Items', icon: <LayoutGrid size={18} /> },
    { id: 'furniture', name: 'Furniture', label: 'Furnitures & Cots', count: '13 Items', icon: <Armchair size={18} /> },
    { id: 'home-appliances', name: 'Home Appliances', label: 'Home Appliances', count: '10 Items', icon: <Tv size={18} /> },
    { id: 'kitchen-appliances', name: 'Kitchen Appliances', label: 'Kitchen Appliances', count: '11 Items', icon: <ChefHat size={18} /> }
  ];

  const handleHeroCategorySubmit = (e) => {
    e?.preventDefault();
    if (selectedHeroCategory === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${selectedHeroCategory}`);
    }
  };

  const handleDirectCategoryClick = (catId) => {
    setSelectedHeroCategory(catId);
    if (catId === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${catId}`);
    }
  };

  const currentCategoryObj = heroCategoryOptions.find(c => c.id === selectedHeroCategory) || heroCategoryOptions[0];

  // 4 Featured Categories for the 2x2 mobile grid and 4-column desktop grid
  const featuredCategories = [
    {
      id: "furniture",
      name: "Furniture & Cots",
      desc: "Teakwood cots, luxury sofas & steel beros",
      link: "/products?category=furniture",
      badge: "13 Items",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "kitchen-appliances",
      name: "Kitchen Appliances",
      desc: "Heavy mixies, wet grinders & gas stoves",
      link: "/products?category=kitchen-appliances",
      badge: "11 Items",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "home-appliances",
      name: "Home Electronics",
      desc: "BLDC fans, geysers & inverter combos",
      link: "/products?category=home-appliances",
      badge: "10 Items",
      image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "offers",
      name: "Festival Deals",
      desc: "Combo packages & zero-cost EMI offers",
      link: "/offers",
      badge: "Mega Sale",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80"
    }
  ];

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
            <div className="hero-content-col">
              <div className="hero-badge-row">
                <div className="hero-badge">
                  <ShieldCheck size={16} />
                  <span>Jayankondam's Trusted Showroom</span>
                </div>
                <div className="hero-heritage-tag">
                  <Sparkles size={14} className="sparkle-anim" />
                  <span>ESTD. 1949</span>
                </div>
              </div>

              <h1 className="hero-title">
                <span className="hero-title-row">Quality Products.</span>
                <span className="hero-title-gradient">Best Prices.</span>
                <span className="hero-title-row hero-trusted-row">
                  Trusted Since <span className="hero-year-highlight" title="Serving since 1949">1949</span>
                </span>
              </h1>

              <div className="hero-subtagline-wrapper">
                <p className="hero-subtagline">
                  <span className="hero-subtagline-spark">✨</span>
                  {SITE_CONFIG.subTagline}
                </p>
              </div>

              {/* Premium Category Finder / Dropdown Hub */}
              <div className="hero-category-hub">
                <div className="hero-hub-header">
                  <div className="hero-hub-title-wrap">
                    <span className="hero-hub-dot"></span>
                    <span className="hero-hub-title">Select Product Category</span>
                  </div>
                  <span className="hero-hub-count">34 Showroom Items</span>
                </div>

                <form onSubmit={handleHeroCategorySubmit} className="hero-finder-bar">
                  <div className="hero-dropdown-wrapper">
                    <div className="hero-dropdown-icon">
                      {currentCategoryObj.icon}
                    </div>
                    <select
                      id="hero-category-dropdown"
                      className="hero-category-select"
                      value={selectedHeroCategory}
                      onChange={(e) => setSelectedHeroCategory(e.target.value)}
                      aria-label="Select product category"
                    >
                      <option value="all">All Products (Full Showroom)</option>
                      <option value="furniture">Furnitures &amp; Cots (13 Items)</option>
                      <option value="home-appliances">Home Appliances (10 Items)</option>
                      <option value="kitchen-appliances">Kitchen Appliances (11 Items)</option>
                    </select>
                    <ChevronDown size={16} className="hero-select-arrow" />
                  </div>

                  <button type="submit" className="hero-finder-btn" id="hero-explore-btn">
                    <span>Explore</span>
                    <ArrowRight size={17} />
                  </button>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="hero-cta-group">
                <button
                  onClick={() => onOpenEnquiry && onOpenEnquiry('General Product Enquiry')}
                  className="btn btn-whatsapp btn-lg"
                >
                  <PhoneCall size={18} />
                  <span>WhatsApp Enquiry</span>
                </button>

                <Link to="/offers" className="btn btn-gold btn-lg">
                  <Gift size={18} />
                  <span>View Festival Deals</span>
                </Link>
              </div>

              {/* Trust Stats Strip */}
              <div className="hero-stats-strip">
                <div className="stat-item">
                  <span className="stat-value">{SITE_CONFIG.yearsOfTrust}</span>
                  <span className="stat-label">Years of Trust</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">10,000+</span>
                  <span className="stat-label">Happy Families</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">25+</span>
                  <span className="stat-label">Top Brands</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d97706',
                    flexShrink: 0
                  }}>
                    <img src={logoImg} alt="Aruna Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800 }}>Jayankondam's Pride</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cots, Beros, Mixies &amp; Inverters</p>
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

      {/* Rounded Brand Logo Carousel */}
      <BrandMarquee />

      {/* 4 Category Showcase (2-in-a-row on mobile, 4-in-a-row on desktop) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Explore Categories</span>
            <h2 className="section-title">Everything for Your Home</h2>
            <p className="section-desc">
              Browse our certified home appliances, heavy-duty electronics, and durable furniture built for longevity.
            </p>
          </div>

          <div className="category-grid-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="category-card"
              >
                <div className="category-img-wrap">
                  <img
                    src={cat.image}
                    alt={`${cat.name} Collection`}
                    loading="lazy"
                  />
                  <div className="category-badge-chip">
                    {cat.badge}
                  </div>
                </div>

                <div className="category-content">
                  <div>
                    <h3 className="category-card-title">{cat.name}</h3>
                    <p className="category-card-desc">{cat.desc}</p>
                  </div>
                  <span className="category-link-btn">
                    <span>Browse</span>
                    <ArrowRight size={14} />
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
            padding: '2.25rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div className="section-badge">Our Legacy Since 1949</div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
              Serving Jayankondam with Trust for Over 7 Decades
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '880px' }}>
              Serving Jayankondam with trust since 1949, <strong>Aruna Radios &amp; Furniture</strong> is a trusted destination for quality home appliances, electronics, and furniture. From modern home appliances and the latest electronics to stylish and comfortable furniture, we offer everything you need to make your home smarter, more comfortable, and more beautiful.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
              <Link to="/about" className="btn btn-primary">
                <span>Read Full History</span>
                <ArrowRight size={16} />
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-dark)', fontWeight: 800, fontSize: '0.88rem' }}>
                <CheckCircle2 size={17} />
                <span>100% Brand Warranty &amp; Doorstep Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section with Avatar Image Slots & Even Layout */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Customer Testimonials</span>
            <h2 className="section-title">What Our Customers in Jayankondam Say</h2>
            <p className="section-desc">
              Real feedback from generations of families who rely on Aruna Radios &amp; Furniture.
            </p>
          </div>

          <div className="reviews-grid">
            {displayedReviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div>
                  <div className="review-stars">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <h3 className="review-title">"{rev.title}"</h3>
                  <p className="review-comment">"{rev.comment}"</p>
                </div>

                <div className="reviewer-meta">
                  <div className="reviewer-avatar-slot">
                    {/* Render photo or stylish initials fallback */}
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
              {showAllReviews ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
              Step into our store to experience furniture comfort and test live appliances before you buy.
            </p>
          </div>

          <div className="contact-grid">
            {/* Address Details */}
            <div className="contact-info-card">
              <div className="info-row">
                <div className="info-icon-box">
                  <MapPin size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Store Address</span>
                  <span className="info-value">
                    {SITE_CONFIG.contact.address.line1}<br />
                    {SITE_CONFIG.contact.address.line2}<br />
                    {SITE_CONFIG.contact.address.city}, {SITE_CONFIG.contact.address.state} - {SITE_CONFIG.contact.address.pincode}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    ({SITE_CONFIG.contact.address.landmark})
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-box">
                  <PhoneCall size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Direct Phone</span>
                  <a href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`} className="info-value">
                    {SITE_CONFIG.contact.phone}
                  </a>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Alt: {SITE_CONFIG.contact.altPhone}
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-box">
                  <Clock size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Showroom Hours</span>
                  <span className="info-value">{SITE_CONFIG.contact.hours.weekday}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {SITE_CONFIG.contact.hours.sunday}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem' }}>
                <a
                  href={SITE_CONFIG.contact.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <MapPin size={16} />
                  <span>Get Directions</span>
                </a>

                <a
                  href={SITE_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon size={17} color="#E1306C" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="map-container" style={{ height: '340px' }}>
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
