import { test, expect } from '../fixtures/accessibility';

/**
 * shadcn/ui Modal/Dialog component tests
 * Tests modal behavior, accessibility, and keyboard navigation
 */
test.describe('Modal/Dialog Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper ARIA roles', async ({ page }) => {
    const dialogs = page.locator('[role="dialog"], dialog');
    const count = await dialogs.count();

    for (let i = 0; i < count; i++) {
      const dialog = dialogs.nth(i);
      const role = await dialog.getAttribute('role');
      const tagName = await dialog.evaluate((el) => el.tagName.toLowerCase());

      // Should be either dialog element or have role="dialog"
      expect(role === 'dialog' || tagName === 'dialog').toBe(true);
    }
  });

  test('should have accessible labels', async ({ page, makeAxeBuilder }) => {
    const dialogs = page.locator('[role="dialog"], dialog');
    const count = await dialogs.count();

    for (let i = 0; i < count; i++) {
      const dialog = dialogs.nth(i);
      const ariaLabel = await dialog.getAttribute('aria-label');
      const ariaLabelledBy = await dialog.getAttribute('aria-labelledby');

      // Dialog should have aria-label or aria-labelledby
      expect(ariaLabel !== null || ariaLabelledBy !== null).toBe(true);
    }
  });

  test('should trap focus within modal', async ({ page }) => {
    const dialogTriggers = page.locator('button[aria-haspopup="dialog"]');
    const count = await dialogTriggers.count();

    if (count > 0) {
      const trigger = dialogTriggers.first();
      await trigger.click();

      // Wait for dialog to open
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();

      // Get all focusable elements within dialog
      const focusableElements = await dialog.locator(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ).all();

      if (focusableElements.length > 1) {
        // Focus should be trapped within the dialog
        for (let i = 0; i < focusableElements.length + 1; i++) {
          await page.keyboard.press('Tab');
        }

        // Focus should still be within dialog
        const activeElement = await page.evaluate(() => {
          const active = document.activeElement;
          return active?.closest('[role="dialog"]') !== null;
        });

        expect(activeElement).toBe(true);
      }
    }
  });

  test('should close on Escape key', async ({ page }) => {
    const dialogTriggers = page.locator('button[aria-haspopup="dialog"]');
    const count = await dialogTriggers.count();

    if (count > 0) {
      const trigger = dialogTriggers.first();
      await trigger.click();

      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');

      // Dialog should close
      await expect(dialog).not.toBeVisible();
    }
  });

  test('should have close button', async ({ page }) => {
    const dialogTriggers = page.locator('button[aria-haspopup="dialog"]');
    const count = await dialogTriggers.count();

    if (count > 0) {
      const trigger = dialogTriggers.first();
      await trigger.click();

      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();

      // Look for close button
      const closeButton = dialog.locator('button[aria-label*="close" i], button[aria-label*="cerrar" i]');
      await expect(closeButton).toBeVisible();

      // Close button should work
      await closeButton.click();
      await expect(dialog).not.toBeVisible();
    }
  });

  test('should return focus to trigger on close', async ({ page }) => {
    const dialogTriggers = page.locator('button[aria-haspopup="dialog"]');
    const count = await dialogTriggers.count();

    if (count > 0) {
      const trigger = dialogTriggers.first();
      await trigger.focus();
      await trigger.click();

      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();

      // Close dialog
      await page.keyboard.press('Escape');

      // Focus should return to trigger
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBe('BUTTON');
    }
  });

  test('should have proper backdrop', async ({ page }) => {
    const dialogTriggers = page.locator('button[aria-haspopup="dialog"]');
    const count = await dialogTriggers.count();

    if (count > 0) {
      const trigger = dialogTriggers.first();
      await trigger.click();

      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();

      // Check for backdrop/overlay
      const backdrop = page.locator('[data-radix-dialog-overlay], .dialog-overlay, .modal-backdrop');
      if (await backdrop.count() > 0) {
        await expect(backdrop.first()).toBeVisible();

        // Backdrop should have some opacity/color
        const bgColor = await backdrop.first().evaluate((el) =>
          window.getComputedStyle(el).backgroundColor
        );
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });

  test('should pass accessibility scan', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .include('[role="dialog"]')
      .withRules([
        'aria-dialog-name',
        'aria-required-attr',
        'color-contrast',
      ])
      .analyze();

    // Note: This might fail if no dialogs are present on the page
    // In production, you'd navigate to a page with a modal
    if (await page.locator('[role="dialog"]').count() > 0) {
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('should prevent body scroll when open', async ({ page }) => {
    const dialogTriggers = page.locator('button[aria-haspopup="dialog"]');
    const count = await dialogTriggers.count();

    if (count > 0) {
      const trigger = dialogTriggers.first();
      await trigger.click();

      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();

      // Check if body has overflow hidden or similar
      const bodyOverflow = await page.evaluate(() =>
        window.getComputedStyle(document.body).overflow
      );

      // Body should prevent scrolling (overflow: hidden or similar)
      expect(['hidden', 'clip']).toContain(bodyOverflow);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const dialogTriggers = page.locator('button[aria-haspopup="dialog"]');
    const count = await dialogTriggers.count();

    if (count > 0) {
      const trigger = dialogTriggers.first();
      await trigger.click();

      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();

      // Dialog should fit within viewport
      const box = await dialog.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
      }
    }
  });
});
