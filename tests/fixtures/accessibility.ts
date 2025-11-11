import { test as base, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Custom test fixture with accessibility testing utilities
 */
export const test = base.extend({
  /**
   * Automatically inject accessibility testing into every test
   */
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        // Configure axe to check for WCAG 2.1 Level AA compliance
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // Exclude known third-party elements if needed
        .exclude('#third-party-widget');

    await use(makeAxeBuilder);
  },
});

/**
 * Helper to run accessibility scan on the current page
 */
export async function runAccessibilityScan(page: Page) {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  return accessibilityScanResults;
}

/**
 * Helper to check specific accessibility rules
 */
export async function checkColorContrast(page: Page) {
  const results = await new AxeBuilder({ page })
    .include('[role="button"]')
    .include('button')
    .include('a')
    .withRules(['color-contrast'])
    .analyze();

  return results;
}

/**
 * Helper to check ARIA attributes
 */
export async function checkAriaAttributes(page: Page) {
  const results = await new AxeBuilder({ page })
    .withRules([
      'aria-allowed-attr',
      'aria-required-attr',
      'aria-required-children',
      'aria-required-parent',
      'aria-roles',
      'aria-valid-attr',
      'aria-valid-attr-value',
    ])
    .analyze();

  return results;
}

export { expect } from '@playwright/test';
