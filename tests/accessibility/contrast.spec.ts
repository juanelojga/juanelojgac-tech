import { test, expect } from '../fixtures/accessibility';
import { viewports } from '../config/viewports';
import { accessibilityThresholds } from '../config/thresholds';

/**
 * Color Contrast Accessibility Tests
 * Ensures all text and interactive elements meet WCAG 2.1 Level AA contrast requirements
 *
 * @tag accessibility
 */
test.describe('Color Contrast Compliance', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/en/', name: 'Homepage (EN)' },
    { path: '/es/', name: 'Homepage (ES)' },
  ];

  for (const { path, name } of pages) {
    test(`should have adequate contrast on ${name}`, async ({ page, makeAxeBuilder }) => {
      await page.goto(path);

      const accessibilityScanResults = await makeAxeBuilder()
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test('should have adequate contrast for buttons', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .include('button')
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have adequate contrast for links', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .include('a')
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have adequate contrast for form inputs', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .include('input, textarea, select')
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should maintain contrast on mobile viewports', async ({ page, makeAxeBuilder }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should maintain contrast on tablet viewports', async ({ page, makeAxeBuilder }) => {
    await page.setViewportSize(viewports.tabletLandscape);
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
