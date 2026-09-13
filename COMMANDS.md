# دليل أوامر تشغيل وإدارة سيرفر كتاب «عيشي كأنثى»
### AWS Lightsail & EC2 Server Management & Deployment Cheat Sheet

يحتوي هذا المستند على جميع أوامر سطر الأوامر (Terminal Commands) المستخدمة لإعداد السيرفر، بناء الواجهة، تشغيل الباك إند، توجيه المنافذ، وتحديث المنصة وإضافة القارئات.

---

## 📑 فهرس الأوامر السريع (Table of Contents)
1. [التشغيل الأولي وبناء المشروع (Initial Setup & Build)](#1-التشغيل-الأولي-وبناء-المشروع-initial-setup--build)
2. [إدارة الخادم الخلفي عبر PM2 (Backend Process Management)](#2-إدارة-الخادم-الخلفي-عبر-pm2-backend-process-management)
3. [توجيه المنفذ 80 للتشغيل المباشر عبر الـ IP (Port 80 Redirection)](#3-توجيه-المنفذ-80-للتشغيل-المباشر-عبر-الـ-ip-port-80-redirection)
4. [تحديث السيرفر بالكود الجديد (Update Server from GitHub)](#4-تحديث-السيرفر-بالكود-الجديد-update-server-from-github)
5. [إدارة القارئات وقاعدة البيانات (Reader & DB Management)](#5-إدارة-القارئات-وقاعدة-البيانات-reader--db-management)
6. [أوامر الصيانة والمراقبة المفيدة (Useful Maintenance Commands)](#6-أوامر-الصيانة-والمراقبة-المفيدة-useful-maintenance-commands)

---

## 1. التشغيل الأولي وبناء المشروع (Initial Setup & Build)

### استنساخ المستودع من GitHub:
```bash
cd ~
git clone https://github.com/Yassein19/Kal-ontha-Book.git
cd Kal-ontha-Book
```

### تثبيت وبناء الواجهة (Frontend - React & Vite):
```bash
cd ~/Kal-ontha-Book/frontend
npm install
npm run build
```

### تجهيز الباك إند وقاعدة البيانات (Backend & SQLite Seed):
```bash
cd ~/Kal-ontha-Book/backend
npm install
npm run seed
```

---

## 2. إدارة الخادم الخلفي عبر PM2 (Backend Process Management)

### حذف أي عمليات قديمة وتشغيل الخادم:
```bash
cd ~/Kal-ontha-Book/backend
pm2 delete all
pm2 start src/server.js --name kal-ontha
pm2 save
```

### إعادة تشغيل السيرفر بعد أي تعديل:
```bash
pm2 restart kal-ontha
```

### فحص سجلات الخادم اللحظية (Logs):
```bash
# عرض آخر 30 سطر من السجلات
pm2 logs kal-ontha --lines 30 --nostream

# متابعة السجلات بشكل مباشر مستمر
pm2 logs kal-ontha
```

### فحص حالة السيرفر واستهلاك الذاكرة:
```bash
pm2 status
```

### اختبار عمل الخادم محلياً:
```bash
curl -I http://localhost:5000
```
*(يجب أن تظهر نتيجة: `HTTP/1.1 200 OK`)*

---

## 3. توجيه المنفذ 80 للتشغيل المباشر عبر الـ IP (Port 80 Redirection)

لتشغيل الموقع بمجرد كتابة عنوان الآي بي فقط `http://<IP>` دون الحاجة لكتابة المنفذ `:5000`:

```bash
# 1. إيقاف أي سيرفر افتراضي قديم يشغل المنفذ 80
sudo systemctl stop apache2 2>/dev/null || true
sudo systemctl disable apache2 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true
sudo systemctl disable nginx 2>/dev/null || true
if [ -f /opt/bitnami/ctlscript.sh ]; then
    sudo /opt/bitnami/ctlscript.sh stop apache 2>/dev/null || true
fi

# 2. توجيه حركة المرور من المنفذ 80 إلى 5000 عبر iptables
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 5000
sudo iptables -t nat -I OUTPUT -p tcp -d 127.0.0.1 --dport 80 -j REDIRECT --to-ports 5000

# 3. حفظ إعدادات التوجيه لتستمر حتى بعد إعادة تشغيل السيرفر (Persistent)
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y iptables-persistent
sudo netfilter-persistent save

# 4. اختبار عمل الموقع على المنفذ 80
curl -I http://localhost
```

---

## 4. تحديث السيرفر بالكود الجديد (Update Server from GitHub)

عند دفع أي تعديلات جديدة إلى GitHub (سواء للتصميم، القارئ، أو النصوص)، نفذ هذا الأمر الشامل لتطبيق التحديث على الخادم في دقيقة واحدة:

```bash
cd ~/Kal-ontha-Book
git pull origin main
cd frontend && npm run build
cd ../backend
pm2 restart all
```

---

## 5. إدارة القارئات وقاعدة البيانات (Reader & DB Management)

### إضافة أو تحديث حساب قارئة فورياً عبر السكربت:
```bash
cd ~/Kal-ontha-Book/backend
node src/db/add-reader.js
```

### إعادة تهيئة قاعدة البيانات بالكامل بالحسابات الافتراضية:
```bash
cd ~/Kal-ontha-Book/backend
npm run seed
```

### بيانات الحسابات المعتمدة الافتراضية:
| الحساب | البريد الإلكتروني | كلمة المرور | الدور |
|---|---|---|---|
| **المدير العام (Admin)** | `yasssokamel@gmail.com` | `Yassein123#` | إدارة القارئات والتحكم الكامل |
| **المؤلفة (Author)** | `bedour.lotfi77@gmail.com` | `password123` | حساب الكاتبة بدور لطفي |
| **قارئة 1** | `reader@kal-ontha.com` | `read2026` | قارئة معتمدة (مريم أحمد) |
| **قارئة 2** | `zainabmahmoud290@gmail.com` | `zainab123` | قارئة معتمدة (زينب محمود) |

---

## 6. أوامر الصيانة والمراقبة المفيدة (Useful Maintenance Commands)

### جعل PM2 يعمل تلقائياً عند إعادة تشغيل السيرفر (Auto-Start on Reboot):
```bash
pm2 startup
# (انسخ الأمر الذي يطبعه الترمنال ونفذه بصلاحيات sudo)
pm2 save
```

### التحقق من المنافذ المفتوحة والشغالة:
```bash
sudo ss -tulpn | grep -E ':(80|5000)'
```

### إعادة تشغيل السيرفر بالكامل (Reboot):
```bash
sudo reboot
```

### مراقبة أداء السيرفر في الزمن الفعلي (Dashboard):
```bash
pm2 monit
```
