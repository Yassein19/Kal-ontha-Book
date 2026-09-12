import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import readerRoutes from './routes/reader.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

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

// 404 Handler
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
