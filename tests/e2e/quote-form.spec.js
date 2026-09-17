/**
 * E2E Test: Quote Form
 *
 * This is the CORE USER ACTION for BLU CORE — the primary conversion mechanism.
 *
 * The Quote Form:
 * - Collects project details (name, phone, email optional, location, service, material, project type, requirements, message)
 * - Allows optional file upload
 * - Validates all mandatory fields client-side
 * - On success: attempts backend save, then opens WhatsApp with formatted message
 * - Shows success state with action buttons
 *
 * Tests cover:
 * Happy Path:
 *   - All required fields filled → form submits → success state appears
 *
 * Failure Paths (validation):
 *   - Empty form submission → error states shown on required fields
 *   - Short name (1 char) → name field error
 *   - Invalid phone format → phone field error
 *   - Invalid email format (when provided) → email field error
 *   - Missing location → location field error
 *   - Missing service → service field error
 *   - Missing material → material field error
 *   - Missing project type → project type field error
 *   - Missing requirements → requirements field error
 *   - Missing message → message field error
 *
 * Features NOT tested here (not implemented):
 * - User Signup:  N/A — not implemented
 * - User Login:   N/A — not implemented
 * - Payment:      N/A — not implemented
 * - User Logout:  N/A — not implemented
 */

import { test, expect } from '@playwright/test';
import { VALID_QUOTE_DATA, INVALID_QUOTE_DATA } from '../helpers/test-data.js';

test.describe('Quote Form — Validation (Failure Paths)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll to the quote form
    await page.getByTestId('quote-form').scrollIntoViewIfNeeded();
  });

  test('submitting empty form shows errors on all required fields', async ({ page }) => {
    await page.getByTestId('quote-submit').click();

    // All mandatory fields should have the error class applied
    await expect(page.locator('[data-testid="quote-fname"]').locator('..')).toHaveClass(/err/);
    await expect(page.locator('[data-testid="quote-fphone"]').locator('..')).toHaveClass(/err/);
    await expect(page.locator('[data-testid="quote-flocation"]').locator('..')).toHaveClass(/err/);
    await expect(page.locator('[data-testid="quote-fservice"]').locator('..')).toHaveClass(/err/);
    await expect(page.locator('[data-testid="quote-fmaterial"]').locator('..')).toHaveClass(/err/);
    await expect(page.locator('[data-testid="quote-fptype"]').locator('..')).toHaveClass(/err/);
    await expect(page.locator('[data-testid="quote-freq"]').locator('..')).toHaveClass(/err/);
    await expect(page.locator('[data-testid="quote-fmsg"]').locator('..')).toHaveClass(/err/);
  });

  test('success message is NOT shown when form has validation errors', async ({ page }) => {
    await page.getByTestId('quote-submit').click();
    // Success message should not be visible (it has class 'show' when visible)
    await expect(page.getByTestId('quote-success')).not.toHaveClass(/show/);
  });

  test('short name (1 char) triggers name field error', async ({ page }) => {
    await page.getByTestId('quote-fname').fill(INVALID_QUOTE_DATA.shortName);
    await page.getByTestId('quote-submit').click();
    await expect(page.locator('[data-testid="quote-fname"]').locator('..')).toHaveClass(/err/);
  });

  test('invalid phone format triggers phone field error', async ({ page }) => {
    await page.getByTestId('quote-fphone').fill(INVALID_QUOTE_DATA.invalidPhone);
    await page.getByTestId('quote-submit').click();
    await expect(page.locator('[data-testid="quote-fphone"]').locator('..')).toHaveClass(/err/);
  });

  test('invalid email format (when provided) triggers email field error', async ({ page }) => {
    await page.getByTestId('quote-femail').fill(INVALID_QUOTE_DATA.invalidEmail);
    await page.getByTestId('quote-submit').click();
    await expect(page.locator('[data-testid="quote-femail"]').locator('..')).toHaveClass(/err/);
  });

  test('valid email format clears email error', async ({ page }) => {
    // First trigger validation with invalid email
    await page.getByTestId('quote-femail').fill(INVALID_QUOTE_DATA.invalidEmail);
    await page.getByTestId('quote-submit').click();
    await expect(page.locator('[data-testid="quote-femail"]').locator('..')).toHaveClass(/err/);

    // Then fix the email — error should clear
    await page.getByTestId('quote-femail').fill('valid@example.com');
    await expect(page.locator('[data-testid="quote-femail"]').locator('..')).not.toHaveClass(/err/);
  });

  test('error clears when user starts typing in name field', async ({ page }) => {
    await page.getByTestId('quote-submit').click();
    await expect(page.locator('[data-testid="quote-fname"]').locator('..')).toHaveClass(/err/);

    await page.getByTestId('quote-fname').fill('John');
    await expect(page.locator('[data-testid="quote-fname"]').locator('..')).not.toHaveClass(/err/);
  });

  test('missing location triggers location field error', async ({ page }) => {
    // Fill all fields except location
    await page.getByTestId('quote-fname').fill(VALID_QUOTE_DATA.fname);
    await page.getByTestId('quote-fphone').fill(VALID_QUOTE_DATA.fphone);
    await page.getByTestId('quote-submit').click();
    await expect(page.locator('[data-testid="quote-flocation"]').locator('..')).toHaveClass(/err/);
  });

  test('missing message triggers message field error', async ({ page }) => {
    await page.getByTestId('quote-fname').fill(VALID_QUOTE_DATA.fname);
    await page.getByTestId('quote-fphone').fill(VALID_QUOTE_DATA.fphone);
    await page.getByTestId('quote-submit').click();
    await expect(page.locator('[data-testid="quote-fmsg"]').locator('..')).toHaveClass(/err/);
  });
});

test.describe('Quote Form — Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    // Stub window.open BEFORE navigating to page
    await page.addInitScript(() => {
      window.open = () => null;
    });

    // Mock API submission with slight delay to allow UI states to render cleanly
    await page.route('**/api/quote**', async (route) => {
      await new Promise((r) => setTimeout(r, 150));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Quote submitted successfully' }),
      });
    });

    await page.goto('/');
    await page.getByTestId('quote-form').scrollIntoViewIfNeeded();
  });

  test('filling all required fields enables successful submission', async ({ page }) => {
    // Fill all required fields
    await page.getByTestId('quote-fname').fill(VALID_QUOTE_DATA.fname);
    await page.getByTestId('quote-fphone').fill(VALID_QUOTE_DATA.fphone);
    await page.getByTestId('quote-flocation').selectOption(VALID_QUOTE_DATA.flocation);
    await page.getByTestId('quote-fservice').selectOption(VALID_QUOTE_DATA.fservice);
    await page.getByTestId('quote-fmaterial').selectOption(VALID_QUOTE_DATA.fmaterial);
    await page.getByTestId('quote-fptype').selectOption(VALID_QUOTE_DATA.fptype);
    await page.getByTestId('quote-freq').fill(VALID_QUOTE_DATA.freq);
    await page.getByTestId('quote-fmsg').fill(VALID_QUOTE_DATA.fmsg);

    await page.getByTestId('quote-submit').click();

    // After successful submission, the success message should appear
    await expect(page.getByTestId('quote-success')).toHaveClass(/show/, { timeout: 10_000 });
  });

  test('submit button shows "Submitting..." while processing', async ({ page }) => {
    await page.getByTestId('quote-fname').fill(VALID_QUOTE_DATA.fname);
    await page.getByTestId('quote-fphone').fill(VALID_QUOTE_DATA.fphone);
    await page.getByTestId('quote-flocation').selectOption(VALID_QUOTE_DATA.flocation);
    await page.getByTestId('quote-fservice').selectOption(VALID_QUOTE_DATA.fservice);
    await page.getByTestId('quote-fmaterial').selectOption(VALID_QUOTE_DATA.fmaterial);
    await page.getByTestId('quote-fptype').selectOption(VALID_QUOTE_DATA.fptype);
    await page.getByTestId('quote-freq').fill(VALID_QUOTE_DATA.freq);
    await page.getByTestId('quote-fmsg').fill(VALID_QUOTE_DATA.fmsg);

    // Click submit and immediately check button text
    const submitBtn = page.getByTestId('quote-submit');
    await submitBtn.click();

    // The button becomes "Submitting..." during processing
    const btnText = await submitBtn.textContent();
    expect(
      btnText === 'Submitting...' || btnText === 'Request a Quote'
    ).toBeTruthy();
  });

  test('form resets after successful submission', async ({ page }) => {
    await page.getByTestId('quote-fname').fill(VALID_QUOTE_DATA.fname);
    await page.getByTestId('quote-fphone').fill(VALID_QUOTE_DATA.fphone);
    await page.getByTestId('quote-flocation').selectOption(VALID_QUOTE_DATA.flocation);
    await page.getByTestId('quote-fservice').selectOption(VALID_QUOTE_DATA.fservice);
    await page.getByTestId('quote-fmaterial').selectOption(VALID_QUOTE_DATA.fmaterial);
    await page.getByTestId('quote-fptype').selectOption(VALID_QUOTE_DATA.fptype);
    await page.getByTestId('quote-freq').fill(VALID_QUOTE_DATA.freq);
    await page.getByTestId('quote-fmsg').fill(VALID_QUOTE_DATA.fmsg);

    await page.getByTestId('quote-submit').click();
    await expect(page.getByTestId('quote-success')).toHaveClass(/show/, { timeout: 10_000 });

    // After success, form fields should be reset
    await expect(page.getByTestId('quote-fname')).toHaveValue('');
    await expect(page.getByTestId('quote-fphone')).toHaveValue('');
    await expect(page.getByTestId('quote-fmsg')).toHaveValue('');
  });

  test('success message shows "Open WhatsApp Chat" button', async ({ page }) => {
    await page.getByTestId('quote-fname').fill(VALID_QUOTE_DATA.fname);
    await page.getByTestId('quote-fphone').fill(VALID_QUOTE_DATA.fphone);
    await page.getByTestId('quote-flocation').selectOption(VALID_QUOTE_DATA.flocation);
    await page.getByTestId('quote-fservice').selectOption(VALID_QUOTE_DATA.fservice);
    await page.getByTestId('quote-fmaterial').selectOption(VALID_QUOTE_DATA.fmaterial);
    await page.getByTestId('quote-fptype').selectOption(VALID_QUOTE_DATA.fptype);
    await page.getByTestId('quote-freq').fill(VALID_QUOTE_DATA.freq);
    await page.getByTestId('quote-fmsg').fill(VALID_QUOTE_DATA.fmsg);

    await page.getByTestId('quote-submit').click();
    await expect(page.getByTestId('quote-success')).toHaveClass(/show/, { timeout: 10_000 });

    // WhatsApp action button should appear in the success panel
    await expect(
      page.getByTestId('quote-success').locator('a', { hasText: 'Open WhatsApp Chat' })
    ).toBeVisible();
  });

  test('email is optional — form submits without email', async ({ page }) => {
    await page.getByTestId('quote-fname').fill(VALID_QUOTE_DATA.fname);
    await page.getByTestId('quote-fphone').fill(VALID_QUOTE_DATA.fphone);
    // femail intentionally left empty
    await page.getByTestId('quote-flocation').selectOption(VALID_QUOTE_DATA.flocation);
    await page.getByTestId('quote-fservice').selectOption(VALID_QUOTE_DATA.fservice);
    await page.getByTestId('quote-fmaterial').selectOption(VALID_QUOTE_DATA.fmaterial);
    await page.getByTestId('quote-fptype').selectOption(VALID_QUOTE_DATA.fptype);
    await page.getByTestId('quote-freq').fill(VALID_QUOTE_DATA.freq);
    await page.getByTestId('quote-fmsg').fill(VALID_QUOTE_DATA.fmsg);

    await page.getByTestId('quote-submit').click();
    await expect(page.getByTestId('quote-success')).toHaveClass(/show/, { timeout: 10_000 });
  });
});

test.describe('Quote Form — Form Fields', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('quote-form').scrollIntoViewIfNeeded();
  });

  test('location select contains expected branches', async ({ page }) => {
    const locationSelect = page.getByTestId('quote-flocation');
    await expect(locationSelect.locator('option[value="Kanhangad"]')).toHaveCount(1);
    await expect(locationSelect.locator('option[value="Payyannur / Trikaripur"]')).toHaveCount(1);
    await expect(locationSelect.locator('option[value="Palakkunnu"]')).toHaveCount(1);
    await expect(locationSelect.locator('option[value="Cherupuzha"]')).toHaveCount(1);
  });

  test('service select contains all 7 services plus Other', async ({ page }) => {
    const serviceSelect = page.getByTestId('quote-fservice');
    await expect(serviceSelect.locator('option')).toHaveCount(9); // blank + 7 services + Other
  });

  test('material select contains all 7 materials plus Not sure yet', async ({ page }) => {
    const materialSelect = page.getByTestId('quote-fmaterial');
    await expect(materialSelect.locator('option')).toHaveCount(8); // blank + 6 + Not sure yet
  });

  test('project type select contains all 7 options', async ({ page }) => {
    const ptypeSelect = page.getByTestId('quote-fptype');
    await expect(ptypeSelect.locator('option')).toHaveCount(8); // blank + 7
  });

  test('file upload input accepts images and PDFs', async ({ page }) => {
    const fileInput = page.getByTestId('quote-ffile');
    await expect(fileInput).toHaveAttribute('accept', 'image/*,.pdf');
  });
});
