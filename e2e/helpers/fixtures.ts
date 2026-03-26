import { test as base, type Page } from "@playwright/test";

/**
 * Extended test fixtures for the AI Consultant E2E tests.
 */
export const test = base.extend<{
  /** Navigate to the homepage and wait for full hydration */
  homePage: Page;
}>({
  homePage: async ({ page }, use) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await use(page);
  },
});

export { expect } from "@playwright/test";
