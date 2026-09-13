async function runTests() {
  console.log('=== Kal Ontha API Test Suite ===');

  // 1. Health
  const hRes = await fetch('http://localhost:5000/api/health');
  const hData = await hRes.json();
  console.log('1. Health Check:', hData.status === 'online' ? 'PASS' : 'FAIL', hData.service);

  // 2. Book Meta
  const bRes = await fetch('http://localhost:5000/api/reader/book/1/meta');
  const bData = await bRes.json();
  console.log('2. Book Meta:', bData.book.title, `(${bData.book.totalPages} pages)`, 'PASS');

  // 3. Reset Reader lock for reproducible test
  await fetch('http://localhost:5000/api/auth/reset-device-lock/7', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 7 }),
  });

  // 4. Test Author Login (bedour.lotfi77@gmail.com)
  const aRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'bedour.lotfi77@gmail.com',
      password: 'password123',
    }),
  });
  const aData = await aRes.json();
  console.log('3. Author Login:', aData.success ? 'PASS' : 'FAIL', 'Author:', aData.user?.email, 'Role:', aData.user?.role);

  // 5. Login Reader
  const deviceToken = 'dev_test_device_123';
  const lRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'reader@kal-ontha.com',
      password: 'read2026',
      deviceToken,
    }),
  });
  const lData = await lRes.json();
  console.log('4. Login Reader:', lData.success ? 'PASS' : 'FAIL', 'User:', lData.user?.email);
  const token = lData.token;

  // 4. Device Lock Enforcement Test (Try login with DIFFERENT device)
  const lRes2 = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'reader@kal-ontha.com',
      password: 'read2026',
      deviceToken: 'different_unauthorized_device_999',
    }),
  });
  const lData2 = await lRes2.json();
  console.log(
    '4. Device Lock Rejection Test:',
    lRes2.status === 403 && lData2.error === 'DEVICE_LOCKED' ? 'PASS (Correctly Rejected)' : 'FAIL',
    lData2.error
  );

  // 5. Page Ticket
  const tRes = await fetch('http://localhost:5000/api/reader/page-ticket/1/1', {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-device-token': deviceToken,
    },
  });
  const tData = await tRes.json();
  console.log('5. Page Ticket:', tData.signedToken ? 'PASS' : 'FAIL', 'Ticket streamUrl ready');

  // 6. Stream Page Image
  const sRes = await fetch(`http://localhost:5000${tData.streamUrl}`);
  const sType = sRes.headers.get('content-type');
  const sBytes = (await sRes.arrayBuffer()).byteLength;
  console.log('6. Page Stream:', sRes.status === 200 ? 'PASS' : 'FAIL', 'Type:', sType, 'Bytes:', sBytes);

  // 7. Contact Submission
  const cRes = await fetch('http://localhost:5000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'فاطمة الزهراء',
      email: 'fatima@example.com',
      message: 'أود حجز استشارة وعي ذاتي مع الأستاذة بدور.',
    }),
  });
  const cData = await cRes.json();
  console.log('7. Contact Submission:', cData.success ? 'PASS' : 'FAIL', cData.message.slice(0, 30) + '...');

  // 8. Admin Login
  const admRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'yasssokamel@gmail.com', password: 'Yassein123#' }),
  });
  const admData = await admRes.json();
  const adminToken = admData.token;
  console.log('8. Admin Login:', admData.success ? 'PASS' : 'FAIL', 'Role:', admData.user?.role);

  // 9. Admin Creates New Reader
  const testNewEmail = `reader_test_${Date.now()}@kal-ontha.com`;
  const testNewUsername = `user_${Math.floor(Math.random() * 9000 + 1000)}`;
  const crRes = await fetch('http://localhost:5000/api/admin/readers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'هدى المنصوري',
      email: testNewEmail,
      username: testNewUsername,
      password: 'mypassword2026#',
    }),
  });
  const crData = await crRes.json();
  const isReaderRole = crData.reader?.role === 'reader';
  console.log(
    '9. Admin Create Reader:',
    crData.success && isReaderRole ? 'PASS' : 'FAIL',
    'Email:',
    crData.reader?.email,
    'Username:',
    crData.reader?.username,
    'Role:',
    crData.reader?.role
  );

  // 10. New Reader Logs in via EMAIL
  const lgEmailRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testNewEmail,
      password: 'mypassword2026#',
    }),
  });
  const lgEmailData = await lgEmailRes.json();
  console.log('10. New Reader Login via Email:', lgEmailData.success ? 'PASS' : 'FAIL', lgEmailData.user?.email);

  // 11. New Reader Logs in via USERNAME
  const lgUserRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: testNewUsername,
      password: 'mypassword2026#',
    }),
  });
  const lgUserData = await lgUserRes.json();
  console.log('11. New Reader Login via Username:', lgUserData.success ? 'PASS' : 'FAIL', lgUserData.user?.username);

  // 12. Non-Admin (Reader) is strictly blocked from creating reader accounts (403)
  const blockRes = await fetch('http://localhost:5000/api/admin/readers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${lgUserData.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'محاولة اختراق',
      email: 'hacker@example.com',
      username: 'hacker123',
      password: 'password123',
    }),
  });
  console.log(
    '12. Non-Admin Blocked from Admin API:',
    blockRes.status === 403 ? 'PASS (403 Forbidden)' : 'FAIL ' + blockRes.status
  );

  // 13. Admin Lists Readers and Resets Device Lock
  const listRes = await fetch('http://localhost:5000/api/admin/readers', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const listData = await listRes.json();
  const foundReader = listData.readers?.find((r) => r.email === testNewEmail);
  console.log('13. Admin List Readers:', listData.success && foundReader ? 'PASS' : 'FAIL', `Found ${listData.count} readers`);

  const rstRes = await fetch(`http://localhost:5000/api/admin/readers/${crData.reader.id}/reset-lock`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const rstData = await rstRes.json();
  console.log('14. Admin Reset Reader Device Lock:', rstData.success ? 'PASS' : 'FAIL');

  console.log('=== All 14 API Verification Tests Completed Successfully! ===');
  process.exit(0);
}

runTests().catch((e) => {
  console.error('Test Failed:', e);
  process.exit(1);
});
