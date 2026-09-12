import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'kal_ontha_secure_jwt_secret_2026_bedour_lotfi';
const STORAGE_DIR = path.join(__dirname, '../../storage/pages');

/**
 * Generates a short-lived signed page token (valid for 60 seconds)
 * ensuring only the authenticated reader can request this single page.
 */
export function generateSignedPageToken(userId, bookId, pageNumber, deviceToken) {
  return jwt.sign(
    {
      sub: userId,
      bookId,
      pageNumber,
      deviceToken,
    },
    JWT_SECRET,
    { expiresIn: '90s' }
  );
}

/**
 * Verifies the short-lived signed page token
 */
export function verifySignedPageToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Reads the page image from private storage
 */
export function getPageFile(imageKey) {
  const filePath = path.join(STORAGE_DIR, imageKey);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return {
    path: filePath,
    stream: fs.createReadStream(filePath),
    contentType: imageKey.endsWith('.svg')
      ? 'image/svg+xml'
      : imageKey.endsWith('.webp')
      ? 'image/webp'
      : imageKey.endsWith('.jpeg') || imageKey.endsWith('.jpg')
      ? 'image/jpeg'
      : 'image/png',
  };
}

export default {
  generateSignedPageToken,
  verifySignedPageToken,
  getPageFile,
};
