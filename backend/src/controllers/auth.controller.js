import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryOne, execute } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kal_ontha_secure_jwt_secret_2026_bedour_lotfi';

export async function login(req, res) {
  try {
    const { email, password, deviceToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
      });
    }

    const user = queryOne('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (!user) {
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      });
    }

    const incomingDeviceToken = deviceToken || 'web_browser_default_token';

    // Device lock check & bind (Admins and Authors are exempt)
    if (user.role === 'admin' || user.role === 'author') {
      user.device_token = incomingDeviceToken;
    } else if (!user.is_locked || !user.device_token) {
      // First login: Lock account to this specific device
      execute('UPDATE users SET device_token = ?, is_locked = 1 WHERE id = ?', [
        incomingDeviceToken,
        user.id,
      ]);
      user.device_token = incomingDeviceToken;
      user.is_locked = 1;
    } else if (user.device_token !== incomingDeviceToken) {
      // Access from unauthorized device
      return res.status(403).json({
        error: 'DEVICE_LOCKED',
        message:
          'الحساب مقترن بجهاز قراءة آخر بموجب نظام حماية حقوق الملكية. لا يمكن استخدام الحساب إلا من الجهاز المعتمد الأول. للتغيير تواصل مع الإدارة.',
        lockedDeviceHint: user.device_token ? user.device_token.slice(0, 8) + '...' : null,
      });
    }

    // Generate JWT token (expires in 24 hours)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        deviceToken: user.device_token,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isLocked: !!user.is_locked,
        deviceToken: user.device_token,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'حدث خطأ أثناء تسجيل الدخول.' });
  }
}

export function me(req, res) {
  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      isLocked: !!req.user.is_locked,
      deviceToken: req.user.device_token,
    },
  });
}

export function resetDeviceLock(req, res) {
  try {
    const rawId = req.params?.userId || req.body?.userId || req.user?.id;
    const targetUserId = parseInt(rawId, 10);
    execute('UPDATE users SET device_token = NULL, is_locked = 0 WHERE id = ?', [targetUserId]);

    return res.json({
      success: true,
      message: 'تم فك قفل الجهاز بنجاح. سيتم قفل الحساب على أول جهاز يتم تسجيل الدخول منه.',
    });
  } catch (err) {
    console.error('Reset lock error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'تعذر فك القفل.' });
  }
}

export default {
  login,
  me,
  resetDeviceLock,
};
