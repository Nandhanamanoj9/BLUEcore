import http from 'http';

async function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            rawBody: data
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting BLU CORE Backend Automated Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extra = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${extra}`);
      failed++;
    }
  }

  // 1. Health Check
  const healthRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  assert(healthRes.statusCode === 200 && healthRes.body.success === true, '1. GET /api/health returns 200 OK');

  // 2. Services
  const servicesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/services',
    method: 'GET'
  });
  assert(servicesRes.statusCode === 200 && Array.isArray(servicesRes.body.data) && servicesRes.body.data.length === 7, '2. GET /api/services returns 7 craft services');

  // 3. Materials
  const materialsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/materials',
    method: 'GET'
  });
  assert(materialsRes.statusCode === 200 && materialsRes.body.data.length === 6, '3. GET /api/materials returns 6 materials');

  // 4. Branches
  const branchesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/branches',
    method: 'GET'
  });
  assert(branchesRes.statusCode === 200 && branchesRes.body.data.length === 4, '4. GET /api/branches returns 4 branches');

  // 5. Quote Validation Failure
  const invalidQuoteRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/quote',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { fname: 'A' });
  assert(invalidQuoteRes.statusCode === 400 && invalidQuoteRes.body.errors, '5. POST /api/quote validates required fields (returns 400)');

  // 6. Valid Quote Submission
  const validQuoteRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/quote',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fname: 'Hariharan Nair',
    fphone: '+91 9400 123 456',
    femail: 'hari@example.com',
    flocation: 'Kanhangad',
    fservice: 'Wood Carving',
    fmaterial: 'Wood',
    fptype: 'Home / Residential',
    freq: '24 x 48 inches entrance panel',
    fmsg: 'Looking for a traditional carved motif for main door.'
  });
  assert(validQuoteRes.statusCode === 201 && validQuoteRes.body.data?.id, '6. POST /api/quote creates quote successfully (returns 201)');

  // 7. Admin Login Failure
  const badLoginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'blucorenc@gmail.com', password: 'WrongPassword' });
  assert(badLoginRes.statusCode === 401, '7. POST /api/admin/login rejects invalid password (returns 401)');

  // 8. Admin Login Success
  const loginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'blucorenc@gmail.com', password: 'Admin@123456' });
  const token = loginRes.body?.data?.token;
  assert(loginRes.statusCode === 200 && Boolean(token), '8. POST /api/admin/login issues JWT token (returns 200)');

  // 9. Protected Dashboard Stats
  const dashRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert(dashRes.statusCode === 200 && dashRes.body.data.totalQuotes >= 1, '9. GET /api/admin/dashboard returns aggregated metrics');

  // 10. Protected Quotes Listing
  const quotesListRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/quotes',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert(quotesListRes.statusCode === 200 && quotesListRes.body.data.items.length >= 1, '10. GET /api/admin/quotes returns paginated quotes list');

  // 11. Unauthorized Protected Route
  const unauthRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/quotes',
    method: 'GET'
  });
  assert(unauthRes.statusCode === 401, '11. GET /api/admin/quotes blocks unauthenticated request (returns 401)');

  console.log('--------------------------------------------------');
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
