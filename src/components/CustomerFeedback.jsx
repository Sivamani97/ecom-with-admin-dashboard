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
  Award,
  ImageOff
} from 'lucide-react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

/* ─────────────────────────────────────────────────────────────
   Helper: Star row
───────────────────────────────────────────────────────────── */
const StarRow = ({ rating = 5, size = 14 }) => (
  <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} fill={s <= rating ? '#f59e0b' : 'none'} />
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Helper: Single Review Card (fixed dimensions for marquee)
───────────────────────────────────────────────────────────── */
const ReviewCard = ({ rev, onPhotoClick }) => {
  const [imgError, setImgError] = useState(false);

  const dateFormatted = rev.created_at
    ? new Date(rev.created_at).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  const hasPhoto = rev.avatar_url && !imgError;

  return (
    <div className="cf-review-card">
      {/* Top: stars + verified badge */}
      <div className="cf-card-top">
        <StarRow rating={rev.rating || 5} />
        <span className="cf-verified-badge">
          <CheckCircle2 size={11} />
          Verified
        </span>
      </div>

      {/* Review text */}
      <p className="cf-review-text">"{rev.review_text}"</p>

      {/* Optional customer photo */}
      {rev.avatar_url && (
        <div className="cf-photo-slot">
          {hasPhoto ? (
            <div
              className="cf-photo-wrap"
              onClick={() => onPhotoClick(rev.avatar_url)}
              title="Click to view full photo"
            >
              <img
                src={rev.avatar_url}
                alt={`Photo by ${rev.customer_name}`}
                className="cf-photo-img"
                loading="lazy"
                onError={() => setImgError(true)}
              />
              <div className="cf-photo-expand-hint">
                <Maximize2 size={11} />
                <span>View</span>
              </div>
            </div>
          ) : (
            /* Broken image fallback — doesn't affect layout */
            <div className="cf-photo-fallback">
              <ImageOff size={18} />
              <span>Photo unavailable</span>
            </div>
          )}
        </div>
      )}

      {/* Footer: name + location + date */}
      <div className="cf-card-footer">
        <div>
          <h3 className="cf-reviewer-name">{rev.customer_name}</h3>
          {rev.location && (
            <div className="cf-reviewer-loc">
              <MapPin size={11} />
              <span>{rev.location}</span>
            </div>
          )}
        </div>
        {dateFormatted && (
          <span className="cf-review-date">{dateFormatted}</span>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main exported component
───────────────────────────────────────────────────────────── */
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
  const [lightboxError, setLightboxError] = useState(false);

  // Form State strictly for public submission
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    review_text: '',
    location: '',
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

  /* ── Modal helpers ── */
  const handleOpenModal = () => {
    setFormData({ customer_name: '', rating: 5, review_text: '', location: '' });
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
    reader.onload = (event) => setPhotoPreview(event.target?.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Submit review ── */
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
            upsert: true,
          });

        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from('review-images')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            uploadedPhotoUrl = urlData.publicUrl;
          }
        } else {
          // NOTE: If photos are not loading publicly, ensure the Supabase
          // "review-images" Storage bucket is set to PUBLIC in the Supabase dashboard.
          console.warn('Review photo upload notice:', uploadErr.message);
        }
      }

      // 2. Insert review strictly with status = 'pending'
      const { error } = await supabase.from('reviews').insert({
        customer_name: formData.customer_name.trim(),
        rating: parseInt(formData.rating, 10) || 5,
        review_text: formData.review_text.trim(),
        location: formData.location ? formData.location.trim() : null,
        avatar_url: uploadedPhotoUrl,
        status: 'pending',
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

  /* ── Marquee: duplicate items for seamless loop ── */
  // Only duplicate when there are reviews; use a minimum of 2 copies
  // so the loop works even with just 1–2 reviews.
  const marqueeItems =
    reviews.length > 0
      ? reviews.length < 4
        ? [...reviews, ...reviews, ...reviews] // triple for short lists
        : [...reviews, ...reviews]             // double is enough for larger sets
      : [];

  /* ── Lightbox handler ── */
  const openLightbox = (url) => {
    setLightboxUrl(url);
    setLightboxError(false);
  };

  return (
    <section
      className="cf-section section-padding"
      style={{ backgroundColor: 'var(--bg-subtle, var(--bg-primary))', position: 'relative', overflow: 'hidden' }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} />
            Verified Customer Stories
          </span>
          <h2 className="section-title" style={{ marginTop: '0.5rem' }}>
            What Our Customers Say
          </h2>
          <p className="section-desc" style={{ maxWidth: '580px', margin: '0 auto 1.5rem auto' }}>
            Real experiences from families who trust Aruna Radios &amp; Furniture for their home.
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
      </div>

      {/* ── Reviews Marquee / Loading / Empty ── */}
      {loading ? (
        /* Skeleton loader */
        <div className="container">
          <div style={{ display: 'flex', gap: '1.25rem', overflow: 'hidden' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="cf-review-card cf-skeleton" style={{ flexShrink: 0 }} />
            ))}
          </div>
        </div>
      ) : reviews.length === 0 ? (
        /* Empty state */
        <div className="container">
          <div className="cf-empty-state">
            <Award size={38} color="var(--accent-gold, #d97706)" style={{ margin: '0 auto 0.85rem auto', display: 'block' }} />
            <h3 className="cf-empty-title">No Reviews Yet</h3>
            <p className="cf-empty-desc">
              Be the first customer to share your shopping experience with Aruna Radios &amp; Furniture!
            </p>
            <button type="button" onClick={handleOpenModal} className="btn btn-primary btn-sm">
              Share Your Experience
            </button>
          </div>
        </div>
      ) : (
        /* Seamless right-to-left marquee */
        <div className="cf-marquee-container" aria-label="Customer reviews carousel">
          <div className="cf-marquee-track">
            {marqueeItems.map((rev, idx) => (
              <ReviewCard
                key={`${rev.id}-${idx}`}
                rev={rev}
                onPhotoClick={openLightbox}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Submit Review Modal ── */}
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
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Share Your Experience</h3>
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
              /* Success screen */
              <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <CheckCircle2 size={34} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  Thank you for your feedback!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 1.75rem auto' }}>
                  Your review has been submitted and will appear on the website after admin approval.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(false)}
                  style={{ minWidth: '140px' }}
                >
                  Close
                </button>
              </div>
            ) : (
              /* Submission Form */
              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
                  {formError && (
                    <div style={{ marginBottom: '1rem', padding: '0.7rem 0.9rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '0.84rem' }}>
                      {formError}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div style={{ marginBottom: '1.15rem', textAlign: 'center' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem' }}>
                      How was your experience? *
                    </label>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.2rem', color: star <= formData.rating ? '#f59e0b' : '#cbd5e1', transition: 'transform 0.15s ease' }}
                        >
                          <Star size={28} fill={star <= formData.rating ? '#f59e0b' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '0.3rem' }}>
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
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      Town / Location <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Jayankondam, Ariyalur"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="admin-input"
                    />
                  </div>

                  {/* Feedback Comment */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '0.3rem' }}>
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
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '0.3rem' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.7rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <img
                          src={photoPreview}
                          alt="Photo preview"
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', color: 'var(--text-primary)' }}>
                            Photo Attached
                          </span>
                          <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {photoFile?.name} ({(photoFile?.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ef4444', padding: '0.35rem 0.55rem', flexShrink: 0 }}
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
                        <Camera size={15} />
                        <span>Add a photo (optional)</span>
                      </button>
                    )}
                    <span style={{ fontSize: '0.71rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
                      Allowed: JPG, PNG, WebP · Max 5 MB
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ padding: '0.9rem 1.5rem', borderTop: '1px solid var(--border-color, #e2e8f0)', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', flexShrink: 0, backgroundColor: 'var(--bg-tertiary)' }}>
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
                        <RefreshCw size={15} className="spin-anim" />
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

      {/* ── Photo Lightbox Modal ── */}
      {lightboxUrl && (
        <div
          className="modal-overlay"
          onClick={() => setLightboxUrl(null)}
          style={{ zIndex: 2000 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close photo"
            >
              <X size={20} />
            </button>

            {lightboxError ? (
              <div style={{ background: 'rgba(15,23,42,0.9)', borderRadius: '12px', padding: '2.5rem 3rem', color: '#94a3b8', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <ImageOff size={36} />
                <span style={{ fontSize: '0.9rem' }}>Photo could not be loaded.</span>
              </div>
            ) : (
              <img
                src={lightboxUrl}
                alt="Customer photo full preview"
                style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', objectFit: 'contain', display: 'block' }}
                onError={() => setLightboxError(true)}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};
