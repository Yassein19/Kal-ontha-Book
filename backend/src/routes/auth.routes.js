import { Router } from 'express';
import { login, me, resetDeviceLock } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, me);
router.post('/reset-device-lock', authenticate, resetDeviceLock);

export default router;
