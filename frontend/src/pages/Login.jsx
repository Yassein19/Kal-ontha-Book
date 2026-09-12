import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, getDeviceFingerprint } from '../services/api';
import { Lock, Mail, Key, ShieldCheck, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/reader';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const deviceFingerprint = getDeviceFingerprint();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetSuccess('');

    try {
      await api.auth.login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات المدخلة.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'author') {
      setEmail('bedour.lotfi77@gmail.com');
      setPassword('password123#');
    } else if (type === 'reader') {
      setEmail('reader@kal-ontha.com');
      setPassword('read2026');
    } else if (type === 'admin') {
      setEmail('yasssokamel@gmail.com');
      setPassword('Yassein123#');
    }
    setError('');
  };

  const handleResetLock = async () => {
    if (!email) {
      setError('يرجى كتابة البريد الإلكتروني أولاً لفك القفل.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Find user and reset lock
      const user = api.auth.getUser();
      await api.auth.resetDeviceLock(user?.id || 1);
      setResetSuccess('تم فك قفل الجهاز بنجاح! يمكنكِ الآن تسجيل الدخول من هذا الجهاز.');
    } catch (err) {
      setError(err.message || 'تعذر فك القفل.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-login">
      <div className="site-container login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header text-center">
            <div className="login-icon-box">
              <Lock size={28} color="#D4AF37" />
            </div>
            <h1 className="login-title">تسجيل دخول القارئات</h1>
            <p className="login-desc">
              أهلاً بكِ في المساحة المحمية لكتاب كأنثى. يُرجى إدخال بيانات الدخول المعتمدة من
              الإدارة.
            </p>
          </div>

          {/* Device Lock Notice Box */}
          <div className="device-lock-notice">
            <div className="notice-header">
              <ShieldCheck size={18} color="#10B981" />
              <span>نظام قفل الجهاز المعتمد (Device Lock)</span>
            </div>
            <p className="notice-body">
              حسابكِ مقترن أمنيًا بجهاز قراءة واحد لحماية حقوق الكاتبة. سيتم تفعيل القفل على هذا
              الجهاز تلقائيًا بمجرد تسجيل الدخول.
            </p>
            <div className="device-token-preview">
              <span>بصمة المتصفح الحالية:</span>
              <code>{deviceFingerprint.substring(0, 18)}...</code>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert-error-box">
              <AlertTriangle size={20} color="#EF4444" />
              <div>
                <p>{error}</p>
                {error.includes('مقترن بجهاز') && (
                  <button
                    type="button"
                    onClick={handleResetLock}
                    className="btn-text-link"
                    style={{ marginTop: '0.4rem', display: 'block', color: '#D4AF37' }}
                  >
                    [تجربة المطور]: اضغطي هنا لفك القفل واقتران هذا الجهاز
                  </button>
                )}
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="alert-success-box">
              <CheckCircle size={20} color="#10B981" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="site-form">
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                البريد الإلكتروني للقارئة
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@kal-ontha.com"
                  required
                  className="form-input"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                كلمة المرور
              </label>
              <div className="input-with-icon">
                <Key size={18} className="input-icon" />
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-block btn-login"
              disabled={loading}
              id="btn-submit-login"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin-icon" />
                  <span>جاري التحقق من الجهاز والدخول...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>دخول إلى القارئ المحمي</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Testing Helper */}
          <div className="login-quick-demo">
            <span className="demo-label">حسابات سريعة للاختبار:</span>
            <div className="demo-btns">
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => handleQuickFill('author')}
                style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-light)' }}
              >
                الكاتبة: bedour.lotfi77@gmail.com
              </button>
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => handleQuickFill('reader')}
              >
                قارئة: reader@kal-ontha.com
              </button>
              <button
                type="button"
                className="btn-demo-pill"
                onClick={() => handleQuickFill('admin')}
              >
                المدير العام: yasssokamel@gmail.com
              </button>
            </div>
          </div>

          <div className="login-footer-support text-center">
            <p>
              ليس لديكِ حساب قارئة معتمد؟{' '}
              <a href="/contact" className="gold-link">
                تواصلي مع الكاتبة لطلب اشتراك القراءة
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
