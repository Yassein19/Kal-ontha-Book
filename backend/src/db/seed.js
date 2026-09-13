import bcrypt from 'bcryptjs';
import { db, execute, queryOne, queryAll } from './database.js';

async function seed() {
  console.log('Seeding Kal Ontha Database...');

  // 1. Users
  const readerPasswordHash = await bcrypt.hash('read2026', 10);
  const adminPasswordHash = await bcrypt.hash('Yassein123#', 10);
  const authorPasswordHash = await bcrypt.hash('password123', 10);

  // Clear existing users
  execute('DELETE FROM users');

  // Reader account
  execute(
    `INSERT INTO users (email, name, password_hash, device_token, is_locked, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['reader@kal-ontha.com', 'مريم أحمد (قارئة معتمدة)', readerPasswordHash, null, 0, 'reader']
  );

  // Author account: Bedour Lotfi
  execute(
    `INSERT INTO users (email, name, password_hash, device_token, is_locked, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['bedour.lotfi77@gmail.com', 'أ. بدور لطفي (المؤلفة)', authorPasswordHash, null, 0, 'author']
  );

  // The Only Admin: Yassein Ahmed
  execute(
    `INSERT INTO users (email, name, password_hash, device_token, is_locked, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['yasssokamel@gmail.com', 'ياسين أحمد (المدير العام)', adminPasswordHash, null, 0, 'admin']
  );

  console.log('✓ Seeded users:');
  console.log('  - Author:     bedour.lotfi77@gmail.com / password123');
  console.log('  - Only Admin: yasssokamel@gmail.com / Yassein123#');
  console.log('  - Reader:     reader@kal-ontha.com / read2026');

  // 2. Books
  execute('DELETE FROM books');
  execute('DELETE FROM book_pages');

  execute(
    `INSERT INTO books (id, title, subtitle, author, description, cover_image, total_pages)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      1,
      'عيشي كأنثى',
      'رحلة الوعي الذاتي، النور الداخلي، وجودة الحياة',
      'بدور لطفي',
      'أساعدكِ تفهمي نفسكِ بعمق؛ مشاعركِ، أفكاركِ، معتقداتكِ، قيمكِ واحتياجاتكِ، وتبني علاقة أكثر وعيًا وصحة مع جسدكِ، عشان تحولي فهمكِ لنفسكِ إلى حياة أكثر حيوية، وإنجازًا وأثرًا. لأن نوركِ يستحق أن يُرى.',
      'cover.jpeg',
      336,
    ]
  );
  console.log('✓ Seeded book: "عيشي كأنثى" by بدور لطفي (336 pages)');

  // 3. Book Pages (336 pages)
  for (let i = 1; i <= 336; i++) {
    execute(
      `INSERT INTO book_pages (book_id, page_number, image_key)
       VALUES (?, ?, ?)`,
      [1, i, `page_${i}.png`]
    );
  }
  console.log('✓ Seeded 336 protected book page mappings');

  // 4. Sample Contact Message
  execute('DELETE FROM contact_messages');
  execute(
    `INSERT INTO contact_messages (name, email, message)
     VALUES (?, ?, ?)`,
    [
      'سارة العلي',
      'sara.ali@example.com',
      'أستاذة بدور، قرأت المقدمة ومتحمسة جداً لاقتناء نسختي الكاملة والانضمام لجلسات الاستشارة. شكراً لهذا النور!',
    ]
  );
  console.log('✓ Seeded sample contact message');

  console.log('\nDatabase seeding successfully completed!');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
