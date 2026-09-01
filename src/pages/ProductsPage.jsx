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
  ChevronDown
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { BackButton } from '../components/BackButton';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/products';

export const ProductsPage = ({ onOpenEnquiry }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

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
    if (cat && ['furniture', 'kitchen-appliances', 'home-appliances'].includes(cat)) {
      setActiveCategory(cat);
    } else if (!cat) {
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

  // Filter products based on active category & search query
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.itemType.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.highlight.toLowerCase().includes(q) ||
        item.popularBrands.some(b => b.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <SEO
        title="Products Catalog - Furniture, Kitchen & Home Appliances"
        description="Browse full range of wooden and steel cots, sofas, beros, mixies, grinders, gas stoves, water heaters, fans and inverter batteries in Jayankondam."
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

          {/* Search Bar & Category Tabs */}
          <div className="catalog-search-bar">
            <div className="search-input-wrap">
              <Search size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search mixie, sofa, cot, bero, fan, cooker, water heater..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="hero-dropdown-wrapper" style={{ marginTop: '1rem', width: '100%', maxWidth: '100%' }}>
              <select
                className="hero-category-select"
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                aria-label="Filter products by category"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.id !== 'all' ? `(${cat.count})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="hero-select-arrow" />
            </div>
          </div>

          {/* Active Filter Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              {activeCategory !== 'all' && ` in ${PRODUCT_CATEGORIES.find(c => c.id === activeCategory)?.name}`}
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
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Image Frame */}
                  <div className="product-img-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                    <span className="product-tag-badge">
                      {product.tag}
                    </span>
                    <span className="product-category-chip">
                      {product.categoryLabel}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="product-details">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-highlight">{product.highlight}</p>

                    {/* Features list */}
                    <div style={{ marginBottom: '0.85rem' }}>
                      {product.features.slice(0, 2).map((feat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                          <Check size={13} color="var(--success)" style={{ flexShrink: 0 }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Popular Brands Tags */}
                    <div className="product-brands-row">
                      {product.popularBrands.map((brand, i) => (
                        <span key={i} className="product-brand-tag">{brand}</span>
                      ))}
                    </div>

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
              ))}
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
                  {selectedProductDetail.categoryLabel}
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
                  src={selectedProductDetail.image}
                  alt={selectedProductDetail.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-dark)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                  <ShieldCheck size={18} />
                  <span>{selectedProductDetail.warranty}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {selectedProductDetail.highlight}
                </p>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem' }}>Key Features &amp; Specifications:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {selectedProductDetail.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    <Check size={16} color="var(--success)" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

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
