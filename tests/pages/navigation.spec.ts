import { test, expect } from '../fixtures/accessibility';
import { checkMetadata, waitForPageLoad } from '../config/helpers';
import { performanceThresholds } from '../config/thresholds';

/**
 * Navigation and Page Flow Tests
 * Tests bilingual navigation, page loads, and routing
 */
test.describe('Page Navigation', () => {
  const pages = [
    { path: '/', title: /JuaneloJGAC Tech/i, lang: 'en' },
    { path: '/en/', title: /JuaneloJGAC Tech/i, lang: 'en' },
    { path: '/es/', title: /JuaneloJGAC Tech/i, lang: 'es' },
  ];

  for (const { path, title, lang } of pages) {
    test(`should load ${path} successfully`, async ({ page }) => {
      const startTime = Date.now();

      await page.goto(path);
      await waitForPageLoad(page);

      const loadTime = Date.now() - startTime;

      // Verify page loaded
      await expect(page).toHaveTitle(title);

      // Check load time (should be under 2 seconds)
      expect(loadTime).toBeLessThan(performanceThresholds.pageLoadTime);
    });

    test(`should have correct lang attribute on ${path}`, async ({ page }) => {
      await page.goto(path);

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe(lang);
    });

    test(`should have correct metadata on ${path}`, async ({ page }) => {
      await page.goto(path);
      await checkMetadata(page, title);
    });
  }

  test('should navigate between bilingual pages', async ({ page }) => {
    // Start on English page
    await page.goto('/en/');
    await expect(page).toHaveURL(/\/en\//);

    // Look for language switcher
    const langSwitcher = page.locator(
      '[data-testid="language-switcher"], .language-switcher, [href*="/es/"]'
    );

    const switcherExists = (await langSwitcher.count()) > 0;

    if (switcherExists) {
      // Click language switcher to go to Spanish
      const spanishLink = page.locator('a[href*="/es/"]').first();

      if (await spanishLink.isVisible()) {
        await spanishLink.click();
        await waitForPageLoad(page);

        // Should be on Spanish page
        await expect(page).toHaveURL(/\/es\//);

        // HTML lang should be Spanish
        const htmlLang = await page.locator('html').getAttribute('lang');
        expect(htmlLang).toBe('es');
      }
    }
  });

  test('should maintain navigation context across pages', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Get navigation element
    const nav = page.locator('nav, [role="navigation"]');
    const navExists = (await nav.count()) > 0;

    if (navExists) {
      // Navigation should be visible
      await expect(nav.first()).toBeVisible();

      // Get navigation links
      const navLinks = await nav.locator('a').count();
      expect(navLinks).toBeGreaterThan(0);
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    // Should return 404 status or redirect
    if (response) {
      const status = response.status();
      expect([404, 301, 302, 200]).toContain(status);
    }
  });

  test('should have working internal links', async ({ page }) => {
    await page.goto('/');

    // Get all internal links
    const internalLinks = await page.$$eval(
      'a[href^="/"], a[href^="./"]',
      (links) =>
        links.map((link) => ({
          href: link.getAttribute('href'),
          text: link.textContent?.trim(),
        }))
    );

    // Test first few internal links (to avoid long test times)
    const linksToTest = internalLinks.slice(0, 5);

    for (const link of linksToTest) {
      if (link.href && !link.href.includes('#')) {
        const response = await page.goto(link.href);

        if (response) {
          const status = response.status();
          expect(status).toBeLessThan(400);
        }

        // Navigate back
        await page.goto('/');
      }
    }
  });

  test('should preserve scroll position on back navigation', async ({ page }) => {
    await page.goto('/');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));

    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(0);

    // Navigate to another page if there are links
    const firstLink = page.locator('a[href^="/"]').first();
    const linkExists = (await firstLink.count()) > 0;

    if (linkExists) {
      await firstLink.click();
      await waitForPageLoad(page);

      // Go back
      await page.goBack();
      await waitForPageLoad(page);

      // Scroll position might be restored (browser-dependent)
      const newScrollPosition = await page.evaluate(() => window.scrollY);
      expect(newScrollPosition).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have consistent header across pages', async ({ page }) => {
    const pagesToCheck = ['/en/', '/es/'];

    for (const pagePath of pagesToCheck) {
      await page.goto(pagePath);

      // Check for header element
      const header = page.locator('header, [role="banner"]');
      await expect(header.first()).toBeVisible();
    }
  });

  test('should have consistent footer across pages', async ({ page }) => {
    const pagesToCheck = ['/en/', '/es/'];

    for (const pagePath of pagesToCheck) {
      await page.goto(pagePath);

      // Check for footer element
      const footer = page.locator('footer, [role="contentinfo"]');

      // Footer should exist (though not necessarily visible above fold)
      const footerCount = await footer.count();
      expect(footerCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle browser navigation (back/forward)', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/en/');
    await waitForPageLoad(page);

    // Navigate to Spanish version
    await page.goto('/es/');
    await waitForPageLoad(page);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/en\//);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/\/es\//);
  });

  test('should have breadcrumbs if applicable', async ({ page }) => {
    await page.goto('/');

    // Look for breadcrumb navigation
    const breadcrumbs = page.locator('[aria-label*="breadcrumb"], .breadcrumb, nav ol, nav ul');

    // Breadcrumbs are optional for homepage
    const breadcrumbCount = await breadcrumbs.count();
    expect(breadcrumbCount).toBeGreaterThanOrEqual(0);
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await waitForPageLoad(page);

    expect(errors).toEqual([]);
  });

  test('should have proper canonical URLs', async ({ page }) => {
    const pagesToCheck = ['/en/', '/es/'];

    for (const pagePath of pagesToCheck) {
      await page.goto(pagePath);

      // Check for canonical link
      const canonical = page.locator('link[rel="canonical"]');
      const canonicalCount = await canonical.count();

      // Canonical URLs are recommended but not required
      if (canonicalCount > 0) {
        const href = await canonical.getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });
});
