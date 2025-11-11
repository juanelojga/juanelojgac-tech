import { test, expect } from '../fixtures/accessibility';

/**
 * ARIA Attributes and Roles Accessibility Tests
 * Verifies proper ARIA implementation across the application
 *
 * @tag accessibility
 */
test.describe('ARIA Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have valid ARIA attributes', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules([
        'aria-allowed-attr',
        'aria-valid-attr',
        'aria-valid-attr-value',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have valid ARIA roles', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['aria-roles', 'aria-allowed-role'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have required ARIA attributes', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules([
        'aria-required-attr',
        'aria-required-children',
        'aria-required-parent',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have accessible names for interactive elements', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules([
        'button-name',
        'link-name',
        'input-button-name',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper ARIA labels for form inputs', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .include('input, textarea, select')
      .withRules(['label', 'aria-input-field-name'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should use ARIA landmarks correctly', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['landmark-one-main', 'landmark-unique', 'region'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have valid ARIA live regions', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['aria-live-region'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have redundant ARIA attributes', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['aria-hidden-body', 'aria-hidden-focus'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
