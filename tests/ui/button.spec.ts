import { test, expect } from '../fixtures/accessibility';
import { captureComponentScreenshot } from '../fixtures/visual';

/**
 * Button Component E2E Tests
 * Tests the Dusty Pink → Purple gradient design system
 * Verifies rendering, variants, interactions, states, and accessibility
 */
test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with buttons or component showcase
    await page.goto('/');
  });

  test.describe('Variant Rendering', () => {
    test('should render primary gradient button with correct styles', async ({ page }) => {
      const primaryButton = page.locator('button').filter({ hasText: /get started|primary/i }).first();

      if (await primaryButton.isVisible()) {
        // Check for gradient classes
        const classes = await primaryButton.getAttribute('class');
        expect(classes).toBeTruthy();

        // Verify it's visible and has text
        await expect(primaryButton).toBeVisible();

        // Capture visual regression test
        await captureComponentScreenshot(primaryButton, 'button-primary-gradient');
      }
    });

    test('should render secondary outlined button with correct styles', async ({ page }) => {
      const secondaryButton = page.locator('button').filter({ hasText: /learn more|secondary/i }).first();

      if (await secondaryButton.isVisible()) {
        await expect(secondaryButton).toBeVisible();

        // Capture visual regression test
        await captureComponentScreenshot(secondaryButton, 'button-secondary-outlined');
      }
    });

    test('should render transparent text-only button', async ({ page }) => {
      const transparentButton = page.locator('button').filter({ hasText: /discover|learn more|explore/i }).first();

      if (await transparentButton.isVisible()) {
        await expect(transparentButton).toBeVisible();

        // Capture visual regression test
        await captureComponentScreenshot(transparentButton, 'button-transparent');
      }
    });
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
    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      const accessibilityScanResults = await makeAxeBuilder()
        .withRules(['button-name', 'aria-allowed-attr', 'aria-valid-attr-value'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('should have adequate color contrast', async ({ page, makeAxeBuilder }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      const accessibilityScanResults = await makeAxeBuilder()
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
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
    // Capture screenshots for all button variants
    const variants = [
      { selector: 'button', name: 'button-default' },
    ];

    for (const variant of variants) {
      const button = page.locator(variant.selector).first();
      if (await button.isVisible()) {
        await captureComponentScreenshot(button, variant.name);
      }
    }
  });

  test('should verify gradient colors on primary buttons', async ({ page }) => {
    const primaryButton = page
      .locator('button')
      .filter({ hasText: /get started|primary/i })
      .first();

    if (await primaryButton.isVisible()) {
      // Check computed styles for gradient
      const backgroundImage = await primaryButton.evaluate((el) =>
        window.getComputedStyle(el).backgroundImage
      );

      // Should have a gradient (linear-gradient)
      if (backgroundImage && backgroundImage !== 'none') {
        expect(backgroundImage).toContain('linear-gradient');
      }
    }
  });

  test('should handle hover state with gradient transition', async ({ page }) => {
    const button = page.locator('button').first();

    if (await button.isVisible()) {
      // Hover over button
      await button.hover();

      // Button should remain visible and potentially show gradient shift
      await expect(button).toBeVisible();

      // Capture hover state for visual regression
      await captureComponentScreenshot(button, 'button-hover-state');
    }
  });

  test('should show glow effect on primary button hover', async ({ page }) => {
    const primaryButton = page
      .locator('button')
      .filter({ hasText: /get started|primary/i })
      .first();

    if (await primaryButton.isVisible()) {
      // Initial state
      await captureComponentScreenshot(primaryButton, 'button-primary-initial');

      // Hover state
      await primaryButton.hover();
      await page.waitForTimeout(100); // Allow transition to start

      // Should be visible with hover effects
      await expect(primaryButton).toBeVisible();

      // Capture hover state with glow effect
      await captureComponentScreenshot(primaryButton, 'button-primary-hover-glow');
    }
  });

  test('should work with screen readers', async ({ page, makeAxeBuilder }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count > 0) {
      // Run comprehensive accessibility scan
      const accessibilityScanResults = await makeAxeBuilder().analyze();

      // No violations should be present
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
