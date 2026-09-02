import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Send, 
  MessageCircle, 
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';
import { SEO } from '../components/SEO';
import { BackButton } from '../components/BackButton';
import { useBusinessSettings } from '../context/BusinessSettingsContext';

export const ContactPage = () => {
  const { settings } = useBusinessSettings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    product: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Please enter your phone number.');
      return;
    }
    setFormError('');

    const businessNumber = settings.whatsapp_number || '919597589230';
    const textMsg = 
`*Contact Form Message - Aruna Radios & Furniture*
----------------------------------------
👤 *Name:* ${formData.name.trim()}
📱 *Phone:* ${formData.phone.trim()}
🏷️ *Subject / Product:* ${formData.product.trim() || 'General Enquiry'}
💬 *Message:* ${formData.message.trim() || 'Please contact me regarding current showroom offers.'}
----------------------------------------
_Sent from Website Contact Page_`;

    setSubmitted(true);

    setTimeout(() => {
      window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(textMsg)}`, '_blank', 'noopener,noreferrer');
    }, 500);
  };

  return (
    <>
      <SEO
        title="Contact Us - Store Location & Hours in Jayankondam"
        description="Get in touch with Aruna Radios & Furniture in Jayankondam. Phone numbers, showroom address, working hours, and Google Map directions."
      />

      <BackButton label="Back to Home" to="/" />

      <section className="section-padding" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">We Are Here For You</span>
            <h1 className="section-title">Visit or Contact Our Store</h1>
            <p className="section-desc">
              Have a question about a product, bulk wedding order, or warranty service? Reach out by phone, WhatsApp, or drop by our showroom.
            </p>
          </div>

          <div className="contact-grid">
            {/* Contact Details & Working Hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="contact-info-card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Showroom Contact Information
                </h2>

                <div className="info-row">
                  <div className="info-icon-box">
                    <MapPin size={22} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Address</span>
                    <span className="info-value">
                      {settings.address_line1}<br />
                      {settings.address_line2}<br />
                      {settings.city}, {settings.state} - {settings.pincode}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Landmark: Near Bus Stand, Jayankondam
                    </span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-icon-box">
                    <Phone size={22} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Phone Numbers</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <a href={`tel:${(settings.phone_primary || '').replace(/\s+/g, '')}`} className="info-value" style={{ color: 'var(--primary)' }}>
                        {settings.phone_primary} (Primary Store Line)
                      </a>
                      <a href={`tel:${(settings.phone_secondary || '').replace(/\s+/g, '')}`} className="info-value">
                        {settings.phone_secondary} (Enquiry Hotline)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-icon-box">
                    <Mail size={22} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Email Support</span>
                    <a href={`mailto:${settings.email}`} className="info-value">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-icon-box">
                    <Clock size={22} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Business Hours</span>
                    <span className="info-value">{settings.hours_weekday}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {settings.hours_sunday}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <a
                    href={settings.google_maps_directions_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <Navigation size={18} />
                    <span>Get Directions</span>
                  </a>

                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <InstagramIcon size={18} color="#E1306C" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="map-container" style={{ height: '240px' }}>
                <iframe
                  title="Aruna Radios & Furniture Showroom Google Map"
                  src={settings.google_maps_embed_url}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* In-Site Contact Form */}
            <div className="contact-info-card">
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Send Us a Direct Message
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Fill out the quick form below and our store staff will connect with you with pricing and product information.
              </p>

              {submitted ? (
                <div style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)'
                }}>
                  <CheckCircle2 size={54} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Message Ready on WhatsApp!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                    We've opened your enquiry directly on WhatsApp for instant confirmation.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormError(''); setFormData({ name: '', phone: '', product: '', message: '' }); }}
                    className="btn btn-secondary btn-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {formError && (
                    <div role="alert" style={{
                      padding: '0.7rem 1rem',
                      marginBottom: '1rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fca5a5',
                      borderRadius: 'var(--radius-md)',
                      color: '#dc2626',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      ⚠️ {formError}
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">
                      Full Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formError) setFormError(''); }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-phone">
                      Phone Number <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className="form-control"
                      placeholder="e.g. 94432 54321"
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); if (formError) setFormError(''); }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-product">
                      Interested Product / Category
                    </label>
                    <input
                      id="contact-product"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Teakwood Bed, Mixie, Refrigerator, Sofa Set"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-msg">
                      Your Message or Questions
                    </label>
                    <textarea
                      id="contact-msg"
                      className="form-control"
                      placeholder="Tell us what you are looking for (dimensions, preferred brand, wedding package, etc.)..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                  >
                    <Send size={18} />
                    <span>Submit Enquiry &amp; Chat on WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
