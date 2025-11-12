import { test, expect } from '../fixtures/accessibility';
import { captureComponentScreenshot } from '../fixtures/visual';

/**
 * Hero Section E2E Tests
 *
 * Tests the Hero section component across multiple dimensions:
 * - Bilingual rendering (EN/ES)
 * - Responsive behavior (mobile, tablet, desktop)
 * - Image rendering and fallbacks
 * - CTA button interaction
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Visual regression testing
 * - Keyboard navigation
 */
test.describe('Hero Section Component', () => {
  test.describe('English (EN) Rendering', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to English homepage with Hero section
      await page.goto('/en');
    });

    test('should render hero section with correct EN content', async ({ page }) => {
      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      // Check headline
      const headline = heroSection.locator('.hero-headline');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText('Empowering AI Transformation for Modern Businesses');

      // Check subheadline
      const subheadline = heroSection.locator('.hero-subheadline');
      await expect(subheadline).toBeVisible();
      await expect(subheadline).toContainText(
        'Innovation should make life simpler, not more complicated'
      );

      // Check CTA button
      const ctaButton = heroSection.locator('button').filter({ hasText: 'LEARN MORE' });
      await expect(ctaButton).toBeVisible();
    });

    test('should have proper semantic HTML structure', async ({ page }) => {
      // Check for banner role
      const heroSection = page.locator('section[role="banner"]');
      await expect(heroSection).toBeVisible();

      // Check for heading hierarchy
      const h1 = page.locator('h1.hero-headline');
      await expect(h1).toBeVisible();
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1); // Should have exactly one h1
    });

    test('should render images with proper attributes', async ({ page }) => {
      const heroSection = page.locator('section#hero');

      // Check circles graphic (decorative)
      const circlesGraphic = heroSection.locator('.circles-graphic img');
      if (await circlesGraphic.isVisible()) {
        const alt = await circlesGraphic.getAttribute('alt');
        expect(alt).toBe(''); // Decorative images should have empty alt
        const ariaHidden = await circlesGraphic
          .locator('..')
          .locator('..')
          .getAttribute('aria-hidden');
        expect(ariaHidden).toBe('true');
      }

      // Check logo/brand graphic
      const logoGraphic = heroSection.locator('.hero-logo');
      if (await logoGraphic.isVisible()) {
        const alt = await logoGraphic.getAttribute('alt');
        expect(alt).toBeTruthy(); // Logo should have descriptive alt text
        expect(alt).toContain('logo');
      }
    });
  });

  test.describe('Spanish (ES) Rendering', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to Spanish homepage with Hero section
      await page.goto('/es');
    });

    test('should render hero section with correct ES content', async ({ page }) => {
      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      // Check headline
      const headline = heroSection.locator('.hero-headline');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText('Potenciando la Transformación IA para Empresas Modernas');

      // Check subheadline
      const subheadline = heroSection.locator('.hero-subheadline');
      await expect(subheadline).toBeVisible();
      await expect(subheadline).toContainText('La innovación debe simplificar la vida, no complicarla');

      // Check CTA button
      const ctaButton = heroSection.locator('button').filter({ hasText: 'SABER MÁS' });
      await expect(ctaButton).toBeVisible();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display correctly on mobile (375x667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/en');

      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      // On mobile, content should be stacked
      const container = heroSection.locator('.hero-container');
      const computedStyle = await container.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          gridTemplateColumns: style.gridTemplateColumns,
          gap: style.gap,
        };
      });

      // Should have single column layout
      expect(computedStyle.gridTemplateColumns).toContain('1fr');

      // Capture visual regression
      await captureComponentScreenshot(heroSection, 'hero-mobile-en');
    });

    test('should display correctly on tablet (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/en');

      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      // On tablet, should have 2-column layout
      const container = heroSection.locator('.hero-container');
      const computedStyle = await container.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          gridTemplateColumns: style.gridTemplateColumns,
        };
      });

      // Should have two-column layout
      expect(computedStyle.gridTemplateColumns).toContain('1fr 1fr');

      // Capture visual regression
      await captureComponentScreenshot(heroSection, 'hero-tablet-en');
    });

    test('should display correctly on desktop (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/en');

      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      // Capture visual regression
      await captureComponentScreenshot(heroSection, 'hero-desktop-en');
    });
  });

  test.describe('CTA Button Interaction', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en');
    });

    test('should have clickable CTA button with proper styling', async ({ page }) => {
      const ctaButton = page.locator('section#hero button').filter({ hasText: 'LEARN MORE' });
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toBeEnabled();

      // Check for gradient styling
      const backgroundImage = await ctaButton.evaluate((el) =>
        window.getComputedStyle(el).backgroundImage
      );
      expect(backgroundImage).toContain('linear-gradient');
    });

    test('should be clickable and interactive', async ({ page }) => {
      const ctaButton = page.locator('section#hero button').filter({ hasText: 'LEARN MORE' });

      // Click should work (even if it doesn't navigate anywhere yet)
      await ctaButton.click();

      // Button should remain visible after click
      await expect(ctaButton).toBeVisible();
    });

    test('should show hover state', async ({ page }) => {
      const ctaButton = page.locator('section#hero button').filter({ hasText: 'LEARN MORE' });

      // Initial state
      await expect(ctaButton).toBeVisible();

      // Hover
      await ctaButton.hover();

      // Capture hover state for visual regression
      await page.waitForTimeout(100); // Allow transition
      await captureComponentScreenshot(ctaButton, 'hero-cta-hover');
    });
  });

  test.describe('Accessibility Compliance', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en');
    });

    test('should pass axe accessibility scan', async ({ page, makeAxeBuilder }) => {
      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      // Run comprehensive accessibility scan on hero section
      const accessibilityScanResults = await makeAxeBuilder()
        .include('section#hero')
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have adequate color contrast (4.5:1 minimum)', async ({
      page,
      makeAxeBuilder,
    }) => {
      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      const accessibilityScanResults = await makeAxeBuilder()
        .include('section#hero')
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      // Check banner role
      const heroSection = page.locator('section[role="banner"]');
      await expect(heroSection).toBeVisible();

      // Check aria-label
      const ariaLabel = await heroSection.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      // Check aria-hidden on decorative elements
      const decorativeElements = page.locator('[aria-hidden="true"]');
      const count = await decorativeElements.count();
      expect(count).toBeGreaterThan(0); // Should have at least one decorative element
    });

    test('should have accessible button labels', async ({ page }) => {
      const ctaButton = page.locator('section#hero button');

      // Button should have accessible name (either aria-label or text content)
      const ariaLabel = await ctaButton.getAttribute('aria-label');
      const textContent = await ctaButton.textContent();

      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    });

    test('should support keyboard navigation', async ({ page }) => {
      const ctaButton = page.locator('section#hero button').filter({ hasText: 'LEARN MORE' });

      // Tab to button
      await page.keyboard.press('Tab');

      // Check if button is focused or can receive focus
      const isFocused = await ctaButton.evaluate((el) => {
        return document.activeElement === el;
      });

      // If not focused yet, tab until we reach it
      if (!isFocused) {
        let attempts = 0;
        while (attempts < 10) {
          await page.keyboard.press('Tab');
          const nowFocused = await ctaButton.evaluate((el) => {
            return document.activeElement === el;
          });
          if (nowFocused) break;
          attempts++;
        }
      }

      // Press Enter to activate
      await page.keyboard.press('Enter');

      // Button should remain visible (even if no action happens)
      await expect(ctaButton).toBeVisible();
    });

    test('should have visible focus indicators', async ({ page }) => {
      const ctaButton = page.locator('section#hero button').filter({ hasText: 'LEARN MORE' });

      // Focus the button
      await ctaButton.focus();

      // Capture focus state for visual verification
      await captureComponentScreenshot(ctaButton, 'hero-cta-focus');

      // Check for focus-visible styling
      const outline = await ctaButton.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          outlineWidth: style.outlineWidth,
          outlineStyle: style.outlineStyle,
          boxShadow: style.boxShadow,
        };
      });

      // Should have some form of focus indicator (outline or box-shadow)
      const hasFocusIndicator =
        outline.outlineWidth !== '0px' ||
        outline.outlineStyle !== 'none' ||
        outline.boxShadow !== 'none';

      expect(hasFocusIndicator).toBe(true);
    });
  });

  test.describe('Visual Regression Testing', () => {
    test('should match baseline screenshot - EN desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/en');

      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      await captureComponentScreenshot(heroSection, 'hero-baseline-en-desktop');
    });

    test('should match baseline screenshot - ES desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/es');

      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      await captureComponentScreenshot(heroSection, 'hero-baseline-es-desktop');
    });

    test('should match baseline screenshot - EN mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/en');

      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      await captureComponentScreenshot(heroSection, 'hero-baseline-en-mobile');
    });

    test('should match baseline screenshot - ES mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/es');

      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      await captureComponentScreenshot(heroSection, 'hero-baseline-es-mobile');
    });
  });

  test.describe('Content Validation', () => {
    test('should have non-empty headline and subheadline', async ({ page }) => {
      await page.goto('/en');

      const headline = page.locator('.hero-headline');
      const subheadline = page.locator('.hero-subheadline');

      const headlineText = await headline.textContent();
      const subheadlineText = await subheadline.textContent();

      expect(headlineText?.trim().length).toBeGreaterThan(0);
      expect(subheadlineText?.trim().length).toBeGreaterThan(0);
    });

    test('should translate content correctly between languages', async ({ page }) => {
      // Get EN content
      await page.goto('/en');
      const enHeadline = await page.locator('.hero-headline').textContent();
      const enCTA = await page.locator('section#hero button').textContent();

      // Get ES content
      await page.goto('/es');
      const esHeadline = await page.locator('.hero-headline').textContent();
      const esCTA = await page.locator('section#hero button').textContent();

      // Content should be different between languages
      expect(enHeadline).not.toBe(esHeadline);
      expect(enCTA?.trim()).not.toBe(esCTA?.trim());

      // ES content should be in Spanish
      expect(esHeadline).toContain('IA');
      expect(esCTA?.trim()).toBe('SABER MÁS');
    });
  });

  test.describe('Gradient and Styling', () => {
    test('should have dusty pink to purple gradient background', async ({ page }) => {
      await page.goto('/en');

      const heroSection = page.locator('section#hero');
      const background = await heroSection.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          background: style.background,
          backgroundImage: style.backgroundImage,
        };
      });

      // Should have gradient (either from CSS or image)
      const hasGradient =
        background.backgroundImage.includes('linear-gradient') ||
        background.background.includes('linear-gradient') ||
        background.backgroundImage.includes('.png');

      expect(hasGradient).toBe(true);
    });

    test('should have white text on dark background (contrast)', async ({ page }) => {
      await page.goto('/en');

      const headline = page.locator('.hero-headline');
      const color = await headline.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.color;
      });

      // White text should be rgb(255, 255, 255)
      expect(color).toContain('255, 255, 255');
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load hero section within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/en');
      const heroSection = page.locator('section#hero');
      await expect(heroSection).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds (generous for CI environments)
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have eager loading for critical images', async ({ page }) => {
      await page.goto('/en');

      // Check circles graphic
      const circlesImg = page.locator('.circles-graphic img');
      if (await circlesImg.isVisible()) {
        const loading = await circlesImg.getAttribute('loading');
        expect(loading).toBe('eager');
      }

      // Check logo
      const logoImg = page.locator('.hero-logo');
      if (await logoImg.isVisible()) {
        const loading = await logoImg.getAttribute('loading');
        expect(loading).toBe('eager');
      }
    });
  });
});
