import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Compass, MessageCircle, Mail, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import authorImg from '../assets/author.jpg';

export function Author() {
  const counselingAreas = [
    {
      title: 'استشارات الوعي الذاتي والعمق النفسي',
      desc: 'جلسات فردية لمساعدتكِ على تفكيك المعتقدات المقيدة، استيعاب دورة المشاعر، وبناء رؤية واضحة لقيمكِ واحتياجاتكِ الحقيقية.',
    },
    {
      title: 'بناء علاقة صحية وواعية مع الجسد',
      desc: 'إعادة الاتصال بالجسد كبوصلة حكمة واستشعار، التخلص من أحكام المقارنة، والإنصات لإشارات التعب والتعبير الحميم.',
    },
    {
      title: 'تطوير جودة الحياة وصناعة الأثر',
      desc: 'تحويل فهمكِ لذاتكِ إلى قرارات يومية عملية وعادات متوازنة تصنع حياة ذات بهجة، إنتاجية، وتأثير إيجابي في محيطكِ.',
    },
    {
      title: 'جلسات مناقشة وتطبيق كتاب كأنثى',
      desc: 'مرافقة تطبيقية لرحلة الكتاب، مع تمارين تفاعلية ومتابعة خاصة لضمان تجسيد النور الداخلي في واقعكِ.',
    },
  ];

  return (
    <div className="page-author">
      {/* Author Hero Section */}
      <section className="author-hero">
        <div className="site-container author-hero-grid">
          {/* Author Portrait / Card */}
          <div className="author-portrait-wrapper">
            <div className="author-portrait-frame">
              <div className="author-portrait-art author-portrait-real">
                <img
                  src={authorImg || '/author.jpg'}
                  alt="المستشارة والكاتبة بدور لطفي"
                  className="author-real-img"
                  onError={(e) => {
                    e.currentTarget.src = '/author.jpg';
                  }}
                />
                <div className="author-portrait-gradient-overlay"></div>
              </div>
              <div className="author-badge-card">
                <Sparkles size={18} color="#D4AF37" />
                <div>
                  <h4>بدور لطفي</h4>
                  <p>مستشارة وعي ذاتي وجودة حياة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Author Words & Intro */}
          <div className="author-bio-content">
            <div className="hero-badge">
              <Sparkles size={16} color="#D4AF37" />
              <span>رسالتي ورؤيتي</span>
            </div>

            <h1 className="author-bio-title">
              أنا بدور لطفي،
              <span className="title-sub">مستشارة وعي ذاتي وجودة حياة</span>
            </h1>

            <div className="author-manifesto">
              <p className="manifesto-p lead">
                أساعدكِ تفهمي نفسكِ بعمق؛ مشاعركِ، أفكاركِ، معتقداتكِ، قيمكِ واحتياجاتكِ، وتبني علاقة
                أكثر وعيًا وصحة مع جسدكِ.
              </p>
              <p className="manifesto-p">
                عشان تحولي فهمكِ لنفسكِ إلى حياة أكثر حيوية، وإنجازًا وأثرًا.
              </p>
              <p className="manifesto-p">
                أنا مؤمنة إن جوا كل واحدة فينا نور جميل من ربنا، لكن ضغوط الحياة والأدوار والتجارب
                ممكن تبعدنا عنه.
              </p>
              <p className="manifesto-p">
                ودوري أساعدكِ تكتشفي النور اللي جواكي، تعيشي منه، وتنوري بيه حياتكِ وتتركي أثرًا.
              </p>
            </div>

            <div className="author-quote-box">
              <p className="author-quote-text">« لأن نوركِ يستحق أن يُرى »</p>
            </div>

            <div className="author-action-btns">
              <Link to="/contact" className="btn btn-gold btn-lg">
                <MessageCircle size={18} />
                <span>احجزي استشارة خاصة</span>
              </Link>
              <Link to="/reader" className="btn btn-outline btn-lg">
                <span>تصفحي كتاب كأنثى</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Counseling Areas */}
      <section className="section-counseling">
        <div className="site-container">
          <div className="section-header text-center">
            <h2 className="section-title">مجالات الاستشارة والمرافقة النفسية</h2>
            <p className="section-subtitle">
              برامج مصممة لمساندتكِ في عبور التحديات واكتشاف بوصلتكِ الداخلية
            </p>
          </div>

          <div className="counseling-grid">
            {counselingAreas.map((area, idx) => (
              <div key={idx} className="counseling-card">
                <div className="counseling-header">
                  <CheckCircle2 size={24} color="#D4AF37" />
                  <h3 className="counseling-title">{area.title}</h3>
                </div>
                <p className="counseling-desc">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Author Direct Contacts Banner */}
      <section className="section-author-contact-bar">
        <div className="site-container">
          <div className="author-contact-card">
            <div className="card-info">
              <h3>هل تودين بدء رحلة الوعي معي؟</h3>
              <p>
                متاحة لجلسات الاستشارة الفردية عن بُعد (عبر الإنترنت) لجميع دول العالم، وجلسات
                حضورياً في مصر.
              </p>
            </div>
            <div className="contact-quick-links">
              <a href="mailto:bedour.lotfi77@gmail.com" className="quick-contact-pill">
                <Mail size={16} />
                <span>bedour.lotfi77@gmail.com</span>
              </a>
              <a
                href="https://wa.me/201207151711"
                target="_blank"
                rel="noreferrer"
                className="quick-contact-pill highlight"
              >
                <Phone size={16} />
                <span>+20 12 07151711</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Author;
