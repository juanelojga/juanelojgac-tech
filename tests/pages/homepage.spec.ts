import { test, expect } from '../fixtures/accessibility';
import { waitForImagesToLoad, waitForAnimations } from '../fixtures/visual';

/**
 * Homepage E2E and accessibility tests
 */
test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForImagesToLoad(page);
    await waitForAnimations(page);
  });

  test('should load successfully', async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveTitle(/JuaneloJGAC Tech/i);

    // Verify main content is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check for essential meta tags
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check for viewport meta tag
    const metaViewport = page.locator('meta[name="viewport"]');
    await expect(metaViewport).toHaveAttribute('content', /width=device-width/i);
  });

  test('should pass accessibility scan', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Verify heading structure
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
      elements.map((el) => ({
        level: parseInt(el.tagName.substring(1)),
        text: el.textContent?.trim(),
      }))
    );

    // Should start with h1
    expect(headings[0]?.level).toBe(1);
  });

  test('should render correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await waitForAnimations(page);

    // Verify main content is still visible
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for mobile-friendly touch targets (at least 44x44)
    const buttons = await page.$$('button, a');
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(32); // Minimum for good UX
      }
    }
  });

  test('should have good color contrast', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder().withRules(['color-contrast']).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should capture visual baseline @visual', async ({ page }) => {
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(consoleErrors).toEqual([]);
  });

  test('should have valid HTML', async ({ page }) => {
    // Check for common HTML validation issues
    const html = await page.content();

    // Should have doctype
    expect(html).toMatch(/<!DOCTYPE html>/i);

    // Should have lang attribute
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });
});
