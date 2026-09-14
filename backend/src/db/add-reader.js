import bcrypt from 'bcryptjs';
import { execute, queryOne } from './database.js';

async function addReader(email, username, name, password) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);

  // Check if exists
  const existing = queryOne('SELECT id, email FROM users WHERE LOWER(email) = ?', [cleanEmail]);
  if (existing) {
    execute(
      `UPDATE users 
       SET password_hash = ?, is_locked = 0, device_token = NULL, role = 'reader', name = ?
       WHERE id = ?`,
      [passwordHash, name, existing.id]
    );
    console.log(`✓ Updated existing reader account for: ${cleanEmail}`);
  } else {
    execute(
      `INSERT INTO users (email, username, name, password_hash, device_token, is_locked, role)
       VALUES (?, ?, ?, ?, NULL, 0, 'reader')`,
      [cleanEmail, cleanUsername, name, passwordHash]
    );
    console.log(`✓ Successfully created new reader account for: ${cleanEmail}`);
  }

  const user = queryOne('SELECT id, email, username, name, role FROM users WHERE LOWER(email) = ?', [cleanEmail]);
  console.log('Account Details:', user);
}

// CLI Arguments or defaults
const args = process.argv.slice(2);
const targetEmail = args[0] || 'ahmedelgamal1983@gmail.com';
const targetPassword = args[1] || 'Ahmed123#';
const targetName = args[2] || 'أحمد الجمل (قارئ معتمد)';
const targetUsername = args[3] || 'ahmedelgamal1983';

addReader(targetEmail, targetUsername, targetName, targetPassword).catch((err) => {
  console.error('Error adding reader:', err);
  process.exit(1);
});
