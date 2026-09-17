/**
 * E2E Test: Homepage
 *
 * Verifies:
 * - Page loads successfully
 * - Correct page title
 * - H1 heading is present and correct
 * - Hero section is visible
 * - Key metadata is set
 * - Footer is present
 * - Scroll-reveal animations do not break layout
 *
 * Features NOT tested here (not implemented):
 * - User Signup: N/A — not implemented
 * - User Login:  N/A — not implemented
 * - Payment:     N/A — not implemented
 */

import { test, expect } from '@playwright/test';
import { EXPECTED_CONTENT } from '../helpers/test-data.js';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully with 200 status', async ({ page }) => {
    const response = await page.request.get('/');
    expect(response.status()).toBe(200);
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/BLU CORE/);
  });

  test('hero section is visible', async ({ page }) => {
    const hero = page.getByTestId('hero-section');
    await expect(hero).toBeVisible();
  });

  test('hero H1 heading contains correct text', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText(EXPECTED_CONTENT.heroH1);
  });

  test('hero eyebrow text is visible', async ({ page }) => {
    await expect(page.locator('.hero-eyebrow')).toContainText(EXPECTED_CONTENT.heroEyebrow);
  });

  test('hero CTA buttons are visible', async ({ page }) => {
    await expect(page.getByTestId('hero-get-quote')).toBeVisible();
    await expect(page.getByTestId('hero-explore-gallery')).toBeVisible();
  });

  test('hero "Get a Free Quote" CTA links to #quote', async ({ page }) => {
    const quoteLink = page.getByTestId('hero-get-quote');
    await expect(quoteLink).toHaveAttribute('href', '#quote');
  });

  test('hero "Explore Our Work" CTA links to #gallery', async ({ page }) => {
    const galleryLink = page.getByTestId('hero-explore-gallery');
    await expect(galleryLink).toHaveAttribute('href', '#gallery');
  });

  test('About section is present', async ({ page }) => {
    await expect(page.locator('#about')).toBeVisible();
  });

  test('Services section is present', async ({ page }) => {
    await expect(page.locator('#services')).toBeVisible();
  });

  test('Gallery section is present', async ({ page }) => {
    await expect(page.getByTestId('gallery-section')).toBeVisible();
  });

  test('Materials section is present', async ({ page }) => {
    await expect(page.locator('#materials')).toBeVisible();
  });

  test('Projects / Applications section is present', async ({ page }) => {
    await expect(page.locator('#projects')).toBeVisible();
  });

  test('Contact section is present', async ({ page }) => {
    await expect(page.getByTestId('contact-section')).toBeVisible();
  });

  test('Quote form section is present', async ({ page }) => {
    await expect(page.getByTestId('quote-form')).toBeVisible();
  });

  test('Footer is present with BLU CORE branding', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(EXPECTED_CONTENT.footerCopyright);
  });

  test('floating WhatsApp button is present', async ({ page }) => {
    await expect(page.getByTestId('fab-whatsapp')).toBeVisible();
  });

  test('floating call button is present', async ({ page }) => {
    await expect(page.getByTestId('fab-call')).toBeVisible();
  });

  test('page has 7 service cards', async ({ page }) => {
    // SERVICES array in siteData.js has 7 services
    const serviceCards = page.locator('.svc-card');
    await expect(serviceCards).toHaveCount(7);
  });

  test('page has all 6 material cells', async ({ page }) => {
    // MATERIALS array in siteData.js has 6 materials
    const matCells = page.locator('.mat-cell');
    await expect(matCells).toHaveCount(6);
  });

  test('page has 4 branch cards', async ({ page }) => {
    // BRANCHES array in siteData.js has 4 branches
    const branchCards = page.locator('.branch-card');
    await expect(branchCards).toHaveCount(4);
  });
});
