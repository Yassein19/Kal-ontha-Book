import { Router } from 'express';
import { submitContact, listMessages } from '../controllers/contact.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public contact submission (rate-limited)
router.post('/', contactRateLimiter, submitContact);

// Admin-only: view messages
router.get('/', authenticate, requireAdmin, listMessages);

export default router;
