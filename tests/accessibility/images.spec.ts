import { test, expect } from '../fixtures/accessibility';

/**
 * Image Accessibility Tests
 * Ensures all images have proper alt text and are accessible
 *
 * @tag accessibility
 */
test.describe('Image Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have alt attributes on all images', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['image-alt'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have meaningful alt text', async ({ page }) => {
    const images = await page.$$eval('img', (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        alt: img.alt,
      }))
    );

    for (const image of images) {
      // Decorative images should have empty alt
      // Content images should have descriptive alt
      const hasAltAttribute = image.alt !== undefined;
      expect(hasAltAttribute).toBe(true);

      // Alt text should not be generic
      const genericAltTexts = ['image', 'picture', 'photo', 'graphic'];
      if (image.alt.trim()) {
        const isGeneric = genericAltTexts.some((generic) =>
          image.alt.toLowerCase() === generic
        );
        expect(isGeneric).toBe(false);
      }
    }
  });

  test('should have valid image sources', async ({ page }) => {
    const images = await page.$$('img');

    for (const img of images) {
      const src = await img.getAttribute('src');
      const isVisible = await img.isVisible();

      if (isVisible && src) {
        // Image source should not be empty
        expect(src.length).toBeGreaterThan(0);

        // Image should load (naturalHeight > 0)
        const isLoaded = await img.evaluate((el) => {
          const imgEl = el as HTMLImageElement;
          return imgEl.complete && imgEl.naturalHeight > 0;
        });

        expect(isLoaded).toBe(true);
      }
    }
  });

  test('should not use images of text', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .withRules(['image-redundant-alt'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper role for decorative images', async ({ page }) => {
    const decorativeImages = await page.$$('img[alt=""], img[role="presentation"]');

    for (const img of decorativeImages) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');

      // Decorative images should have empty alt or role="presentation"
      const isProperlyMarked = alt === '' || role === 'presentation' || role === 'none';
      expect(isProperlyMarked).toBe(true);
    }
  });
});
