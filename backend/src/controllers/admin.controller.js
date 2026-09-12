import bcrypt from 'bcryptjs';
import { queryOne, queryAll, execute } from '../db/database.js';

// Regex validators
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;

/**
 * Create a new reader account (Admin only)
 */
export async function createReader(req, res) {
  try {
    const { name, email, username, password } = req.body;

    // 1. Validation - Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        error: 'INVALID_NAME',
        message: 'يرجى إدخال اسم القارئة بشكل صحيح (حرفين على الأقل).',
      });
    }

    // 2. Validation - Email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        error: 'INVALID_EMAIL',
        message: 'يرجى إدخال بريد إلكتروني صالح (مثال: reader@example.com).',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingEmail = queryOne('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingEmail) {
      return res.status(409).json({
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر.',
      });
    }

    // 3. Validation - Username
    if (!username || typeof username !== 'string' || !USERNAME_REGEX.test(username.trim())) {
      return res.status(400).json({
        error: 'INVALID_USERNAME',
        message: 'اسم المستخدم يجب أن يتكون من 3 إلى 30 حرفًا أو رقمًا إنجليزيًا بدون مسافات (يُسمح بـ _ و -).',
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check if username already exists
    const existingUsername = queryOne('SELECT id FROM users WHERE LOWER(username) = ?', [cleanUsername]);
    if (existingUsername) {
      return res.status(409).json({
        error: 'USERNAME_ALREADY_EXISTS',
        message: 'اسم المستخدم هذا مستخدم بالفعل، يرجى اختيار اسم مستخدم آخر.',
      });
    }

    // 4. Validation - Password
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        error: 'INVALID_PASSWORD',
        message: 'كلمة المرور يجب ألا تقل عن 6 أحرف.',
      });
    }

    // 5. Hash password and insert
    const passwordHash = await bcrypt.hash(password, 10);
    const trimmedName = name.trim();

    execute(
      `INSERT INTO users (email, username, name, password_hash, device_token, is_locked, role)
       VALUES (?, ?, ?, ?, NULL, 0, 'reader')`,
      [cleanEmail, cleanUsername, trimmedName, passwordHash]
    );

    const newReader = queryOne(
      'SELECT id, name, email, username, role, is_locked, created_at FROM users WHERE LOWER(email) = ?',
      [cleanEmail]
    );

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء حساب القارئة بنجاح.',
      reader: {
        id: newReader.id,
        name: newReader.name,
        email: newReader.email,
        username: newReader.username,
        role: newReader.role,
        isLocked: !!newReader.is_locked,
        createdAt: newReader.created_at,
      },
    });
  } catch (err) {
    console.error('createReader error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'حدث خطأ في الخادم أثناء إنشاء الحساب.',
    });
  }
}

/**
 * List all readers (Admin only)
 */
export function listReaders(req, res) {
  try {
    const readers = queryAll(
      `SELECT id, name, email, username, device_token, is_locked, role, created_at 
       FROM users 
       WHERE role = 'reader' 
       ORDER BY id DESC`
    );

    return res.json({
      success: true,
      count: readers.length,
      readers: readers.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        username: r.username,
        isLocked: !!r.is_locked,
        deviceToken: r.device_token,
        role: r.role,
        createdAt: r.created_at,
      })),
    });
  } catch (err) {
    console.error('listReaders error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'تعذر جلب قائمة القارئات.',
    });
  }
}

/**
 * Reset a reader's device lock (Admin only)
 */
export function resetReaderLock(req, res) {
  try {
    const readerId = parseInt(req.params.id, 10);
    if (isNaN(readerId)) {
      return res.status(400).json({ error: 'INVALID_ID', message: 'معرف القارئة غير صحيح.' });
    }

    const reader = queryOne("SELECT id, name, email FROM users WHERE id = ? AND role = 'reader'", [readerId]);
    if (!reader) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'حساب القارئة غير موجود.' });
    }

    execute('UPDATE users SET device_token = NULL, is_locked = 0 WHERE id = ?', [readerId]);

    return res.json({
      success: true,
      message: `تم فك قفل الجهاز للقارئة (${reader.name}) بنجاح. ستتمكن من تسجيل الدخول من جهاز جديد.`,
    });
  } catch (err) {
    console.error('resetReaderLock error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'تعذر فك قفل الجهاز.',
    });
  }
}

/**
 * Delete a reader account (Admin only)
 */
export function deleteReader(req, res) {
  try {
    const readerId = parseInt(req.params.id, 10);
    if (isNaN(readerId)) {
      return res.status(400).json({ error: 'INVALID_ID', message: 'معرف القارئة غير صحيح.' });
    }

    const reader = queryOne('SELECT id, name, email, role FROM users WHERE id = ?', [readerId]);
    if (!reader) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'الحساب غير موجود.' });
    }

    // Safety: ensure only readers can be deleted via this endpoint
    if (reader.role !== 'reader') {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'لا يمكن حذف حسابات المشرفين أو المؤلفة من هذا المسار.',
      });
    }

    execute('DELETE FROM users WHERE id = ?', [readerId]);

    return res.json({
      success: true,
      message: `تم حذف حساب القارئة (${reader.name}) بنجاح.`,
    });
  } catch (err) {
    console.error('deleteReader error:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'تعذر حذف الحساب.',
    });
  }
}

export default {
  createReader,
  listReaders,
  resetReaderLock,
  deleteReader,
};
