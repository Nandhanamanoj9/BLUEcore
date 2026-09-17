/**
 * Playwright Configuration — BLU CORE E2E Tests
 *
 * Frontend: Vite dev server on port 3000 (confirmed from vite.config.js)
 * Backend:  Express API on port 5000 (confirmed from backend/server.js)
 */

import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

export default defineConfig({
  testDir: './e2e',

  // Run files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Worker count: 1 on CI, 4 locally to prevent dev server starvation
  workers: process.env.CI ? 1 : 4,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: resolve(ROOT, 'playwright-report'), open: 'never' }],
    ['list'],
  ],

  // Overall test timeout: 60s
  timeout: 60_000,

  use: {
    // Base URL for the frontend application (port 3000 per vite.config.js)
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',

    // Capture trace on first retry only
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video: record on first retry only (keeps CI artifacts lean)
    video: 'on-first-retry',

    // Action timeout
    actionTimeout: 15_000,

    // Navigation timeout
    navigationTimeout: 45_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Start the Vite dev server before running tests
  // cwd must point to the project root (one level above tests/)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    cwd: ROOT,
  },
});
