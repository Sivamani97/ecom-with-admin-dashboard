import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getAdminSession, interpretSupabaseError } from '../../lib/adminAuth';
import { ImageCropModal } from '../../components/admin/ImageCropModal';
import { 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  Edit2, 
  Trash2, 
  Star, 
  Layers, 
  Check, 
  X, 
  Upload, 
  Package, 
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const ProductsManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories'

  // Products State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productError, setProductError] = useState(null);

  // Simplified 7-field Product Form State
  const [productFormData, setProductFormData] = useState({
    name: '',
    brand: '',
    category_id: '',
    image_url: '',
    featured: false,
    is_visible: true
  });

  // Image Crop Modal
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Category Management Modal / State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catFormData, setCatFormData] = useState({
    name: '',
    slug: '',
    display_order: 1,
    is_active: true
  });
  const [catFormLoading, setCatFormLoading] = useState(false);
  const [catError, setCatError] = useState(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('products').select('*, categories(id, name, slug)').order('created_at', { ascending: false })
      ]);

      if (catRes.error) throw catRes.error;
      if (prodRes.error) throw prodRes.error;

      if (catRes.data) setCategories(catRes.data);
      if (prodRes.data) setProducts(prodRes.data);
    } catch (err) {
      console.error('Error loading products/categories:', err);
      showToast(err.message || 'Failed to fetch catalog from Supabase', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle URL ?action=new to automatically open Add modal
  useEffect(() => {
    if (searchParams.get('action') === 'new' && categories.length > 0) {
      openAddProductModal();
      setSearchParams({});
    }
  }, [searchParams, categories]);

  // Open Add Product Modal
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductError(null);
    setProductFormData({
      name: '',
      brand: '',
      category_id: categories[0]?.id || '',
      image_url: '',
      featured: false,
      is_visible: true
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductError(null);
    setProductFormData({
      name: prod.name || '',
      brand: prod.brand || '',
      category_id: prod.category_id,
      image_url: prod.image_url || '',
      featured: !!prod.featured,
      is_visible: prod.is_visible !== false
    });
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      setProductError('Please enter the product model name.');
      return;
    }
    if (!productFormData.category_id) {
      setProductError('Please select a valid category.');
      return;
    }

    setProductFormLoading(true);
    setProductError(null);

    try {
      // 1. Verify active Supabase session and admin privileges
      const authCheck = await getAdminSession();
      if (!authCheck.isAdmin) {
        setProductError(authCheck.error || 'Admin authorization required. Please log in again.');
        setProductFormLoading(false);
        return;
      }

      const payload = {
        name: productFormData.name.trim(),
        brand: productFormData.brand.trim() || null,
        category_id: productFormData.category_id,
        image_url: productFormData.image_url || null,
        featured: productFormData.featured,
        is_visible: productFormData.is_visible,
        updated_at: new Date().toISOString()
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);

        if (error) throw error;
        showToast(`Updated "${payload.name}" successfully!`);
      } else {
        const { error } = await supabase
          .from('products')
          .insert(payload);

        if (error) throw error;
        showToast(`Added "${payload.name}" to catalog!`);
      }

      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Save product error:', err);
      setProductError(interpretSupabaseError(err));
    } finally {
      setProductFormLoading(false);
    }
  };

  // Toggle Product Visibility
  const handleToggleVisibility = async (product) => {
    const nextVal = !product.is_visible;
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_visible: nextVal, updated_at: new Date().toISOString() })
        .eq('id', product.id);

      if (error) throw error;
      setProducts(products.map(p => p.id === product.id ? { ...p, is_visible: nextVal } : p));
      showToast(`${product.name} is now ${nextVal ? 'Visible' : 'Hidden'}`);
    } catch (err) {
      showToast(`Error updating visibility: ${err.message}`, true);
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (product) => {
    const nextVal = !product.featured;
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: nextVal, updated_at: new Date().toISOString() })
        .eq('id', product.id);

      if (error) throw error;
      setProducts(products.map(p => p.id === product.id ? { ...p, featured: nextVal } : p));
      showToast(`${product.name} ${nextVal ? 'marked as Featured' : 'unmarked from Featured'}`);
    } catch (err) {
      showToast(`Error updating featured status: ${err.message}`, true);
    }
  };

  // Quick Change Category
  const handleQuickChangeCategory = async (productId, newCategoryId) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ category_id: newCategoryId, updated_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) throw error;
      fetchData();
      showToast('Category updated');
    } catch (err) {
      showToast(`Error changing category: ${err.message}`, true);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${product.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== product.id));
      showToast(`Deleted "${product.name}"`);
    } catch (err) {
      showToast(`Error deleting product: ${err.message}`, true);
    }
  };

  // Category Management Handlers
  const openAddCatModal = () => {
    setEditingCategory(null);
    setCatError(null);
    setCatFormData({
      name: '',
      slug: '',
      display_order: categories.length + 1,
      is_active: true
    });
    setIsCatModalOpen(true);
  };

  const openEditCatModal = (cat) => {
    setEditingCategory(cat);
    setCatError(null);
    setCatFormData({
      name: cat.name,
      slug: cat.slug,
      display_order: cat.display_order || 1,
      is_active: cat.is_active !== false
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catFormData.name.trim()) {
      setCatError('Category name is required.');
      return;
    }
    const slug = catFormData.slug.trim() || catFormData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    setCatFormLoading(true);
    setCatError(null);
    try {
      const authCheck = await getAdminSession();
      if (!authCheck.isAdmin) {
        setCatError(authCheck.error || 'Admin authorization required.');
        setCatFormLoading(false);
        return;
      }

      const payload = {
        name: catFormData.name.trim(),
        slug,
        display_order: parseInt(catFormData.display_order, 10) || 1,
        is_active: catFormData.is_active,
        updated_at: new Date().toISOString()
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
        showToast(`Category "${payload.name}" updated!`);
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(payload);
        if (error) throw error;
        showToast(`Category "${payload.name}" created!`);
      }

      setIsCatModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Save category error:', err);
      setCatError(interpretSupabaseError(err));
    } finally {
      setCatFormLoading(false);
    }
  };

  const handleToggleCatActive = async (cat) => {
    const nextVal = !cat.is_active;
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: nextVal, updated_at: new Date().toISOString() })
        .eq('id', cat.id);

      if (error) throw error;
      setCategories(categories.map(c => c.id === cat.id ? { ...c, is_active: nextVal } : c));
      showToast(`Category "${cat.name}" is now ${nextVal ? 'Active' : 'Inactive'}`);
    } catch (err) {
      showToast(`Error toggling category: ${err.message}`, true);
    }
  };

  const handleDeleteCategory = async (cat) => {
    const attachedCount = products.filter(p => p.category_id === cat.id).length;
    if (attachedCount > 0) {
      alert(`Cannot delete category "${cat.name}" because ${attachedCount} product(s) are attached to it. Reassign or delete those products first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete category "${cat.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', cat.id);

      if (error) throw error;
      setCategories(categories.filter(c => c.id !== cat.id));
      showToast(`Category "${cat.name}" deleted`);
    } catch (err) {
      showToast(`Error deleting category: ${err.message}`, true);
    }
  };

  // Dynamic Product Counts calculated from Supabase products
  const getCategoryVisibleCount = (categoryId) => {
    return products.filter(p => p.category_id === categoryId && p.is_visible !== false).length;
  };

  const getCategoryTotalCount = (categoryId) => {
    return products.filter(p => p.category_id === categoryId).length;
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryFilter === 'all' || p.category_id === selectedCategoryFilter;
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
          <h1>Products & Categories</h1>
          <p>Manage showroom models, photo framing, visibility, and category order</p>
        </div>

        <div className="admin-page-actions">
          {/* Tab switch */}
          <div style={{ display: 'flex', backgroundColor: 'var(--admin-surface-subtle)', padding: '0.25rem', borderRadius: 'var(--admin-radius-md)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'products' ? 'var(--admin-surface)' : 'transparent',
                color: activeTab === 'products' ? 'var(--admin-text-main)' : 'var(--admin-text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'products' ? 'var(--admin-shadow-sm)' : 'none'
              }}
            >
              Products ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'categories' ? 'var(--admin-surface)' : 'transparent',
                color: activeTab === 'categories' ? 'var(--admin-text-main)' : 'var(--admin-text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'categories' ? 'var(--admin-shadow-sm)' : 'none'
              }}
            >
              Categories ({categories.length})
            </button>
          </div>

          {activeTab === 'products' ? (
            <button 
              onClick={openAddProductModal}
              className="admin-btn admin-btn-primary"
            >
              <Plus size={16} />
              <span>+ Add Product</span>
            </button>
          ) : (
            <button 
              onClick={openAddCatModal}
              className="admin-btn admin-btn-primary"
            >
              <Plus size={16} />
              <span> Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= PRODUCTS VIEW ================= */}
      {activeTab === 'products' && (
        <>
          {/* Toolbar with Search & Category Filter */}
          <div className="admin-toolbar">
            <div className="admin-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products by model or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input admin-search-input"
              />
            </div>

            <div className="admin-filter-scroll">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={`admin-chip ${selectedCategoryFilter === 'all' ? 'active' : ''}`}
              >
                <span>All Products</span>
                <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({products.length})</span>
              </button>

              {categories.map((cat) => {
                const count = getCategoryVisibleCount(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`admin-chip ${selectedCategoryFilter === cat.id ? 'active' : ''}`}
                  >
                    <span>{cat.name}</span>
                    <span style={{ opacity: 0.8, fontSize: '0.75rem', fontWeight: 800 }}>
                      — {count} Models
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="admin-skeleton" style={{ width: '100%', height: '200px' }} />
                  <div style={{ padding: '1rem' }}>
                    <div className="admin-skeleton" style={{ height: '20px', width: '70%', marginBottom: '0.5rem' }} />
                    <div className="admin-skeleton" style={{ height: '14px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <Package size={32} />
              </div>
              <h3 className="admin-empty-title">No products found</h3>
              <p className="admin-empty-desc">
                {searchQuery || selectedCategoryFilter !== 'all'
                  ? 'Try adjusting your search query or category filter.'
                  : 'Start by adding your first showroom model with a clean photo.'}
              </p>
              <button onClick={openAddProductModal} className="admin-btn admin-btn-primary">
                <Plus size={16} />
                <span>+ Add Product</span>
              </button>
            </div>
          ) : (
            <div className="admin-grid-cards">
              {filteredProducts.map((prod) => {
                const catName = categories.find(c => c.id === prod.category_id)?.name || 'General';
                return (
                  <div key={prod.id} className="admin-item-card">
                    {/* Card Image */}
                    <div className="admin-card-img-wrap">
                      {prod.image_url ? (
                        <img 
                          src={prod.image_url} 
                          alt={prod.name} 
                          className="admin-card-img"
                          loading="lazy"
                        />
                      ) : (
                        <div style={{ color: 'var(--admin-text-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                          <Package size={36} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>No Image</span>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="admin-card-badges">
                        {prod.featured && (
                          <span className="admin-pill admin-pill-featured">
                            ★ Featured
                          </span>
                        )}
                        {!prod.is_visible && (
                          <span className="admin-pill admin-pill-hidden">
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="admin-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="admin-card-cat">{catName}</span>
                        {prod.brand && (
                          <span className="admin-card-brand">{prod.brand}</span>
                        )}
                      </div>

                      <h3 className="admin-card-title">{prod.name}</h3>

                      {/* Category Switcher dropdown */}
                      <div style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                        <select
                          value={prod.category_id}
                          onChange={(e) => handleQuickChangeCategory(prod.id, e.target.value)}
                          className="admin-select"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', minHeight: '34px' }}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="admin-card-actions">
                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(prod)}
                          className={`admin-btn admin-btn-sm ${prod.is_visible ? 'admin-btn-secondary' : 'admin-btn-danger'}`}
                          title={prod.is_visible ? 'Hide from public' : 'Show publicly'}
                          style={{ flex: 1 }}
                        >
                          {prod.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                          <span>{prod.is_visible ? 'Visible' : 'Hidden'}</span>
                        </button>

                        {/* Featured Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(prod)}
                          className={`admin-btn admin-btn-sm ${prod.featured ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                          title={prod.featured ? 'Unfeature' : 'Mark as Featured'}
                        >
                          <Star size={14} fill={prod.featured ? '#fff' : 'none'} />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditProductModal(prod)}
                          className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon"
                          title="Edit product"
                        >
                          <Edit2 size={15} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod)}
                          className="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ================= CATEGORIES VIEW ================= */}
      {activeTab === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="admin-card" style={{ marginBottom: '0.5rem', background: '#f8fafc' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--admin-text-muted)' }}>
              Categories dictate the navigation and showcase structure on the public website. Product counts update dynamically based on live visible products.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {categories.map((cat) => {
              const visibleCount = getCategoryVisibleCount(cat.id);
              const totalCount = getCategoryTotalCount(cat.id);
              return (
                <div key={cat.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
                          Order #{cat.display_order}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0', color: 'var(--admin-text-main)' }}>
                          {cat.name}
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                          Slug: <code>{cat.slug}</code>
                        </span>
                      </div>

                      <span className={`admin-pill ${cat.is_active ? 'admin-pill-featured' : 'admin-pill-hidden'}`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--admin-surface-subtle)', borderRadius: '8px', margin: '0.75rem 0' }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--admin-primary-accent)' }}>
                        {cat.name} — {visibleCount} Models
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
                        ({totalCount} total in database, {visibleCount} visible to customers)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--admin-border)' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleCatActive(cat)}
                      className={`admin-btn admin-btn-sm ${cat.is_active ? 'admin-btn-secondary' : 'admin-btn-success'}`}
                      style={{ flex: 1 }}
                    >
                      {cat.is_active ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditCatModal(cat)}
                      className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon"
                      title="Edit Category"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SIMPLIFIED 6-FIELD ADD/EDIT PRODUCT MODAL ================= */}
      {isProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon"
                onClick={() => setIsProductModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="admin-modal-body">
                {productError && (
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} />
                    <span>{productError}</span>
                  </div>
                )}

                {/* 1. Product Image Field (Opens Crop Editor) */}
                <div className="admin-form-group">
                  <label className="admin-label">Product Image</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div 
                      onClick={() => setIsCropModalOpen(true)}
                      style={{
                        width: '100px',
                        height: '75px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '8px',
                        border: '1.5px dashed var(--admin-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      {productFormData.image_url ? (
                        <img 
                          src={productFormData.image_url} 
                          alt="Product preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <Upload size={22} color="var(--admin-text-muted)" />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <button
                        type="button"
                        onClick={() => setIsCropModalOpen(true)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                      >
                        <Upload size={14} />
                        <span>{productFormData.image_url ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>
                      <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', margin: '0.35rem 0 0 0' }}>
                        Opens crop editor & uploads to Supabase Storage
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Product Brand */}
                <div className="admin-form-group">
                  <label className="admin-label">Product Brand</label>
                  <input
                    type="text"
                    placeholder="e.g., Sony, LG, Samsung, Whirlpool, Godrej, Duroflex"
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                    className="admin-input"
                  />
                </div>

                {/* 3. Product Name */}
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sony Bravia 55' 4K Google TV"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="admin-input"
                  />
                </div>

                {/* 4. Category */}
                <div className="admin-form-group">
                  <label className="admin-label">Category *</label>
                  <select
                    required
                    value={productFormData.category_id}
                    onChange={(e) => setProductFormData({ ...productFormData, category_id: e.target.value })}
                    className="admin-select"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Featured Toggle */}
                <div style={{ marginBottom: '1rem' }}>
                  <label className="admin-toggle-wrap">
                    <div className="admin-toggle-info">
                      <span className="admin-toggle-title">Featured Product</span>
                      <span className="admin-toggle-desc">Highlight on public home page & top of catalog</span>
                    </div>
                    <div className="admin-switch">
                      <input
                        type="checkbox"
                        checked={productFormData.featured}
                        onChange={(e) => setProductFormData({ ...productFormData, featured: e.target.checked })}
                      />
                      <span className="admin-slider" />
                    </div>
                  </label>
                </div>

                {/* 6. Show Publicly Toggle */}
                <div style={{ marginBottom: '1rem' }}>
                  <label className="admin-toggle-wrap">
                    <div className="admin-toggle-info">
                      <span className="admin-toggle-title">Show Publicly</span>
                      <span className="admin-toggle-desc">Make visible to showroom visitors immediately</span>
                    </div>
                    <div className="admin-switch">
                      <input
                        type="checkbox"
                        checked={productFormData.is_visible}
                        onChange={(e) => setProductFormData({ ...productFormData, is_visible: e.target.checked })}
                      />
                      <span className="admin-slider" />
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit / Cancel Footer */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsProductModalOpen(false)}
                  disabled={productFormLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={productFormLoading}
                >
                  {productFormLoading ? (
                    <>
                      <RefreshCw size={16} className="spin-anim" />
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CATEGORY ADD/EDIT MODAL ================= */}
      {isCatModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsCatModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon"
                onClick={() => setIsCatModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="admin-modal-body">
                {catError && (
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem' }}>
                    {catError}
                  </div>
                )}

                <div className="admin-form-group">
                  <label className="admin-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Washing Machine"
                    value={catFormData.name}
                    onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={catFormData.display_order}
                    onChange={(e) => setCatFormData({ ...catFormData, display_order: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-toggle-wrap">
                    <div className="admin-toggle-info">
                      <span className="admin-toggle-title">Category Active</span>
                      <span className="admin-toggle-desc">Show on public navigation</span>
                    </div>
                    <div className="admin-switch">
                      <input
                        type="checkbox"
                        checked={catFormData.is_active}
                        onChange={(e) => setCatFormData({ ...catFormData, is_active: e.target.checked })}
                      />
                      <span className="admin-slider" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsCatModalOpen(false)}
                  disabled={catFormLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={catFormLoading}
                >
                  {catFormLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= IMAGE CROP & UPLOAD MODAL ================= */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        initialImageUrl={productFormData.image_url}
        onImageProcessed={(publicUrl) => {
          setProductFormData((prev) => ({ ...prev, image_url: publicUrl }));
          showToast('Image cropped & uploaded to Supabase Storage!');
        }}
      />
    </div>
  );
};
