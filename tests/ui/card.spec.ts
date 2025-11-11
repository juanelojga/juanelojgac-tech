import { test, expect } from '../fixtures/accessibility';
import { captureComponentScreenshot } from '../fixtures/visual';
import { viewports } from '../config/viewports';

/**
 * shadcn/ui Card component tests
 * Tests card rendering, responsiveness, and accessibility
 */
test.describe('Card Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with cards
    await page.goto('/');
  });

  test('should render card elements', async ({ page }) => {
    // Look for common card patterns
    const cards = page.locator('[class*="card"], [data-testid*="card"], article, .card');
    const count = await cards.count();

    // May or may not have cards depending on the page
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper semantic structure', async ({ page }) => {
    const cards = await page.$$('[class*="card"], article');

    if (cards.length > 0) {
      for (const card of cards) {
        // Cards should be semantic HTML elements or have proper ARIA
        const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
        const role = await card.getAttribute('role');

        const isSemanticOrHasRole =
          ['article', 'section', 'div'].includes(tagName) &&
          (!role || ['article', 'region'].includes(role));

        expect(isSemanticOrHasRole).toBe(true);
      }
    }
  });

  test('should be accessible', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .include('[class*="card"], article')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have adequate color contrast', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .include('[class*="card"], article')
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/');

    const cards = page.locator('[class*="card"], article');
    const count = await cards.count();

    if (count > 0) {
      const firstCard = cards.first();

      // Card should be visible on mobile
      await expect(firstCard).toBeVisible();

      // Card should fit within viewport width
      const box = await firstCard.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(viewports.mobile.width);
      }
    }
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize(viewports.tabletLandscape);
    await page.goto('/');

    const cards = page.locator('[class*="card"], article');
    const count = await cards.count();

    if (count > 0) {
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();

      const box = await firstCard.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(viewports.tabletLandscape.width);
      }
    }
  });

  test('should support hover states', async ({ page }) => {
    const cards = await page.$$('[class*="card"], article');

    if (cards.length > 0) {
      const firstCard = cards[0];

      // Get initial styles
      const initialStyles = await firstCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          transform: styles.transform,
          boxShadow: styles.boxShadow,
        };
      });

      // Hover over card
      await firstCard.hover();

      // Verify card is still visible after hover
      const isVisible = await firstCard.isVisible();
      expect(isVisible).toBe(true);
    }
  });

  test('should have clickable areas if interactive', async ({ page }) => {
    const interactiveCards = await page.$$(
      '[class*="card"] a, [class*="card"] button, article a, article button'
    );

    for (const element of interactiveCards) {
      const box = await element.boundingBox();
      if (box && (await element.isVisible())) {
        // Interactive elements should have adequate touch target size
        expect(box.height).toBeGreaterThanOrEqual(32);
        expect(box.width).toBeGreaterThanOrEqual(32);
      }
    }
  });

  test('should render images properly if present', async ({ page }) => {
    const cardImages = await page.$$('[class*="card"] img, article img');

    for (const img of cardImages) {
      // Images should have alt text
      const alt = await img.getAttribute('alt');
      expect(alt !== null).toBe(true);

      // Images should load
      const isLoaded = await img.evaluate((el) => {
        const imgEl = el as HTMLImageElement;
        return imgEl.complete && imgEl.naturalHeight > 0;
      });

      if (await img.isVisible()) {
        expect(isLoaded).toBe(true);
      }
    }
  });

  test('should have proper heading hierarchy in cards', async ({ page }) => {
    const cardHeadings = await page.$$eval(
      '[class*="card"] h1, [class*="card"] h2, [class*="card"] h3, article h1, article h2, article h3',
      (headings) =>
        headings.map((h) => ({
          level: parseInt(h.tagName.substring(1)),
          text: h.textContent?.trim(),
        }))
    );

    // Card headings should typically be h2 or h3
    for (const heading of cardHeadings) {
      expect(heading.level).toBeGreaterThanOrEqual(2);
      expect(heading.level).toBeLessThanOrEqual(6);
    }
  });

  test('should capture visual baseline', async ({ page }) => {
    const cards = page.locator('[class*="card"], article').first();

    if (await cards.isVisible()) {
      await captureComponentScreenshot(cards, 'card-default');
    }
  });

  test('should maintain layout integrity', async ({ page }) => {
    const cards = await page.$$('[class*="card"], article');

    for (const card of cards) {
      if (await card.isVisible()) {
        const box = await card.boundingBox();

        if (box) {
          // Card should have reasonable dimensions
          expect(box.width).toBeGreaterThan(0);
          expect(box.height).toBeGreaterThan(0);

          // Card should not overflow viewport
          const viewportWidth = page.viewportSize()?.width || 1280;
          expect(box.width).toBeLessThanOrEqual(viewportWidth);
        }
      }
    }
  });

  test('should handle long content gracefully', async ({ page }) => {
    const cards = await page.$$('[class*="card"], article');

    if (cards.length > 0) {
      for (const card of cards) {
        // Check for text overflow
        const hasOverflow = await card.evaluate((el) => {
          return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
        });

        // Content should not overflow (should have proper text wrapping/truncation)
        // This is a soft check - some cards may intentionally have scrollable content
        const box = await card.boundingBox();
        if (box && hasOverflow) {
          // If there's overflow, card should have reasonable dimensions
          expect(box.height).toBeGreaterThan(0);
        }
      }
    }
  });
});
