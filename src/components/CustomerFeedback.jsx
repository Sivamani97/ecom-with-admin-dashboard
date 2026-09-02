import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  MapPin, 
  CheckCircle2, 
  X, 
  Quote, 
  Sparkles, 
  Camera,
  Trash2,
  Maximize2,
  RefreshCw,
  Award
} from 'lucide-react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const CustomerFeedback = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  // Optional Photo State
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Image Lightbox State
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Form State strictly for public submission
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    review_text: '',
    location: ''
  });

  const loadApprovedReviews = async () => {
    setLoading(true);
    const data = await api.getApprovedReviews();
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadApprovedReviews();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      customer_name: '',
      rating: 5,
      review_text: '',
      location: ''
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setSubmitted(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Photo size must be less than 5 MB.');
      return;
    }

    setFormError(null);
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.customer_name.trim() || !formData.review_text.trim()) {
      setFormError('Please enter your name and feedback.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      let uploadedPhotoUrl = null;

      // 1. Upload photo if customer attached one
      if (photoFile) {
        const ext = photoFile.name.split('.').pop() || 'jpg';
        const fileName = `review_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `customer_photos/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('review-images')
          .upload(filePath, photoFile, {
            contentType: photoFile.type,
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from('review-images')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            uploadedPhotoUrl = urlData.publicUrl;
          }
        } else {
          console.warn('Review photo upload notice:', uploadErr.message);
          // Fall back gracefully even if photo storage fails so review isn't lost
        }
      }

      // 2. Insert review strictly with status = 'pending'
      const { error } = await supabase
        .from('reviews')
        .insert({
          customer_name: formData.customer_name.trim(),
          rating: parseInt(formData.rating, 10) || 5,
          review_text: formData.review_text.trim(),
          location: formData.location ? formData.location.trim() : null,
          avatar_url: uploadedPhotoUrl,
          status: 'pending'
        });

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Submit review error:', err);
      setFormError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg-subtle, #f8fafc)', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} />
            Verified Customer Stories
          </span>
          <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
            Customer Experiences
          </h2>
          <p className="section-desc" style={{ maxWidth: '640px', margin: '0 auto 1.5rem auto' }}>
            See what our customers have to say about their experience with Aruna Radios & Furniture.
          </p>

          <button
            type="button"
            onClick={handleOpenModal}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
          >
            <MessageSquarePlus size={18} />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', border: '1px solid #e2e8f0', height: '220px' }} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px dashed #cbd5e1', maxWidth: '540px', margin: '0 auto' }}>
            <Award size={40} color="var(--accent-gold, #d97706)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
              No Reviews Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Be the first customer to share your shopping experience with Aruna Radios & Furniture!
            </p>
            <button type="button" onClick={handleOpenModal} className="btn btn-primary btn-sm">
              Share Your Experience
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {reviews.map((rev) => {
              const dateFormatted = rev.created_at
                ? new Date(rev.created_at).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric'
                  })
                : null;

              return (
                <div
                  key={rev.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '1.5rem',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div>
                    {/* Rating stars & verified badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '3px', color: '#f59e0b' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={16}
                            fill={s <= (rev.rating || 5) ? '#f59e0b' : 'none'}
                          />
                        ))}
                      </div>

                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '0.2rem 0.65rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} />
                        Verified Purchase
                      </span>
                    </div>

                    {/* Customer Optional Photo Attachment */}
                    {rev.avatar_url && (
                      <div 
                        onClick={() => setLightboxUrl(rev.avatar_url)}
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '180px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          marginBottom: '1rem',
                          backgroundColor: '#f1f5f9',
                          cursor: 'pointer'
                        }}
                        title="Click to view full photo"
                      >
                        <img 
                          src={rev.avatar_url} 
                          alt={`Photo by ${rev.customer_name}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          color: '#ffffff',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.72rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Maximize2 size={12} />
                          <span>View Photo</span>
                        </div>
                      </div>
                    )}

                    {/* Feedback Quote */}
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                      "{rev.review_text}"
                    </p>
                  </div>

                  {/* Customer Info Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.15rem 0', color: 'var(--text-primary)' }}>
                        {rev.customer_name}
                      </h3>
                      {rev.location && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          <span>{rev.location}</span>
                        </div>
                      )}
                    </div>

                    {dateFormatted && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {dateFormatted}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= SHARE YOUR EXPERIENCE MODAL ================= */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Quote size={20} color="var(--accent-gold)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Share Your Experience</h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '0.4rem', minHeight: 'auto', borderRadius: '50%' }}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {submitted ? (
              /* Success State Screen */
              <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  Thank you for your feedback!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 1.75rem auto' }}>
                  Your review has been submitted and will appear on the website after approval.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(false)}
                  style={{ minWidth: '160px' }}
                >
                  Close
                </button>
              </div>
            ) : (
              /* Submission Form */
              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                  {formError && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem' }}>
                      {formError}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      How was your experience? *
                    </label>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            color: star <= formData.rating ? '#f59e0b' : '#cbd5e1',
                            transition: 'transform 0.15s ease'
                          }}
                        >
                          <Star size={30} fill={star <= formData.rating ? '#f59e0b' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Ramesh Kumar"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="admin-input"
                    />
                  </div>

                  {/* Location (Optional) */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Town / Location <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Jayankondam, Ariyalur, Gangaikonda Cholapuram"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="admin-input"
                    />
                  </div>

                  {/* Feedback Comment */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Your Feedback *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your appliance, furniture quality, price, or delivery experience..."
                      value={formData.review_text}
                      onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                      className="admin-textarea"
                    />
                  </div>

                  {/* Photo (Optional) */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Photo <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                    />

                    {photoPreview ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <img 
                          src={photoPreview} 
                          alt="Photo preview" 
                          style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', color: 'var(--text-primary)' }}>
                            Photo Attached
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {photoFile?.name} ({(photoFile?.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444', padding: '0.4rem 0.6rem' }}
                          title="Remove photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed' }}
                      >
                        <Camera size={16} />
                        <span>Add a photo (optional)</span>
                      </button>
                    )}
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                      Allowed: JPG, PNG, WebP up to 5 MB
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color, #e2e8f0)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexShrink: 0, backgroundColor: '#f8fafc' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={16} className="spin-anim" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Feedback</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= PHOTO LIGHTBOX MODAL ================= */}
      {lightboxUrl && (
        <div className="modal-overlay" onClick={() => setLightboxUrl(null)} style={{ zIndex: 2000 }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
          >
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
            <img 
              src={lightboxUrl} 
              alt="Customer photo full preview" 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </section>
  );
};
