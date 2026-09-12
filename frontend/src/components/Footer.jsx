import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top-ornament">
        <div className="ornament-line"></div>
        <div className="ornament-symbol">
          <Sparkles size={18} color="#D4AF37" />
        </div>
        <div className="ornament-line"></div>
      </div>

      <div className="footer-container">
        {/* Col 1: Brand & Philosophy */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <h3 className="footer-title">كـــأنــثـــى</h3>
            <p className="footer-quote">« لأن نوركِ يستحق أن يُرى »</p>
          </div>
          <p className="footer-bio">
            مساحة متخصصة للوعي الذاتي، فهم المشاعر وبناء علاقة صحية ومستنيرة مع الجسد والروح
            بإشراف المستشارة بدور لطفي.
          </p>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="footer-col links-col">
          <h4 className="footer-heading">روابط سريعة</h4>
          <ul className="footer-nav-list">
            <li>
              <Link to="/">عن الكتاب والرسالة</Link>
            </li>
            <li>
              <Link to="/author">السيرة والمنهج الاستشاري</Link>
            </li>
            <li>
              <Link to="/contact">حجز الاستشارات والتواصل</Link>
            </li>
            <li>
              <Link to="/login">تسجيل دخول القارئات</Link>
            </li>
            <li>
              <Link to="/reader">القارئ المحمي الرقمي</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact Details */}
        <div className="footer-col contact-col">
          <h4 className="footer-heading">تواصل مباشر</h4>
          <div className="footer-contact-items">
            <a href="mailto:bedour.lotfi77@gmail.com" className="contact-link-item">
              <Mail size={18} color="#D4AF37" />
              <span dir="ltr">bedour.lotfi77@gmail.com</span>
            </a>
            <a href="https://wa.me/201207151711" target="_blank" rel="noreferrer" className="contact-link-item">
              <Phone size={18} color="#D4AF37" />
              <span dir="ltr">+20 12 07151711</span>
            </a>
          </div>

          <div className="security-notice-box">
            <ShieldCheck size={18} color="#C5A880" />
            <span>نظام قراءة محمي بتقنية كانفاس لمنع النسخ وحفظ الحقوق الفكرية.</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          جميع الحقوق محفوظة © {new Date().getFullYear()} للكاتبة والمستشارة{' '}
          <strong>بدور لطفي</strong> — كتاب كأنثى.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
