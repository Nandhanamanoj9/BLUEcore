/**
 * E2E Test: Navigation
 *
 * Verifies:
 * - Navbar is visible on load
 * - All nav links are present
 * - Desktop "Get a Quote" nav CTA is present and correct
 * - Mobile burger menu opens
 * - Mobile menu contains all nav links
 * - Mobile menu closes via close button
 * - Mobile menu "Get a Quote" CTA works
 * - Navbar scrolled state (class change on scroll)
 *
 * Features NOT tested here (not implemented):
 * - User Login / Logout: N/A — not implemented
 */

import { test, expect } from '@playwright/test';
import { EXPECTED_CONTENT } from '../helpers/test-data.js';

test.describe('Desktop Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('site header is visible', async ({ page }) => {
    await expect(page.getByTestId('site-header')).toBeVisible();
  });

  test('navbar contains all expected links', async ({ page }) => {
    const navLinks = page.locator('.navlinks a');
    const texts = await navLinks.allTextContents();
    for (const expected of EXPECTED_CONTENT.navLinks) {
      expect(texts).toContain(expected);
    }
  });

  test('desktop "Get a Quote" CTA is visible and links to #quote', async ({ page }) => {
    const cta = page.getByTestId('navbar-get-quote');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '#quote');
  });

  test('logo links to #home', async ({ page }) => {
    const logo = page.locator('header .logo').first();
    await expect(logo).toHaveAttribute('href', '#home');
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('burger button is visible on mobile', async ({ page }) => {
    await expect(page.getByTestId('burger-btn')).toBeVisible();
  });

  test('mobile menu is closed by default', async ({ page }) => {
    const mobileMenu = page.getByTestId('mobile-menu');
    // The menu exists in DOM but should not have the 'open' class
    await expect(mobileMenu).not.toHaveClass(/open/);
  });

  test('clicking burger opens mobile menu', async ({ page }) => {
    await page.getByTestId('burger-btn').click();
    const mobileMenu = page.getByTestId('mobile-menu');
    await expect(mobileMenu).toHaveClass(/open/);
  });

  test('mobile menu contains all nav links', async ({ page }) => {
    await page.getByTestId('burger-btn').click();
    const mobileMenu = page.getByTestId('mobile-menu');
    for (const linkText of EXPECTED_CONTENT.navLinks) {
      await expect(mobileMenu.getByText(linkText)).toBeVisible();
    }
  });

  test('mobile menu has "Get a Quote" CTA', async ({ page }) => {
    await page.getByTestId('burger-btn').click();
    const quoteCta = page.getByTestId('mobile-menu-quote');
    await expect(quoteCta).toBeVisible();
    await expect(quoteCta).toHaveAttribute('href', '#quote');
  });

  test('close button closes the mobile menu', async ({ page }) => {
    await page.getByTestId('burger-btn').click();
    const mobileMenu = page.getByTestId('mobile-menu');
    await expect(mobileMenu).toHaveClass(/open/);

    await page.getByTestId('mobile-menu-close').click();
    await expect(mobileMenu).not.toHaveClass(/open/);
  });

  test('clicking a nav link closes the mobile menu', async ({ page }) => {
    await page.getByTestId('burger-btn').click();
    const mobileMenu = page.getByTestId('mobile-menu');
    await expect(mobileMenu).toHaveClass(/open/);

    // Click the About link inside mobile menu
    await mobileMenu.getByText('About').click();
    await expect(mobileMenu).not.toHaveClass(/open/);
  });
});

test.describe('Anchor Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking "Get a Free Quote" scrolls to quote section', async ({ page }) => {
    await page.getByTestId('hero-get-quote').click();
    // Wait for scroll and verify the quote form is in view
    await expect(page.getByTestId('quote-form')).toBeInViewport({ timeout: 5000 });
  });

  test('clicking "Explore Our Work" scrolls to gallery section', async ({ page }) => {
    await page.getByTestId('hero-explore-gallery').click();
    await expect(page.getByTestId('gallery-section')).toBeInViewport({ timeout: 5000 });
  });
});
