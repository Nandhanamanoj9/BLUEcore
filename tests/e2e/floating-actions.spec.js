/**
 * E2E Test: Floating Action Buttons (WhatsApp + Phone)
 *
 * Verifies:
 * - WhatsApp FAB is visible on page
 * - WhatsApp FAB links to the correct WhatsApp API URL with the correct number
 * - WhatsApp FAB opens in a new tab (target="_blank")
 * - Phone FAB is visible
 * - Phone FAB links to correct tel: URI
 * - CTA section WhatsApp button is correct
 *
 * Note: We do NOT actually open WhatsApp or make phone calls in tests.
 * We verify the href attributes are correctly formed.
 */

import { test, expect } from '@playwright/test';

const EXPECTED_WHATSAPP_NUMBER = '919400544477';
const EXPECTED_PHONE_TEL = '+919400544477';

test.describe('Floating Action Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('WhatsApp FAB is visible', async ({ page }) => {
    await expect(page.getByTestId('fab-whatsapp')).toBeVisible();
  });

  test('WhatsApp FAB has correct WhatsApp API URL with correct phone number', async ({ page }) => {
    const fabWhatsapp = page.getByTestId('fab-whatsapp');
    const href = await fabWhatsapp.getAttribute('href');
    expect(href).toContain(`phone=${EXPECTED_WHATSAPP_NUMBER}`);
    expect(href).toContain('api.whatsapp.com');
  });

  test('WhatsApp FAB opens in a new tab', async ({ page }) => {
    const fabWhatsapp = page.getByTestId('fab-whatsapp');
    await expect(fabWhatsapp).toHaveAttribute('target', '_blank');
  });

  test('WhatsApp FAB has safe rel attribute', async ({ page }) => {
    const fabWhatsapp = page.getByTestId('fab-whatsapp');
    await expect(fabWhatsapp).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Phone FAB is visible', async ({ page }) => {
    await expect(page.getByTestId('fab-call')).toBeVisible();
  });

  test('Phone FAB has correct tel: URI', async ({ page }) => {
    const fabCall = page.getByTestId('fab-call');
    const href = await fabCall.getAttribute('href');
    expect(href).toBe(`tel:${EXPECTED_PHONE_TEL}`);
  });
});

test.describe('CTA Section — WhatsApp Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('.cta-band').scrollIntoViewIfNeeded();
  });

  test('CTA WhatsApp button is visible', async ({ page }) => {
    await expect(page.getByTestId('cta-whatsapp')).toBeVisible();
  });

  test('CTA WhatsApp button links to correct WhatsApp URL', async ({ page }) => {
    const ctaBtn = page.getByTestId('cta-whatsapp');
    const href = await ctaBtn.getAttribute('href');
    expect(href).toContain(`phone=${EXPECTED_WHATSAPP_NUMBER}`);
    expect(href).toContain('api.whatsapp.com');
  });

  test('CTA WhatsApp button opens in new tab', async ({ page }) => {
    await expect(page.getByTestId('cta-whatsapp')).toHaveAttribute('target', '_blank');
  });

  test('CTA section "Request a Quote" button links to #quote', async ({ page }) => {
    const ctaBand = page.locator('.cta-band');
    const quoteBtn = ctaBand.locator('a[href="#quote"]');
    await expect(quoteBtn).toBeVisible();
    await expect(quoteBtn).toHaveAttribute('href', '#quote');
  });
});

test.describe('Footer Contact Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').scrollIntoViewIfNeeded();
  });

  test('footer contains email link', async ({ page }) => {
    const emailLink = page.locator('footer a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:blucorenc@gmail.com');
  });

  test('footer contains phone links for Kanhangad', async ({ page }) => {
    const phoneLink = page.locator('footer a[href="tel:+919400544477"]');
    await expect(phoneLink).toBeVisible();
  });

  test('footer contains website link', async ({ page }) => {
    const webLink = page.locator('footer a[href*="blucoredesign.com"]').first();
    await expect(webLink).toBeVisible();
  });

  test('branch cards each have a phone link', async ({ page }) => {
    const branchPhoneLinks = page.locator('.branch-card a[href^="tel:"]');
    await expect(branchPhoneLinks).toHaveCount(4);
  });
});
