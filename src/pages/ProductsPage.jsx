import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  SlidersHorizontal,
  X,
  Info,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { BackButton } from '../components/BackButton';
import { api } from '../lib/api';

export const ProductsPage = ({ onOpenEnquiry }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic data from Supabase / Fallback
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(fetchedProducts || []);
      setCategories(fetchedCategories || []);
      setLoading(false);
    };
    loadData();
  }, []);

  // Close modal on Escape key + body scroll lock
  useEffect(() => {
    if (!selectedProductDetail) {
      document.body.classList.remove('modal-open');
      return;
    }
    document.body.classList.add('modal-open');
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProductDetail(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [selectedProductDetail]);

  // Sync category state with URL parameters
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory('all');
    }
  }, [searchParams]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  // Filter products based on active category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const itemCat = item.categories?.slug || item.category_id || item.category;
      const matchesCategory = activeCategory === 'all' || itemCat === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = item.name?.toLowerCase().includes(q);
      const brandMatch = item.brand?.toLowerCase().includes(q) || (Array.isArray(item.popularBrands) && item.popularBrands.some(b => b.toLowerCase().includes(q)));
      const highlightMatch = item.highlight?.toLowerCase().includes(q);
      const featuresMatch = Array.isArray(item.features) && item.features.some(f => f.toLowerCase().includes(q));

      return nameMatch || brandMatch || highlightMatch || featuresMatch;
    });
  }, [activeCategory, searchQuery, products]);

  return (
    <>
      <SEO
  title="Furniture, Kitchen Appliances & Electronics"
  description="Explore furniture, kitchen appliances, home appliances and electronics at Aruna Radios & Furniture in Jayankondam. Shop cots, sofas, beros, mixies, grinders, gas stoves, water heaters, fans and more."
/>

      <BackButton label="Back to Home" to="/" />

      <section className="section-padding" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <span className="section-badge">Verified Product Catalog</span>
            <h1 className="section-title">Explore Our Quality Products</h1>
            <p className="section-desc">
              All items are sourced directly from authorized manufacturers with official brand warranty and local delivery assistance.
            </p>
          </div>

          {/* Controls: Search Bar & Category Dropdown */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            {/* Text Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by name, brand, or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="hero-dropdown-wrapper" style={{ width: '100%', maxWidth: '280px' }}>
              <select
                className="hero-category-select"
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                aria-label="Filter products by category"
              >
                <option value="all">All Product Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="hero-select-arrow" />
            </div>
          </div>

          {/* Active Filter Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Model' : 'Models'}
              {activeCategory !== 'all' && ` in ${categories.find(c => c.slug === activeCategory || c.id === activeCategory)?.name || 'Selected Category'}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>

            {(activeCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSearchParams({}); }}
                className="btn btn-outline btn-sm"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="sparkle-anim" style={{ fontSize: '2rem' }}>✨</div>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading catalog...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const imgSrc = product.image_url || product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80';
                const catName = product.categories?.name || product.categoryLabel || (categories.find(c => c.slug === product.category_id || c.id === product.category_id)?.name);
                const featuresList = Array.isArray(product.features) ? product.features : [];
                const brandsList = Array.isArray(product.popularBrands) ? product.popularBrands : product.brand ? [product.brand] : [];

                return (
                  <div key={product.id} className="product-card">
                    {/* Image Frame */}
                    <div className="product-img-wrap">
                      <img
                        src={imgSrc}
                        alt={product.name}
                        loading="lazy"
                      />
                      {product.tag && (
                        <span className="product-tag-badge">
                          {product.tag}
                        </span>
                      )}
                      {catName && (
                        <span className="product-category-chip">
                          {catName}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="product-details">
                      <h3 className="product-title">{product.name}</h3>
                      {product.highlight && <p className="product-highlight">{product.highlight}</p>}

                      {/* Features list */}
                      {featuresList.length > 0 && (
                        <div style={{ marginBottom: '0.85rem' }}>
                          {featuresList.slice(0, 2).map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                              <Check size={13} color="var(--success)" style={{ flexShrink: 0 }} />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Popular Brands Tags */}
                      {brandsList.length > 0 && (
                        <div className="product-brands-row">
                          {brandsList.map((brand, i) => (
                            <span key={i} className="product-brand-tag">{brand}</span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="product-footer-actions">
                        <button
                          onClick={() => setSelectedProductDetail(product)}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1 }}
                          title="View specifications"
                        >
                          <Info size={14} />
                          <span>Specs</span>
                        </button>

                        <button
                          onClick={() => onOpenEnquiry && onOpenEnquiry(product.name)}
                          className="btn btn-whatsapp btn-sm"
                          style={{ flex: 1.5 }}
                        >
                          <MessageCircle size={15} />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : products.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)'
            }}>
              <Sparkles size={48} color="var(--accent-gold, #d97706)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Products Added Yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                The product catalog is currently empty. Products added from the Admin Dashboard will automatically appear here.
              </p>
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry('Product Catalog Enquiry')}
                className="btn btn-whatsapp"
              >
                <MessageCircle size={18} />
                <span>Enquire Direct on WhatsApp</span>
              </button>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)'
            }}>
              <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No matching products found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                We stock virtually all home appliances and custom furniture items. Enquire directly on WhatsApp to check stock.
              </p>
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry(searchQuery || 'Custom Product Request')}
                className="btn btn-whatsapp"
              >
                <MessageCircle size={18} />
                <span>Ask Store on WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product Quick Details Modal */}
      {selectedProductDetail && (
        <div className="modal-overlay" onClick={() => setSelectedProductDetail(null)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px' }}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedProductDetail.categories?.name || selectedProductDetail.categoryLabel}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  {selectedProductDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <img
                  src={selectedProductDetail.image_url || selectedProductDetail.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'}
                  alt={selectedProductDetail.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-dark)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <ShieldCheck size={18} />
                  <span>{selectedProductDetail.warranty || 'Official Brand Warranty'}</span>
                </div>
                {selectedProductDetail.highlight && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {selectedProductDetail.highlight}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.55rem', marginTop: '0.5rem' }}>
                  <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Store Address:</strong> 103A, bazaar street, Jayankondam. Opposite to PVR lodge</span>
                </div>
              </div>

              {Array.isArray(selectedProductDetail.features) && selectedProductDetail.features.length > 0 && (
                <>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem' }}>Key Features &amp; Specifications:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {selectedProductDetail.features.map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        <Check size={16} color="var(--success)" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    const prodName = selectedProductDetail.name;
                    setSelectedProductDetail(null);
                    if (onOpenEnquiry) onOpenEnquiry(prodName);
                  }}
                  className="btn btn-whatsapp"
                  style={{ flex: 1, padding: '0.85rem' }}
                >
                  <MessageCircle size={18} />
                  <span>Enquire Price on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
