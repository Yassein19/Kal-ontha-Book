# دليل النشر العالمي المباشر — كتاب «عيشي كأنثى» (Global Deployment Guide)

يوضح هذا الدليل كيفية نشر المنصة عالمياً لتكون متاحة أونلاين لجميع القارئات حول العالم بأعلى سرعة وأقل تكلفة (مجاناً أو بتكلفة شبه صفرية).

---

## 🌟 الخطة المعمارية للنشر العالمي

```
                  ┌─────────────────────────────────────┐
                  │      القارئة حول العالم (Visitor)     │
                  └──────────────────┬──────────────────┘
                                     │ HTTPS
                 ┌───────────────────▼───────────────────┐
                 │    شبكة التوزيع العالمية (Global CDN)     │
                 │    Cloudflare Pages أو Vercel         │
                 │   (توزيع فوري على 300+ مركز بيانات)     │
                 └───────────────────┬───────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           │                                                   │
┌──────────▼──────────┐                             ┌──────────▼──────────┐
│ واجهة الويب (Frontend)│                             │ الخادم الخلفي (API) │
│ - Cloudflare Pages  │                             │ - Render / Railway  │
│ - أو Vercel         │                             │ - أو Fly.io         │
│ - صفحات سريعة وثابتة │                             │ - مصادقة وقفل أجهزة  │
└─────────────────────┘                             │ - تشفير صفحات وتذاكر │
                                                    └─────────────────────┘
```

---

## 🚀 الخطوة 1: رفع المشروع إلى مستودع GitHub

قم بفتح منفذ الأوامر (Terminal) في مجلد المشروع ونفذ:

```bash
# إضافة كافة التعديلات والملفات
git add .

# إنشاء الـ Commit
git commit -m "feat: complete author platform, protected reader with 336 pages, and global deployment config"

# رفع الكود إلى GitHub
git push -u origin main
```

المستودع الخاص بك على GitHub هو:  
👉 `https://github.com/Yassein19/Kal-ontha-Book`

---

## ⚙️ الخطوة 2: نشر الخادم الخلفي (Backend) مجاناً على Render أو Railway

### عبر منصة Render (موصى بها ومجانية 100%):
1. اذهب إلى [render.com](https://render.com) وسجل الدخول باستخدام حسابك على GitHub.
2. اضغط على **New +** ثم اختر **Web Service**.
3. اختر مستودعك: `Yassein19/Kal-ontha-Book`.
4. أدخل الإعدادات التالية:
   - **Name**: `kal-ontha-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. اضغط **Create Web Service**.
6. بعد انتهاء النشر (دقيقة واحدة)، سيعطيك Render رابطاً مجانياً مشفراً مثل:  
   `https://kal-ontha-api.onrender.com`
   *(انسخ هذا الرابط لأننا سنربطه بالواجهة).*

---

## 🌐 الخطوة 3: نشر واجهة الموقع (Frontend) على Vercel أو Cloudflare Pages

### عبر منصة Vercel (الأسرع والأسهل):
1. اذهب إلى [vercel.com](https://vercel.com) وسجل الدخول بحساب GitHub.
2. اضغط **Add New...** ثم **Project**.
3. اختر مستودع `Yassein19/Kal-ontha-Book` واضغط **Import**.
4. في شاشة الإعدادات:
   - **Framework Preset**: `Vite`
   - **Root Directory**: اضغط **Edit** واختر مجلد `frontend`.
   - **Environment Variables**: أضف المتغير التالي:
     - **Name**: `VITE_API_URL`
     - **Value**: رابط الـ Backend متبوعاً بـ `/api` (مثال: `https://kal-ontha-api.onrender.com/api`)
5. اضغط **Deploy**.
6. مبارك! خلال 40 ثانية سيصبح موقعك متاحاً برابط رسمي فائق السرعة عالمياً، ومحمي بشهادة SSL مجانية.

---

## 🔒 الخطوة 4: ربط دومين خاص (Custom Domain) - اختياري
إذا كنت تملك نطاقاً خاصاً (مثل `kal-ontha.com`):
1. في لوحة تحكم Vercel أو Cloudflare، اذهب إلى قسم **Domains**.
2. اكتب الدومين الخاص بك، وسيعطيك سجلات DNS (مثل CNAME و A record).
3. أضف هذه السجلات في مزود الدومين الخاص بك (Namecheap, GoDaddy, Cloudflare)، وسيعمل الدومين تلقائياً مع تفعيل حماية HTTPS المشفرة مجاناً.
