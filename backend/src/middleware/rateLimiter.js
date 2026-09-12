import rateLimit from 'express-rate-limit';

// Rate limiter for reader page requests - configured for fast scrolling while preventing malicious dumping
export const readerRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 1200, // Allows fast scrolling and rapid page flipping (up to 20 requests per sec)
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.role === 'admin', // Admins have completely unlimited access
  message: {
    error: 'TOO_MANY_REQUESTS',
    message:
      'تم تجاوز معدل التصفح الطبيعي. لأسباب أمنية لحماية حقوق الكتاب، يُرجى الانتظار قليلاً قبل تقليب المزيد من الصفحات.',
  },
});

// General API rate limiter for auth / contact
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10,
  message: {
    error: 'TOO_MANY_SUBMISSIONS',
    message: 'لقد قمت بإرسال عدة رسائل مؤخراً. يرجى الانتظار قليلاً قبل إرسال رسالة جديدة.',
  },
});
