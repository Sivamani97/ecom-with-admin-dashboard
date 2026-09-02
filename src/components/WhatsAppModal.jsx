import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Package, FileText, CheckCircle2 } from 'lucide-react';
import { useBusinessSettings } from '../context/BusinessSettingsContext';

export const WhatsAppModal = ({ isOpen, onClose, initialProduct = '', defaultOpen = false }) => {
  const { settings } = useBusinessSettings();
  const [modalOpen, setModalOpen] = useState(defaultOpen);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [product, setProduct] = useState(initialProduct);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const prevInitialProduct = useRef(initialProduct);

  // Sync external isOpen prop with internal state if provided
  useEffect(() => {
    if (isOpen !== undefined) {
      setModalOpen(isOpen);
      // Reset form when opened externally
      if (isOpen) setSubmitted(false);
    }
  }, [isOpen]);

  // Only open modal and update product when initialProduct *changes* (not on first render if empty)
  useEffect(() => {
    if (initialProduct && initialProduct !== prevInitialProduct.current) {
      setProduct(initialProduct);
      setModalOpen(true);
      setSubmitted(false);
    }
    prevInitialProduct.current = initialProduct;
  }, [initialProduct]);

  // Close modal on Escape key
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Scroll lock when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [modalOpen]);

  const handleClose = () => {
    setModalOpen(false);
    setSubmitted(false);
    if (onClose) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setPhoneError('Please enter your phone number.');
      return;
    }
    setPhoneError('');

    const businessNumber = settings.whatsapp_number || '919597589230';
    
    // Construct structured WhatsApp message
    const message = 
`*New Enquiry - Aruna Radios & Furniture*
---------------------------------------
📱 *Customer Phone:* ${phoneNumber.trim()}
🏷️ *Product / Requirement:* ${product.trim() || 'General Store Enquiry'}
📝 *Details / Message:* ${description.trim() || 'Please share best price, availability and festival discounts.'}
---------------------------------------
_Sent via arunaradiosandfurniture.com_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodedMessage}`;

    setSubmitted(true);

    // Launch WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      handleClose();
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button on Every Page */}
      <div className="floating-whatsapp-wrap">
        <button
          onClick={() => setModalOpen(true)}
          className="floating-whatsapp-btn"
          aria-label="Open Instant WhatsApp Enquiry"
          title="Instant WhatsApp Enquiry"
        >
          <div className="whatsapp-pulse-ring" />
          <MessageCircle size={30} fill="#ffffff" color="#25d366" />
          <div className="whatsapp-tooltip">
            Chat on WhatsApp
          </div>
        </button>
      </div>

      {/* In-Site WhatsApp Enquiry Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="modal-header whatsapp-theme">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#25d366'
                }}>
                  <MessageCircle size={24} fill="#25d366" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: 1.2 }}>WhatsApp Enquiry</h3>
                  <p style={{ fontSize: '0.78rem', opacity: 0.9 }}>Aruna Radios &amp; Furniture • Quick Response</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className="modal-body">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={48} color="#25d366" style={{ margin: '0 auto 1rem auto' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Opening WhatsApp...</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Redirecting you to our official WhatsApp chat with your pre-filled enquiry.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="wa-phone">
                      <Phone size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
                      Your Phone Number <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      id="wa-phone"
                      type="tel"
                      className="form-control"
                      placeholder="e.g. 98424 12345"
                      value={phoneNumber}
                      onChange={(e) => { setPhoneNumber(e.target.value); if (phoneError) setPhoneError(''); }}
                      required
                      autoFocus
                      aria-describedby={phoneError ? 'wa-phone-error' : undefined}
                    />
                    {phoneError && (
                      <p id="wa-phone-error" role="alert" style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, marginTop: '0.35rem' }}>
                        ⚠️ {phoneError}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="wa-product">
                      <Package size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
                      Product Name / Category
                    </label>
                    <input
                      id="wa-product"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Godrej Steel Bero, Mixie, Teakwood Cot, AC"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="wa-desc">
                      <FileText size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
                      Description / Specific Requirement
                    </label>
                    <textarea
                      id="wa-desc"
                      className="form-control"
                      placeholder="Any specific size, model, delivery date or offer details you'd like to ask..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-whatsapp"
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    <Send size={18} />
                    <span>Send Enquiry on WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
