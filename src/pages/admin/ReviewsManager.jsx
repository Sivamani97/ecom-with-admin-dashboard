import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getAdminSession, interpretSupabaseError } from '../../lib/adminAuth';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star, 
  Clock, 
  MessageSquareWarning, 
  MapPin, 
  Calendar,
  RefreshCw,
  X,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

export const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // Default is 'pending' as requested
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      showToast(err.message || 'Failed to fetch reviews', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateReviewStatus = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      const authCheck = await getAdminSession();
      if (!authCheck.isAdmin) {
        showToast(authCheck.error || 'Admin authorization required.', true);
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setReviews(reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      showToast(newStatus === 'approved' ? 'Review approved & published!' : 'Review marked as rejected.');
    } catch (err) {
      showToast(interpretSupabaseError(err) || `Error updating review: ${err.message}`, true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteReview = async (id, customerName) => {
    if (!window.confirm(`Are you sure you want to permanently delete the review from "${customerName}"?`)) return;

    setActionLoadingId(id);
    try {
      const authCheck = await getAdminSession();
      if (!authCheck.isAdmin) {
        showToast(authCheck.error || 'Admin authorization required.', true);
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReviews(reviews.filter((r) => r.id !== id));
      showToast('Review permanently deleted.');
    } catch (err) {
      showToast(`Error deleting review: ${err.message}`, true);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered reviews by status tab
  const pendingReviews = reviews.filter((r) => r.status === 'pending');
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const rejectedReviews = reviews.filter((r) => r.status === 'rejected');

  const displayedReviews =
    activeTab === 'pending'
      ? pendingReviews
      : activeTab === 'approved'
      ? approvedReviews
      : rejectedReviews;

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`admin-toast ${toastMessage.isError ? 'admin-toast-error' : 'admin-toast-success'}`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Customer Feedback Moderation</h1>
          <p>Review and approve genuine customer feedback & attached photos before publishing</p>
        </div>

        <div className="admin-page-actions">
          <button 
            type="button" 
            onClick={fetchReviews} 
            className="admin-btn admin-btn-secondary admin-btn-sm"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs Row: Pending (Default), Approved, Rejected */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`admin-chip ${activeTab === 'pending' ? 'active' : ''}`}
          style={{ minHeight: '44px', padding: '0.5rem 1.25rem' }}
        >
          <Clock size={16} color={activeTab === 'pending' ? '#fff' : '#d97706'} />
          <span>Pending</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.15rem 0.55rem',
            borderRadius: '999px',
            backgroundColor: activeTab === 'pending' ? '#d97706' : '#fef3c7',
            color: activeTab === 'pending' ? '#ffffff' : '#b45309'
          }}>
            {pendingReviews.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`admin-chip ${activeTab === 'approved' ? 'active' : ''}`}
          style={{ minHeight: '44px', padding: '0.5rem 1.25rem' }}
        >
          <CheckCircle size={16} color={activeTab === 'approved' ? '#fff' : '#16a34a'} />
          <span>Approved</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.15rem 0.55rem',
            borderRadius: '999px',
            backgroundColor: activeTab === 'approved' ? '#16a34a' : '#dcfce7',
            color: activeTab === 'approved' ? '#ffffff' : '#15803d'
          }}>
            {approvedReviews.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rejected')}
          className={`admin-chip ${activeTab === 'rejected' ? 'active' : ''}`}
          style={{ minHeight: '44px', padding: '0.5rem 1.25rem' }}
        >
          <XCircle size={16} color={activeTab === 'rejected' ? '#fff' : '#dc2626'} />
          <span>Rejected</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.15rem 0.55rem',
            borderRadius: '999px',
            backgroundColor: activeTab === 'rejected' ? '#dc2626' : '#fee2e2',
            color: activeTab === 'rejected' ? '#ffffff' : '#b91c1c'
          }}>
            {rejectedReviews.length}
          </span>
        </button>
      </div>

      {/* Reviews Cards List */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="admin-card">
              <div className="admin-skeleton" style={{ height: '24px', width: '50%', marginBottom: '1rem' }} />
              <div className="admin-skeleton" style={{ height: '60px', width: '100%', marginBottom: '1rem' }} />
              <div className="admin-skeleton" style={{ height: '36px', width: '100%' }} />
            </div>
          ))}
        </div>
      ) : displayedReviews.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            <MessageSquareWarning size={32} />
          </div>
          <h3 className="admin-empty-title">
            {activeTab === 'pending'
              ? 'No pending reviews'
              : activeTab === 'approved'
              ? 'No approved reviews'
              : 'No rejected reviews'}
          </h3>
          <p className="admin-empty-desc">
            {activeTab === 'pending'
              ? 'All incoming customer feedback has been moderated. New submissions will appear here.'
              : 'Customer reviews will be grouped here according to their status.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {displayedReviews.map((rev) => {
            const isProcessing = actionLoadingId === rev.id;
            const dateStr = rev.created_at
              ? new Date(rev.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : 'Recent';

            return (
              <div
                key={rev.id}
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft:
                    rev.status === 'pending'
                      ? '4px solid #f59e0b'
                      : rev.status === 'approved'
                      ? '4px solid #10b981'
                      : '4px solid #ef4444'
                }}
              >
                <div>
                  {/* Top Customer Info & Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--admin-text-main)' }}>
                        {rev.customer_name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                        {rev.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <MapPin size={12} />
                            {rev.location}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={12} />
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating Display */}
                    <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={15}
                          fill={s <= (rev.rating || 5) ? '#f59e0b' : 'none'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Customer Photo Attachment Preview in Admin */}
                  {rev.avatar_url && (
                    <div
                      onClick={() => setPreviewPhotoUrl(rev.avatar_url)}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '140px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginBottom: '0.75rem',
                        backgroundColor: '#f1f5f9',
                        cursor: 'pointer',
                        border: '1px solid var(--admin-border)'
                      }}
                      title="Click to view full photo"
                    >
                      <img 
                        src={rev.avatar_url} 
                        alt="Customer feedback photo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '6px',
                        right: '6px',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        color: '#ffffff',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Maximize2 size={11} />
                        <span>Enlarge Photo</span>
                      </div>
                    </div>
                  )}

                  {/* Feedback Text */}
                  <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.5, margin: '0.5rem 0 1rem 0', fontStyle: 'italic' }}>
                    "{rev.review_text}"
                  </p>
                </div>

                {/* Actions Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border)' }}>
                  {rev.avatar_url && (
                    <button
                      type="button"
                      onClick={() => setPreviewPhotoUrl(rev.avatar_url)}
                      className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon"
                      title="View Customer Photo"
                    >
                      <ImageIcon size={15} />
                    </button>
                  )}

                  {rev.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => updateReviewStatus(rev.id, 'approved')}
                      className="admin-btn admin-btn-success admin-btn-sm"
                      style={{ flex: 1 }}
                    >
                      <CheckCircle size={15} />
                      <span>Approve</span>
                    </button>
                  )}

                  {rev.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => updateReviewStatus(rev.id, 'rejected')}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      style={{ flex: 1, color: '#dc2626' }}
                    >
                      <XCircle size={15} />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => deleteReview(rev.id, rev.customer_name)}
                    className="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon"
                    title="Delete permanently"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Photo Lightbox Modal */}
      {previewPhotoUrl && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewPhotoUrl(null)} style={{ zIndex: 1100 }}>
          <div 
            className="admin-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '1rem', backgroundColor: '#0f172a' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', color: '#ffffff' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Customer Photo Attachment</span>
              <button 
                type="button"
                onClick={() => setPreviewPhotoUrl(null)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <img 
              src={previewPhotoUrl} 
              alt="Customer photo full" 
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
