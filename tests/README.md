# Complete Testing Structure Documentation

Comprehensive testing infrastructure for the Astro project with MCP + Playwright + shadcn/ui integration.

## 📁 Directory Structure

```
tests/
├── accessibility/          # Accessibility compliance tests (WCAG 2.1 AA)
│   ├── aria.spec.ts       # ARIA attributes and roles validation
│   ├── comprehensive.spec.ts  # Full accessibility audit
│   ├── contrast.spec.ts   # Color contrast compliance
│   ├── images.spec.ts     # Image accessibility (alt text, etc.)
│   └── keyboard.spec.ts   # Keyboard navigation tests
├── config/                # Shared configuration and utilities
│   ├── helpers.ts         # Common test helper functions
│   ├── thresholds.ts      # Test thresholds and tolerances
│   ├── viewports.ts       # Viewport configurations
│   └── index.ts           # Central export
├── fixtures/              # Playwright fixtures and setup
│   ├── accessibility.ts   # Accessibility testing fixtures
│   ├── global-setup.ts    # Global test setup
│   ├── global-teardown.ts # Global test teardown
│   └── visual.ts          # Visual regression helpers
├── mcp/                   # MCP orchestration and automation
│   ├── deployment-gate.js # Pre-deployment validation
│   ├── orchestrator.js    # Test orchestration
│   ├── pre-commit-hook.js # Pre-commit test runner
│   ├── pre-deploy-hook.sh # Pre-deployment script
│   ├── reporter.js        # Custom test reporter
│   └── watcher.js         # File watcher for continuous testing
├── pages/                 # Page-level E2E tests
│   ├── bilingual.spec.ts  # Bilingual content tests
│   ├── homepage.spec.ts   # Homepage tests
│   ├── i18n.spec.ts       # Internationalization tests
│   └── navigation.spec.ts # Navigation and routing tests
├── ui/                    # Component tests
│   ├── button.spec.ts     # Button component tests
│   ├── card.spec.ts       # Card component tests
│   ├── input.spec.ts      # Input component tests
│   └── modal.spec.ts      # Modal component tests
├── playwright.config.ts   # Playwright configuration
└── README.md             # This file
```

## 🚀 Quick Start

### Installation

```bash
npm install
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm run test:all

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:accessibility

# Run visual regression tests
npm run test:visual

# Run specific test suites
npm run test:pages        # Page tests only
npm run test:components   # Component tests only

# Run tests in specific browsers
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Run tests in UI mode
npm run test:e2e:ui

# Watch mode (continuous testing)
npm run test:watch

# View test reports
npm run test:report
```

### Pre-deployment Checks

```bash
# Run deployment gate (validates all tests)
npm run test:deployment-gate

# Run full pre-deployment script
npm run pre-deploy

# Run pre-commit tests
npm run pre-commit-tests
```

## 📋 Test Categories

### 1. UI Component Tests (`/tests/ui/`)

Tests for shadcn/ui components including Button, Card, Input, and Modal:

**What's Tested:**
- ✅ Rendering without errors
- ✅ Hover, focus, and click states
- ✅ Visual consistency with baseline screenshots
- ✅ Keyboard accessibility
- ✅ Touch target sizes (minimum 32x32px)
- ✅ ARIA attributes and roles
- ✅ Responsive behavior across viewports

**Example:**
```typescript
test('should render button with correct styles', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('button').first();
  await expect(button).toBeVisible();
});
```

### 2. Page Tests (`/tests/pages/`)

End-to-end tests for all pages with bilingual support:

**What's Tested:**
- ✅ Navigation and routing
- ✅ Page load performance (<2 seconds)
- ✅ SEO metadata (titles, descriptions)
- ✅ Bilingual language switching (EN/ES)
- ✅ Header and footer consistency
- ✅ Browser back/forward navigation
- ✅ Console errors detection

**Example:**
```typescript
test('should load homepage in under 2 seconds', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(2000);
});
```

### 3. Accessibility Tests (`/tests/accessibility/`)

WCAG 2.1 Level AA compliance with **zero tolerance for violations**:

**What's Tested:**
- ♿ Color contrast (minimum 4.5:1 ratio)
- ♿ ARIA attributes and roles
- ♿ Keyboard navigation
- ♿ Image alt text
- ♿ Form labels
- ♿ Touch target sizes
- ♿ Heading hierarchy
- ♿ Landmark regions
- ♿ Focus indicators

**Test Files:**
- `contrast.spec.ts` - Color contrast on all pages and components
- `aria.spec.ts` - ARIA attributes, roles, and labels
- `keyboard.spec.ts` - Keyboard navigation and focus management
- `images.spec.ts` - Image accessibility and alt text
- `comprehensive.spec.ts` - Full WCAG 2.1 Level AA audit

**Example:**
```typescript
test('should have adequate color contrast', async ({ page, makeAxeBuilder }) => {
  await page.goto('/');
  const results = await makeAxeBuilder()
    .withRules(['color-contrast'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

### 4. Visual Regression Tests

Screenshot comparison testing with configurable thresholds:

**What's Tested:**
- 👁️ Baseline screenshot comparisons
- 👁️ Full page visual consistency
- 👁️ Component-level screenshots
- 👁️ Responsive layout verification

**Example:**
```typescript
test('should match homepage baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100,
    threshold: 0.2,
  });
});
```

## 🔧 Configuration

### Viewports (`/tests/config/viewports.ts`)

Pre-configured viewports for responsive testing:

| Category | Size | Name |
|----------|------|------|
| Desktop | 1920x1080 | desktop |
| Desktop | 1280x720 | desktopSmall |
| Tablet | 1024x768 | tabletLandscape |
| Tablet | 768x1024 | tabletPortrait |
| Mobile | 414x896 | mobileLarge |
| Mobile | 375x667 | mobile |
| Mobile | 320x568 | mobileSmall |

### Thresholds (`/tests/config/thresholds.ts`)

#### Visual Regression
- `maxDiffPixels`: 100 pixels
- `threshold`: 0.2 (20% tolerance)
- `strict`: 10px / 5% for critical UI
- `lenient`: 500px / 40% for dynamic content

#### Performance
- `pageLoadTime`: 2000ms (2 seconds)
- `timeToInteractive`: 3000ms
- `firstContentfulPaint`: 1500ms

#### Accessibility
- `maxViolations`: 0 (zero tolerance)
- `colorContrastRatio`: 4.5:1 (WCAG AA)
- `minTouchTargetSize`: 44x44px (AAA)
- `minTouchTargetSizeAA`: 32x32px (AA)

#### Timeouts
- `default`: 30000ms
- `expect`: 5000ms
- `navigation`: 10000ms
- `animation`: 2000ms

### Browsers

Tests run across:
- ✅ Chromium (Desktop Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 13)
- ✅ Tablet (iPad Pro)

## 🔄 MCP Integration

### File Watcher

Automatically triggers tests when files change:

```bash
npm run test:watch
```

**Automatic Triggers:**

| File Pattern | Tests Triggered |
|--------------|----------------|
| `src/components/**` | UI tests |
| `src/pages/**` | Page tests |
| `src/layouts/**` | All tests |
| `src/styles/**` | Visual regression |
| `src/i18n/**` | i18n tests |

**Features:**
- 🔄 Debounced execution (2 seconds)
- 🎯 Intelligent test selection
- 📊 Real-time console output
- ⚡ Fast incremental testing

### Deployment Gate

Pre-deployment validation with strict requirements:

```bash
npm run test:deployment-gate
# or
npm run pre-deploy
```

**Validation Steps:**
1. ✅ Build succeeds
2. ✅ All unit tests pass
3. ✅ All E2E tests pass
4. ✅ Accessibility tests pass (zero violations)
5. ✅ Visual regression tests pass
6. ✅ Linting passes
7. ⚠️ Security audit (non-blocking)

**Exit Codes:**
- `0` - All checks passed, deploy approved ✅
- `1` - Tests failed, deployment blocked ❌
- `2` - Accessibility violations, deployment blocked ❌
- `3` - Missing test reports ⚠️

## 📊 Reporting

### HTML Reports

Generated at `/reports/playwright-html/`

View with:
```bash
npm run test:report
```

**Features:**
- 📸 Screenshots on failure
- 🎥 Video recordings
- 📈 Test statistics
- 🔍 Detailed error messages
- 📊 Performance metrics

### JSON Reports

Located at `/reports/test-results.json`

Used by:
- CI/CD pipelines
- Deployment gates
- Custom reporting tools

### Console Output

Real-time test results in terminal with:
- ✅ Pass/fail indicators
- ⏱️ Execution time
- 📍 File locations
- 🔍 Error details

### CI/CD Reports

Artifacts uploaded to GitHub Actions:
- HTML reports (30-day retention)
- Screenshots and videos
- Accessibility scan results
- Visual regression diffs
- JSON/JUnit test results

## 🎯 GitHub Actions Integration

### Workflow Jobs

The CI/CD pipeline includes:

1. **Browser Tests** (`test`)
   - Runs on Chromium, Firefox, WebKit (matrix)
   - Parallel execution
   - Uploads results per browser

2. **Accessibility Tests** (`accessibility`)
   - WCAG 2.1 Level AA compliance
   - Zero violations tolerance
   - Detailed violation reporting
   - PR comments with results

3. **Visual Regression** (`visual-regression`)
   - Screenshot comparisons
   - Diff artifacts on failure
   - Baseline update support

4. **Deployment Gate** (`deployment-gate`)
   - Validates all test results
   - Blocks deployment on failure
   - Posts approval status to PR
   - Only runs on `main`/`develop` branches

5. **Test Summary** (`test-summary`)
   - Aggregates all results
   - Creates GitHub summary
   - Fails if any tests failed

### Deployment Blocking

**Tests MUST pass before deployment:**
- ❌ Any test failure → Deployment blocked
- ❌ Accessibility violations → Deployment blocked
- ❌ Visual regression failures → Deployment blocked
- ✅ All green → Deployment approved 🚀

### PR Comments

Automatic comments on pull requests:
- ♿ Accessibility test results
- 🚀 Deployment gate status
- 📊 Test summary with checklist

## 🛠️ Helper Functions

### Common Helpers (`/tests/config/helpers.ts`)

```typescript
// Wait for page load
await waitForPageLoad(page);

// Wait for all images to load
await waitForImages(page);

// Check metadata tags
await checkMetadata(page, /Title/);

// Measure performance metrics
const metrics = await measurePerformance(page);

// Take full page screenshot
await takeFullPageScreenshot(page, 'page-name.png');

// Scroll to element
await scrollToElement(page, '#element');

// Check if element is in viewport
const isVisible = await isInViewport(page, '#element');

// Get console errors
const errors = await getConsoleErrors(page);

// Test bilingual links
const hasBilingualLinks = await testBilingualLinks(page);

// Check for broken links
const brokenLinks = await checkForBrokenLinks(page);
```

### Accessibility Helpers

```typescript
import { test } from '../fixtures/accessibility';

// Full accessibility scan
test('should be accessible', async ({ page, makeAxeBuilder }) => {
  const results = await makeAxeBuilder().analyze();
  expect(results.violations).toEqual([]);
});

// Check specific rules
const results = await makeAxeBuilder()
  .withRules(['color-contrast', 'aria-roles'])
  .analyze();

// Exclude elements
const results = await makeAxeBuilder()
  .exclude('.third-party-widget')
  .analyze();

// Include specific elements
const results = await makeAxeBuilder()
  .include('button')
  .analyze();
```

### Visual Helpers

```typescript
import { captureComponentScreenshot } from '../fixtures/visual';
import { waitForAnimations, waitForImagesToLoad } from '../fixtures/visual';

// Wait for page stability
await waitForAnimations(page);
await waitForImagesToLoad(page);

// Capture component screenshot
await captureComponentScreenshot(
  page.locator('[data-testid="my-component"]'),
  'component-name'
);
```

## 📝 Writing New Tests

### Component Test Template

```typescript
import { test, expect } from '../fixtures/accessibility';
import { captureComponentScreenshot } from '../fixtures/visual';
import { viewports } from '../config/viewports';

test.describe('MyComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render correctly', async ({ page }) => {
    const component = page.locator('[data-testid="my-component"]');
    await expect(component).toBeVisible();
  });

  test('should be accessible', async ({ page, makeAxeBuilder }) => {
    const results = await makeAxeBuilder()
      .include('[data-testid="my-component"]')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    const component = page.locator('[data-testid="my-component"]');
    await expect(component).toBeVisible();
  });

  test('should match visual baseline', async ({ page }) => {
    const component = page.locator('[data-testid="my-component"]');
    await captureComponentScreenshot(component, 'my-component');
  });
});
```

### Page Test Template

```typescript
import { test, expect } from '../fixtures/accessibility';
import { checkMetadata, waitForPageLoad } from '../config/helpers';
import { performanceThresholds } from '../config/thresholds';

test.describe('My Page', () => {
  test('should load successfully', async ({ page }) => {
    const start = Date.now();
    await page.goto('/my-page');
    await waitForPageLoad(page);

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(performanceThresholds.pageLoadTime);
  });

  test('should have correct metadata', async ({ page }) => {
    await page.goto('/my-page');
    await checkMetadata(page, /My Page Title/);
  });

  test('should pass accessibility scan', async ({ page, makeAxeBuilder }) => {
    await page.goto('/my-page');
    const results = await makeAxeBuilder().analyze();
    expect(results.violations).toEqual([]);
  });

  test('should load without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/my-page');
    expect(errors).toEqual([]);
  });
});
```

## 🔍 Debugging Tests

### Interactive Debugging

```bash
# Debug mode with browser paused
npm run test:e2e:debug

# UI mode with visual test runner
npm run test:e2e:ui

# Headed mode to see browser
npm run test:e2e:headed
```

### Screenshots and Videos

Automatically captured on failure:
- **Screenshots**: Every failed test
- **Videos**: Full test execution
- **Location**: `/reports/test-artifacts/`

### Traces

- Enabled on first retry
- Full DOM snapshots
- Network requests
- Console logs
- View at: [trace.playwright.dev](https://trace.playwright.dev)

```bash
npx playwright show-trace reports/test-artifacts/trace.zip
```

## 🚨 Troubleshooting

### Tests Failing Locally

```bash
# Clear test artifacts
rm -rf reports/ test-results/

# Clear Playwright cache
npx playwright install --force

# Rebuild project
npm run build

# Run specific failing test
npx playwright test tests/ui/button.spec.ts --debug
```

### Visual Regression Failures

```bash
# Update all snapshots
npx playwright test --update-snapshots

# Update specific test snapshots
npx playwright test tests/pages/homepage.spec.ts --update-snapshots

# View diffs
npm run test:report
```

### Accessibility Violations

1. Run tests to get detailed report
2. Open HTML report: `npm run test:report`
3. Check violations with impact level
4. Review help URLs for fixing guidance
5. Fix issues and re-run tests

### Flaky Tests

- Add proper waits instead of `setTimeout`
- Use `waitForLoadState('networkidle')`
- Disable animations in config
- Use stricter, more stable selectors
- Check for race conditions

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Axe Accessibility Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Astro Documentation](https://docs.astro.build)

## 🎓 Best Practices

1. **Write descriptive test names** - Tests should be self-documenting
2. **Use data-testid attributes** - For stable selectors
3. **Keep tests isolated** - Each test should be independent
4. **Use fixtures** - Reuse common setup logic
5. **Test accessibility first** - Build inclusive experiences
6. **Monitor performance** - Keep load times under 2 seconds
7. **Update snapshots carefully** - Review visual changes
8. **Run tests before commits** - Catch issues early
9. **Use helper functions** - DRY principle
10. **Document test intent** - Add comments for complex tests

## 📊 Test Coverage

Our testing structure covers:

✅ **100% of pages** - All routes tested for accessibility, performance, and functionality
✅ **Core UI components** - Button, Card, Input, Modal with full coverage
✅ **Bilingual support** - EN/ES language switching and content
✅ **Responsive design** - Desktop, tablet, mobile viewports
✅ **Accessibility compliance** - WCAG 2.1 Level AA with zero tolerance
✅ **Visual consistency** - Baseline screenshot comparisons
✅ **Performance** - Sub-2-second page loads

## 📞 Support

For issues or questions:
- Check test reports: `npm run test:report`
- Review this documentation
- Check GitHub Actions logs
- Consult Playwright documentation
- Run tests in debug mode: `npm run test:e2e:debug`

---

**Last Updated**: 2025-11-11
**Testing Framework**: Playwright 1.56.1
**Accessibility Engine**: axe-core 4.11.0
**WCAG Compliance**: Level AA (Zero Tolerance)
