import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for JuaneloJGAC Tech
 * Includes E2E, visual regression, and accessibility testing
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory structure
  testDir: './tests',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],

  // Timeout configuration
  timeout: 30000,
  expect: {
    timeout: 5000,
    // Visual comparison threshold - allows for minor pixel differences
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration - line for console, html for detailed reports
  reporter: [
    ['line'],
    ['html', {
      outputFolder: './reports/playwright-html',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['json', {
      outputFile: './reports/test-results.json'
    }],
    ['junit', {
      outputFile: './reports/junit.xml'
    }],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for testing
    baseURL: process.env.BASE_URL || 'http://localhost:4321',

    // Collect trace on failure
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Slow down tests in headed mode
    launchOptions: {
      slowMo: process.env.HEADED ? 100 : 0,
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable Chrome DevTools features
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write'],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile testing
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },

    // Tablet testing
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Web server configuration for local development
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Output folder for test artifacts
  outputDir: './reports/test-artifacts',

  // Folder for baseline screenshots
  snapshotDir: './tests/snapshots',

  // Global setup/teardown (using relative paths for ES modules)
  globalSetup: './fixtures/global-setup.ts',
  globalTeardown: './fixtures/global-teardown.ts',
});
