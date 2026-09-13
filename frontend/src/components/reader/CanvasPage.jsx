import React, { useEffect, useRef, useState, useCallback } from 'react';
import { api, getDeviceFingerprint } from '../../services/api';
import { burnWatermark } from './Watermark';
import { ShieldAlert, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const BOOK_ASPECT_RATIO = 1130 / 800; // Original high-res aspect ratio (1.4125)

export function CanvasPage({
  bookId = 1,
  pageNumber = 1,
  user,
  theme = 'warm',
  zoom = 1,
  onNextPage,
  onPrevPage,
  onToggleControls,
  onZoomToggle,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // In-session image cache for instant, zero-latency page flipping
  const imageCache = useRef(new Map());

  // Dynamic canvas sizing tailored for Mobile, Tablet & Desktop screens
  const [viewportDims, setViewportDims] = useState(() => calculateOptimalDimensions(zoom));

  function calculateOptimalDimensions(currentZoom) {
    if (typeof window === 'undefined') {
      return { width: 800, height: 1130, isMobile: false, isTablet: false };
    }

    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const isMobile = windowW <= 640;
    const isTablet = windowW > 640 && windowW <= 1024;

    // Available space accounting for top/bottom bars and side padding
    const horizontalPadding = isMobile ? 16 : isTablet ? 32 : 64;
    const verticalDeduction = isMobile ? 130 : 160; // Top header + bottom toolbar

    const maxW = windowW - horizontalPadding;
    const maxH = Math.max(380, windowH - verticalDeduction);

    // Baseline width: cap to 800px on desktop, 720px on tablet, 100% on mobile
    let targetW = isMobile ? maxW : isTablet ? Math.min(maxW, 720) : Math.min(maxW, 800);

    // Ensure it fits vertically within the viewport in 1.0x standard reading view
    if (targetW * BOOK_ASPECT_RATIO > maxH && currentZoom <= 1.0) {
      targetW = maxH / BOOK_ASPECT_RATIO;
    }

    // Apply zoom multiplier
    const finalW = Math.round(targetW * currentZoom);
    const finalH = Math.round(finalW * BOOK_ASPECT_RATIO);

    return {
      width: Math.max(280, finalW),
      height: Math.max(395, finalH),
      isMobile,
      isTablet,
    };
  }

  // Handle window resizing & device orientation changes (Portrait <-> Landscape)
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setViewportDims(calculateOptimalDimensions(zoom));
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [zoom]);

  // Render book page onto Canvas with High-DPI sharpness
  const renderToCanvas = useCallback(
    (img) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: false });

      const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Cap to 2.5 for memory safety
      const { width, height } = viewportDims;

      // Internal bitmap buffer dimensions (Retina crisp)
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      // Display CSS dimensions
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // 1. Theme backdrop
      if (theme === 'sepia') {
        ctx.fillStyle = '#F4ECD8';
        ctx.fillRect(0, 0, width, height);
      } else if (theme === 'dark') {
        ctx.fillStyle = '#181920';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw book page image
      ctx.drawImage(img, 0, 0, width, height);

      // 3. Subtle contrast layer for dark theme reading comfort
      if (theme === 'dark' && pageNumber > 1) {
        ctx.fillStyle = 'rgba(20, 20, 28, 0.15)';
        ctx.fillRect(0, 0, width, height);
      }

      // 4. Burn Dynamic Security Watermark (Scales with dynamic canvas)
      burnWatermark(ctx, width, height, {
        email: user?.email || 'reader@kal-ontha.com',
        deviceToken: user?.deviceToken || getDeviceFingerprint(),
        timestamp: new Date().toLocaleTimeString('ar-EG'),
      });

      setLoading(false);
      setError(null);
    },
    [pageNumber, theme, viewportDims, user]
  );

  // Load Page Image
  useEffect(() => {
    let isCancelled = false;

    if (imageCache.current.has(pageNumber)) {
      renderToCanvas(imageCache.current.get(pageNumber));
      return;
    }

    async function loadPage() {
      setLoading(true);
      setError(null);

      try {
        const ticket = await api.reader.getPageTicket(bookId, pageNumber);
        if (isCancelled) return;

        const streamUrl = api.reader.getStreamUrl(ticket.streamUrl);
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          if (isCancelled) return;
          imageCache.current.set(pageNumber, img);
          renderToCanvas(img);
        };

        img.onerror = () => {
          if (isCancelled) return;
          setError('تعذر تحميل صفحة الكتاب. اضغطي إعادة المحاولة.');
          setLoading(false);
        };

        img.src = streamUrl;
      } catch (err) {
        if (isCancelled) return;
        console.error('Error loading canvas page:', err);
        setError(err.message || 'فشل تحميل الصفحة.');
        setLoading(false);
      }
    }

    loadPage();

    return () => {
      isCancelled = true;
    };
  }, [bookId, pageNumber, reloadKey, renderToCanvas]);

  // Touch & Gesture Navigation (Mobile & Tablet)
  const touchState = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
  });

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchState.current.startX = touch.clientX;
      touchState.current.startY = touch.clientY;
      touchState.current.startTime = Date.now();
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchState.current.startX;
      const deltaY = touch.clientY - touchState.current.startY;
      const elapsed = Date.now() - touchState.current.startTime;

      // 1. Detect Swipe (Fast horizontal swipe)
      const isSwipe = Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && elapsed < 450;
      if (isSwipe) {
        if (deltaX < 0) {
          // Swipe Left -> Next Page (Arabic RTL)
          onNextPage?.();
        } else {
          // Swipe Right -> Previous Page (Arabic RTL)
          onPrevPage?.();
        }
        return;
      }

      // 2. Detect Tap (Quick touch with minimal movement)
      if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15 && elapsed < 300) {
        const now = Date.now();
        // Check for double-tap zoom
        if (now - touchState.current.lastTapTime < 320) {
          onZoomToggle?.();
          touchState.current.lastTapTime = 0;
          return;
        }
        touchState.current.lastTapTime = now;

        // Single Tap Zone Detection
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const clickX = touch.clientX - rect.left;
          const width = rect.width;

          // Left 22% -> Next Page (Arabic RTL)
          if (clickX < width * 0.22) {
            onNextPage?.();
            return;
          }
          // Right 22% -> Previous Page (Arabic RTL)
          if (clickX > width * 0.78) {
            onPrevPage?.();
            return;
          }
          // Center 56% -> Toggle toolbar (Zen immersion reading)
          onToggleControls?.();
        }
      }
    }
  };

  // Mouse click handling for PC
  const handleContainerClick = (e) => {
    // Only trigger if click is on desktop/PC (no touch)
    if (window.matchMedia('(pointer: fine)').matches) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (clickX < width * 0.2) {
          onNextPage?.();
        } else if (clickX > width * 0.8) {
          onPrevPage?.();
        } else {
          onToggleControls?.();
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="canvas-page-wrapper"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleContainerClick}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        minHeight: `${viewportDims.height}px`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: 'pointer',
        touchAction: 'pan-y',
      }}
    >
      {/* Loading Overlay */}
      {loading && !error && (
        <div className="canvas-loader-overlay">
          <RefreshCw className="spin-icon" size={32} color="#D4AF37" />
          <p>جاري عرض الصفحة {pageNumber} بأمان...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="canvas-error-box">
          <ShieldAlert size={44} color="#E57373" />
          <h3>تنبيه أمان القارئ</h3>
          <p>{error}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
              setReloadKey((k) => k + 1);
            }}
            className="btn btn-outline"
            style={{ marginTop: '1rem' }}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Pure HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        id={`reader-canvas-p${pageNumber}`}
        className={`book-canvas theme-${theme}`}
        style={{
          display: error ? 'none' : 'block',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.55), 0 0 1px rgba(212, 175, 55, 0.25)',
          borderRadius: viewportDims.isMobile ? '4px' : '8px',
          backgroundColor: theme === 'sepia' ? '#F4ECD8' : theme === 'dark' ? '#181920' : '#FFF',
          transition: 'transform 0.15s ease, opacity 0.2s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle edge-tap hover zones for PC & Tablet */}
      <div className="reader-edge-zone reader-edge-left" title="الصفحة التالية (انقري هنا)">
        <ChevronLeft size={28} className="edge-chevron" />
      </div>
      <div className="reader-edge-zone reader-edge-right" title="الصفحة السابقة (انقري هنا)">
        <ChevronRight size={28} className="edge-chevron" />
      </div>
    </div>
  );
}

export default CanvasPage;
