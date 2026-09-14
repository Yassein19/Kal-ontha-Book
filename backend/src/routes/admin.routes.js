import { Router } from 'express';
import {
  createReader,
  listReaders,
  resetReaderLock,
  deleteReader,
} from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Protect ALL admin routes for admin and author roles
router.use(authenticate, requireAdmin);

// Create a new reader account
router.post('/readers', createReader);

// List all readers
router.get('/readers', listReaders);

// Reset device lock for a specific reader
router.post('/readers/:id/reset-lock', resetReaderLock);

// Delete a reader account
router.delete('/readers/:id', deleteReader);

export default router;
