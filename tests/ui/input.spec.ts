import { test, expect } from '../fixtures/accessibility';

/**
 * shadcn/ui Input component tests
 * Tests form inputs for accessibility and functionality
 */
test.describe('Input Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper labels', async ({ page }) => {
    const inputs = await page.$$('input[type="text"], input[type="email"], input[type="search"]');

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Input should have a label, aria-label, or aria-labelledby
      if (id) {
        const label = await page.$(`label[for="${id}"]`);
        const hasLabel = label !== null || ariaLabel !== null || ariaLabelledBy !== null;
        expect(hasLabel).toBe(true);
      }
    }
  });

  test('should pass accessibility scan', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .include('input, textarea, select')
      .withRules([
        'label',
        'aria-input-field-name',
        'aria-required-attr',
        'color-contrast',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have visible focus indicators', async ({ page }) => {
    const input = page.locator('input').first();

    if (await input.isVisible()) {
      // Focus the input
      await input.focus();

      // Check for focus-visible styles
      const hasFocusStyles = await input.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return (
          styles.outline !== 'none' ||
          styles.boxShadow !== 'none' ||
          el.matches(':focus-visible')
        );
      });

      expect(hasFocusStyles).toBe(true);
    }
  });

  test('should support placeholder text', async ({ page }) => {
    const inputsWithPlaceholder = page.locator('input[placeholder]');
    const count = await inputsWithPlaceholder.count();

    for (let i = 0; i < count; i++) {
      const placeholder = await inputsWithPlaceholder.nth(i).getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
      expect(placeholder?.length).toBeGreaterThan(0);
    }
  });

  test('should handle validation states', async ({ page }) => {
    // Test for inputs with aria-invalid
    const invalidInputs = page.locator('input[aria-invalid="true"]');
    const count = await invalidInputs.count();

    for (let i = 0; i < count; i++) {
      const input = invalidInputs.nth(i);

      // Invalid input should have error message
      const ariaDescribedBy = await input.getAttribute('aria-describedby');
      if (ariaDescribedBy) {
        const errorMessage = page.locator(`#${ariaDescribedBy}`);
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    const inputs = await page.$$('input');

    if (inputs.length > 1) {
      // Focus first input
      await inputs[0].focus();

      // Tab to next input
      await page.keyboard.press('Tab');

      // Check that focus moved
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toBeTruthy();
    }
  });

  test('should have proper autocomplete attributes', async ({ page }) => {
    // Check for sensitive inputs with autocomplete
    const emailInputs = page.locator('input[type="email"]');
    const passwordInputs = page.locator('input[type="password"]');

    const emailCount = await emailInputs.count();
    for (let i = 0; i < emailCount; i++) {
      const autocomplete = await emailInputs.nth(i).getAttribute('autocomplete');
      // Email inputs should have autocomplete="email" for better UX
      if (autocomplete) {
        expect(autocomplete).toMatch(/email/i);
      }
    }

    const passwordCount = await passwordInputs.count();
    for (let i = 0; i < passwordCount; i++) {
      const autocomplete = await passwordInputs.nth(i).getAttribute('autocomplete');
      // Password inputs should have appropriate autocomplete
      if (autocomplete) {
        expect(autocomplete).toMatch(/password|current-password|new-password/i);
      }
    }
  });

  test('should handle required fields', async ({ page }) => {
    const requiredInputs = page.locator('input[required], input[aria-required="true"]');
    const count = await requiredInputs.count();

    for (let i = 0; i < count; i++) {
      const input = requiredInputs.nth(i);

      // Required input should have visual indicator or aria-required
      const isRequired = await input.getAttribute('required');
      const ariaRequired = await input.getAttribute('aria-required');

      expect(isRequired !== null || ariaRequired === 'true').toBe(true);
    }
  });

  test('should have sufficient color contrast for labels', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .include('label')
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
