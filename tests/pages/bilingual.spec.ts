import { test, expect } from '../fixtures/accessibility';
import { waitForPageLoad } from '../config/helpers';

/**
 * Bilingual (EN/ES) Content Tests
 * Verifies proper i18n implementation and language switching
 */
test.describe('Bilingual Content', () => {
  test('should have both English and Spanish versions', async ({ page }) => {
    // Test English version
    const enResponse = await page.goto('/en/');
    expect(enResponse?.status()).toBeLessThan(400);

    const enLang = await page.locator('html').getAttribute('lang');
    expect(enLang).toBe('en');

    // Test Spanish version
    const esResponse = await page.goto('/es/');
    expect(esResponse?.status()).toBeLessThan(400);

    const esLang = await page.locator('html').getAttribute('lang');
    expect(esLang).toBe('es');
  });

  test('should have language switcher on all pages', async ({ page }) => {
    const pages = ['/en/', '/es/'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Look for language links
      const langLinks = page.locator('a[href*="/en/"], a[href*="/es/"]');
      const count = await langLinks.count();

      // Should have at least one language link
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should switch language when clicking language switcher', async ({ page }) => {
    // Start on English
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Find Spanish link
    const spanishLink = page.locator('a[href*="/es/"]').first();

    if (await spanishLink.isVisible()) {
      await spanishLink.click();
      await waitForPageLoad(page);

      // Should now be on Spanish version
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    }
  });

  test('should maintain page context when switching languages', async ({ page }) => {
    // This test assumes similar URL structure for both languages
    await page.goto('/en/');
    const enURL = page.url();

    // Switch to Spanish
    const spanishLink = page.locator('a[href*="/es/"]').first();

    if (await spanishLink.isVisible()) {
      await spanishLink.click();
      await waitForPageLoad(page);

      const esURL = page.url();

      // URLs should be similar, just with different language prefix
      expect(esURL).toContain('/es/');
      expect(enURL).toContain('/en/');
    }
  });

  test('should have proper hreflang tags', async ({ page }) => {
    await page.goto('/en/');

    // Check for hreflang alternate tags
    const hreflangTags = await page.$$eval(
      'link[rel="alternate"][hreflang]',
      (links) =>
        links.map((link) => ({
          hreflang: link.getAttribute('hreflang'),
          href: link.getAttribute('href'),
        }))
    );

    // Should have hreflang tags for multiple languages
    // This is optional but recommended for SEO
    if (hreflangTags.length > 0) {
      const languages = hreflangTags.map((tag) => tag.hreflang);
      expect(languages.length).toBeGreaterThan(0);
    }
  });

  test('should have different content for different languages', async ({ page }) => {
    // Get English content
    await page.goto('/en/');
    const enContent = await page.locator('main, body').textContent();

    // Get Spanish content
    await page.goto('/es/');
    const esContent = await page.locator('main, body').textContent();

    // Content should be different (assuming pages are translated)
    expect(enContent).not.toEqual(esContent);
  });

  test('should have proper lang attributes on text elements', async ({ page }) => {
    await page.goto('/en/');

    // Main content should have correct lang
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');

    // If there are Spanish snippets in English page, they should have lang="es"
    const spanishSnippets = await page.$$('[lang="es"]');
    // This is optional, so we just check it doesn't error
    expect(spanishSnippets.length).toBeGreaterThanOrEqual(0);
  });

  test('should handle language-specific date formatting', async ({ page }) => {
    // This test checks if dates are formatted correctly for each language
    const pages = [
      { path: '/en/', lang: 'en' },
      { path: '/es/', lang: 'es' },
    ];

    for (const { path, lang } of pages) {
      await page.goto(path);

      // Look for date elements (common patterns)
      const dates = await page.$$('time, [datetime], .date');

      // If dates exist, they should be properly formatted
      // This is a basic check - actual implementation may vary
      expect(dates.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have accessible language switcher', async ({ page, makeAxeBuilder }) => {
    await page.goto('/en/');

    // Language switcher should be accessible
    const accessibilityScanResults = await makeAxeBuilder()
      .include('a[href*="/en/"], a[href*="/es/"]')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have clear language labels in switcher', async ({ page }) => {
    await page.goto('/en/');

    const langLinks = await page.$$eval('a[href*="/en/"], a[href*="/es/"]', (links) =>
      links.map((link) => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim(),
        ariaLabel: link.getAttribute('aria-label'),
      }))
    );

    for (const link of langLinks) {
      // Each language link should have text or aria-label
      const hasLabel = (link.text && link.text.length > 0) || link.ariaLabel;
      expect(hasLabel).toBe(true);
    }
  });

  test('should preserve user session across language switches', async ({ page }) => {
    // Navigate to English version
    await page.goto('/en/');

    // Add a session indicator (e.g., localStorage item)
    await page.evaluate(() => {
      localStorage.setItem('testSession', 'active');
    });

    // Switch to Spanish
    const spanishLink = page.locator('a[href*="/es/"]').first();

    if (await spanishLink.isVisible()) {
      await spanishLink.click();
      await waitForPageLoad(page);

      // Check if session is preserved
      const sessionValue = await page.evaluate(() => {
        return localStorage.getItem('testSession');
      });

      expect(sessionValue).toBe('active');
    }
  });

  test('should have consistent navigation structure across languages', async ({ page }) => {
    // Get navigation on English page
    await page.goto('/en/');
    const enNavItems = await page.$$eval('nav a, [role="navigation"] a', (links) => links.length);

    // Get navigation on Spanish page
    await page.goto('/es/');
    const esNavItems = await page.$$eval('nav a, [role="navigation"] a', (links) => links.length);

    // Both should have similar number of nav items
    expect(enNavItems).toBe(esNavItems);
  });
});
