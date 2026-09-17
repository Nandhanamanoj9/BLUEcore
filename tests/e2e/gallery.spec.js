/**
 * E2E Test: Gallery
 *
 * Verifies:
 * - Gallery section is visible
 * - All gallery filter buttons are rendered
 * - "ALL" filter is active by default
 * - Clicking a category filter shows only items of that category
 * - Gallery items are clickable
 * - Lightbox opens when a gallery item is clicked
 * - Lightbox shows correct caption
 * - Lightbox closes via close button
 * - Lightbox closes via Escape key
 * - Lightbox closes by clicking the backdrop
 */

import { test, expect } from '@playwright/test';
import { GALLERY_CATEGORIES } from '../helpers/test-data.js';

test.describe('Gallery Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll to the gallery section so it's in view
    await page.locator('#gallery').scrollIntoViewIfNeeded();
  });

  test('gallery section is visible', async ({ page }) => {
    await expect(page.getByTestId('gallery-section')).toBeVisible();
  });

  test('all filter buttons are rendered', async ({ page }) => {
    for (const cat of GALLERY_CATEGORIES) {
      const slug = cat.toLowerCase().replace(/\s+/g, '-');
      await expect(page.getByTestId(`gallery-filter-${slug}`)).toBeVisible();
    }
  });

  test('"ALL" filter is active by default', async ({ page }) => {
    const allFilter = page.getByTestId('gallery-filter-all');
    await expect(allFilter).toHaveClass(/active/);
  });

  test('ALL filter shows all gallery items (11 items)', async ({ page }) => {
    // GALLERY_ITEMS in siteData.js has 11 items
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(11);
  });

  test('clicking "WALL PANELS" filter shows only wall panel items', async ({ page }) => {
    await page.getByTestId('gallery-filter-wall-panels').click();
    await expect(page.getByTestId('gallery-filter-wall-panels')).toHaveClass(/active/);
    // GALLERY_ITEMS has 2 WALL PANELS items (ids 1, 7)
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(2);
  });

  test('clicking "DOORS" filter shows only door items', async ({ page }) => {
    await page.getByTestId('gallery-filter-doors').click();
    // GALLERY_ITEMS has 2 DOORS items (ids 2, 8)
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(2);
  });

  test('clicking "WOOD CARVING" filter shows wood carving items', async ({ page }) => {
    await page.getByTestId('gallery-filter-wood-carving').click();
    // GALLERY_ITEMS has 2 WOOD CARVING items (ids 3, 10)
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(2);
  });

  test('clicking "CEILING" filter shows ceiling items', async ({ page }) => {
    await page.getByTestId('gallery-filter-ceiling').click();
    // GALLERY_ITEMS has 1 CEILING item (id 4)
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(1);
  });

  test('clicking "3D PANELS" filter shows 3D panel items', async ({ page }) => {
    await page.getByTestId('gallery-filter-3d-panels').click();
    // GALLERY_ITEMS has 2 3D PANELS items (ids 5, 9)
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(2);
  });

  test('clicking "CUSTOM DESIGNS" filter shows custom design items', async ({ page }) => {
    await page.getByTestId('gallery-filter-custom-designs').click();
    // GALLERY_ITEMS has 2 CUSTOM DESIGNS items (ids 6, 11)
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(2);
  });

  test('clicking "ALL" after a filter restores all items', async ({ page }) => {
    await page.getByTestId('gallery-filter-doors').click();
    await expect(page.getByTestId('gallery-item')).toHaveCount(2);

    await page.getByTestId('gallery-filter-all').click();
    await expect(page.getByTestId('gallery-item')).toHaveCount(11);
  });

  test('active filter class switches correctly', async ({ page }) => {
    await page.getByTestId('gallery-filter-doors').click();
    await expect(page.getByTestId('gallery-filter-doors')).toHaveClass(/active/);
    await expect(page.getByTestId('gallery-filter-all')).not.toHaveClass(/active/);
  });
});

test.describe('Gallery Lightbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#gallery').scrollIntoViewIfNeeded();
  });

  test('lightbox is closed by default', async ({ page }) => {
    // Lightbox renders null when not open — element not in DOM
    await expect(page.getByTestId('lightbox')).not.toBeAttached();
  });

  test('clicking a gallery item opens the lightbox', async ({ page }) => {
    const firstItem = page.getByTestId('gallery-item').first();
    await firstItem.click();
    await expect(page.getByTestId('lightbox')).toBeVisible();
  });

  test('lightbox shows the close button', async ({ page }) => {
    await page.getByTestId('gallery-item').first().click();
    await expect(page.getByTestId('lightbox-close')).toBeVisible();
  });

  test('lightbox close button closes the lightbox', async ({ page }) => {
    await page.getByTestId('gallery-item').first().click();
    await expect(page.getByTestId('lightbox')).toBeVisible();

    await page.getByTestId('lightbox-close').click();
    await expect(page.getByTestId('lightbox')).not.toBeAttached();
  });

  test('pressing Escape closes the lightbox', async ({ page }) => {
    await page.getByTestId('gallery-item').first().click();
    await expect(page.getByTestId('lightbox')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('lightbox')).not.toBeAttached();
  });

  test('lightbox shows a caption for the opened item', async ({ page }) => {
    await page.getByTestId('gallery-item').first().click();
    const caption = page.locator('#lightboxCaption');
    await expect(caption).not.toBeEmpty();
  });

  test('lightbox shows item category label', async ({ page }) => {
    await page.getByTestId('gallery-item').first().click();
    const catLabel = page.locator('#lightboxCat');
    await expect(catLabel).not.toBeEmpty();
  });

  test('clicking lightbox backdrop closes the lightbox', async ({ page }) => {
    await page.getByTestId('gallery-item').first().click();
    const lightbox = page.getByTestId('lightbox');
    await expect(lightbox).toBeVisible();

    // Click the outermost lightbox container (backdrop), not the inner content
    await lightbox.click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('lightbox')).not.toBeAttached();
  });
});
