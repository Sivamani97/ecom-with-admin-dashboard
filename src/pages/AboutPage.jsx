import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  HeartHandshake, 
  Smile, 
  MapPin, 
  Calendar, 
  CheckCircle,
  ShoppingBag,
  PhoneCall
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { BackButton } from '../components/BackButton';
import { BrandMarquee } from '../components/BrandMarquee';
import { SITE_CONFIG } from '../config/siteConfig';
const logoImg = "/logo.png";

export const AboutPage = ({ onOpenEnquiry }) => {
  return (
    <>
      <SEO
  title="About Aruna Radios & Furniture"
  description="Learn about Aruna Radios & Furniture, a trusted showroom serving Jayankondam, Tamil Nadu since 1949 with electronics, home appliances and quality furniture."
/>

      <BackButton label="Back to Home" to="/" />

      {/* About Header with Brand Logo */}
      <section className="about-hero-section">
        <div className="container text-center">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              margin: '0 auto 1.25rem auto',
              boxShadow: 'var(--shadow-md)',
              border: '2px solid rgba(217, 119, 6, 0.4)',
              background: '#ffffff',
              padding: '2px'
            }}>
              <img src={logoImg} alt="Aruna Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            <span className="section-badge">
              <Calendar size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
              Established 1949 • 75+ Years Heritage
            </span>
            <h1 className="section-title">
              About Aruna Radios &amp; Furniture
            </h1>
            <p className="section-desc">
              Three generations of genuine quality, honest pricing, and steadfast service to the families of Jayankondam and Ariyalur district.
            </p>
          </div>
        </div>
      </section>

      {/* Main Verbatim Copy Sections */}
      <section className="section-padding" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          <div className="about-content-block">
            {/* Primary Verbatim Lead */}
            

            {/* Structured Verbatim Pillars */}
            <div className="pillar-grid">
              {/* Pillar 1 */}
              <div className="pillar-card">
                <div className="pillar-icon">
                  <Award size={24} />
                </div>
                <h2 className="pillar-title">Quality Products at the Best Price</h2>
                <p className="pillar-desc">
                  For generations, we have been committed to offering quality products at the best prices, earning the trust and support of the people of Jayankondam.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="pillar-card">
                <div className="pillar-icon">
                  <HeartHandshake size={24} />
                </div>
                <h2 className="pillar-title">Supported by the People of Jayankondam</h2>
                <p className="pillar-desc">
                  Our journey since 1949 has been made special by the continued trust, support, and love of the people of Jayankondam.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="pillar-card">
                <div className="pillar-icon">
                  <Smile size={24} />
                </div>
                <h2 className="pillar-title">Customer Satisfaction Is Our Satisfaction</h2>
                <p className="pillar-desc">
                  Your happiness is our greatest achievement. We are dedicated to providing quality products, value for money, and a satisfying shopping experience to every customer.
                </p>
              </div>
              <p className="about-lead">
              Serving Jayankondam with trust since 1949, <strong>Aruna Radios &amp; Furniture</strong> is a trusted destination for quality home appliances, electronics, and furniture. From modern home appliances and the latest electronics to stylish and comfortable furniture, we offer everything you need to make your home smarter, more comfortable, and more beautiful.
            </p>
            </div>
          </div>

          {/* Heritage Timeline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
            <div className="about-content-block" style={{ marginBottom: 0 }}>
              <span className="section-badge">Our Journey</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                Milestones Through the Decades
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.15rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    flexShrink: 0,
                    fontFamily: 'var(--font-display)'
                  }}>
                    1949
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem' }}>Founding the First Radio &amp; Appliance Hub</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Started in the historic heart of Jayankondam to introduce genuine valve radios, watches, and essential home goods with reliable repair service.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.15rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-gold-light)',
                    color: 'var(--accent-gold-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    flexShrink: 0,
                    fontFamily: 'var(--font-display)'
                  }}>
                    1980s
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem' }}>Expansion into Steel Beros, Mixies &amp; Televisions</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Expanded into furniture manufacturing (steel cots, almirahs) and authorized partnerships with leading national appliance brands.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.15rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    flexShrink: 0,
                    fontFamily: 'var(--font-display)'
                  }}>
                    Present
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem' }}>Modern Comprehensive Home Showroom</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Everything under one roof: Smart LED TVs, BLDC Fans, Inverters, Teakwood furniture, and digital appliances with warranty backing across Jayankondam, Gangaikonda Cholapuram, Andimadam, and Ariyalur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Area & Call to Action */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 1.75rem',
            color: '#ffffff',
            marginTop: '2.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.35rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '0.85rem'
            }}>
              <MapPin size={16} /> Service Area: Jayankondam &amp; Surrounding Districts
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.85rem' }}>
              Experience the Aruna Advantage in Person
            </h3>
            <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
              Visit our showroom to see why generations of families continue to choose Aruna Radios &amp; Furniture for all their wedding, festival, and home upgrade purchases.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-gold btn-lg">
                <ShoppingBag size={18} />
                <span>Browse Products</span>
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                <PhoneCall size={18} />
                <span>Get Store Directions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BrandMarquee />
    </>
  );
};
