import React, { useState } from 'react';
import { api } from '../services/api';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.contact.submit(formData);
      setSuccessMsg(res.message || 'تم إرسال رسالتكِ بنجاح!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setErrorMsg(err.message || 'تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-card">
      <div className="form-card-header">
        <h3 className="form-card-title">أرسلي رسالتكِ للكاتبة</h3>
        <p className="form-card-desc">
          سواء كان استفسارًا عن الكتاب، أو طلب استشارة خاصة في الوعي الذاتي، يسعدني التواصل معكِ.
        </p>
      </div>

      {successMsg ? (
        <div className="alert-success-box">
          <CheckCircle2 size={32} color="#10B981" />
          <div className="alert-text">
            <h4>تم الإرسال بنجاح</h4>
            <p>{successMsg}</p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setSuccessMsg('')}
            style={{ marginTop: '0.5rem' }}
          >
            إرسال رسالة أخرى
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="site-form">
          {errorMsg && (
            <div className="alert-error-box">
              <AlertCircle size={20} color="#EF4444" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="contact-name" className="form-label">
              الاسم الكريم <span className="text-required">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="مثال: سارة محمد"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email" className="form-label">
              البريد الإلكتروني <span className="text-required">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="form-input"
              dir="ltr"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message" className="form-label">
              الرسالة أو تفاصيل الاستشارة <span className="text-required">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="اكتبي ما يجول في خاطركِ بكل أريحية..."
              required
              className="form-textarea"
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold btn-block btn-submit"
            disabled={loading}
            id="btn-submit-contact"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin-icon" />
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>إرسال الرسالة الآن</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactForm;
