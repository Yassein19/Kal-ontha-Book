import jwt from 'jsonwebtoken';
import { queryOne } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kal_ontha_secure_jwt_secret_2026_bedour_lotfi';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'تسجيل الدخول مطلوب للوصول إلى هذا المحتوى.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = queryOne(
      'SELECT id, email, name, device_token, is_locked, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        error: 'USER_NOT_FOUND',
        message: 'المستخدم غير موجود.',
      });
    }

    // Check device lock (readers only, admins and authors are exempt)
    const clientDeviceToken = req.headers['x-device-token'] || decoded.deviceToken;
    if (user.role !== 'admin' && user.role !== 'author' && user.is_locked && user.device_token && user.device_token !== clientDeviceToken) {
      return res.status(403).json({
        error: 'DEVICE_MISMATCH',
        message:
          'هذا الحساب مقترن بجهاز قراءة آخر بموجب نظام حماية حقوق الملكية. يُرجى التواصل مع الإدارة في حال تغيير الجهاز.',
      });
    }

    req.user = user;
    req.deviceToken = clientDeviceToken;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجددًا.',
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'author')) {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'هذا الإجراء يتطلب صلاحيات المشرف أو الكاتبة.',
    });
  }
  next();
}

export default {
  authenticate,
  requireAdmin,
};
