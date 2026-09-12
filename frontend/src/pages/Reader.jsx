import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import CanvasPage from '../components/reader/CanvasPage';
import ReaderControls from '../components/reader/ReaderControls';
import {
  Shield,
  Lock,
  BookOpen,
  AlertTriangle,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function Reader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(api.auth.getUser());
  const [bookMeta, setBookMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem('kal_ontha_current_page');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [totalPages, setTotalPages] = useState(10);
  const [theme, setTheme] = useState('warm'); // 'warm' | 'sepia' | 'dark'
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [securityAlert, setSecurityAlert] = useState(null);

  const readerContainerRef = useRef(null);

  // 1. Check Authentication on Mount
  useEffect(() => {
    const currentUser = api.auth.getUser();
    if (!currentUser) {
      setUser(null);
      return;
    }
    setUser(currentUser);

    // Fetch book metadata
    async function loadMeta() {
      try {
        const res = await api.reader.getBookMeta(1);
        if (res.book) {
          setBookMeta(res.book);
          if (res.book.totalPages) {
            setTotalPages(res.book.totalPages);
          }
        }
      } catch (err) {
        console.warn('Could not load book meta:', err);
      }
    }

    loadMeta();
  }, []);

  // Save current page in session
  useEffect(() => {
    sessionStorage.setItem('kal_ontha_current_page', currentPage.toString());
  }, [currentPage]);

  // 2. Anti-Piracy Keyboard Interceptors & Escape Hatch Blocking
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Intercept Print (Ctrl+P, Cmd+P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('عذرًا، أمر الطباعة محظور حمايةً لحقوق الملكية الفكرية لكتاب كأنثى.');
        return false;
      }

      // Intercept Save Page (Ctrl+S, Cmd+S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('تنزيل وحفظ صفحات الكتاب غير متاح لحماية حقوق الكاتبة.');
        return false;
      }

      // Intercept View Source (Ctrl+U)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Intercept DevTools (F12, Ctrl+Shift+I)
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityNotice('أدوات الفحص معطلة في وضع القراءة الآمن.');
        return false;
      }

      // Page Navigation Shortcuts
      if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
        // Next page in RTL
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        // Previous page in RTL
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    // Block right-click context menu entirely
    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerSecurityNotice('النقر بالزر الأيمن وحفظ الصور معطل في بيئة القارئ المحمي.');
    };

    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [totalPages]);

  const triggerSecurityNotice = (msg) => {
    setSecurityAlert(msg);
    setTimeout(() => setSecurityAlert(null), 4000);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // If user is not authenticated -> Lock Gate
  if (!user) {
    return (
      <div className="page-reader-locked">
        <div className="site-container">
          <div className="locked-card">
            <div className="lock-icon-circle">
              <Lock size={42} color="#D4AF37" />
            </div>
            <h1 className="locked-title">محتوى خاص ومحمي</h1>
            <p className="locked-subtitle">
              كتاب <strong>«كأنثى»</strong> للمستشارة <strong>بدور لطفي</strong> متاح حصريًا
              للقارئات المشتركات والمصرح لهن بنظام القراءة المقترنة بالجهاز.
            </p>

            <div className="locked-features-list">
              <div className="locked-feature">
                <Shield size={18} color="#D4AF37" />
                <span>قراءة رقمية خاصة بدون إمكانية النسخ أو التسريب</span>
              </div>
              <div className="locked-feature">
                <Sparkles size={18} color="#D4AF37" />
                <span>عرض عالي الدقة بنظام كانفاس المطور</span>
              </div>
            </div>

            <div className="locked-cta-group">
              <Link to="/login" state={{ from: { pathname: '/reader' } }} className="btn btn-gold btn-lg">
                <Lock size={18} />
                <span>تسجيل الدخول بالبيانات المعتمدة</span>
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                <span>طلب الحصول على ترخيص قراءة</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={readerContainerRef}
      className={`page-reader reader-theme-${theme} ${isFullscreen ? 'is-fullscreen' : ''} reader-protected-area`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Security Toast Alert */}
      {securityAlert && (
        <div className="security-toast-alert animate-fade-in">
          <AlertTriangle size={20} color="#FBBF24" />
          <span>{securityAlert}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="reader-top-bar">
        <div className="reader-meta-title">
          <BookOpen size={18} color="#D4AF37" />
          <span className="book-name">كأنثى</span>
          <span className="author-name">— بدور لطفي</span>
        </div>

        <div className="reader-watermark-indicator">
          <Shield size={14} color="#10B981" />
          <span>القارئة: {user.email} (نسخة موثقة)</span>
        </div>

        <Link to="/" className="btn-exit-reader" title="العودة للرئيسية">
          <ArrowRight size={18} />
          <span>مغادرة القارئ</span>
        </Link>
      </div>

      {/* Main Canvas Display Area */}
      <div className="reader-canvas-viewport">
        <CanvasPage
          bookId={1}
          pageNumber={currentPage}
          user={user}
          theme={theme}
          zoom={zoom}
        />
      </div>

      {/* Bottom Sticky Controls */}
      <ReaderControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))}
        theme={theme}
        onThemeChange={setTheme}
        zoom={zoom}
        onZoomChange={setZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
}

export default Reader;
