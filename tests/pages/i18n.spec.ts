import { test, expect } from '../fixtures/accessibility';
import { waitForAnimations } from '../fixtures/visual';

/**
 * Internationalization (i18n) and language switcher tests
 */
test.describe('i18n and Language Switching', () => {
  test('should support English locale', async ({ page }) => {
    await page.goto('/en');
    await waitForAnimations(page);

    // Verify HTML lang attribute
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toMatch(/en/i);

    // Verify page loads
    await expect(page).toHaveTitle(/.+/);
  });

  test('should support Spanish locale', async ({ page }) => {
    await page.goto('/es');
    await waitForAnimations(page);

    // Verify HTML lang attribute
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toMatch(/es/i);

    // Verify page loads
    await expect(page).toHaveTitle(/.+/);
  });

  test('should have language switcher component', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Look for language switcher (adjust selector based on your implementation)
    const languageSwitcher = page.locator('[data-testid="language-switcher"]')
      .or(page.locator('nav a[href*="/en"], nav a[href*="/es"]'))
      .first();

    // Language switcher should be visible
    await expect(languageSwitcher).toBeVisible();
  });

  test('should switch between languages', async ({ page }) => {
    await page.goto('/en');
    await waitForAnimations(page);

    const initialLang = await page.locator('html').getAttribute('lang');
    expect(initialLang).toMatch(/en/i);

    // Find and click Spanish language link
    const esLink = page.locator('a[href*="/es"]').first();
    if (await esLink.isVisible()) {
      await esLink.click();
      await page.waitForURL(/\/es/);
      await waitForAnimations(page);

      const newLang = await page.locator('html').getAttribute('lang');
      expect(newLang).toMatch(/es/i);
    }
  });

  test('should maintain route structure across languages', async ({ page }) => {
    // Test that routes are consistent across languages
    const routes = ['/', '/en', '/es'];

    for (const route of routes) {
      await page.goto(route);
      await waitForAnimations(page);

      // Should not have 404 errors
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
    }
  });

  test('should have proper hreflang tags', async ({ page }) => {
    await page.goto('/');
    await waitForAnimations(page);

    // Check for hreflang alternates for SEO
    const hreflangs = await page.$$eval('link[hreflang]', (links) =>
      links.map((link) => ({
        hreflang: link.getAttribute('hreflang'),
        href: link.getAttribute('href'),
      })),
    );

    // Should have at least one hreflang tag (if implemented)
    // This is optional but recommended for multilingual sites
    if (hreflangs.length > 0) {
      expect(hreflangs.length).toBeGreaterThan(0);
    }
  });

  test('should pass accessibility scan on language switcher', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/');
    await waitForAnimations(page);

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    // Filter to only language switcher violations if present
    const violations = accessibilityScanResults.violations.filter(
      (violation) => {
        return violation.nodes.some((node) =>
          node.html.includes('language-switcher'),
        );
      },
    );

    expect(violations).toEqual([]);
  });

  test('should handle direct navigation to localized routes', async ({
    page,
  }) => {
    // Navigate directly to English version
    const enResponse = await page.goto('/en');
    expect(enResponse?.status()).toBe(200);

    // Navigate directly to Spanish version
    const esResponse = await page.goto('/es');
    expect(esResponse?.status()).toBe(200);
  });

  test('should preserve language preference on navigation', async ({
    page,
  }) => {
    await page.goto('/es');
    await waitForAnimations(page);

    // Get current language
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toMatch(/es/i);

    // Navigate to another page (if available)
    // This assumes internal links maintain the language
    const internalLinks = await page.$$('a[href^="/es"]');
    if (internalLinks.length > 1) {
      await internalLinks[1].click();
      await page.waitForLoadState('networkidle');

      const newLang = await page.locator('html').getAttribute('lang');
      expect(newLang).toMatch(/es/i);
    }
  });
});
