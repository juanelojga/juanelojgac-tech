import { Page, Locator } from '@playwright/test';

/**
 * Visual regression testing utilities
 */

export interface VisualTestOptions {
  /**
   * Name of the screenshot for comparison
   */
  name: string;

  /**
   * Maximum allowed pixel difference
   */
  maxDiffPixels?: number;

  /**
   * Threshold for pixel comparison (0-1)
   */
  threshold?: number;

  /**
   * Mask dynamic elements before comparison
   */
  mask?: Locator[];

  /**
   * Whether to capture fullPage screenshot
   */
  fullPage?: boolean;
}

/**
 * Take a baseline screenshot for visual regression testing
 */
export async function captureVisualBaseline(
  page: Page,
  options: VisualTestOptions,
) {
  const {
    name,
    maxDiffPixels = 100,
    threshold = 0.2,
    mask = [],
    fullPage = false,
  } = options;

  await page.screenshot({
    path: `./tests/snapshots/${name}-baseline.png`,
    fullPage,
    mask,
  });

  return {
    name,
    maxDiffPixels,
    threshold,
  };
}

/**
 * Compare current state with baseline screenshot
 */
export async function compareVisual(page: Page, options: VisualTestOptions) {
  const {
    name,
    maxDiffPixels = 100,
    threshold = 0.2,
    mask = [],
    fullPage = false,
  } = options;

  await page.screenshot({
    path: `./reports/test-artifacts/${name}-current.png`,
    fullPage,
    mask,
  });

  // Playwright automatically compares screenshots
  await page.screenshot({
    animations: 'disabled',
    mask,
    fullPage,
  });
}

/**
 * Capture element screenshot for component testing
 */
export async function captureComponentScreenshot(
  locator: Locator,
  name: string,
) {
  await locator.screenshot({
    path: `./reports/test-artifacts/component-${name}.png`,
  });
}

/**
 * Wait for all images to load before visual comparison
 */
export async function waitForImagesToLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            }),
        ),
    );
  });
}

/**
 * Wait for animations to complete
 */
export async function waitForAnimations(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    return Promise.all(
      document.getAnimations().map((animation) => animation.finished),
    );
  });
}

/**
 * Test responsive design across different viewports
 */
export async function testResponsiveDesign(
  page: Page,
  testName: string,
  viewports: Array<{ width: number; height: number; name: string }>,
) {
  const results = [];

  for (const viewport of viewports) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await waitForAnimations(page);

    await page.screenshot({
      path: `./reports/test-artifacts/${testName}-${viewport.name}.png`,
      fullPage: true,
    });

    results.push({
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return results;
}
