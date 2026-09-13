import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.routes.js';
import readerRoutes from './routes/reader.routes.js';
import contactRoutes from './routes/contact.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Cross-Origin Configuration
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-device-token'],
  })
);

app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Kal Ontha Backend API',
    author: 'بدور لطفي (Bedour Lotfi)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/reader', readerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend SPA build if available (Production / Docker / Unified Host)
const publicPath = path.join(__dirname, '../public');
const distPath = path.join(__dirname, '../../frontend/dist');
const staticPath = fs.existsSync(publicPath) ? publicPath : (fs.existsSync(distPath) ? distPath : null);

if (staticPath) {
  app.use(express.static(staticPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// 404 Handler for API
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'المسار المطلوب غير موجود.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'حدث خطأ غير متوقع في الخادم.' });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  كأنثى — Kal Ontha Backend Server      `);
  console.log(`  Author: بدور لطفي (Bedour Lotfi)      `);
  console.log(`  Running on: http://localhost:${PORT}   `);
  console.log(`=========================================`);
});
