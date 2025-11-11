# Playwright Testing Suite

Comprehensive end-to-end, visual regression, and accessibility testing for JuaneloJGAC Tech.

## Overview

This testing suite includes:

- **End-to-End Tests**: Full page testing with Playwright
- **Visual Regression**: Screenshot comparison for UI consistency
- **Accessibility Testing**: WCAG 2.1 Level AA compliance with axe-core
- **Component Tests**: shadcn/ui component validation
- **MCP Orchestration**: Automated test execution on file changes
- **CI/CD Integration**: GitHub Actions workflows

## Quick Start

### Install Dependencies

```bash
npm install
npx playwright install
```

### Run Tests

```bash
# Run all tests
npm run test:e2e

# Run in specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test suites
npm run test:pages          # Page tests only
npm run test:components     # UI component tests only
npm run test:accessibility  # Accessibility tests only
npm run test:visual         # Visual regression tests only
```

### Watch Mode

Start the file watcher to automatically run tests on changes:

```bash
npm run test:watch
```

This will:
- Watch `/src/components` and run UI tests
- Watch `/src/pages` and run page tests
- Watch `/src/layouts` and run all tests
- Debounce test runs (2 seconds after last change)

### View Reports

```bash
npm run test:report
```

Opens the HTML report in your browser showing:
- Test results by browser
- Screenshots and videos of failures
- Trace viewer for debugging
- Performance metrics

## Test Structure

```
tests/
├── playwright.config.ts      # Main Playwright configuration
├── fixtures/                 # Reusable test utilities
│   ├── accessibility.ts      # Accessibility testing helpers
│   ├── visual.ts            # Visual regression utilities
│   ├── global-setup.ts      # Global test setup
│   └── global-teardown.ts   # Global test cleanup
├── pages/                    # Page-level E2E tests
│   ├── homepage.spec.ts     # Homepage tests
│   └── i18n.spec.ts         # Internationalization tests
├── ui/                       # Component tests
│   ├── button.spec.ts       # Button component tests
│   ├── input.spec.ts        # Input component tests
│   └── modal.spec.ts        # Modal component tests
├── mcp/                      # MCP orchestration
│   ├── orchestrator.js      # Test orchestrator
│   ├── reporter.js          # Test reporter
│   └── watcher.js           # File watcher
└── snapshots/               # Visual regression baselines

reports/
├── playwright-html/         # HTML test reports
├── test-results.json        # JSON test results
├── junit.xml               # JUnit XML for CI/CD
└── test-artifacts/         # Screenshots, videos, traces
```

## Writing Tests

### Basic Test

```typescript
import { test, expect } from '../fixtures/accessibility';

test.describe('My Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Accessibility Test

```typescript
import { test, expect } from '../fixtures/accessibility';

test('should pass accessibility scan', async ({ page, makeAxeBuilder }) => {
  await page.goto('/my-page');

  const accessibilityScanResults = await makeAxeBuilder().analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Visual Regression Test

```typescript
import { test, expect } from '@playwright/test';

test('should match visual baseline', async ({ page }) => {
  await page.goto('/my-page');

  await expect(page).toHaveScreenshot('my-page.png', {
    fullPage: true,
    maxDiffPixels: 100,
  });
});
```

### Component Test

```typescript
import { test, expect } from '../fixtures/accessibility';

test('should render button correctly', async ({ page }) => {
  await page.goto('/components/button');

  const button = page.locator('button').first();

  // Visual
  await expect(button).toBeVisible();

  // Functionality
  await button.click();

  // Accessibility
  await expect(button).toHaveAccessibleName();
});
```

## Accessibility Testing

All tests automatically scan for WCAG 2.1 Level AA compliance:

- **Color Contrast**: Text must have 4.5:1 ratio (3:1 for large text)
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **ARIA Attributes**: Proper roles, labels, and states
- **Form Labels**: All inputs must have labels
- **Focus Indicators**: Visible focus states required
- **Touch Targets**: Minimum 44x44px (32x32px acceptable)

### Specific Accessibility Checks

```typescript
import {
  checkColorContrast,
  checkAriaAttributes
} from '../fixtures/accessibility';

// Check color contrast only
const contrastResults = await checkColorContrast(page);

// Check ARIA attributes only
const ariaResults = await checkAriaAttributes(page);
```

## Visual Regression Testing

### Creating Baselines

```bash
# Update all snapshots
npm run test:visual -- --update-snapshots

# Update specific test snapshots
npm run test:e2e -- tests/pages/homepage.spec.ts --update-snapshots
```

### Configuration

Visual tests use the following defaults:
- **maxDiffPixels**: 100 (allows minor rendering differences)
- **threshold**: 0.2 (20% pixel difference tolerance)

Override in individual tests:

```typescript
await expect(page).toHaveScreenshot('name.png', {
  maxDiffPixels: 50,
  threshold: 0.1,
  mask: [page.locator('.dynamic-content')],
});
```

## MCP Integration

### Test Orchestration

The MCP orchestrator automatically runs tests based on file changes:

```json
{
  "watchers": {
    "components": {
      "patterns": ["src/components/**/*.{astro,tsx,jsx}"],
      "action": "run_tests",
      "parameters": { "testType": "ui" }
    }
  }
}
```

### Triggers

- **pre-commit**: Optional (commented out by default)
- **pre-push**: Runs chromium tests before push
- **GitHub Actions**: Full test suite on PR/push

### MCP Commands

```bash
# Start orchestrator
node tests/mcp/orchestrator.js

# Start reporter
node tests/mcp/reporter.js

# Start file watcher
npm run test:watch
```

## CI/CD Integration

### GitHub Actions

Three parallel jobs run on every push/PR:

1. **Browser Tests**: Chromium, Firefox, WebKit matrix
2. **Accessibility Tests**: WCAG 2.1 compliance
3. **Visual Regression**: Screenshot comparison

### Artifacts

All test runs upload:
- HTML reports (30-day retention)
- Screenshots and videos of failures
- JSON/XML test results
- Visual regression diffs

### Viewing Results

1. Go to Actions tab in GitHub
2. Select workflow run
3. Download artifacts or view summary

## Configuration

### Playwright Config

`tests/playwright.config.ts` contains:
- Browser configurations
- Viewport sizes
- Timeout settings
- Reporter configurations
- Screenshot/video settings

### Environment Variables

```bash
# Base URL for tests (default: http://localhost:4321)
BASE_URL=http://localhost:4321

# Run in headed mode
HEADED=true

# CI mode (affects retries and workers)
CI=true
```

## Debugging

### Debug Mode

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### UI Mode

```bash
npm run test:e2e:ui
```

Interactive UI for running and debugging tests.

### Trace Viewer

```bash
npx playwright show-trace reports/test-artifacts/trace.zip
```

View detailed trace of test execution with:
- DOM snapshots
- Network activity
- Console logs
- Screenshots at each step

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Wait Strategies**: Use Playwright's auto-waiting
3. **Selectors**: Prefer data-testid, accessible names, or semantic HTML
4. **Accessibility First**: Run accessibility scans on all pages
5. **Visual Baselines**: Update snapshots intentionally, review diffs
6. **Fast Tests**: Use single browser locally, full matrix in CI
7. **Meaningful Names**: Describe what the test validates, not how

## Troubleshooting

### Tests Timing Out

- Increase timeout in `playwright.config.ts`
- Check for network issues or slow API responses
- Use `page.waitForLoadState('networkidle')`

### Flaky Tests

- Add proper waits instead of `setTimeout`
- Disable animations: `{ animations: 'disabled' }`
- Use stricter selectors
- Check for race conditions

### Visual Regression Failures

- Review diff images in `reports/test-artifacts/`
- Update baselines if changes are intentional
- Check for dynamic content (dates, random IDs)
- Use `mask` option for dynamic elements

### Accessibility Failures

- Review violations in HTML report
- Check contrast ratios with dev tools
- Verify ARIA attributes
- Test keyboard navigation manually

## Resources

- [Playwright Documentation](https://playwright.dev)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MCP Specification](https://modelcontextprotocol.io)

## Support

For issues or questions:
1. Check existing test examples in `tests/`
2. Review Playwright documentation
3. Run with `--debug` flag
4. Open an issue with reproduction steps
