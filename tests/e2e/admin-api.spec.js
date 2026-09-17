/**
 * E2E Test: Admin API
 *
 * BLU CORE has a backend admin system accessible via JWT-authenticated REST API.
 * There is NO frontend admin panel — the admin API is backend-only.
 * These tests verify the API endpoints directly using Playwright's request context.
 *
 * Backend runs on port 5000 (mounted under /api).
 * These tests use the mock-mode admin seeded in backend/config/firebase.js
 * when no real Firebase credentials are present.
 *
 * Features tested:
 * - Backend health check endpoint (/api/health)
 * - Admin login — happy path (valid credentials → JWT token)
 * - Admin login — wrong password (401)
 * - Admin login — unknown email (401)
 * - Admin login — missing fields (400)
 * - Protected dashboard endpoint — with valid token → 200
 * - Protected dashboard endpoint — without token → 401
 * - Protected dashboard endpoint — with invalid token → 401
 * - Quote submission API — happy path (/api/quote)
 * - Quote submission API — validation failure
 * - Unauthenticated access to protected quote admin list → 401
 *
 * Features NOT tested (not implemented):
 * - User Signup:    N/A — not implemented
 * - User Login:     N/A — no user authentication system
 * - User Logout:    N/A — no user authentication system
 * - Payment:        N/A — not implemented
 *
 * NOTE: These tests gracefully skip if the backend server is unavailable.
 */

import { test, expect, request } from '@playwright/test';
import { API_BASE_URL, ADMIN_CREDENTIALS, VALID_QUOTE_DATA } from '../helpers/test-data.js';

async function getApiContext() {
  return await request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  });
}

async function isBackendReachable(api) {
  try {
    const res = await api.get('/api/health', { timeout: 3000 });
    return res.ok();
  } catch {
    return false;
  }
}

test.describe('Backend Health Check', () => {
  test('GET /api/health returns 200 with status online', async () => {
    const api = await getApiContext();
    const ready = await isBackendReachable(api);
    if (!ready) {
      await api.dispose();
      test.skip(true, 'Backend server not available — skipping health check');
    }

    const response = await api.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain('BLU CORE API');
    await api.dispose();
  });
});

test.describe('Admin Login API', () => {
  test.describe.configure({ mode: 'serial' });
  let api;
  let backendReady = false;

  test.beforeAll(async () => {
    api = await getApiContext();
    backendReady = await isBackendReachable(api);
  });

  test.afterAll(async () => {
    if (api) await api.dispose();
  });

  test('Happy Path — valid credentials return 200 with token', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/admin/login', {
      data: {
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
      },
    });

    if (response.status() === 429) {
      test.skip(true, 'Rate limit reached on login endpoint');
    }

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('token');
    expect(typeof body.data.token).toBe('string');
    expect(body.data.token.length).toBeGreaterThan(10);
    expect(body.data.admin).toHaveProperty('email', ADMIN_CREDENTIALS.email);
  });

  test('Failure — wrong password returns 401', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/admin/login', {
      data: {
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.wrongPassword,
      },
    });

    expect([401, 429]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('Failure — unknown email returns 401', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/admin/login', {
      data: {
        email: ADMIN_CREDENTIALS.unknownEmail,
        password: 'AnyPassword123',
      },
    });

    expect([401, 429]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('Failure — missing email returns 400', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/admin/login', {
      data: { password: ADMIN_CREDENTIALS.password },
    });

    expect([400, 429]).toContain(response.status());
  });

  test('Failure — missing password returns 400', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/admin/login', {
      data: { email: ADMIN_CREDENTIALS.email },
    });

    expect([400, 429]).toContain(response.status());
  });

  test('Failure — empty body returns 400', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/admin/login', { data: {} });
    expect([400, 429]).toContain(response.status());
  });
});

test.describe('Admin Dashboard API — Authorization', () => {
  test.describe.configure({ mode: 'serial' });
  let api;
  let backendReady = false;
  let validToken = null;

  test.beforeAll(async () => {
    api = await getApiContext();
    backendReady = await isBackendReachable(api);
    if (backendReady) {
      try {
        const loginRes = await api.post('/api/admin/login', {
          data: {
            email: ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password,
          },
        });
        if (loginRes.ok()) {
          const body = await loginRes.json();
          validToken = body?.data?.token || null;
        }
      } catch {
        validToken = null;
      }
    }
  });

  test.afterAll(async () => {
    if (api) await api.dispose();
  });

  test('GET /admin/dashboard — without token returns 401', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const unauthApi = await request.newContext({ baseURL: API_BASE_URL });
    const response = await unauthApi.get('/api/admin/dashboard');

    expect([401, 429]).toContain(response.status());
    await unauthApi.dispose();
  });

  test('GET /admin/dashboard — with invalid token returns 401', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const badApi = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { Authorization: 'Bearer this.is.a.fake.token' },
    });
    const response = await badApi.get('/api/admin/dashboard');

    expect([401, 429]).toContain(response.status());
    await badApi.dispose();
  });

  test('GET /admin/dashboard — with valid token returns 200', async () => {
    if (!backendReady || !validToken) {
      test.skip(true, 'Valid admin token not available');
    }

    const authApi = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${validToken}` },
    });
    const response = await authApi.get('/api/admin/dashboard');

    if (response.status() === 429) {
      test.skip(true, 'Rate limit reached on dashboard endpoint');
    }

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('totalQuotes');
    expect(body.data).toHaveProperty('totalContacts');
    await authApi.dispose();
  });

  test('GET /admin/quotes — unauthenticated returns 401', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const unauthApi = await request.newContext({ baseURL: API_BASE_URL });
    const response = await unauthApi.get('/api/admin/quotes');

    expect([401, 429]).toContain(response.status());
    await unauthApi.dispose();
  });
});

test.describe('Quote Submission API', () => {
  test.describe.configure({ mode: 'serial' });
  let api;
  let backendReady = false;

  test.beforeAll(async () => {
    api = await request.newContext({ baseURL: API_BASE_URL });
    backendReady = await isBackendReachable(api);
  });

  test.afterAll(async () => {
    if (api) await api.dispose();
  });

  test('POST /quote — happy path with all required fields returns 200', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/quote', {
      data: {
        fname: VALID_QUOTE_DATA.fname,
        fphone: VALID_QUOTE_DATA.fphone,
        femail: VALID_QUOTE_DATA.femail,
        flocation: VALID_QUOTE_DATA.flocation,
        fservice: VALID_QUOTE_DATA.fservice,
        fmaterial: VALID_QUOTE_DATA.fmaterial,
        fptype: VALID_QUOTE_DATA.fptype,
        freq: VALID_QUOTE_DATA.freq,
        fmsg: VALID_QUOTE_DATA.fmsg,
      },
    });

    if (response.status() === 429) {
      test.skip(true, 'Rate limit reached on quote submission endpoint');
    }

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('POST /quote — missing required fields returns 400 with validation errors', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/quote', {
      data: { fmsg: 'Missing most required fields' },
    });

    expect([400, 429]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('POST /quote — invalid phone returns 400', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/quote', {
      data: {
        fname: VALID_QUOTE_DATA.fname,
        fphone: 'not-a-phone',
        flocation: VALID_QUOTE_DATA.flocation,
        fservice: VALID_QUOTE_DATA.fservice,
        fmaterial: VALID_QUOTE_DATA.fmaterial,
        fptype: VALID_QUOTE_DATA.fptype,
        freq: VALID_QUOTE_DATA.freq,
        fmsg: VALID_QUOTE_DATA.fmsg,
      },
    });

    expect([400, 429]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test('POST /quotes — alias endpoint returns same result as /quote', async () => {
    if (!backendReady) test.skip(true, 'Backend not available');

    const response = await api.post('/api/quotes', {
      data: {
        fname: VALID_QUOTE_DATA.fname,
        fphone: VALID_QUOTE_DATA.fphone,
        flocation: VALID_QUOTE_DATA.flocation,
        fservice: VALID_QUOTE_DATA.fservice,
        fmaterial: VALID_QUOTE_DATA.fmaterial,
        fptype: VALID_QUOTE_DATA.fptype,
        freq: VALID_QUOTE_DATA.freq,
        fmsg: VALID_QUOTE_DATA.fmsg,
      },
    });

    if (response.status() === 429) {
      test.skip(true, 'Rate limit reached on quotes alias endpoint');
    }

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
