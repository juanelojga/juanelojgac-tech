import { Page, expect } from '@playwright/test';

/**
 * Common helper functions for tests
 */

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Wait for all images to load
 */
export async function waitForImages(page: Page) {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every((img) => img.complete && img.naturalHeight > 0);
  });
}

/**
 * Scroll to element smoothly
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  // Wait for scroll animation
  await page.waitForTimeout(300);
}

/**
 * Get all console errors from page
 */
export async function getConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
}

/**
 * Check if element is visible in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
}

/**
 * Wait for element to be visible
 */
export async function waitForVisible(page: Page, selector: string, timeout = 5000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
}

/**
 * Check page metadata
 */
export async function checkMetadata(page: Page, expectedTitle: string | RegExp) {
  // Check title
  if (typeof expectedTitle === 'string') {
    await expect(page).toHaveTitle(expectedTitle);
  } else {
    await expect(page).toHaveTitle(expectedTitle);
  }

  // Check essential meta tags
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute('content', /.+/);

  const metaViewport = page.locator('meta[name="viewport"]');
  await expect(metaViewport).toHaveAttribute('content', /width=device-width/i);
}

/**
 * Check for hydration errors
 */
export async function checkForHydrationErrors(page: Page) {
  const errors: string[] = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('Hydration') ||
      text.includes('hydration') ||
      text.includes('mismatch')
    ) {
      errors.push(text);
    }
  });

  return errors;
}

/**
 * Test bilingual navigation
 */
export async function testBilingualLinks(page: Page) {
  // Check for language switcher
  const langSwitcher = page.locator('[data-testid="language-switcher"], .language-switcher');

  // Check for bilingual links (en/es)
  const links = await page.$$('a[href^="/en/"], a[href^="/es/"]');

  return links.length > 0;
}

/**
 * Measure page load performance
 */
export async function measurePerformance(page: Page) {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    };
  });

  return metrics;
}

/**
 * Take full page screenshot with proper waiting
 */
export async function takeFullPageScreenshot(
  page: Page,
  name: string,
  options?: { maxDiffPixels?: number; threshold?: number }
) {
  // Wait for page to be stable
  await waitForPageLoad(page);
  await waitForImages(page);
  await page.waitForTimeout(500); // Wait for any animations

  // Take screenshot
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    maxDiffPixels: options?.maxDiffPixels ?? 100,
    threshold: options?.threshold ?? 0.2,
  });
}

/**
 * Check for broken links
 */
export async function checkForBrokenLinks(page: Page) {
  const links = await page.$$eval('a[href]', (anchors) =>
    anchors.map((a) => ({
      href: a.getAttribute('href'),
      text: a.textContent?.trim(),
    }))
  );

  const brokenLinks: Array<{ href: string | null; text: string | undefined }> = [];

  for (const link of links) {
    if (!link.href) continue;

    // Skip external links, anchors, and mailto/tel links
    if (
      link.href.startsWith('http') ||
      link.href.startsWith('#') ||
      link.href.startsWith('mailto:') ||
      link.href.startsWith('tel:')
    ) {
      continue;
    }

    // Check if internal link is valid
    try {
      const response = await page.goto(link.href);
      if (!response || response.status() >= 400) {
        brokenLinks.push(link);
      }
    } catch {
      brokenLinks.push(link);
    }
  }

  return brokenLinks;
}
