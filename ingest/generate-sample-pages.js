import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../backend/storage/pages');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Sample content for the 10 pages of "كأنثى" by Bedour Lotfi
const pagesContent = [
  {
    type: 'cover',
    title: 'كـــأنــثـــى',
    subtitle: 'رحلة الوعي الذاتي، النور الداخلي، وجودة الحياة',
    author: 'بدور لطفي',
    quote: 'لأن نوركِ يستحق أن يُرى',
  },
  {
    type: 'dedication',
    title: 'إهداء',
    content: [
      'إلى كل أنثى نسيت في زحام الأيام كيف تلمع..',
      'إلى الروح النقية التي تحارب بصمت خلف ابتسامة صامدة..',
      'إلى التي تبحث عن نفسها بين ركام التوقعات والواجبات..',
      'هذا الكتاب ليس مجرد كلمات.. إنه مرآة لروحك، ودعوة صادقة للعودة إلى موطنكِ الأول: ذاتك الحقيقية.',
    ],
    sign: 'بدور لطفي',
  },
  {
    type: 'toc',
    title: 'فهرس الرحلة',
    chapters: [
      { num: 'المقدمة', name: 'نوركِ يستحق أن يُرى', page: '٥' },
      { num: 'الفصل الأول', name: 'صوت المشاعر: كيف نفهم ما لا يُقال؟', page: '١٢' },
      { num: 'الفصل الثاني', name: 'تفكيك المعتقدات والقوالب الجاهزة', page: '٣٨' },
      { num: 'الفصل الثالث', name: 'الجسد كبوصلة: التصالح والإنصات العميق', page: '٦٤' },
      { num: 'الفصل الرابع', name: 'قيمكِ واحتياجاتكِ الحقيقية', page: '٩٢' },
      { num: 'الفصل الخامس', name: 'من الفهم إلى الأثر: صناعة حياة نابضة', page: '١٢٠' },
      { num: 'الخاتمة', name: 'إشراقة لا تنطفئ', page: '١٤٥' },
    ],
  },
  {
    type: 'text',
    chapter: 'المقدمة',
    heading: 'نوركِ يستحق أن يُرى',
    paragraphs: [
      'أنا مؤمنة أن جوا كل واحدة فينا نور جميل من ربنا، لكن ضغوط الحياة، وتراكم الأدوار، والتجارب المتلاحقة ممكن تبعدنا عنه تدريجيًا حتى نكاد ننسى ملامحه.',
      'نجد أنفسنا في أوقات كثيرة نركض لإرضاء الجميع، لنكون الابنة المثالية، الزوجة المضحية، الأم المعطاءة، والمهنية الناجحة. وفي غمرة هذا السباق، ننسى الإنسانة التي تسكن داخلنا.',
      'إن هذا الكتاب صُمم ليكون مساحة آمنة تتنفسين فيها بعمق، تضعين فيها أعباء العالم عند الباب، وتدخلين في حوار حميم وصادق مع أعماقك.',
    ],
  },
  {
    type: 'text',
    chapter: 'الفصل الأول',
    heading: 'صوت المشاعر: بوصلتكِ الأولى',
    paragraphs: [
      'المشاعر ليست أعداء نحاربهم، ولا عيوبًا نخفيها خلف قناع القوة الزائفة. المشاعر هي رسائل مشفرة قادمة من أعماق روحك لتخبركِ بحقيقة ما تمرين به.',
      'حين تشعرين بالحزن، فالروح تقول لكِ: هنا شيء عزيز يحتاج رعاية واعترافًا.',
      'وحين تشعرين بالغضب، فالجسد يخبركِ: هناك حدٌّ من حدودكِ قد تم تجاوزه، وانتبهي لحمايته.',
      'الوعي الذاتي يبدأ باللحظة التي تتوقفين فيها عن كبت مشاعركِ، وتبدأين في الاستماع إليها كصديقة ناصحة.',
    ],
  },
  {
    type: 'quote',
    quote: '«أنتِ لستِ مطالبة بأن تكوني كاملة لتكوني محبوبة.. حضوركِ بوعيكِ وصدقكِ هو أعظم هدية تقدمينها لنفسكِ وللعالم.»',
    author: 'بدور لطفي — كأنثى',
  },
  {
    type: 'text',
    chapter: 'الفصل الثالث',
    heading: 'الجسد كبوصلة: المصالحة الكبرى',
    paragraphs: [
      'كم مرة عاقبتِ جسدكِ لأنه لا يشبه صور المجلات؟ وكم مرة تجاهلتِ إشارات التعب والإرهاق التي يرسلها لكِ يوميًا؟',
      'جسدكِ ليس مجرد وعاء يحملكِ في هذه الحياة، بل هو شريك رحلتكِ، والمستودع الذي يخزن كل فرحة، وكل صدمة، وكل تنهيدة لم تُطلق.',
      'بناء علاقة واعية وصحية مع الجسد يبدأ بالامتنان: أن تشكري نبضات قلبكِ التي لم تتوقف لحظة، وقدَميكِ اللتين حملتاكِ في أصعب الظروف.',
    ],
  },
  {
    type: 'exercise',
    title: 'تمرين عملي: الإنصات الواعي',
    steps: [
      '١. اجلسي في مكان هادئ لمدة خمس دقائق، وأغمضي عينيكِ.',
      '٢. خذي ثلاثة أنفاس عميقة، وركزي انتباهكِ على منطقة الصدر.',
      '٣. اسألي نفسكِ برفق: ما الذي أحتاجه حقًا في هذه اللحظة؟',
      '٤. اكتبي الإجابة الأولى التي تظهر في وعيكِ دون إصدار أي أحكام.',
    ],
  },
  {
    type: 'text',
    chapter: 'الفصل الخامس',
    heading: 'من الفهم إلى الأثر الحقيقي',
    paragraphs: [
      'فهم الذات ليس غاية في حد ذاته، بل هو المحرك الأساسي لتحويل طاقتكِ إلى حياة أكثر حيوية وإنجازًا وتأثيرًا.',
      'حين تكونين على وعي بقيمكِ العليا، تصبح قراراتكِ أكثر شجاعة ووضوحًا. لن تضيعي وقتكِ في صراعات لا تخصكِ، ولن تستنزفي طاقتكِ في علاقات لا تقدر قيمتكِ.',
      'إن دوركِ ليس فقط أن تنجحي بمقاييس الآخرين، بل أن تنوري محيطكِ بنوركِ الخاص الفريد.',
    ],
  },
  {
    type: 'conclusion',
    title: 'كلمة الختام',
    text: 'تذكري دائمًا: النور الذي تبحثين عنه في الخارج، قد وُضع في قلبكِ منذ البداية.. فعيشي منه، وتنوري به، واتركي أثرًا لا يمحوه الزمان.',
    sign: 'بدور لطفي',
    callout: 'نهاية العينة المصرح بها — شكراً لاهتمامكِ بكتاب كأنثى',
  },
];

function generateSVGPage(pageData, pageNumber) {
  const width = 800;
  const height = 1130; // standard A4 ratio

  let innerContent = '';

  if (pageData.type === 'cover') {
    innerContent = `
      <rect width="100%" height="100%" fill="url(#coverBg)" />
      <!-- Ornate Border -->
      <rect x="35" y="35" width="730" height="1060" rx="16" fill="none" stroke="#D4AF37" stroke-width="2.5" opacity="0.6"/>
      <rect x="45" y="45" width="710" height="1040" rx="12" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.3"/>
      
      <!-- Ornate Corner Accents -->
      <circle cx="55" cy="55" r="4" fill="#D4AF37"/>
      <circle cx="745" cy="55" r="4" fill="#D4AF37"/>
      <circle cx="55" cy="1075" r="4" fill="#D4AF37"/>
      <circle cx="745" cy="1075" r="4" fill="#D4AF37"/>

      <!-- Center Logo / Emblem -->
      <circle cx="400" cy="300" r="85" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.5"/>
      <circle cx="400" cy="300" r="75" fill="none" stroke="#D4AF37" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.7"/>
      <path d="M 370,300 C 370,260 430,260 430,300 C 430,340 370,340 370,300 Z" fill="#D4AF37" opacity="0.25"/>
      <text x="400" y="315" font-family="'Amiri', 'Cairo', serif" font-size="44" fill="#F3E5AB" text-anchor="middle" font-weight="bold">ك</text>

      <!-- Main Title -->
      <text x="400" y="470" font-family="'Amiri', 'Cairo', serif" font-size="64" fill="#FFFFFF" text-anchor="middle" font-weight="bold" letter-spacing="4">${pageData.title}</text>
      
      <!-- Subtitle -->
      <text x="400" y="530" font-family="'Cairo', sans-serif" font-size="20" fill="#E2D4C5" text-anchor="middle" font-weight="300">${pageData.subtitle}</text>
      
      <!-- Decorative Line -->
      <path d="M 280 570 L 520 570" stroke="#D4AF37" stroke-width="1.5" opacity="0.6"/>
      <circle cx="400" cy="570" r="4" fill="#D4AF37"/>

      <!-- Quote -->
      <text x="400" y="660" font-family="'Amiri', serif" font-style="italic" font-size="24" fill="#D4AF37" text-anchor="middle">« ${pageData.quote} »</text>

      <!-- Author -->
      <text x="400" y="940" font-family="'Cairo', sans-serif" font-size="16" fill="#A89F91" text-anchor="middle" letter-spacing="2">تـــألـــيـــف</text>
      <text x="400" y="980" font-family="'Cairo', sans-serif" font-size="28" fill="#FFFFFF" text-anchor="middle" font-weight="bold">${pageData.author}</text>
      <text x="400" y="1015" font-family="'Cairo', sans-serif" font-size="15" fill="#D4AF37" text-anchor="middle">مستشارة الوعي الذاتي وجودة الحياة</text>
    `;
  } else {
    // Normal Book Page Layout
    const isDedication = pageData.type === 'dedication';
    const isQuote = pageData.type === 'quote';

    let bodySvg = '';

    if (pageData.type === 'dedication') {
      bodySvg = `
        <text x="400" y="240" font-family="'Amiri', 'Cairo', serif" font-size="36" fill="#C5A880" text-anchor="middle" font-weight="bold">${pageData.title}</text>
        <path d="M 340 270 L 460 270" stroke="#C5A880" stroke-width="1" opacity="0.5"/>
        
        <g transform="translate(100, 360)">
          ${pageData.content
            .map(
              (line, idx) =>
                `<text x="300" y="${idx * 70}" font-family="'Amiri', serif" font-size="22" fill="#2C2825" text-anchor="middle" line-height="1.8">${line}</text>`
            )
            .join('')}
        </g>
        
        <text x="400" y="780" font-family="'Amiri', serif" font-size="26" fill="#C5A880" text-anchor="middle" font-weight="bold">${pageData.sign}</text>
      `;
    } else if (pageData.type === 'toc') {
      bodySvg = `
        <text x="400" y="180" font-family="'Cairo', sans-serif" font-size="32" fill="#2C2825" text-anchor="middle" font-weight="bold">${pageData.title}</text>
        <path d="M 330 205 L 470 205" stroke="#C5A880" stroke-width="1.5"/>

        <g transform="translate(100, 280)">
          ${pageData.chapters
            .map(
              (chap, idx) => `
              <g transform="translate(0, ${idx * 85})">
                <text x="590" y="25" font-family="'Cairo', sans-serif" font-size="18" fill="#7A6F64" text-anchor="end">${chap.num}</text>
                <text x="500" y="25" font-family="'Cairo', sans-serif" font-size="20" fill="#1C1814" text-anchor="end" font-weight="600">${chap.name}</text>
                <path d="M 120 20 L 220 20" stroke="#E2DCD4" stroke-width="1" stroke-dasharray="4,4"/>
                <text x="80" y="25" font-family="'Cairo', sans-serif" font-size="18" fill="#C5A880" text-anchor="end">${chap.page}</text>
              </g>
            `
            )
            .join('')}
        </g>
      `;
    } else if (pageData.type === 'quote') {
      bodySvg = `
        <circle cx="400" cy="380" r="140" fill="#FAF5EE" stroke="#EFE4D6" stroke-width="2"/>
        <text x="400" y="320" font-family="'Amiri', serif" font-size="70" fill="#D4AF37" opacity="0.4" text-anchor="middle">“</text>
        <g transform="translate(140, 520)">
          <text x="260" y="0" font-family="'Amiri', serif" font-size="28" fill="#241E1A" text-anchor="middle" font-weight="500">${pageData.quote.slice(0, 48)}</text>
          <text x="260" y="45" font-family="'Amiri', serif" font-size="28" fill="#241E1A" text-anchor="middle" font-weight="500">${pageData.quote.slice(48)}</text>
        </g>
        <text x="400" y="670" font-family="'Cairo', sans-serif" font-size="20" fill="#C5A880" text-anchor="middle" font-weight="bold">${pageData.author}</text>
      `;
    } else if (pageData.type === 'exercise') {
      bodySvg = `
        <rect x="80" y="160" width="640" height="800" rx="16" fill="#F8F4EE" stroke="#DECDB8" stroke-width="1.5"/>
        <text x="400" y="230" font-family="'Cairo', sans-serif" font-size="26" fill="#A8586A" text-anchor="middle" font-weight="bold">✨ ${pageData.title}</text>
        <path d="M 300 260 L 500 260" stroke="#DECDB8" stroke-width="1"/>

        <g transform="translate(120, 340)">
          ${pageData.steps
            .map(
              (step, idx) => `
              <rect x="0" y="${idx * 110}" width="560" height="75" rx="10" fill="#FFFFFF" stroke="#EFE7DC" stroke-width="1"/>
              <text x="530" y="${idx * 110 + 46}" font-family="'Cairo', sans-serif" font-size="18" fill="#2B2621" text-anchor="end" font-weight="500">${step}</text>
            `
            )
            .join('')}
        </g>
      `;
    } else if (pageData.type === 'conclusion') {
      bodySvg = `
        <text x="400" y="240" font-family="'Cairo', sans-serif" font-size="32" fill="#221C18" text-anchor="middle" font-weight="bold">${pageData.title}</text>
        <path d="M 340 270 L 460 270" stroke="#C5A880" stroke-width="1.5"/>

        <text x="400" y="420" font-family="'Amiri', serif" font-size="24" fill="#2E2823" text-anchor="middle">${pageData.text.slice(0, 55)}</text>
        <text x="400" y="465" font-family="'Amiri', serif" font-size="24" fill="#2E2823" text-anchor="middle">${pageData.text.slice(55)}</text>

        <text x="400" y="580" font-family="'Amiri', serif" font-size="28" fill="#C5A880" text-anchor="middle" font-weight="bold">${pageData.sign}</text>

        <rect x="120" y="740" width="560" height="70" rx="12" fill="#FAF0E6" stroke="#DDB892" stroke-width="1"/>
        <text x="400" y="784" font-family="'Cairo', sans-serif" font-size="16" fill="#7F4F24" text-anchor="middle" font-weight="600">${pageData.callout}</text>
      `;
    } else {
      // standard text page
      bodySvg = `
        <!-- Running Header -->
        <text x="700" y="90" font-family="'Cairo', sans-serif" font-size="14" fill="#998F82" text-anchor="end">${pageData.chapter}</text>
        <text x="100" y="90" font-family="'Cairo', sans-serif" font-size="14" fill="#998F82" text-anchor="start">كأنثى — بدور لطفي</text>
        <path d="M 90 110 L 710 110" stroke="#EBE4D8" stroke-width="1"/>

        <!-- Chapter Heading -->
        <text x="400" y="190" font-family="'Cairo', sans-serif" font-size="28" fill="#211C18" text-anchor="middle" font-weight="bold">${pageData.heading}</text>
        <circle cx="400" cy="225" r="3" fill="#C5A880"/>

        <!-- Paragraphs -->
        <g transform="translate(100, 290)">
          ${pageData.paragraphs
            .map(
              (p, idx) => `
              <text x="600" y="${idx * 160}" font-family="'Amiri', serif" font-size="22" fill="#2C2722" text-anchor="end" line-height="2">${p.slice(0, 60)}</text>
              <text x="600" y="${idx * 160 + 40}" font-family="'Amiri', serif" font-size="22" fill="#2C2722" text-anchor="end" line-height="2">${p.slice(60, 125)}</text>
              <text x="600" y="${idx * 160 + 80}" font-family="'Amiri', serif" font-size="22" fill="#2C2722" text-anchor="end" line-height="2">${p.slice(125)}</text>
            `
            )
            .join('')}
        </g>
      `;
    }

    innerContent = `
      <rect width="100%" height="100%" fill="#FCF9F5" />
      <rect x="25" y="25" width="750" height="1080" rx="6" fill="none" stroke="#EFE8DD" stroke-width="1"/>
      ${bodySvg}
      
      <!-- Footer Page Number -->
      <path d="M 90 1040 L 710 1040" stroke="#EBE4D8" stroke-width="1"/>
      <text x="400" y="1075" font-family="'Cairo', sans-serif" font-size="16" fill="#756B5F" text-anchor="middle" font-weight="600">${pageNumber}</text>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="coverBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18151D"/>
      <stop offset="50%" stop-color="#241B28"/>
      <stop offset="100%" stop-color="#141118"/>
    </linearGradient>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&amp;family=Cairo:wght@300;400;600;700;900&amp;display=swap');
      text { direction: rtl; unicode-bidi: embed; }
    </style>
  </defs>
  ${innerContent}
</svg>`;
}

console.log('Generating 10 sample pages for "كأنثى"...');
pagesContent.forEach((content, index) => {
  const pageNum = index + 1;
  const svg = generateSVGPage(content, pageNum);
  const filePath = path.join(OUTPUT_DIR, `page_${pageNum}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log(`✓ Generated ${filePath}`);
});

console.log('All sample pages successfully created in backend/storage/pages!');
