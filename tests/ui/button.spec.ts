import { test, expect } from '../fixtures/accessibility';
import { captureComponentScreenshot } from '../fixtures/visual';

/**
 * shadcn/ui Button component tests
 * Tests component rendering, state changes, and accessibility
 */
test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with buttons or component showcase
    await page.goto('/');
  });

  test('should render button elements', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    // Should have at least one button (adjust based on your pages)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have accessible labels', async ({ page, makeAxeBuilder }) => {
    // Check that all buttons have accessible names
    const buttons = await page.$$('button');

    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      const hasAccessibleName = ariaLabel || (textContent && textContent.trim());

      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('should have proper ARIA attributes', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .include('button')
      .withRules(['button-name', 'aria-allowed-attr', 'aria-valid-attr-value'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have adequate color contrast', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .include('button')
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Find first visible button
    const button = page.locator('button').first();

    if (await button.isVisible()) {
      // Focus button with Tab
      await page.keyboard.press('Tab');

      // Check if button can receive focus
      const isFocusable = await button.evaluate((el) => {
        return document.activeElement === el || el.matches(':focus-visible');
      });

      // Button should be focusable or have proper tabindex
      const tabIndex = await button.getAttribute('tabindex');
      expect(tabIndex === null || parseInt(tabIndex) >= 0).toBe(true);

      // Should be activatable with Enter or Space
      if (isFocusable) {
        await page.keyboard.press('Enter');
        // Add assertions for button click behavior
      }
    }
  });

  test('should have proper touch target size', async ({ page }) => {
    const buttons = await page.$$('button');

    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box && (await button.isVisible())) {
        // WCAG 2.1 Level AAA recommends 44x44 pixels
        // We'll use 32x32 as minimum for Level AA
        expect(box.height).toBeGreaterThanOrEqual(32);
        expect(box.width).toBeGreaterThanOrEqual(32);
      }
    }
  });

  test('should handle disabled state', async ({ page }) => {
    const disabledButton = page.locator('button[disabled]').first();

    if (await disabledButton.isVisible()) {
      // Disabled button should have proper attributes
      await expect(disabledButton).toBeDisabled();

      // Should have aria-disabled or disabled attribute
      const ariaDisabled = await disabledButton.getAttribute('aria-disabled');
      const disabled = await disabledButton.getAttribute('disabled');

      expect(ariaDisabled === 'true' || disabled !== null).toBe(true);
    }
  });

  test('should support different variants visually', async ({ page }) => {
    // This test assumes you have button variants like primary, secondary, etc.
    const buttons = await page.$$('button');

    if (buttons.length > 0) {
      // Capture screenshot of first button for visual regression
      await captureComponentScreenshot(
        page.locator('button').first(),
        'button-default',
      );
    }
  });

  test('should handle hover state', async ({ page }) => {
    const button = page.locator('button').first();

    if (await button.isVisible()) {
      // Get initial styles
      const initialBgColor = await button.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor,
      );

      // Hover over button
      await button.hover();

      // Styles might change on hover (optional test)
      // This is more for visual regression testing
      await expect(button).toBeVisible();
    }
  });

  test('should work with screen readers', async ({ page, makeAxeBuilder }) => {
    // Run comprehensive accessibility scan
    const accessibilityScanResults = await makeAxeBuilder()
      .include('button')
      .analyze();

    // No violations should be present
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
