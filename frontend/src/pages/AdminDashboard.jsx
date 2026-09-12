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

  // Actions feedback
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Verify Admin Access
  useEffect(() => {
    const user = api.auth.getUser();
    setCurrentUser(user);
    if (!user || user.role !== 'admin') {
      setLoadingList(false);
      return;
    }
    fetchReaders();
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
    if (name.trim().length < 2) {
      setFormError('يرجى إدخال اسم القارئة بشكل صحيح (حرفين على الأقل).');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setFormError('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }
    if (username.trim().length < 3) {
      setFormError('اسم المستخدم يجب ألا يقل عن 3 أحرف.');
      return;
    }
    if (password.length < 6) {
      setFormError('كلمة المرور يجب ألا تقل عن 6 أحرف.');
      return;
    }

    setFormSubmitting(true);
    try {
      const res = await api.admin.createReader({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password,
      });

      setLastCreated({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
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
        text: 'تم إنشاء حساب القارئة بنجاح! يمكنكِ الآن نسخ بيانات الدخول وإرسالها لها.',
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
    const text = `مرحباً بكِ في كتاب «عيشي كأنثى» للكاتبة بدور لطفي ✨\nتم تفعيل حسابكِ في القارئ الرقمي المحمي:\n\n🔗 رابط الدخول: ${window.location.origin}/login\n📧 البريد الإلكتروني: ${lastCreated.email}\n👤 اسم المستخدم: ${lastCreated.username}\n🔑 كلمة المرور: ${lastCreated.password}\n\n*ملاحظة: سيتم اقتران الحساب بجهاز القراءة الأول الذي تسجلين الدخول منه لحماية حقوق الكتاب.*`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Reset device lock
  const handleResetLock = async (readerId, readerName) => {
    if (!window.confirm(`هل أنتِ متأكدة من فك قفل الجهاز للقارئة (${readerName})؟ ستتمكن من تسجيل الدخول من جهاز جديد.`)) {
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
    if (!window.confirm(`تحذير: هل أنتِ متأكدة من حذف حساب القارئة (${readerName}) نهائياً؟`)) {
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

  // If user is not admin, show Access Denied guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="page-admin">
        <div className="site-container admin-denied-container">
          <div className="admin-denied-card text-center">
            <div className="denied-icon-box">
              <ShieldAlert size={48} color="#EF4444" />
            </div>
            <h2>منطقة إدارة محمية (Admin Only)</h2>
            <p>
              هذه الصفحة مخصصة لمدير النظام فقط لإدارة وتفعيل حسابات القارئات.
              حسابك الحالي ليس لديه صلاحيات المشرف.
            </p>
            <div className="denied-actions">
              <Link to="/login" className="btn btn-gold">
                تسجيل الدخول كمدير
              </Link>
              <Link to="/" className="btn btn-outline">
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
                <label className="form-label">اسم القارئة الكامل</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: نورة سالم العتيبي"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني للقارئة</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="noura@example.com"
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
                  <span className="label-hint">تستطيع القارئة الدخول به</span>
                </div>
                <div className="input-with-icon">
                  <AtSign size={18} className="input-icon" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    placeholder="noura_reader"
                    required
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
