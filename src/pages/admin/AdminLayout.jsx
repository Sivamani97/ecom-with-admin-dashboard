import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  MessageSquareWarning, 
  Settings, 
  LogOut, 
  Store, 
  ExternalLink,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../../styles/admin.css';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id', { count: 'exact' })
          .eq('status', 'pending');
        if (!error && data) {
          setPendingReviewsCount(data.length);
        }
      } catch (err) {
        console.error("Error checking pending reviews:", err);
      }
    };

    fetchPendingReviews();
    const interval = setInterval(fetchPendingReviews, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Offers', path: '/admin/offers', icon: <Tag size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquareWarning size={20} />, badge: pendingReviewsCount },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-layout-wrapper">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-brand">
            <div className="admin-brand-icon">
              <Store size={20} />
            </div>
            <div className="admin-brand-text">
              <h2>Aruna Store</h2>
              <span>Admin Hub</span>
            </div>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.badge > 0 && (
                <span className="admin-badge-count">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link 
            to="/" 
            target="_blank" 
            className="admin-nav-link"
            style={{ marginBottom: '0.4rem', color: 'var(--admin-text-muted)' }}
          >
            <ExternalLink size={18} />
            <span>Public Website</span>
          </Link>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="admin-logout-btn"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="admin-main-viewport">
        {/* Sticky Mobile Header */}
        <header className="admin-mobile-header">
          <Link to="/admin" className="admin-brand">
            <div className="admin-brand-icon" style={{ width: '32px', height: '32px' }}>
              <Store size={18} />
            </div>
            <div className="admin-brand-text">
              <h2 style={{ fontSize: '0.92rem' }}>Aruna Store</h2>
              <span style={{ fontSize: '0.68rem' }}>Admin</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link 
              to="/" 
              target="_blank" 
              className="admin-btn admin-btn-secondary admin-btn-sm"
              title="View Public Store"
            >
              <ExternalLink size={15} />
              <span style={{ fontSize: '0.78rem' }}>Store</span>
            </Link>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-main-content">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="admin-mobile-bottom-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `admin-bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.badge > 0 && <span className="admin-bottom-badge" />}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Confirm Sign Out</h3>
              <button 
                className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon"
                onClick={() => setShowLogoutModal(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', margin: 0 }}>
                Are you sure you want to end your admin session? You will need your login credentials to sign back in.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="admin-btn admin-btn-danger"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
