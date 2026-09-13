import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Sun,
  Moon,
  BookOpen,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export function ReaderControls({
  currentPage,
  totalPages,
  onPageChange,
  theme,
  onThemeChange,
  zoom,
  onZoomChange,
  isFullscreen,
  onToggleFullscreen,
  visible = true,
}) {
  // Local state for instant, lag-free slider feedback while dragging
  const [sliderVal, setSliderVal] = useState(currentPage);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageInputVal, setPageInputVal] = useState(currentPage.toString());
  const debounceRef = useRef(null);

  useEffect(() => {
    setSliderVal(currentPage);
    setPageInputVal(currentPage.toString());
  }, [currentPage]);

  const handleSliderChange = (newVal) => {
    setSliderVal(newVal);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce actual page load by 100ms so dragging across 336 pages is silky smooth
    debounceRef.current = setTimeout(() => {
      onPageChange(newVal);
    }, 100);
  };

  const handleSliderRelease = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onPageChange(sliderVal);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(pageInputVal, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p);
    } else {
      setPageInputVal(currentPage.toString());
    }
    setIsEditingPage(false);
  };

  return (
    <div className={`reader-controls-bar ${visible ? 'is-visible' : 'is-hidden'}`}>
      {/* Container for responsive layout */}
      <div className="reader-controls-inner">
        {/* Top/Main Row: Navigation & Quick Scrub */}
        <div className="controls-row-primary">
          {/* Previous Page Button (RTL: ChevronRight points to previous/right) */}
          <button
            className="control-btn control-btn-nav"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            title="الصفحة السابقة"
            id="btn-prev-page"
          >
            <ChevronRight size={20} />
            <span className="btn-label-desktop">السابقة</span>
          </button>

          {/* Interactive Page Counter (Tap to type page number!) */}
          <div
            className="page-counter-badge"
            title="انقري للانتقال إلى صفحة محددة"
            onClick={() => setIsEditingPage(true)}
          >
            {isEditingPage ? (
              <form onSubmit={handlePageInputSubmit} className="page-input-form" onClick={(e) => e.stopPropagation()}>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInputVal}
                  onChange={(e) => setPageInputVal(e.target.value)}
                  onBlur={handlePageInputSubmit}
                  autoFocus
                  className="page-direct-input"
                />
                <span className="page-max-label">/ {totalPages}</span>
              </form>
            ) : (
              <>
                <span>صفحة</span>
                <strong className="current-page-num">{sliderVal}</strong>
                <span className="page-separator">من</span>
                <span className="total-pages-num">{totalPages}</span>
              </>
            )}
          </div>

          {/* Next Page Button (RTL: ChevronLeft points to next/left) */}
          <button
            className="control-btn control-btn-nav"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="الصفحة التالية"
            id="btn-next-page"
          >
            <span className="btn-label-desktop">التالية</span>
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Scrub Slider (Centered on desktop, row 2 on mobile) */}
        <div className="controls-group slider-group">
          <input
            type="range"
            min="1"
            max={totalPages}
            value={sliderVal}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            className="page-slider"
            id="reader-page-slider"
            aria-label="شريط تقليب صفحات الكتاب"
          />
        </div>

        {/* Tools Row: Themes, Zoom, Fullscreen & Security Stamp */}
        <div className="controls-row-tools">
          {/* Theme Picker */}
          <div className="theme-toggle-group">
            <button
              className={`theme-btn ${theme === 'warm' ? 'active' : ''}`}
              onClick={() => onThemeChange('warm')}
              title="نهاري نقي"
              aria-label="السمة النهارية"
            >
              <Sun size={16} />
            </button>
            <button
              className={`theme-btn ${theme === 'sepia' ? 'active' : ''}`}
              onClick={() => onThemeChange('sepia')}
              title="ورقي دافئ (Sepia)"
              aria-label="السمة الورقية دافئة"
            >
              <BookOpen size={16} />
            </button>
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
              title="ليلي مريح"
              aria-label="السمة الليلية"
            >
              <Moon size={16} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button
              className="tool-icon-btn"
              onClick={() => onZoomChange(Math.max(0.7, Number((zoom - 0.1).toFixed(1))))}
              title="تصغير"
              aria-label="تصغير الصفحة"
            >
              <ZoomOut size={16} />
            </button>
            <button
              className="zoom-level-btn"
              onClick={() => onZoomChange(1.0)}
              title="إعادة للوضع الافتراضي (100%)"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              className="tool-icon-btn"
              onClick={() => onZoomChange(Math.min(1.5, Number((zoom + 0.1).toFixed(1))))}
              title="تكبير"
              aria-label="تكبير الصفحة"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            className="tool-icon-btn fullscreen-btn"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'إنهاء وضع ملء الشاشة' : 'ملء الشاشة'}
            aria-label="وضع ملء الشاشة"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          {/* Security Indicator */}
          <div className="security-tag" title="نظام الحماية الرقمية والواترمارك نشط">
            <ShieldCheck size={14} color="#4ADE80" />
            <span className="security-tag-text">محمي</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReaderControls;
