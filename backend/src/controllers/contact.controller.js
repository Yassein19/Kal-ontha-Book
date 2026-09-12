import { execute, queryAll } from '../db/database.js';

export function submitContact(req, res) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: 'INVALID_EMAIL',
        message: 'يرجى إدخال بريد إلكتروني صحيح.',
      });
    }

    execute(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), message.trim()]
    );

    console.log(`[Contact Form] New message from ${name} (${email}): ${message.slice(0, 50)}...`);

    return res.json({
      success: true,
      message: 'شكرًا لتواصلكِ! تم استلام رسالتكِ بنجاح وستقوم الأستاذة بدور بالرد عليكِ في أقرب وقت.',
    });
  } catch (err) {
    console.error('submitContact error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقًا أو التواصل عبر البريد مباشرة.',
    });
  }
}

export function listMessages(req, res) {
  try {
    const messages = queryAll(
      'SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC'
    );
    return res.json({ messages });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'تعذر جلب الرسائل.' });
  }
}

export default {
  submitContact,
  listMessages,
};
