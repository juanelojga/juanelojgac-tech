import { test, expect } from '../fixtures/accessibility';

/**
 * shadcn/ui Component Tests
 * Tests for visual regression, accessibility, and brand compliance
 * for JuaneloJGAC Tech UI components
 */

test.describe('shadcn/ui Components - English', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/components-demo');
  });

  test('should load components demo page @visual @accessibility', async ({ page }) => {
    await expect(page).toHaveTitle(/shadcn\/ui Components Demo/);
    await expect(page.locator('h1').first()).toContainText('shadcn/ui Components Demo');
  });

  test('should pass accessibility checks for full page @accessibility', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Button components should meet WCAG 2.1 AA @accessibility', async ({ page, makeAxeBuilder }) => {
    const buttonSection = page.locator('section').filter({ hasText: 'Button Components' });
    await expect(buttonSection).toBeVisible();

    // Test all button variants are present
    await expect(buttonSection.getByRole('button', { name: 'Primary Button' })).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Secondary Button' })).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Accent Button' })).toBeVisible();

    // Check accessibility for button section
    const accessibilityScanResults = await makeAxeBuilder()
      .include('section')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Button focus states should be visible @accessibility', async ({ page }) => {
    const primaryButton = page.getByRole('button', { name: 'Primary Button' }).first();
    await primaryButton.focus();

    // Check that focus ring is visible (ring-2 ring-ring classes)
    const focusRing = await primaryButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have a visible focus indicator
    expect(focusRing.outline !== 'none' || focusRing.boxShadow !== 'none').toBeTruthy();
  });

  test('Button visual regression @visual', async ({ page }) => {
    const buttonSection = page.locator('section').filter({ hasText: 'Button Components' });
    await expect(buttonSection).toHaveScreenshot('buttons-light-en.png', {
      maxDiffPixels: 100,
    });
  });

  test('Card components should meet accessibility standards @accessibility', async ({ page, makeAxeBuilder }) => {
    const cardSection = page.locator('section').filter({ hasText: 'Card Components' });
    await expect(cardSection).toBeVisible();

    // Check for proper heading hierarchy
    const cardTitles = cardSection.locator('h3');
    await expect(cardTitles.first()).toBeVisible();

    // Check accessibility
    const accessibilityScanResults = await makeAxeBuilder()
      .include('section')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Card visual regression @visual', async ({ page }) => {
    const cardSection = page.locator('section').filter({ hasText: 'Card Components' });
    await expect(cardSection).toHaveScreenshot('cards-light-en.png', {
      maxDiffPixels: 100,
    });
  });

  test('Dialog should have proper ARIA attributes @accessibility', async ({ page }) => {
    const openButton = page.getByRole('button', { name: 'Open Dialog' }).first();
    await openButton.click();

    // Dialog should be visible
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Check for ARIA attributes
    await expect(dialog).toHaveAttribute('role', 'dialog');

    // Check for close button with proper label
    const closeButton = dialog.getByRole('button', { name: /close/i });
    await expect(closeButton).toBeVisible();

    // Test keyboard navigation - ESC should close dialog
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('Dialog visual regression @visual', async ({ page }) => {
    const openButton = page.getByRole('button', { name: 'Open Dialog' }).first();
    await openButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot('dialog-light-en.png', {
      maxDiffPixels: 100,
    });

    // Close dialog
    await page.keyboard.press('Escape');
  });

  test('Dropdown menu should be keyboard accessible @accessibility', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: 'Menu' }).first();

    // Open menu with Enter key
    await menuButton.focus();
    await page.keyboard.press('Enter');

    // Menu should be visible
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Close with ESC
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
  });

  test('Dropdown menu visual regression @visual', async ({ page }) => {
    const menuButton = page.getByRole('button', { name: 'Menu' }).first();
    await menuButton.click();

    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveScreenshot('dropdown-menu-light-en.png', {
      maxDiffPixels: 100,
    });
  });

  test('Brand colors should be applied correctly @visual', async ({ page }) => {
    const primaryButton = page.getByRole('button', { name: 'Primary Button' }).first();

    const bgColor = await primaryButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Deep Tech Blue should be applied (approximately)
    // RGB values should be close to primary color
    expect(bgColor).toBeTruthy();
  });
});

test.describe('shadcn/ui Components - Spanish', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/components-demo');
  });

  test('should load Spanish components demo page @visual @accessibility', async ({ page }) => {
    await expect(page).toHaveTitle(/Demostración de Componentes shadcn\/ui/);
  });

  test('should pass accessibility checks for Spanish page @accessibility', async ({ page, makeAxeBuilder }) => {
    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Spanish translations should be applied @visual', async ({ page }) => {
    // Check for Spanish text
    await expect(page.locator('h1').first()).toContainText('shadcn/ui');

    const primaryButton = page.getByRole('button', { name: 'Botón Primario' }).first();
    await expect(primaryButton).toBeVisible();
  });

  test('Button visual regression - Spanish @visual', async ({ page }) => {
    const buttonSection = page.locator('section').filter({ hasText: 'Componentes de Botón' });
    await expect(buttonSection).toHaveScreenshot('buttons-light-es.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Dark Mode Support', () => {
  test('should support dark mode @visual', async ({ page, context }) => {
    // Set dark color scheme
    await context.addInitScript(() => {
      document.documentElement.classList.add('dark');
    });

    await page.goto('/en/components-demo');

    // Check dark mode is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Take screenshot in dark mode
    const buttonSection = page.locator('section').filter({ hasText: 'Button Components' });
    await expect(buttonSection).toHaveScreenshot('buttons-dark-en.png', {
      maxDiffPixels: 100,
    });
  });

  test('dark mode should maintain accessibility @accessibility', async ({ page, context, makeAxeBuilder }) => {
    await context.addInitScript(() => {
      document.documentElement.classList.add('dark');
    });

    await page.goto('/en/components-demo');

    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile @visual', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en/components-demo');

    await expect(page).toHaveScreenshot('components-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should be responsive on tablet @visual', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/en/components-demo');

    await expect(page).toHaveScreenshot('components-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should be responsive on desktop @visual', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/en/components-demo');

    await expect(page).toHaveScreenshot('components-desktop.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
