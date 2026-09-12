import React from 'react';
import ContactForm from '../components/ContactForm';
import { Mail, Phone, MapPin, Clock, MessageSquare, Sparkles } from 'lucide-react';

export function Contact() {
  return (
    <div className="page-contact">
      <div className="site-container">
        <div className="page-header text-center">
          <div className="hero-badge" style={{ margin: '0 auto 1rem' }}>
            <Sparkles size={16} color="#D4AF37" />
            <span>قنوات التواصل الرسمية</span>
          </div>
          <h1 className="page-title">تواصل واستشارات مع الكاتبة</h1>
          <p className="page-subtitle">
            يسعدني استقبال رسائلكِ، استفساراتكِ حول كتاب كأنثى، وطلبات حجز جلسات الوعي الذاتي وجودة
            الحياة.
          </p>
        </div>

        <div className="contact-layout-grid">
          {/* Direct Details Column */}
          <div className="contact-details-col">
            <div className="contact-info-card">
              <h3 className="info-card-title">معلومات التواصل المباشر</h3>
              <p className="info-card-desc">
                يمكنكِ مراسلتي مباشرة عبر البريد الإلكتروني أو تطبيق واتساب للحصول على رد سريع.
              </p>

              <div className="info-items-list">
                {/* Email */}
                <div className="info-item">
                  <div className="info-icon">
                    <Mail size={22} color="#D4AF37" />
                  </div>
                  <div className="info-text">
                    <span className="info-label">البريد الإلكتروني المباشر:</span>
                    <a href="mailto:bedour.lotfi77@gmail.com" className="info-value" dir="ltr">
                      bedour.lotfi77@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div className="info-item">
                  <div className="info-icon">
                    <Phone size={22} color="#D4AF37" />
                  </div>
                  <div className="info-text">
                    <span className="info-label">واتساب / الهاتف:</span>
                    <a
                      href="https://wa.me/201207151711"
                      target="_blank"
                      rel="noreferrer"
                      className="info-value"
                      dir="ltr"
                    >
                      +20 12 07151711
                    </a>
                  </div>
                </div>

                {/* Scope */}
                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={22} color="#D4AF37" />
                  </div>
                  <div className="info-text">
                    <span className="info-label">نطاق الجلسات:</span>
                    <span className="info-value">
                      مصر (حضوريًا) • وجميع أنحاء العالم (أونلاين عبر تقنيات الاتصال المرئي)
                    </span>
                  </div>
                </div>

                {/* Response Time */}
                <div className="info-item">
                  <div className="info-icon">
                    <Clock size={22} color="#D4AF37" />
                  </div>
                  <div className="info-text">
                    <span className="info-label">زمن الرد المتوقع:</span>
                    <span className="info-value">خلال 24 إلى 48 ساعة كحد أقصى</span>
                  </div>
                </div>
              </div>

              {/* Gentle Note */}
              <div className="gentle-note-box">
                <MessageSquare size={20} color="#D4AF37" />
                <p>
                  « كل رسالة تصلني أقرأها بعناية واهتمام بالغ. لا تترددي في طرح ما يشغل بالكِ أو طلب
                  الإرشاد في خطوتكِ القادمة. »
                </p>
                <span>— بدور لطفي</span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-col">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
