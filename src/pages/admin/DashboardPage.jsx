import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Package, 
  Layers, 
  Tag,
  MessageSquareWarning, 
  Gift, 
  Eye, 
  Clock, 
  ArrowRight, 
  Plus,
  Settings,
  Store, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    visibleProducts: 0,
    categoriesCount: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    activeOffersCount: 0,
    activeOfferTitle: null,
    popupEnabled: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes, revRes, offRes] = await Promise.all([
        supabase.from('products').select('id, is_visible'),
        supabase.from('categories').select('id, is_active').eq('is_active', true),
        supabase.from('reviews').select('id, status'),
        supabase.from('offers').select('id, title, is_active, popup_enabled')
      ]);

      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;
      if (revRes.error) throw revRes.error;
      if (offRes.error && offRes.error.code !== 'PGRST116') throw offRes.error;

      const products = prodRes.data || [];
      const reviews = revRes.data || [];
      const offers = offRes.data || [];
      const activeOffers = offers.filter(o => o.is_active);

      setStats({
        totalProducts: products.length,
        visibleProducts: products.filter(p => p.is_visible !== false).length,
        categoriesCount: (catRes.data || []).length,
        pendingReviews: reviews.filter(r => r.status === 'pending').length,
        approvedReviews: reviews.filter(r => r.status === 'approved').length,
        activeOffersCount: activeOffers.length,
        activeOfferTitle: activeOffers[0]?.title || null,
        popupEnabled: activeOffers.some(o => o.popup_enabled)
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || 'Failed to load live store metrics from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="admin-card" style={{ marginBottom: '1.75rem', background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)', border: '1px solid #fde68a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-primary-accent)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Sparkles size={14} />
              <span>Aruna Radios & Furniture Control Center</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--admin-text-main)', margin: '0.25rem 0 0.2rem 0' }}>
              Store Overview
            </h1>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Live real-time status of your product catalog, offers, customer feedback, and business settings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={fetchDashboardStats} 
              className="admin-btn admin-btn-secondary admin-btn-sm"
              disabled={loading}
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => navigate('/admin/products?action=new')} 
              className="admin-btn admin-btn-primary admin-btn-sm"
            >
              <Plus size={15} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="admin-card" style={{ marginBottom: '1.5rem', backgroundColor: '#fee2e2', borderColor: '#fca5a5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#991b1b' }}>
            <AlertCircle size={20} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Database Error</strong>
              <span style={{ fontSize: '0.82rem' }}>{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Stat Cards */}
      <div className="admin-stats-grid">
        {/* Total Products */}
        <Link to="/admin/products" className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Total Products</span>
            <div className="admin-stat-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Package size={22} />
            </div>
          </div>
          {loading ? (
            <div className="admin-skeleton" style={{ height: '36px', width: '60px', marginBottom: '0.4rem' }} />
          ) : (
            <div className="admin-stat-val">{stats.totalProducts}</div>
          )}
          <div className="admin-stat-sub">
            {loading ? 'Fetching...' : `${stats.visibleProducts} visible to customers`}
          </div>
        </Link>

        {/* Visible Products */}
        <Link to="/admin/products" className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Visible Products</span>
            <div className="admin-stat-icon-wrap" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <Eye size={22} />
            </div>
          </div>
          {loading ? (
            <div className="admin-skeleton" style={{ height: '36px', width: '60px', marginBottom: '0.4rem' }} />
          ) : (
            <div className="admin-stat-val">{stats.visibleProducts}</div>
          )}
          <div className="admin-stat-sub">
            {loading ? 'Fetching...' : `${stats.totalProducts - stats.visibleProducts} hidden in catalog`}
          </div>
        </Link>

        {/* Pending Reviews (Alert card if > 0) */}
        <Link 
          to="/admin/reviews" 
          className={`admin-stat-card ${stats.pendingReviews > 0 ? 'alert-card' : ''}`}
        >
          <div className="admin-stat-top">
            <span className="admin-stat-label">Pending Reviews</span>
            <div className="admin-stat-icon-wrap" style={{ backgroundColor: stats.pendingReviews > 0 ? '#fef3c7' : '#f8fafc', color: stats.pendingReviews > 0 ? '#d97706' : '#64748b' }}>
              <MessageSquareWarning size={22} />
            </div>
          </div>
          {loading ? (
            <div className="admin-skeleton" style={{ height: '36px', width: '60px', marginBottom: '0.4rem' }} />
          ) : (
            <div className="admin-stat-val" style={{ color: stats.pendingReviews > 0 ? '#d97706' : 'inherit' }}>
              {stats.pendingReviews}
            </div>
          )}
          <div className="admin-stat-sub">
            {loading ? 'Fetching...' : stats.pendingReviews > 0 ? '⚠️ Action needed: Moderation pending' : `${stats.approvedReviews} published reviews`}
          </div>
        </Link>

        {/* Active Offers */}
        <Link to="/admin/offers" className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Active Offers</span>
            <div className="admin-stat-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <Gift size={22} />
            </div>
          </div>
          {loading ? (
            <div className="admin-skeleton" style={{ height: '36px', width: '60px', marginBottom: '0.4rem' }} />
          ) : (
            <div className="admin-stat-val">{stats.activeOffersCount}</div>
          )}
          <div className="admin-stat-sub">
            {loading ? 'Fetching...' : stats.popupEnabled ? 'Promo popup active' : 'No active popup'}
          </div>
        </Link>

        {/* Active Categories */}
        <Link to="/admin/products" className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Categories</span>
            <div className="admin-stat-icon-wrap" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
              <Layers size={22} />
            </div>
          </div>
          {loading ? (
            <div className="admin-skeleton" style={{ height: '36px', width: '60px', marginBottom: '0.4rem' }} />
          ) : (
            <div className="admin-stat-val">{stats.categoriesCount}</div>
          )}
          <div className="admin-stat-sub">
            {loading ? 'Fetching...' : 'TV, AC, Fridge, Furniture & more'}
          </div>
        </Link>
      </div>

      {/* Quick Action Cards */}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '1rem' }}>
        Quick Management Actions
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Add Product Action */}
        <div 
          onClick={() => navigate('/admin/products?action=new')}
          className="admin-card admin-card-clickable"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plus size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0' }}>+ Add Product</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: 0 }}>Upload image and publish a new model to showroom</p>
          </div>
          <ArrowRight size={18} color="var(--admin-primary-accent)" />
        </div>

        {/* Manage Products Action */}
        <Link 
          to="/admin/products"
          className="admin-card admin-card-clickable"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Package size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--admin-text-main)' }}>Manage Products</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: 0 }}>Toggle visibility, edit details, or reorder categories</p>
          </div>
          <ArrowRight size={18} color="var(--admin-text-muted)" />
        </Link>

        {/* Manage Offers Action */}
        <Link 
          to="/admin/offers"
          className="admin-card admin-card-clickable"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Gift size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--admin-text-main)' }}>Manage Offers &amp; Banners</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: '0 0 0.25rem 0' }}>Update festival deals, combo offers, and popup promo</p>
            <span style={{ fontSize: '0.72rem', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700, display: 'inline-block' }}>
              📐 Banner Spec: 1200×500px Desktop | 600×400px Mobile
            </span>
          </div>
          <ArrowRight size={18} color="var(--admin-text-muted)" />
        </Link>

        {/* Review Feedback Action */}
        <Link 
          to="/admin/reviews"
          className="admin-card admin-card-clickable"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MessageSquareWarning size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--admin-text-main)' }}>Review Feedback</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: 0 }}>
              {stats.pendingReviews > 0 ? `${stats.pendingReviews} pending approval` : 'Moderate customer testimonials'}
            </p>
          </div>
          <ArrowRight size={18} color="var(--admin-text-muted)" />
        </Link>

        {/* Business Settings Action */}
        <Link 
          to="/admin/settings"
          className="admin-card admin-card-clickable"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Settings size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--admin-text-main)' }}>Business Settings</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: 0 }}>Update store address, phone, WhatsApp & working hours</p>
          </div>
          <ArrowRight size={18} color="var(--admin-text-muted)" />
        </Link>
      </div>
    </div>
  );
};
