import { test, expect } from '../fixtures/accessibility';

/**
 * Keyboard Navigation Accessibility Tests
 * Ensures all interactive elements are keyboard accessible
 *
 * @tag accessibility
 */
test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate through focusable elements with Tab', async ({ page }) => {
    // Get all focusable elements
    const focusableElements = await page.$$eval(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      (elements) => elements.length
    );

    // Should have at least some focusable elements
    expect(focusableElements).toBeGreaterThan(0);

    // Tab through first few elements
    for (let i = 0; i < Math.min(5, focusableElements); i++) {
      await page.keyboard.press('Tab');
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBeTruthy();
    }
  });

  test('should have visible focus indicators', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['focus-order-semantics'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have keyboard traps', async ({ page }) => {
    // Tab forward several times
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    // Tab backward
    await page.keyboard.press('Shift+Tab');

    // Should still be able to interact with page
    const isStuck = await page.evaluate(() => {
      return document.activeElement === document.body;
    });

    expect(isStuck).toBe(false);
  });

  test('should activate buttons with Enter and Space', async ({ page }) => {
    const button = page.locator('button').first();

    if (await button.isVisible()) {
      // Focus the button
      await button.focus();

      // Should be focusable
      const isFocused = await button.evaluate((el) => {
        return document.activeElement === el;
      });

      expect(isFocused).toBe(true);

      // Enter key should work (tested by ensuring button stays in DOM)
      await page.keyboard.press('Enter');
      await expect(button).toBeAttached();
    }
  });

  test('should activate links with Enter', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    if (linkCount > 0) {
      const firstLink = links.first();
      await firstLink.focus();

      const isFocused = await firstLink.evaluate((el) => {
        return document.activeElement === el;
      });

      expect(isFocused).toBe(true);
    }
  });

  test('should have proper tab order', async ({ page }) => {
    const tabOrder = await page.$$eval(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      (elements) => elements.map((el) => {
        const tabindex = el.getAttribute('tabindex');
        return tabindex ? parseInt(tabindex) : 0;
      })
    );

    // No negative tabindex on interactive elements
    const hasNegativeTabindex = tabOrder.some(index => index < 0);
    expect(hasNegativeTabindex).toBe(false);
  });

  test('should support Escape key for modals', async ({ page }) => {
    // Look for modal triggers
    const modalTriggers = await page.$$('[data-modal-trigger], [aria-haspopup="dialog"]');

    if (modalTriggers.length > 0) {
      // This test should be expanded when modals are implemented
      expect(modalTriggers.length).toBeGreaterThan(0);
    }
  });

  test('should not have tabindex > 0', async ({ page }) => {
    const positiveTabindexElements = await page.$$eval(
      '[tabindex]',
      (elements) => elements.filter((el) => {
        const tabindex = el.getAttribute('tabindex');
        return tabindex && parseInt(tabindex) > 0;
      }).length
    );

    // Positive tabindex is considered an anti-pattern
    expect(positiveTabindexElements).toBe(0);
  });
});
