# دليل حماية الكتاب من لقطات الشاشة ونظام إدارة وتوليد حسابات القارئات
### Book Anti-Piracy Architecture & Automated Reader Access Manager
**المنصة الرسمية لكتاب «عيشي كأنثى» — بدور لطفي**

---

## 📑 فهرس المحتويات
1. [الجزء الأول: كيف تحمي الكتاب من لقطات الشاشة والقرصنة (Anti-Screenshot Defense)](#-الجزء-الأول-كيف-تحمي-الكتاب-من-لقطات-الشاشة-والقرصنة)
   - [الحقيقة التقنية الصادقة للمتصفحات (The Technical Reality)](#1-الحقيقة-التقنية-الصادقة-للمتصفحات)
   - [طبقات الحماية المطبقة في الموقع (Defense-in-Depth Architecture)](#2-طبقات-الحماية-المطبقة-في-الموقع)
   - [إضافة درع التعتيم اللحظي عند فتح برامج التصوير (Window Blur Shield)](#3-إضافة-درع-التعتيم-اللحظي-عند-فتح-برامج-التصوير)
   - [مقارنة مع حماية التطبيقات (Web vs Native Mobile App DRM)](#4-مقارنة-مع-حماية-التطبيقات-flag_secure)
2. [الجزء الثاني: نظام إدارة وتوليد حسابات القارئات (Account Access Manager)](#-الجزء-الثاني-نظام-إدارة-وتوليد-حسابات-القارئات-account-access-manager)
   - [الطريقة 1: أداة سطر الأوامر الفورية (CLI Generator)](#الطريقة-1-أداة-سطر-الأوامر-الفورية-create-readerjs)
   - [الطريقة 2: لوحة التحكم المباشرة في الموقع (Web Admin Dashboard)](#الطريقة-2-لوحة-التحكم-المباشرة-في-الموقع-admin)
   - [الطريقة 3: الإرسال الآلي لكلمة المرور عبر الإيميل (Automated Email Dispatch)](#الطريقة-3-الإرسال-الآلي-لكلمة-المرور-عبر-الإيميل)

---

# 🛡️ الجزء الأول: كيف تحمي الكتاب من لقطات الشاشة والقرصنة

### 1. الحقيقة التقنية الصادقة للمتصفحات
تعمل متصفحات الويب (Chrome, Safari, Edge) داخل بيئة معزولة (Sandbox) خاضعة لنظام التشغيل (Windows, macOS, iOS, Android). 
* **لا يمكن لأي كود جافاسكريبت في العالم** أن يمنع نظام التشغيل من التقاط لقطة شاشة خارجية (مثل زر `PrtScn`، أداة `Snipping Tool`، أو تصوير شاشة اللابتوب بكاميرا هاتف خارجي).
* حتى كبرى منصات المحتوى العالمية مثل **Amazon Kindle و Chegg و O'Reilly** تعتمد استراتيجية تسمى:
> **«الردع الجنائي متعدد الطبقات (Forensic Traceability & Defense-in-Depth)»**  
> وهي جعل تسريب الكتاب مخاطرة قانونية مباشرة للقارئة، مع تعطيل 95% من سبل النسخ الرقمي السهل.

---

### 2. طبقات الحماية المطبقة في موقع «عيشي كأنثى»

#### الطبقة 1: الرسم المباشر على الكانفاس (HTML5 Canvas Rendering)
* **لا يوجد ملف PDF** متاح للتحميل أو التنزيل في المتصفح.
* لا تُستخدم وسوم صور عادية `<img>` يمكن الضغط عليها بزر الفأرة الأيمن واختيار "حفظ الصورة باسم".
* يتم رسم كل صفحة كبكسلات ثنائية الأبعاد مباشرة داخل معالج الرسوميات، مما يلغي تماماً أدوات فحص العناصر (Inspect Element).

#### الطبقة 2: الواترمارك الجنائي المدمج في البكسلات (Forensic Watermark Burning)
* يقوم ملف `Watermark.js` بدمج بيانات القارئة مباشرة داخل بكسلات كل صفحة:
  * **البريد الإلكتروني للقارئة** (مكرر بنمط مائل خافت عبر أرجاء الصفحة).
  * **بصمة الجهاز الرقمية (Device Fingerprint)**.
  * **توقيت وتاريخ القراءة بدقة الثواني**.
* **النتيجة**: إذا قامت أي قارئة بتصوير الشاشة بهاتفها أو ببرنامج خارجي، ستكون بياناتها وهويتها مطبوعة في خلفية النص القرآني والأدبي للكتاب، مما يعرضها للمساءلة القانونية الفورية ويمنع تداول الصفحة في مجموعات تيليجرام أو واتساب.

#### الطبقة 3: تذاكر الصفحات اللحظية (Signed Short-Lived Page Tickets)
* لا يمكن سحب صور الكتاب دفعة واحدة عبر روابط مباشرة.
* لطلب أي صفحة، يُصدر الخادم تصريحاً رقمياً موقعاً بتشفير HMAC بصلاحية **60-90 ثانية فقط**، مقترن بمعرف القارئة وبصمة متصفحها.

#### الطبقة 4: قفل الجهاز المعتمد (Device-Lock Protection)
* يقترن حساب القارئة تلقائياً بأول جهاز تسجل منه الدخول.
* إذا أعطت القارئة حسابها لصديقتها، يُغلق المتصفح ويظهر تنبيه أمني:  
  *«هذا الحساب مقترن بجهاز قراءة آخر بموجب نظام حماية حقوق الملكية»*.

#### الطبقة 5: حجب الطباعة التام (Print Blackout)
* مفعل في ملف `index.css`:
  ```css
  @media print {
    body { display: none !important; }
  }
  ```
  عند ضغط `Ctrl + P` لتحويل الصفحة إلى PDF مطبوع، تتحول الصفحة لورقة فارغة سوداء تماماً مع تنبيه حظر الطباعة.

---

### 3. إضافة درع التعتيم اللحظي عند فتح برامج التصوير (Window Blur Shield)

لإحباط محاولات تصوير الشاشة عبر أدوات مثل `Snipping Tool` أو `Lightshot` أو اختصار `Win + Shift + S`:  
عندما تفتح القارئة أداة قص الشاشة، يفقد المتصفح تركيزه فوراً (`window.onblur`). يمكن تعتيم محتوى الكتاب لحظياً بإضافة هذا الكود:

```javascript
// يوضع داخل useEffect في صفحة Reader.jsx
useEffect(() => {
  const handleBlur = () => {
    // تعتيم الكانفاس فور خروج المؤشر أو فتح أداة لقطة الشاشة
    const canvas = document.querySelector('.book-canvas');
    if (canvas) canvas.style.filter = 'blur(25px)';
  };

  const handleFocus = () => {
    // إعادة وضوح الصفحة بمجرد عودة القارئة للمتصفح
    const canvas = document.querySelector('.book-canvas');
    if (canvas) canvas.style.filter = 'none';
  };

  window.addEventListener('blur', handleBlur);
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) handleBlur();
    else handleFocus();
  });

  return () => {
    window.removeEventListener('blur', handleBlur);
    window.removeEventListener('focus', handleFocus);
  };
}, []);
```

---

### 4. مقارنة مع حماية التطبيقات (`FLAG_SECURE`)
إذا أردت مستقبلاً منع لقطات الشاشة بنسبة **100% برمجياً من داخل نظام التشغيل**:
* على نظام Android / iOS: تتيح التطبيقات الأصلية (Flutter / React Native) تفعيل خاصية:
  ```java
  // في تطبيقات أندرويد
  getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
  ```
  هذا الأمر يمنع أندرويد نهائياً من التقاط لقطة شاشة، وتظهر الصورة سوداء تماماً حتى لو ضغط المستخدم أزرار الهاتف.
* **الحل لموقعك الحالي**: يمكنك تحويل الموقع إلى تطبيق **PWA (Progressive Web App)** أو حزمه عبر **Capacitor / Tauri** كبرنامج للجوال والكمبيوتر بتكلفة صفرية مع تفعيل `FLAG_SECURE`.

---

# 🔑 الجزء الثاني: نظام إدارة وتوليد حسابات القارئات (Account Access Manager)

لقد تم بناء نظام مرن يسمح لك بإدخال بريد القارئة فقط، ليقوم النظام آلياً بـ:
1. توليد كلمة مرور عشوائية وقوية وغير قابلة للتخمين.
2. تشفير كلمة المرور بـ `bcrypt`.
3. إنشاء اسم مستخدم فريد من بريدها.
4. إخراج رسالة ترحيبية جاهزة للنسخ بنقرة زر واحدة لإرسالها للقارئة عبر الواتساب أو الإيميل.

---

### الطريقة 1: أداة سطر الأوامر الفورية (`create-reader.js`)
تم إنشاء سكربت مخصص داخل مجلد المشروع:  
[backend/src/scripts/create-reader.js](file:///c:/Users/yassein%20ahmed/OneDrive/Desktop/kal%20ontha/backend/src/scripts/create-reader.js)

#### الاستخدام على السيرفر:
ادخل على مجلد الباك إند ونفّذ الأمر متبوعاً بإيميل القارئة واسمها:

```bash
cd ~/Kal-ontha-Book/backend
node src/scripts/create-reader.js fatima@gmail.com "فاطمة محمد"
```

#### النتيجة الفورية في الترمنال:
```text
✅ تم إنشاء حساب قارئة جديد بنجاح!
====================================================
     تفاصيل حساب القارئة — كتاب «عيشي كأنثى»        
====================================================
👤 الاسم:           فاطمة محمد
📧 البريد:          fatima@gmail.com
🆔 اسم المستخدم:    fatima
🔑 كلمة المرور:     K-Q7u4j2a$
====================================================

📩 رسالة الترحيب الجاهزة للإرسال للقارئة عبر الواتساب أو الإيميل:

----------------------------------------------------
أهلاً بكِ في كتاب «عيشي كأنثى» للمستشارة بدور لطفي ✨
تم تفعيل ترخيص قراءتكِ الرقمي الخاص بنجاح:

🔗 رابط القارئ:  http://172.26.15.227/login
📧 البريد:       fatima@gmail.com
🔑 كلمة المرور:  K-Q7u4j2a$

📌 ملاحظة هامة:
الحساب مقترن بنظام حماية رقمي يربط الحساب بأول جهاز (هاتف أو لابتوب) تسجلين الدخول منه.
قراءة ممتعة وملهمة لكِ! 📖✨
----------------------------------------------------
```
*ما عليك سوى نسخ الرسالة وإرسالها للقارئة مباشرة!*

---

### الطريقة 2: لوحة التحكم المباشرة في الموقع (`/admin`)

يمكنك القيام بذلك من أي جهاز محمول أو لابتوب دون فتح الترمنال:
1. افتح الموقع وسجل الدخول بحسابك:  
   `yasssokamel@gmail.com` / `Yassein123#`
2. اضغط على القائمة واختر **«إدارة القارئات»** (أو توجه إلى الرابط `http://<IP>/admin`).
3. ستجد نموذج **«إضافة قارئة جديدة»**:
   * اكتب **الاسم** و **البريد الإلكتروني**.
   * اضغط على زر **«توليد كلمة مرور عشوائية»** (أيقونة المفتاح الذهبي) ليولد كلمة مرور آمنة فوراً.
   * اضغط **«إصدار ترخيص القراءة»**.
4. يظهر لك كرت أخضر جميل به زر **«نسخ بيانات الدخول»** لنسخ الرسالة الجاهزة للواتساب بضغطة واحدة!

---

### الطريقة 3: الإرسال الآلي لكلمة المرور عبر الإيميل (Automated Email Dispatch)

إذا أردت أن يقوم السيرفر بإرسال كلمة المرور إلى إيميل القارئة تلقائياً بمجرد إدخال بريدها (عبر خدمة مثل **Resend** أو **SendGrid** أو بريد Gmail SMTP):

#### تثبيت مكتبة Nodemailer:
```bash
npm --prefix backend install nodemailer
```

#### كود الإرسال الآلي في Node.js:
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password', // كلمة مرور التطبيقات من جوجل
  },
});

export async function sendWelcomeCredentialsEmail(readerEmail, readerName, password) {
  const mailOptions = {
    from: '"بدور لطفي — كتاب كأنثى" <your-email@gmail.com>',
    to: readerEmail,
    subject: '✨ تفعيل حساب القراءة الخاص بكِ — كتاب «عيشي كأنثى»',
    html: `
      <div dir="rtl" style="font-family: 'Cairo', Tahoma, sans-serif; background: #0C0D11; color: #FAF7F2; padding: 2.5rem; border-radius: 12px; max-width: 580px; margin: auto; border: 1px solid #D4AF37;">
        <h2 style="color: #D4AF37; text-align: center;">كتاب «عيشي كأنثى»</h2>
        <p style="font-size: 16px;">مرحباً بكِ عزيزتي <strong>${readerName}</strong>،</p>
        <p style="line-height: 1.8; color: #D1C9BE;">تم تفعيل ترخيصكِ الخاص لتصفح كتاب «عيشي كأنثى» عبر القارئ الرقمي المحمي.</p>
        
        <div style="background: rgba(255,255,255,0.06); padding: 1.25rem; border-radius: 8px; margin: 1.5rem 0; border-right: 4px solid #D4AF37;">
          <p style="margin: 6px 0;">📧 <strong>البريد الإلكتروني:</strong> ${readerEmail}</p>
          <p style="margin: 6px 0;">🔑 <strong>كلمة المرور المؤقتة:</strong> <span style="color: #F3E5AB; font-family: monospace; font-size: 18px;">${password}</span></p>
        </div>

        <div style="text-align: center; margin-top: 2rem;">
          <a href="http://172.26.15.227/login" style="background: #D4AF37; color: #111; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">الدخول إلى القارئ الرقمي</a>
        </div>

        <p style="font-size: 12px; color: #8E887E; margin-top: 2.5rem; text-align: center;">
          * تنبيه أمني: حسابك مقترن بأول جهاز تسجلين منه الدخول، والصفحات محمية بواترمارك رقمي خاص بكِ.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✉️ تم إرسال بيانات الدخول آلياً إلى: ${readerEmail}`);
}
```

---

## 📌 ملخص التوصيات التنفيذية
1. **لحماية لقطات الشاشة**: الواترمارك الجنائي المدمج هو السلاح الأقوى في عالم الويب لأنه يجعل الناشر معروفاً بالاسم والتوقيت، مما يمنع النشر العام.
2. **لإضافة القارئات**: استخدم سطر الأوامر `node src/scripts/create-reader.js <email>` للحصول على رسالة واتساب جاهزة مع كلمة سر مولدة في ثانية واحدة.
