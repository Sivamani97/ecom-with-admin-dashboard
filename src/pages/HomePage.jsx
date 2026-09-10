import React, { useState, useEffect } from 'react';
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
import { CustomerFeedback } from '../components/CustomerFeedback';
import { useBusinessSettings } from '../context/BusinessSettingsContext';
import { api } from '../lib/api';
const logoImg = "/logo.png";

export const HomePage = ({ onOpenEnquiry }) => {
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedHeroCategory, setSelectedHeroCategory] = useState('all');
  const { settings } = useBusinessSettings();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [fetchedCats, fetchedProds, fetchedReviews] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getApprovedReviews()
      ]);
      setCategories(fetchedCats);
      setProducts(fetchedProds);
      setReviews(fetchedReviews);
      setLoading(false);
    };
    loadData();
  }, []);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const getCategoryCount = (slug) => {
    return (products || []).filter(p => p.categories?.slug === slug || p.category_id === slug || p.category === slug).length;
  };

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

  const getCategoryIcon = (slug) => {
    if (slug === 'furniture') return <Armchair size={18} />;
    if (slug === 'kitchen-appliances') return <ChefHat size={18} />;
    if (slug === 'home-appliances' || slug === 'tv' || slug === 'ac') return <Tv size={18} />;
    return <LayoutGrid size={18} />;
  };

  const currentCategoryObj = categories.find(c => c.slug === selectedHeroCategory) || { slug: 'all', icon: <LayoutGrid size={18} /> };

  // 4 Featured Categories for the 2x2 mobile grid and 4-column desktop grid
  const featuredCategories = [
    {
      id: "furniture",
      name: "Furniture & Cots",
      desc: "Teakwood cots, luxury sofas & steel beros",
      link: "/products?category=furniture",
      badge: `${getCategoryCount('furniture')} Models`,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "kitchen-appliances",
      name: "Kitchen Appliances",
      desc: "Heavy mixies, wet grinders & gas stoves",
      link: "/products?category=kitchen-appliances",
      badge: `${getCategoryCount('kitchen-appliances')} Models`,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "home-appliances",
      name: "Home Electronics",
      desc: "BLDC fans, geysers & inverter combos",
      link: "/products?category=home-appliances",
      badge: `${getCategoryCount('home-appliances') + getCategoryCount('tv')} Models`,
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
                <div className="hero-heritage-tag premium-heritage">
                  <ShieldCheck size={14} className="text-gold" />
                  <div className="heritage-col">
                    <span className="heritage-label">Heritage of Trust</span>
                    <span className="heritage-val">ESTD. 1949</span>
                  </div>
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
                  Everything Your Home Needs, Under One Roof!
                </p>
              </div>

              {/* Premium Category Finder / Dropdown Hub */}
              <div className="hero-category-hub">
                <div className="hero-hub-header">
                  <div className="hero-hub-title-wrap">
                    <span className="hero-hub-dot"></span>
                    <span className="hero-hub-title">Select Product Category</span>
                  </div>
                  <span className="hero-hub-count">{products.length} Showroom Models</span>
                </div>

                <form onSubmit={handleHeroCategorySubmit} className="hero-finder-bar">
                  <div className="hero-dropdown-wrapper">
                    <div className="hero-dropdown-icon">
                      {getCategoryIcon(selectedHeroCategory)}
                    </div>
                    <select
                      id="hero-category-dropdown"
                      className="hero-category-select"
                      value={selectedHeroCategory}
                      onChange={(e) => setSelectedHeroCategory(e.target.value)}
                      aria-label="Select product category"
                    >
                      <option value="all">All Products (Full Showroom)</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug || cat.id}>
                          {cat.name} ({getCategoryCount(cat.slug || cat.id)} Models)
                        </option>
                      ))}
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
                  <span className="stat-value">75+</span>
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
                    {cat.badge && (
                      <div className="category-badge-chip">
                        {cat.badge}
                      </div>
                    )}
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
                <span>100% Brand Warranty </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <CustomerFeedback />

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
                    {settings.address_line1}<br />
                    {settings.address_line2}<br />
                    {settings.city}, {settings.state} - {settings.pincode}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    (Near Bus Stand, Jayankondam)
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-box">
                  <PhoneCall size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Direct Phone</span>
                  <a href={`tel:${(settings.phone_primary || '').replace(/\s+/g, '')}`} className="info-value">
                    {settings.phone_primary}
                  </a>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Alt: {settings.phone_secondary}
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-box">
                  <Clock size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Showroom Hours</span>
                  <span className="info-value">{settings.hours_weekday}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {settings.hours_sunday}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem' }}>
                <a
                  href={settings.google_maps_directions_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <MapPin size={16} />
                  <span>Get Directions</span>
                </a>

                <a
                  href={settings.instagram_url}
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
                src={settings.google_maps_embed_url}
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
