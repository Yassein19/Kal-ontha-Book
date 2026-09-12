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
}) {
  // Local state for instant, lag-free slider feedback while dragging
  const [sliderVal, setSliderVal] = useState(currentPage);
  const debounceRef = useRef(null);

  useEffect(() => {
    setSliderVal(currentPage);
  }, [currentPage]);

  const handleSliderChange = (newVal) => {
    setSliderVal(newVal);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce actual page load by 120ms so dragging across 336 pages is silky smooth
    debounceRef.current = setTimeout(() => {
      onPageChange(newVal);
    }, 120);
  };

  const handleSliderRelease = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onPageChange(sliderVal);
  };

  return (
    <div className="reader-controls-bar">
      {/* Page Navigation (RTL: Previous is right arrow, Next is left arrow) */}
      <div className="controls-group navigation-group">
        <button
          className="control-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="الصفحة السابقة"
          id="btn-prev-page"
        >
          <ChevronRight size={22} />
          <span>السابقة</span>
        </button>

        <div className="page-counter-badge">
          <span>صفحة</span>
          <strong>{sliderVal}</strong>
          <span>من</span>
          <span>{totalPages}</span>
        </div>

        <button
          className="control-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="الصفحة التالية"
          id="btn-next-page"
        >
          <span>التالية</span>
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Page Slider with smooth rapid scrubbing */}
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
        />
      </div>

      {/* Themes, Zoom & Fullscreen */}
      <div className="controls-group tools-group">
        {/* Theme Picker */}
        <div className="theme-toggle-group">
          <button
            className={`theme-btn ${theme === 'warm' ? 'active' : ''}`}
            onClick={() => onThemeChange('warm')}
            title="نهاري نقي"
          >
            <Sun size={17} />
          </button>
          <button
            className={`theme-btn ${theme === 'sepia' ? 'active' : ''}`}
            onClick={() => onThemeChange('sepia')}
            title="ورقي دافئ (Sepia)"
          >
            <BookOpen size={17} />
          </button>
          <button
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => onThemeChange('dark')}
            title="ليلي مريح"
          >
            <Moon size={17} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="zoom-controls">
          <button
            className="tool-icon-btn"
            onClick={() => onZoomChange(Math.max(0.7, zoom - 0.1))}
            title="تصغير"
          >
            <ZoomOut size={18} />
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button
            className="tool-icon-btn"
            onClick={() => onZoomChange(Math.min(1.4, zoom + 0.1))}
            title="تكبير"
          >
            <ZoomIn size={18} />
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          className="tool-icon-btn fullscreen-btn"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'إنهاء وضع ملء الشاشة' : 'ملء الشاشة'}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        {/* Security Indicator */}
        <div className="security-tag" title="نظام الحماية الرقمية والواترمارك نشط">
          <ShieldCheck size={16} color="#4ADE80" />
          <span>محمي</span>
        </div>
      </div>
    </div>
  );
}

export default ReaderControls;
