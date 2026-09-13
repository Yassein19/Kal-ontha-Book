#!/usr/bin/env node
/**
 * Quick Reader Provisioning CLI
 * 
 * Usage:
 *   node src/scripts/create-reader.js <email> [name]
 * 
 * Example:
 *   node src/scripts/create-reader.js fatima@example.com "فاطمة علي"
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { execute, queryOne } from '../db/database.js';

// 1. Parse Arguments
const args = process.argv.slice(2);
const emailInput = args[0];
const nameInput = args[1];

if (!emailInput || !emailInput.includes('@')) {
  console.error('\n❌ خطأ: يرجى تمرير بريد إلكتروني صالح.');
  console.log('\nالاستخدام:');
  console.log('  node src/scripts/create-reader.js <email> [name]\n');
  console.log('مثال:');
  console.log('  node src/scripts/create-reader.js fatima@example.com "فاطمة علي"\n');
  process.exit(1);
}

const cleanEmail = emailInput.trim().toLowerCase();
const baseUsername = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
const cleanName = nameInput ? nameInput.trim() : `قارئة معتمدة (${baseUsername})`;

// 2. Generate Random Secure Password (e.g., Kal-7x9Kp2)
function generateSecurePassword(length = 8) {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%';
  
  let pwd = 'K-';
  for (let i = 0; i < length - 2; i++) {
    const pool = (i % 2 === 0) ? letters : numbers;
    pwd += pool.charAt(Math.floor(Math.random() * pool.length));
  }
  pwd += special.charAt(Math.floor(Math.random() * special.length));
  return pwd;
}

const generatedPassword = generateSecurePassword(9);

async function run() {
  const passwordHash = await bcrypt.hash(generatedPassword, 10);

  // Check if reader exists
  const existing = queryOne('SELECT id, email, name FROM users WHERE LOWER(email) = ?', [cleanEmail]);

  if (existing) {
    execute(
      `UPDATE users 
       SET password_hash = ?, is_locked = 0, device_token = NULL, role = 'reader'
       WHERE id = ?`,
      [passwordHash, existing.id]
    );
    console.log(`\n🔄 تم تحديث حساب القارئة المسجل مسبقاً بنجاح!`);
  } else {
    // Unique username resolution
    let finalUsername = baseUsername;
    let counter = 1;
    while (queryOne('SELECT id FROM users WHERE username = ?', [finalUsername])) {
      finalUsername = `${baseUsername}_${counter++}`;
    }

    execute(
      `INSERT INTO users (email, username, name, password_hash, device_token, is_locked, role)
       VALUES (?, ?, ?, ?, NULL, 0, 'reader')`,
      [cleanEmail, finalUsername, cleanName, passwordHash]
    );
    console.log(`\n✅ تم إنشاء حساب قارئة جديد بنجاح!`);
  }

  const reader = queryOne('SELECT id, email, username, name, role FROM users WHERE LOWER(email) = ?', [cleanEmail]);

  console.log('====================================================');
  console.log('     تفاصيل حساب القارئة — كتاب «عيشي كأنثى»        ');
  console.log('====================================================');
  console.log(`👤 الاسم:           ${reader.name}`);
  console.log(`📧 البريد:          ${reader.email}`);
  console.log(`🆔 اسم المستخدم:    ${reader.username}`);
  console.log(`🔑 كلمة المرور:     ${generatedPassword}`);
  console.log('====================================================');
  console.log('\n📩 رسالة الترحيب الجاهزة للإرسال للقارئة عبر الواتساب أو الإيميل:\n');
  console.log('----------------------------------------------------');
  console.log(`أهلاً بكِ في كتاب «عيشي كأنثى» للمستشارة بدور لطفي ✨`);
  console.log(`تم تفعيل ترخيص قراءتكِ الرقمي الخاص بنجاح:`);
  console.log(``);
  console.log(`🔗 رابط القارئ:  http://172.26.15.227/login`);
  console.log(`📧 البريد:       ${reader.email}`);
  console.log(`🔑 كلمة المرور:  ${generatedPassword}`);
  console.log(``);
  console.log(`📌 ملاحظة هامة:`);
  console.log(`الحساب مقترن بنظام حماية رقمي يربط الحساب بأول جهاز (هاتف أو لابتوب) تسجلين الدخول منه.`);
  console.log(`قراءة ممتعة وملهمة لكِ! 📖✨`);
  console.log('----------------------------------------------------\n');
}

run().catch((err) => {
  console.error('Execution error:', err);
  process.exit(1);
});
