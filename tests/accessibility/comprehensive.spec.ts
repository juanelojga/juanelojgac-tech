import { test, expect } from '../fixtures/accessibility';
import { viewports } from '../config/viewports';
import { accessibilityThresholds } from '../config/thresholds';

/**
 * Comprehensive Accessibility Audit
 * Full WCAG 2.1 Level AA compliance testing
 *
 * @tag accessibility
 */
test.describe('Comprehensive Accessibility Audit', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/en/', name: 'Homepage (EN)' },
    { path: '/es/', name: 'Homepage (ES)' },
  ];

  for (const { path, name } of pages) {
    test(`should pass full accessibility scan on ${name}`, async ({ page, makeAxeBuilder }) => {
      await page.goto(path);

      // Run comprehensive accessibility scan
      const accessibilityScanResults = await makeAxeBuilder()
        .analyze();

      // Log violations for debugging
      if (accessibilityScanResults.violations.length > 0) {
        console.log('\n❌ Accessibility Violations Found:');
        accessibilityScanResults.violations.forEach((violation) => {
          console.log(`\n  Rule: ${violation.id}`);
          console.log(`  Impact: ${violation.impact}`);
          console.log(`  Description: ${violation.description}`);
          console.log(`  Help: ${violation.helpUrl}`);
          console.log(`  Elements affected: ${violation.nodes.length}`);
        });
      }

      expect(accessibilityScanResults.violations.length).toBeLessThanOrEqual(
        accessibilityThresholds.maxViolations
      );
    });
  }

  test('should have proper document structure', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .withRules([
        'html-has-lang',
        'html-lang-valid',
        'page-has-heading-one',
        'landmark-one-main',
        'region',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .withRules([
        'heading-order',
        'empty-heading',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have accessible forms', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .withRules([
        'label',
        'form-field-multiple-labels',
        'label-title-only',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper list structure', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .withRules([
        'list',
        'listitem',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have duplicate IDs', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['duplicate-id', 'duplicate-id-active', 'duplicate-id-aria'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass accessibility on mobile viewport', async ({ page, makeAxeBuilder }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(accessibilityScanResults.violations.length).toBeLessThanOrEqual(
      accessibilityThresholds.maxViolations
    );
  });

  test('should pass accessibility on tablet viewport', async ({ page, makeAxeBuilder }) => {
    await page.setViewportSize(viewports.tabletLandscape);
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(accessibilityScanResults.violations.length).toBeLessThanOrEqual(
      accessibilityThresholds.maxViolations
    );
  });

  test('should have valid meta tags for accessibility', async ({ page }) => {
    await page.goto('/');

    // Check lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(['en', 'es']).toContain(htmlLang);

    // Check viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });

  test('should not use deprecated elements', async ({ page }) => {
    await page.goto('/');

    const deprecatedElements = await page.$$eval(
      'marquee, blink, center, font, frame, frameset',
      (elements) => elements.length
    );

    expect(deprecatedElements).toBe(0);
  });

  test('should have adequate touch target sizes', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/');

    const interactiveElements = await page.$$('button, a, input, select, textarea, [role="button"]');

    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      if (box && (await element.isVisible())) {
        // WCAG 2.1 Level AA recommends minimum 32x32
        expect(box.height).toBeGreaterThanOrEqual(
          accessibilityThresholds.minTouchTargetSizeAA
        );
        expect(box.width).toBeGreaterThanOrEqual(
          accessibilityThresholds.minTouchTargetSizeAA
        );
      }
    }
  });

  test('should have skip navigation link', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['skip-link', 'bypass'])
      .analyze();

    // Skip links improve accessibility but aren't always required
    // This is a warning-level check
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(criticalViolations).toEqual([]);
  });
});
