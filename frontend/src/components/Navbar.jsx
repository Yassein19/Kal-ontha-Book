import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BookOpen, User, LogOut, Menu, X, Shield, Sparkles } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(api.auth.getUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check current auth
    const currentUser = api.auth.getUser();
    setUser(currentUser);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'الكتاب' },
    { path: '/author', label: 'عن الكاتبة' },
    { path: '/contact', label: 'تواصل واستشارات' },
    { path: '/reader', label: 'القارئ الرقمي', highlight: true },
  ];

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="logo-crest">
            <span>ك</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">كـــأنــثـــى</span>
            <span className="logo-subtitle">بدور لطفي • مستشارة جودة حياة</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''} ${
                link.highlight ? 'nav-link-highlight' : ''
              }`}
            >
              {link.label}
              {link.highlight && <Sparkles size={14} className="nav-sparkle" />}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {user ? (
            <div className="user-profile-badge">
              <div className="user-info-text">
                <span className="user-name">{user.name || 'قارئة معتمدة'}</span>
                <span className="user-status-tag">
                  <Shield size={12} /> جهاز موثق
                </span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="تسجيل الخروج">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-gold btn-sm">
              <User size={16} />
              <span>دخول القارئ</span>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="قائمة التصفح"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="mobile-nav-link text-danger">
              تسجيل الخروج ({user.email})
            </button>
          ) : (
            <Link
              to="/login"
              className="mobile-nav-link btn-gold-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              تسجيل دخول القارئ
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
