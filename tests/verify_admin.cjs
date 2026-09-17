const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. Navigating to homepage...');
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(__dirname, '../public_homepage_wood.png') });
  console.log('Public homepage screenshot captured.');

  console.log('2. Navigating to Admin Login (#admin)...');
  await page.goto('http://localhost:3000/#admin');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, '../admin_login_screen.png') });
  console.log('Admin login screenshot captured.');

  console.log('3. Logging into Admin...');
  await page.fill('input[type="email"]', 'blucorenc@gmail.com');
  await page.fill('input[type="password"]', 'Admin@123456');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, '../admin_dashboard_slots.png') });
  console.log('Admin dashboard slots captured.');

  console.log('4. Testing Section Navigation...');
  // Click on Materials Gallery
  await page.locator('.section-nav-pill:has-text("Materials Gallery")').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, '../admin_section_materials.png') });
  console.log('Materials gallery section screenshot captured.');

  // Click on Portfolio Gallery
  await page.locator('.section-nav-pill:has-text("Portfolio Gallery")').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, '../admin_section_portfolio.png') });
  console.log('Portfolio gallery section screenshot captured.');

  // Click on Showcase
  await page.locator('.section-nav-pill:has-text("Showcase")').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, '../admin_section_showcase.png') });
  console.log('Showcase section screenshot captured.');

  console.log('5. Clicking View Website to verify seamless return...');
  await page.locator('.admin-btn-secondary').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, '../back_to_homepage.png') });
  console.log('Back to homepage captured.');

  await browser.close();
  console.log('ALL SECTION VERIFICATIONS SUCCESSFUL!');
})();

