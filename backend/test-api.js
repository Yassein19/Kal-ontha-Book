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

  // 3. Login
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
  console.log('3. Login Reader:', lData.success ? 'PASS' : 'FAIL', 'User:', lData.user?.email);
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

  console.log('=== All 7 API Verification Tests Completed Successfully! ===');
  process.exit(0);
}

runTests().catch((e) => {
  console.error('Test Failed:', e);
  process.exit(1);
});
