import { Router } from 'express';
import {
  getBookMeta,
  getPageTicket,
  streamPage,
  getBookCover,
} from '../controllers/reader.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { readerRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public: Book metadata & Cover
router.get('/book/:bookId/meta', getBookMeta);
router.get('/cover/:bookId', getBookCover);

// Protected: Get single-page time-restricted ticket
router.get('/page-ticket/:bookId/:pageNumber', authenticate, readerRateLimiter, getPageTicket);

// Protected: Stream single page image directly to canvas (secured by signed ticket)
router.get('/stream/:bookId/:pageNumber', streamPage);

export default router;
