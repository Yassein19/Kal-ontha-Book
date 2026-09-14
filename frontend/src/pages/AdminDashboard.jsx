import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Key,
  Mail,
  User,
  AtSign,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Unlock,
  AlertCircle,
  Search,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(api.auth.getUser());
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Readers state
  const [readers, setReaders] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [lastCreated, setLastCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  // Inline login state
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlinePassword, setInlinePassword] = useState('');
  const [inlineLoginLoading, setInlineLoginLoading] = useState(false);
  const [inlineLoginError, setInlineLoginError] = useState('');

  // Actions feedback
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Verify Admin & Author Access with session revalidation
  useEffect(() => {
    let isMounted = true;

    async function verifyAndLoad() {
      setCheckingAuth(true);
      const localUser = api.auth.getUser();
      if (localUser && (localUser.role === 'admin' || localUser.role === 'author')) {
        setCurrentUser(localUser);
      }

      try {
        const res = await api.auth.me();
        if (isMounted && res.user) {
          setCurrentUser(res.user);
          localStorage.setItem('kal_ontha_user', JSON.stringify(res.user));
          if (res.user.role === 'admin' || res.user.role === 'author') {
            await fetchReaders();
          }
        }
      } catch (err) {
        if (err.status === 401) {
          api.auth.logout();
          if (isMounted) setCurrentUser(null);
        } else if (localUser && (localUser.role === 'admin' || localUser.role === 'author')) {
          await fetchReaders();
        }
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
          setLoadingList(false);
        }
      }
    }

    verifyAndLoad();
    return () => { isMounted = false; };
  }, []);

  const fetchReaders = async () => {
    setLoadingList(true);
    try {
      const res = await api.admin.listReaders();
      setReaders(res.readers || []);
    } catch (err) {
      console.error('Failed to fetch readers:', err);
      setActionMessage({
        type: 'error',
        text: err.message || 'تعذر تحميل قائمة القارئات.',
      });
    } finally {
      setLoadingList(false);
    }
  };

  // Inline login for quick authentication without leaving the page
  const handleInlineLogin = async (e) => {
    e.preventDefault();
    setInlineLoginError('');
    setInlineLoginLoading(true);
    try {
      const res = await api.auth.login(inlineEmail, inlinePassword);
      if (res.user && (res.user.role === 'admin' || res.user.role === 'author')) {
        setCurrentUser(res.user);
        await fetchReaders();
      } else {
        setInlineLoginError('تم تسجيل الدخول، لكن هذا الحساب ليس لديه صلاحيات الإدارة.');
      }
    } catch (err) {
      setInlineLoginError(err.message || 'فشل تسجيل الدخول. يرجى التأكد من البريد وكلمة المرور.');
    } finally {
      setInlineLoginLoading(false);
    }
  };

  // Generate a friendly username from name or email
  const handleEmailChange = (val) => {
    setEmail(val);
    if (!username && val.includes('@')) {
      const base = val.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      if (base.length >= 3) {
        setUsername(base);
      }
    }
  };

  // Generate secure random password
  const generateRandomPassword = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789#$@';
    let generated = '';
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  // Create reader submit
  const handleCreateReader = async (e) => {
    e.preventDefault();
    setFormError('');
    setLastCreated(null);
    setCopied(false);

    // Client-side quick checks
    if (!email.includes('@') || !email.includes('.')) {
      setFormError('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }
    if (password.length < 6) {
      setFormError('كلمة المرور يجب ألا تقل عن 6 أحرف.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username && username.trim().length >= 3)
      ? username.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '')
      : cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const cleanName = (name && name.trim().length >= 2)
      ? name.trim()
      : `قارئ معتمد (${cleanUsername})`;

    setFormSubmitting(true);
    try {
      const res = await api.admin.createReader({
        name: cleanName,
        email: cleanEmail,
        username: cleanUsername,
        password,
      });

      setLastCreated({
        name: res.reader?.name || cleanName,
        email: res.reader?.email || cleanEmail,
        username: res.reader?.username || cleanUsername,
        password,
      });

      // Clear form inputs
      setName('');
      setEmail('');
      setUsername('');
      setPassword('');

      // Refresh list
      await fetchReaders();
      setActionMessage({
        type: 'success',
        text: res.message || 'تم اعتماد حساب القارئ بنجاح! يمكنك الآن نسخ بيانات الدخول وإرسالها له.',
      });
    } catch (err) {
      setFormError(err.message || 'فشل إنشاء الحساب. يرجى مراجعة البيانات.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Copy credentials helper
  const copyCredentials = () => {
    if (!lastCreated) return;
    const text = `مرحباً بك في كتاب «عيشي كأنثى» للكاتبة بدور لطفي ✨\nتم تفعيل حسابك في القارئ الرقمي المحمي:\n\n🔗 رابط الدخول: ${window.location.origin}/login\n📧 البريد الإلكتروني: ${lastCreated.email}\n👤 اسم المستخدم: ${lastCreated.username}\n🔑 كلمة المرور: ${lastCreated.password}\n\n*ملاحظة: سيتم اقتران الحساب بجهاز القراءة الأول الذي تسجل الدخول منه لحماية حقوق الكتاب.*`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Reset device lock
  const handleResetLock = async (readerId, readerName) => {
    if (!window.confirm(`هل أنت متأكد من فك قفل الجهاز للقارئ (${readerName})؟ سيتمكن من تسجيل الدخول من جهاز جديد.`)) {
      return;
    }

    try {
      const res = await api.admin.resetReaderLock(readerId);
      setActionMessage({ type: 'success', text: res.message });
      await fetchReaders();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'تعذر فك القفل.' });
    }
  };

  // Delete reader
  const handleDeleteReader = async (readerId, readerName) => {
    if (!window.confirm(`تحذير: هل أنت متأكد من حذف حساب القارئ (${readerName}) نهائياً؟`)) {
      return;
    }

    try {
      const res = await api.admin.deleteReader(readerId);
      setActionMessage({ type: 'success', text: res.message });
      await fetchReaders();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'تعذر حذف الحساب.' });
    }
  };

  const isAdminOrAuthor = currentUser && (currentUser.role === 'admin' || currentUser.role === 'author');

  // Loading indicator while verifying authentication
  if (checkingAuth && !isAdminOrAuthor) {
    return (
      <div className="page-admin">
        <div className="site-container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <RefreshCw size={36} className="spin-icon" color="#D4AF37" />
          <p style={{ color: 'var(--text-secondary)' }}>جاري التحقق من صلاحيات الإدارة...</p>
        </div>
      </div>
    );
  }

  // If user is neither admin nor author, show Access Denied with inline login
  if (!isAdminOrAuthor) {
    return (
      <div className="page-admin">
        <div className="site-container admin-denied-container">
          <div className="admin-denied-card text-center">
            <div className="denied-icon-box">
              <ShieldAlert size={48} color="#EF4444" />
            </div>
            <h2>منطقة إدارة محمية (Admin & Author Only)</h2>
            <p>
              هذه الصفحة مخصصة للمدير العام والمؤلفة لإدارة وتفعيل حسابات القارئات وفك أقفال الأجهزة.
            </p>

            {/* Quick Inline Login Form */}
            <form onSubmit={handleInlineLogin} className="site-form" style={{ maxWidth: '380px', margin: '1.5rem auto 1rem', textAlign: 'right' }}>
              {inlineLoginError && (
                <div className="alert-error-box" style={{ marginBottom: '1rem', padding: '0.6rem 0.8rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} color="#EF4444" />
                  <span style={{ fontSize: '0.85rem' }}>{inlineLoginError}</span>
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>البريد الإلكتروني للإدارة</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    value={inlineEmail}
                    onChange={(e) => setInlineEmail(e.target.value)}
                    placeholder="yasssokamel@gmail.com"
                    required
                    className="form-input"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>كلمة المرور</label>
                <div className="input-with-icon">
                  <Key size={16} className="input-icon" />
                  <input
                    type="password"
                    value={inlinePassword}
                    onChange={(e) => setInlinePassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="form-input"
                    dir="ltr"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-gold btn-block" disabled={inlineLoginLoading}>
                {inlineLoginLoading ? 'جاري تسجيل الدخول...' : 'دخول فوري إلى لوحة الإدارة'}
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => { setInlineEmail('yasssokamel@gmail.com'); setInlinePassword('Yassein123#'); }}
                  style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px dashed var(--gold-primary)', color: 'var(--gold-light)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  المدير العام (Yassein)
                </button>
                <button
                  type="button"
                  onClick={() => { setInlineEmail('bedour.lotfi77@gmail.com'); setInlinePassword('password123'); }}
                  style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px dashed var(--gold-primary)', color: 'var(--gold-light)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  المؤلفة (Bedour)
                </button>
              </div>
            </form>

            <div className="denied-actions" style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to="/login" state={{ from: { pathname: '/admin' } }} className="btn btn-outline btn-sm">
                صفحة تسجيل الدخول الكاملة
              </Link>
              <Link to="/" className="btn btn-outline btn-sm">
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter readers by search query
  const filteredReaders = readers.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.username?.toLowerCase().includes(q)
    );
  });

  const lockedCount = readers.filter((r) => r.isLocked).length;
  const pendingCount = readers.length - lockedCount;

  return (
    <div className="page-admin">
      <div className="site-container admin-dashboard-container">
        {/* Header */}
        <div className="admin-page-header">
          <div className="admin-header-title-box">
            <div className="admin-badge">
              <Sparkles size={16} color="#D4AF37" />
              <span>لوحة تحكم الإدارة الحصرية</span>
            </div>
            <h1 className="admin-title">إدارة القارئات والتصاريح الرقمية</h1>
            <p className="admin-subtitle">
              إصدار حسابات معتمدة جديدة لقارئات كتاب «عيشي كأنثى»، فك أقفال الأجهزة عند الحاجة، ومتابعة الاستخدام.
            </p>
          </div>

          <div className="admin-quick-links">
            <Link to="/reader" className="btn btn-outline btn-sm">
              <span>معاينة القارئ</span>
            </Link>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {actionMessage.text && (
          <div className={`alert-banner ${actionMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {actionMessage.type === 'success' ? (
              <Check size={20} color="#10B981" />
            ) : (
              <AlertCircle size={20} color="#EF4444" />
            )}
            <span>{actionMessage.text}</span>
            <button
              type="button"
              onClick={() => setActionMessage({ type: '', text: '' })}
              className="alert-dismiss-btn"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper gold-tint">
              <Users size={24} color="#D4AF37" />
            </div>
            <div className="stat-meta">
              <span className="stat-label">إجمالي القارئات المعتمدات</span>
              <span className="stat-value">{readers.length}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper green-tint">
              <ShieldCheck size={24} color="#10B981" />
            </div>
            <div className="stat-meta">
              <span className="stat-label">أجهزة مقترنة ومحمية</span>
              <span className="stat-value">{lockedCount}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper purple-tint">
              <Key size={24} color="#B794F4" />
            </div>
            <div className="stat-meta">
              <span className="stat-label">في انتظار الدخول الأول</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Form on Left/Top, List on Right/Bottom */}
        <div className="admin-main-grid">
          {/* Create Reader Card */}
          <div className="admin-card create-reader-card">
            <div className="card-header">
              <div className="header-icon-box">
                <UserPlus size={22} color="#D4AF37" />
              </div>
              <div>
                <h3 className="card-title">إضافة قارئة جديدة</h3>
                <p className="card-desc">أدخلي بيانات القارئة ليتم إنشاء حساب قارئة معتمد فوراً.</p>
              </div>
            </div>

            {formError && (
              <div className="alert-error-box">
                <AlertCircle size={18} color="#EF4444" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateReader} className="site-form admin-form">
              {/* Full Name */}
              <div className="form-group">
                <div className="label-with-helper">
                  <label className="form-label">اسم القارئ / القارئة</label>
                  <span className="label-hint">اختياري (يُولّد تلقائياً إن تُرِك فارغاً)</span>
                </div>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد الجمل أو نورة العتيبي"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني (مطلوب)</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="noura@example.com أو ahmed@gmail.com"
                    required
                    className="form-input"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="form-group">
                <div className="label-with-helper">
                  <label className="form-label">اسم المستخدم (Username)</label>
                  <span className="label-hint">اختياري (يُستخرج من البريد إن تُرِك فارغاً)</span>
                </div>
                <div className="input-with-icon">
                  <AtSign size={18} className="input-icon" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    placeholder="ahmed_reader"
                    className="form-input"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="label-with-helper">
                  <label className="form-label">كلمة المرور المؤقتة</label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="btn-text-helper"
                  >
                    ✨ توليد كلمة مرور عشوائية
                  </button>
                </div>
                <div className="input-with-icon">
                  <Key size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="form-input"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="input-eye-btn"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gold btn-block btn-lg"
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>جاري التحقق وإنشاء الحساب...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>اعتماد الحساب وتفعيله كقارئة</span>
                  </>
                )}
              </button>
            </form>

            {/* Created Account Summary & Share Box */}
            {lastCreated && (
              <div className="credentials-receipt-card">
                <div className="receipt-header">
                  <Sparkles size={18} color="#D4AF37" />
                  <span>بيانات الدخول الجاهزة للمشاركة:</span>
                </div>
                <div className="receipt-details">
                  <div className="receipt-row">
                    <span className="r-label">الاسم:</span>
                    <span className="r-val">{lastCreated.name}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">البريد:</span>
                    <code className="r-val" dir="ltr">{lastCreated.email}</code>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">اسم المستخدم:</span>
                    <code className="r-val" dir="ltr">{lastCreated.username}</code>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">كلمة المرور:</span>
                    <code className="r-val r-pwd" dir="ltr">{lastCreated.password}</code>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">الرتبة:</span>
                    <span className="r-val badge-reader">قارئة (Reader)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyCredentials}
                  className={`btn btn-block ${copied ? 'btn-success' : 'btn-outline'}`}
                  style={{ marginTop: '1rem' }}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      <span>تم نسخ الرسالة بالكامل بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span>نسخ رسالة الترحيب وبيانات الدخول للقارئة</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Readers List Card */}
          <div className="admin-card readers-list-card">
            <div className="card-header card-header-between">
              <div>
                <h3 className="card-title">قائمة القارئات المعتمدات ({readers.length})</h3>
                <p className="card-desc">الحسابات المصرح لها بقراءة الكتاب والتحكم في اقتران الأجهزة.</p>
              </div>
              <button
                type="button"
                onClick={fetchReaders}
                className="btn-icon-refresh"
                title="تحديث القائمة"
              >
                <RefreshCw size={16} className={loadingList ? 'spin-icon' : ''} />
              </button>
            </div>

            {/* Search Filter */}
            <div className="readers-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي بالاسم، البريد الإلكتروني، أو اسم المستخدم..."
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Readers Table / List */}
            {loadingList ? (
              <div className="admin-loading-box">
                <RefreshCw size={32} className="spin-icon" color="#D4AF37" />
                <span>جاري تحميل بيانات القارئات...</span>
              </div>
            ) : filteredReaders.length === 0 ? (
              <div className="admin-empty-box">
                <Users size={40} color="#718096" />
                <p>
                  {searchQuery
                    ? 'لم يتم العثور على قارئة تطابق بحثكِ.'
                    : 'لا توجد قارئات مسجلات بعد. استخدمي النموذج لإضافة أول قارئة.'}
                </p>
              </div>
            ) : (
              <div className="readers-table-responsive">
                <table className="readers-table">
                  <thead>
                    <tr>
                      <th>القارئة</th>
                      <th>اسم المستخدم</th>
                      <th>حالة قفل الجهاز</th>
                      <th>تاريخ الإضافة</th>
                      <th className="text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReaders.map((reader) => (
                      <tr key={reader.id}>
                        <td>
                          <div className="reader-cell-info">
                            <span className="reader-name">{reader.name}</span>
                            <span className="reader-email" dir="ltr">{reader.email}</span>
                          </div>
                        </td>
                        <td>
                          <code className="reader-username" dir="ltr">
                            {reader.username ? `@${reader.username}` : '—'}
                          </code>
                        </td>
                        <td>
                          {reader.isLocked ? (
                            <span className="status-badge status-locked" title={`مقترن بالبصمة: ${reader.deviceToken}`}>
                              <ShieldCheck size={14} />
                              <span>مقترن بجهاز</span>
                            </span>
                          ) : (
                            <span className="status-badge status-unlocked">
                              <Unlock size={14} />
                              <span>غير مقترن بعد</span>
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="reader-date">
                            {reader.createdAt ? new Date(reader.createdAt).toLocaleDateString('ar-EG') : '—'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            {reader.isLocked && (
                              <button
                                type="button"
                                onClick={() => handleResetLock(reader.id, reader.name)}
                                className="action-btn action-unlock"
                                title="فك قفل الجهاز ليتاح الدخول من جهاز جديد"
                              >
                                <Unlock size={14} />
                                <span>فك القفل</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteReader(reader.id, reader.name)}
                              className="action-btn action-delete"
                              title="حذف الحساب نهائيًا"
                            >
                              <Trash2 size={14} />
                              <span>حذف</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
