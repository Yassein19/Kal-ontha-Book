import React, { useEffect, useRef, useState, useCallback } from 'react';
import { api, getDeviceFingerprint } from '../../services/api';
import { burnWatermark } from './Watermark';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export function CanvasPage({ bookId = 1, pageNumber = 1, user, theme = 'warm', zoom = 1 }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // In-session image cache for instant, zero-latency page flipping
  const imageCache = useRef(new Map());

  const renderToCanvas = useCallback(
    (img) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const dpr = window.devicePixelRatio || 1;
      const targetWidth = 800 * zoom;
      const targetHeight = 1130 * zoom;

      canvas.width = targetWidth * dpr;
      canvas.height = targetHeight * dpr;
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;

      ctx.scale(dpr, dpr);

      // Apply theme backdrop
      if (theme === 'sepia') {
        ctx.fillStyle = '#F4ECD8';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else if (theme === 'dark') {
        ctx.fillStyle = '#181920';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Draw book page bitmap
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Subtle contrast layer for dark theme
      if (theme === 'dark' && pageNumber > 1) {
        ctx.fillStyle = 'rgba(20, 20, 28, 0.15)';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Burn dynamic security watermark
      burnWatermark(ctx, targetWidth, targetHeight, {
        email: user?.email || 'reader@kal-ontha.com',
        deviceToken: user?.deviceToken || getDeviceFingerprint(),
        timestamp: new Date().toLocaleTimeString('ar-EG'),
      });

      setLoading(false);
      setError(null);
    },
    [pageNumber, theme, zoom, user]
  );

  useEffect(() => {
    let isCancelled = false;

    // 1. Check if page is already cached in session for instant render
    if (imageCache.current.has(pageNumber)) {
      renderToCanvas(imageCache.current.get(pageNumber));
      return;
    }

    async function loadPage() {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Request single-page ticket
        const ticket = await api.reader.getPageTicket(bookId, pageNumber);
        if (isCancelled) return;

        // Step 2: Fetch stream URL and draw onto Canvas
        const streamUrl = api.reader.getStreamUrl(ticket.streamUrl);
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          if (isCancelled) return;
          // Store in session cache for instant scrubbing
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

  return (
    <div
      className="canvas-page-wrapper"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '600px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Loading Overlay */}
      {loading && !error && (
        <div className="canvas-loader-overlay">
          <RefreshCw className="spin-icon" size={36} color="#D4AF37" />
          <p>جاري عرض الصفحة {pageNumber} بأمان...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="canvas-error-box">
          <ShieldAlert size={48} color="#E57373" />
          <h3>تنبيه أمان القارئ</h3>
          <p>{error}</p>
          <button
            onClick={() => {
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          borderRadius: '8px',
          backgroundColor: theme === 'sepia' ? '#F4ECD8' : theme === 'dark' ? '#181920' : '#FFF',
          transition: 'transform 0.15s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default CanvasPage;
