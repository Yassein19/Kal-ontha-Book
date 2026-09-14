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

    // 1. Validation - Email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        error: 'INVALID_EMAIL',
        message: 'يرجى إدخال بريد إلكتروني صالح (مثال: reader@example.com).',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Validation - Password
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        error: 'INVALID_PASSWORD',
        message: 'كلمة المرور يجب ألا تقل عن 6 أحرف.',
      });
    }

    // 3. Resolve Username (auto-derive if not provided or invalid)
    let cleanUsername = (username && typeof username === 'string' && USERNAME_REGEX.test(username.trim()))
      ? username.trim().toLowerCase()
      : cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30).toLowerCase();

    if (cleanUsername.length < 3) {
      cleanUsername = `user_${cleanUsername}_${Date.now().toString().slice(-4)}`;
    }

    // 4. Resolve Name (auto-derive friendly name if not provided)
    const cleanName = (name && typeof name === 'string' && name.trim().length >= 2)
      ? name.trim()
      : `قارئ معتمد (${cleanUsername})`;

    const passwordHash = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingUser = queryOne('SELECT id, name, username, role, is_locked FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingUser) {
      if (existingUser.role === 'reader') {
        // Safe update for existing reader
        execute(
          `UPDATE users 
           SET password_hash = ?, is_locked = 0, device_token = NULL, name = ?, username = ?
           WHERE id = ?`,
          [passwordHash, cleanName, cleanUsername, existingUser.id]
        );

        const updated = queryOne(
          'SELECT id, name, email, username, role, is_locked, created_at FROM users WHERE id = ?',
          [existingUser.id]
        );

        return res.status(200).json({
          success: true,
          message: `تم تحديث حساب القارئ (${updated.name}) وفك قفل جهازه بنجاح.`,
          reader: {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            username: updated.username,
            role: updated.role,
            isLocked: !!updated.is_locked,
            createdAt: updated.created_at,
          },
        });
      }

      return res.status(409).json({
        error: 'EMAIL_ALREADY_EXISTS',
        message: 'هذا البريد الإلكتروني مسجل بالفعل لمستخدم بحساب إدارة أو مؤلفة.',
      });
    }

    // Check username collision for new user
    let finalUsername = cleanUsername;
    let collisionCounter = 1;
    while (queryOne('SELECT id FROM users WHERE LOWER(username) = ?', [finalUsername.toLowerCase()])) {
      finalUsername = `${cleanUsername}_${collisionCounter++}`;
    }

    // 5. Insert new reader
    execute(
      `INSERT INTO users (email, username, name, password_hash, device_token, is_locked, role)
       VALUES (?, ?, ?, ?, NULL, 0, 'reader')`,
      [cleanEmail, finalUsername, cleanName, passwordHash]
    );

    const newReader = queryOne(
      'SELECT id, name, email, username, role, is_locked, created_at FROM users WHERE LOWER(email) = ?',
      [cleanEmail]
    );

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء حساب القارئ وتفعيله بنجاح.',
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
