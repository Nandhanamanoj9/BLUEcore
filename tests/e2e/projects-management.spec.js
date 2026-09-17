import { test, expect, request } from '@playwright/test';
import { API_BASE_URL, ADMIN_CREDENTIALS } from '../helpers/test-data.js';

test.describe.serial('Projects Section & Admin Management', () => {
  test('Public Projects section has Residential, Commercial, and Exterior categories with scrollable cards', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeVisible();

    // Verify all 3 categories exist
    const residentialTitle = projectsSection.locator('h3:has-text("Residential")');
    const commercialTitle = projectsSection.locator('h3:has-text("Commercial")');
    const exteriorTitle = projectsSection.locator('h3:has-text("Exterior")');

    await expect(residentialTitle).toBeVisible();
    await expect(commercialTitle).toBeVisible();
    await expect(exteriorTitle).toBeVisible();

    // Verify default cards exist in scroll container
    const residentialCards = projectsSection.locator('.app-category-group:has-text("Residential") .app-card');
    await expect(residentialCards.first()).toBeVisible();
    await expect(residentialCards.locator('span:has-text("Homes")')).toBeVisible();
    await expect(residentialCards.locator('span:has-text("Living Rooms")')).toBeVisible();
  });

  test('Admin panel provides category-based Projects image management', async ({ page }) => {
    await page.goto('http://localhost:3000/#admin');

    // If login form is shown, log in
    const loginCard = page.locator('.admin-login-card');
    if (await loginCard.isVisible()) {
      await page.fill('input[type="email"]', ADMIN_CREDENTIALS.email);
      await page.fill('input[type="password"]', ADMIN_CREDENTIALS.password);
      await page.click('button[type="submit"]');
      await expect(page.locator('.admin-brand h2')).toBeVisible();
    }

    // Click Projects Gallery pill
    const projectsPill = page.locator('.section-nav-pill:has-text("Projects Gallery")');
    await expect(projectsPill).toBeVisible();
    await projectsPill.click();

    // Verify Category Subnav buttons exist
    const subnav = page.locator('.admin-category-subnav');
    await expect(subnav).toBeVisible();
    await expect(subnav.locator('button:has-text("Residential")')).toBeVisible();
    await expect(subnav.locator('button:has-text("Commercial")')).toBeVisible();
    await expect(subnav.locator('button:has-text("Exterior")')).toBeVisible();
    await expect(subnav.locator('button:has-text("All Categories")')).toBeVisible();

    // Verify Category Header reflects active category
    await expect(page.locator('.admin-gallery-header h3')).toContainText(/RESIDENTIAL|Residential/i);

    // Click Commercial and verify header switches
    await subnav.locator('button:has-text("Commercial")').click();
    await expect(page.locator('.admin-gallery-header h3')).toContainText(/COMMERCIAL|Commercial/i);

    // Click Exterior and verify header switches
    await subnav.locator('button:has-text("Exterior")').click();
    await expect(page.locator('.admin-gallery-header h3')).toContainText(/EXTERIOR|Exterior/i);
  });

  test('Full lifecycle: add project photo via API, display on public site with Lightbox, then remove', async ({ page }) => {
    // 1. Authenticate via backend API to get token
    const api = await request.newContext({ baseURL: API_BASE_URL });
    const loginRes = await api.post('/api/admin/login', {
      data: ADMIN_CREDENTIALS
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    const token = loginData.data.token;

    // 2. Add test project photo to Residential category
    const addRes = await api.post('/api/images/galleries/projects_gallery/batch', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        items: [
          {
            cat: 'RESIDENTIAL',
            label: 'E2E Test Luxury Living Room',
            image: '/images/showcase/wall-panels.jpg',
            legend: ['Residential', 'CNC Accent Wall']
          }
        ]
      }
    });
    expect(addRes.ok()).toBeTruthy();
    const addData = await addRes.json();
    const createdItemId = addData.data[0].id;

    // 3. Visit public site and verify the new photo appears in Residential scroll area
    await page.goto('http://localhost:3000/');
    const projectCard = page.locator('.app-category-group:has-text("Residential") .app-card.has-image:has-text("E2E Test Luxury Living Room")').first();
    await expect(projectCard).toBeVisible({ timeout: 10000 });

    // 4. Click the card and verify Lightbox opens with photo & title
    await projectCard.click();
    const lightbox = page.locator('#lightbox');
    await expect(lightbox).toBeVisible();
    await expect(page.locator('#lightboxCaption')).toHaveText('E2E Test Luxury Living Room');
    await expect(page.locator('#lightboxCat')).toHaveText('Residential');

    // 5. Close the lightbox
    await page.locator('#lightboxClose').click();
    await expect(lightbox).not.toBeVisible();

    // 6. Clean up: delete the test item from projects_gallery
    const deleteRes = await api.delete(`/api/images/galleries/projects_gallery/${createdItemId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    expect(deleteRes.ok()).toBeTruthy();

    // 7. Verify public site gracefully returns to default placeholders
    await page.reload();
    const defaultPlaceholder = page.locator('.app-category-group:has-text("Residential") span:has-text("Homes")');
    await expect(defaultPlaceholder).toBeVisible();

    await api.dispose();
  });
});
