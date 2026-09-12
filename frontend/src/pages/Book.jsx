import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Heart,
  Compass,
  Award,
  ShieldCheck,
  ChevronLeft,
  Quote,
  CheckCircle,
} from 'lucide-react';

export function Book() {
  const pillars = [
    {
      icon: Compass,
      title: 'بوصلة المشاعر',
      desc: 'كيف تفهمين الرسائل المشفرة لمشاعركِ دون خوف أو كبت، لتكون دليلكِ الصادق وليس عائقكِ.',
    },
    {
      icon: Heart,
      title: 'التصالح مع الجسد',
      desc: 'بناء علاقة واعية وصحية مع جسدكِ كشريك رحلة، والإنصات الحميم لإشاراته واحتياجاته.',
    },
    {
      icon: Sparkles,
      title: 'النور الداخلي',
      desc: 'إدراك القيمة الأصيلة التي أودعها الله فيكِ، بعيداً عن ضغوط التوقعات والمقارنات.',
    },
    {
      icon: Award,
      title: 'صناعة الأثر',
      desc: 'تحويل فهمكِ العميق لذاتكِ إلى قرارات شجاعة، وواقع أكثر حيوية وإنجازًا وتأثيرًا.',
    },
  ];

  const reviews = [
    {
      name: 'ريم الشريف',
      title: 'قارئة وباحثة',
      comment:
        'هذا الكتاب غير طريقتي في النظر لمشاعري تمامًا.. شعرت وكأن الأستاذة بدور تجلس أمامي وتتحدث لروحي.',
    },
    {
      name: 'د. منى عبد الرحمن',
      title: 'أخصائية إرشاد أسري',
      comment:
        'كتاب استثنائي يجمع بين عمق الطرح ورقة التناول. أسلوب بدور لطفي يلامس القلب ويمنح المرأة قوة حقيقية نابعة من الوعي.',
    },
    {
      name: 'هند خالد',
      title: 'مهتمة بالتطوير الذاتي',
      comment:
        'تجربة القارئ الرقمي المحمي على الموقع ممتعة ومريحة جدًا للعين. والكلمات في كتاب كأنثى شعلة نور.',
    },
  ];

  return (
    <div className="page-book">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-backdrop-glow"></div>
        <div className="site-container hero-grid">
          {/* Hero Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} color="#D4AF37" />
              <span>الإصدار المميز للمستشارة بدور لطفي</span>
            </div>

            <h1 className="hero-title">
              عيشي كـــأنــثـــى
              <span className="hero-title-sub">رحلة الوعي الذاتي، النور الداخلي، وجودة الحياة</span>
            </h1>

            <p className="hero-description">
              أساعدكِ تفهمي نفسكِ بعمق؛ مشاعركِ، أفكاركِ، معتقداتكِ، قيمكِ واحتياجاتكِ، وتبني علاقة
              أكثر وعيًا وصحة مع جسدكِ.. عشان تحولي فهمكِ لنفسكِ إلى حياة أكثر حيوية، وإنجازًا
              وأثرًا.
            </p>

            <div className="hero-quote-box">
              <Quote size={20} color="#D4AF37" className="quote-icon" />
              <p className="hero-quote-text">« لأن نوركِ يستحق أن يُرى »</p>
            </div>

            <div className="hero-cta-group">
              <Link to="/reader" className="btn btn-gold btn-lg btn-glow" id="hero-btn-read">
                <BookOpen size={20} />
                <span>ابدئي القراءة الآن</span>
                <ChevronLeft size={18} />
              </Link>

              <Link to="/author" className="btn btn-outline btn-lg" id="hero-btn-author">
                <span>عن الكاتبة والمنهج</span>
              </Link>
            </div>

            {/* Quick stats / Features */}
            <div className="hero-perks">
              <div className="perk-item">
                <ShieldCheck size={18} color="#D4AF37" />
                <span>قراءة رقمية خاصة ومحمية</span>
              </div>
              <div className="perk-item">
                <CheckCircle size={18} color="#D4AF37" />
                <span>متوافق مع الهواتف والأجهزة اللوحية</span>
              </div>
            </div>
          </div>

          {/* 3D Book Cover Visual Mockup */}
          <div className="hero-visual">
            <div className="book-3d-wrapper">
              <div className="book-3d-cover">
                <div className="book-spine"></div>
                <div className="book-front book-front-with-cover">
                  <img
                    src="/cover.jpeg"
                    alt="غلاف كتاب عيشي كأنثى - بدور لطفي"
                    className="book-real-cover-img"
                  />
                  <div className="book-cover-gloss"></div>
                </div>
              </div>
              <div className="book-shadow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Pillars Section */}
      <section className="section-pillars">
        <div className="site-container">
          <div className="section-header text-center">
            <h2 className="section-title">محاور رحلتكِ في كتاب كأنثى</h2>
            <p className="section-subtitle">
              أربعة أركان أساسية لإعادة اكتشاف نوركِ الفطري وتشييد حياة متوازنة وذات معنى
            </p>
          </div>

          <div className="pillars-grid">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="pillar-card">
                  <div className="pillar-icon-box">
                    <Icon size={28} color="#D4AF37" />
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Excerpt Banner */}
      <section className="section-excerpt">
        <div className="site-container">
          <div className="excerpt-card">
            <div className="excerpt-ornament">
              <Sparkles size={28} color="#D4AF37" />
            </div>
            <blockquote className="excerpt-text">
              « أنا مؤمنة إن جوا كل واحدة فينا نور جميل من ربنا، لكن ضغوط الحياة والأدوار والتجارب
              ممكن تبعدنا عنه. ودوري أساعدكِ تكتشفي النور اللي جواكي، تعيشي منه، وتنوري بيه حياتكِ
              وتتركي أثرًا. »
            </blockquote>
            <p className="excerpt-author">— بدور لطفي، من مقدمة كتاب كأنثى</p>
            <div className="excerpt-cta">
              <Link to="/reader" className="btn btn-gold">
                تصفحي العينة الرقمية في القارئ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-reviews">
        <div className="site-container">
          <div className="section-header text-center">
            <h2 className="section-title">أصداء وانطباعات القارئات</h2>
            <p className="section-subtitle">كلمات من قلوب خاضت رحلة الوعي مع كتاب كأنثى</p>
          </div>

          <div className="reviews-grid">
            {reviews.map((rev, idx) => (
              <div key={idx} className="review-card">
                <Quote size={24} color="#D4AF37" className="review-quote-mark" />
                <p className="review-comment">{rev.comment}</p>
                <div className="review-author-info">
                  <h4 className="review-author-name">{rev.name}</h4>
                  <span className="review-author-title">{rev.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reader Security Showcase */}
      <section className="section-security-highlight">
        <div className="site-container">
          <div className="security-banner">
            <div className="security-banner-content">
              <ShieldCheck size={40} color="#D4AF37" />
              <div>
                <h3>تجربة قراءة رقمية حصرية ومحمية</h3>
                <p>
                  نعتمد تقنية كانفاس المتقدمة مع التشفير اللحظي والواترمارك الديناميكي وقفل الأجهزة،
                  لتوفير بيئة قراءة نقية، خالية من المشتتات والقرصنة، ومحفوظة الحقوق.
                </p>
              </div>
            </div>
            <Link to="/reader" className="btn btn-outline">
              فتح القارئ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Book;
