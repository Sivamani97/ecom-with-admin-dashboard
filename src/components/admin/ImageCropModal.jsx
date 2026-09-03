import React, { useState, useRef, useEffect } from 'react';
import { 
  Crop, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Check, 
  Upload, 
  RefreshCw, 
  Move,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getAdminSession, interpretSupabaseError } from '../../lib/adminAuth';

export const ImageCropModal = ({ isOpen, onClose, onImageProcessed, initialImageUrl }) => {
  const [imageSrc, setImageSrc] = useState(initialImageUrl || null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (initialImageUrl) {
      setImageSrc(initialImageUrl);
    }
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setError(null);
  }, [isOpen, initialImageUrl]);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setImageSrc(loadEvent.target?.result);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Canvas Export & Supabase Storage Upload
  const handleCropAndSave = async () => {
    if (!imageSrc) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image for processing'));
      });

      // Target aspect ratio 4:3 (800x600 for high quality)
      const targetWidth = 800;
      const targetHeight = 600;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context unavailable');

      // Fill with clean neutral background in case of transparent borders
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Translate to canvas center
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);

      // Apply rotation & scale
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Calculate scale ratio between container and canvas
      const containerRect = containerRef.current?.getBoundingClientRect();
      const scaleFactor = containerRect ? targetWidth / containerRect.width : 1;

      // Draw image with offsets
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      // Fit image proportionally into base frame before transforms
      const baseScale = Math.max(targetWidth / imgW, targetHeight / imgH);
      const drawW = imgW * baseScale;
      const drawH = imgH * baseScale;

      ctx.drawImage(
        img,
        -drawW / 2 + (offset.x * scaleFactor) / zoom,
        -drawH / 2 + (offset.y * scaleFactor) / zoom,
        drawW,
        drawH
      );

      ctx.restore();

      // Convert to Blob (optimized JPEG 85% quality)
      const blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85);
      });

      if (!blob) throw new Error('Image compression failed');

      let finalImageUrl = null;

      try {
        const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const filePath = `products/${fileName}`;

        // Verify admin session before storage upload
        const authCheck = await getAdminSession();
        if (authCheck.isAdmin) {
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, blob, {
              contentType: 'image/jpeg',
              cacheControl: '3600',
              upsert: true
            });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath);

            if (urlData?.publicUrl) {
              finalImageUrl = urlData.publicUrl;
            }
          }
        }
      } catch (storageErr) {
        console.warn('Storage upload error, using Data URL fallback:', storageErr);
      }

      // Data URL fallback if storage is unconfigured or returns error
      if (!finalImageUrl) {
        finalImageUrl = canvas.toDataURL('image/jpeg', 0.85);
      }

      onImageProcessed(finalImageUrl);
      onClose();
    } catch (err) {
      console.error('Image crop & upload error:', err);
      const friendly = interpretSupabaseError(err);
      setError(friendly || err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div 
        className="admin-modal-card" 
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crop size={20} color="var(--admin-primary-accent)" />
            <h3 className="admin-modal-title">Product Image Editor</h3>
          </div>
          <button 
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body" style={{ padding: '1rem' }}>
          {error && (
            <div style={{ marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Android WebView Compatible File Input */}
          <input 
            type="file" 
            id="product-image-crop-file-input"
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif" 
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          />

          {!imageSrc ? (
            /* Empty upload dropzone with direct label trigger */
            <label 
              htmlFor="product-image-crop-file-input"
              style={{
                border: '2px dashed var(--admin-border)',
                borderRadius: '16px',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--admin-surface-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--admin-primary-accent-light)', color: 'var(--admin-primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={28} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Choose Product Photo</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                  Tap to upload high-res image from camera or library
                </p>
              </div>
              <span className="admin-btn admin-btn-primary admin-btn-sm">
                Select Photo
              </span>
            </label>
          ) : (
            <div>
              {/* Interactive Framing Viewport (Aspect ratio 4:3) */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                  touchAction: 'none'
                }}
              >
                {/* Image subject with transforms */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  draggable={false}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                    pointerEvents: 'none'
                  }}
                />

                {/* Aspect Ratio Framing Guide Grid */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: '2px solid rgba(245, 158, 11, 0.8)',
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {/* Rule of thirds lines */}
                  <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                </div>

                {/* Helper overlay badge */}
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Move size={12} />
                  <span>Drag to reposition</span>
                </div>
              </div>

              {/* Editing Controls */}
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Zoom slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ZoomOut size={16} color="var(--admin-text-muted)" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--admin-primary-accent)', cursor: 'pointer' }}
                  />
                  <ZoomIn size={16} color="var(--admin-text-muted)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '35px', textAlign: 'right' }}>
                    {zoom.toFixed(1)}x
                  </span>
                </div>

                {/* Quick actions row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={handleRotate}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw size={14} />
                      <span>Rotate {rotation}°</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      title="Reset framing"
                    >
                      <RefreshCw size={14} />
                      <span>Reset</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                  >
                    <Upload size={14} />
                    <span>Replace Image</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary" 
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
          {imageSrc && (
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleCropAndSave}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <RefreshCw size={16} className="spin-anim" />
                  <span>Processing & Uploading...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Confirm & Use Image</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
