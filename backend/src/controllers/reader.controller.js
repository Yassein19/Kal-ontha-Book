import { queryOne, queryAll } from '../db/database.js';
import {
  generateSignedPageToken,
  verifySignedPageToken,
  getPageFile,
} from '../services/storage.service.js';

export function getBookMeta(req, res) {
  try {
    const bookId = parseInt(req.params.bookId || '1', 10);
    const book = queryOne('SELECT * FROM books WHERE id = ?', [bookId]);

    if (!book) {
      return res.status(404).json({ error: 'BOOK_NOT_FOUND', message: 'الكتاب غير موجود.' });
    }

    const pages = queryAll(
      'SELECT page_number FROM book_pages WHERE book_id = ? ORDER BY page_number ASC',
      [bookId]
    );

    return res.json({
      book: {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle,
        author: book.author,
        description: book.description,
        totalPages: book.total_pages,
        availablePages: pages.map((p) => p.page_number),
      },
    });
  } catch (err) {
    console.error('getBookMeta error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'فشل تحميل بيانات الكتاب.' });
  }
}

/**
 * Step 1: Reader requests access to a specific page
 * Returns a short-lived signed token valid for 90 seconds
 */
export function getPageTicket(req, res) {
  try {
    const bookId = parseInt(req.params.bookId, 10);
    const pageNumber = parseInt(req.params.pageNumber, 10);

    const page = queryOne(
      'SELECT * FROM book_pages WHERE book_id = ? AND page_number = ?',
      [bookId, pageNumber]
    );

    if (!page) {
      return res.status(404).json({ error: 'PAGE_NOT_FOUND', message: 'الصفحة غير موجودة.' });
    }

    const signedToken = generateSignedPageToken(
      req.user.id,
      bookId,
      pageNumber,
      req.user.device_token
    );

    return res.json({
      bookId,
      pageNumber,
      signedToken,
      streamUrl: `/api/reader/stream/${bookId}/${pageNumber}?token=${encodeURIComponent(
        signedToken
      )}`,
      readerEmail: req.user.email,
      watermarkText: `${req.user.email} • ID:${req.user.id}`,
    });
  } catch (err) {
    console.error('getPageTicket error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'فشل إصدار تصريح الصفحة.' });
  }
}

/**
 * Step 2: Streams the single rendered page image directly to reader canvas
 * Locked with strict anti-caching and short-lived signed token check
 */
export function streamPage(req, res) {
  try {
    const bookId = parseInt(req.params.bookId, 10);
    const pageNumber = parseInt(req.params.pageNumber, 10);
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ error: 'MISSING_TICKET', message: 'تصريح الصفحة مفقود.' });
    }

    const payload = verifySignedPageToken(token);
    if (!payload || payload.bookId !== bookId || payload.pageNumber !== pageNumber) {
      return res.status(403).json({
        error: 'INVALID_OR_EXPIRED_TICKET',
        message: 'انتهت صلاحية تصريح قراءة هذه الصفحة. يتم التحديث تلقائيًا.',
      });
    }

    const page = queryOne(
      'SELECT image_key FROM book_pages WHERE book_id = ? AND page_number = ?',
      [bookId, pageNumber]
    );

    if (!page) {
      return res.status(404).json({ error: 'PAGE_NOT_FOUND', message: 'الصفحة غير موجودة.' });
    }

    const fileData = getPageFile(page.image_key);
    if (!fileData) {
      return res.status(404).json({ error: 'IMAGE_NOT_FOUND', message: 'ملف الصفحة غير متوفر.' });
    }

    // Security Headers to prevent caching, downloading, or framing
    res.setHeader('Content-Type', fileData.contentType);
    res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline');

    fileData.stream.pipe(res);
  } catch (err) {
    console.error('streamPage error:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'فشل عرض الصفحة.' });
  }
}

/**
 * Public book cover endpoint
 */
export function getBookCover(req, res) {
  try {
    const fileData = getPageFile('cover.jpeg') || getPageFile('page_1.png') || getPageFile('page_1.svg');
    if (!fileData) {
      return res.status(404).send('Cover not found');
    }
    res.setHeader('Content-Type', fileData.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    fileData.stream.pipe(res);
  } catch (err) {
    res.status(500).send('Error loading cover');
  }
}

export default {
  getBookMeta,
  getPageTicket,
  streamPage,
  getBookCover,
};
