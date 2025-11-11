/**
 * Test thresholds and tolerances for consistent testing
 */

/**
 * Visual regression testing thresholds
 */
export const visualThresholds = {
  // Maximum number of pixels that can differ
  maxDiffPixels: 100,

  // Percentage threshold for screenshot comparison (0-1)
  // 0.2 = 20% tolerance
  threshold: 0.2,

  // Stricter threshold for critical UI elements
  strict: {
    maxDiffPixels: 10,
    threshold: 0.05,
  },

  // More lenient threshold for dynamic content
  lenient: {
    maxDiffPixels: 500,
    threshold: 0.4,
  },
} as const;

/**
 * Performance thresholds
 */
export const performanceThresholds = {
  // Page load time in milliseconds
  pageLoadTime: 2000,

  // Time to interactive in milliseconds
  timeToInteractive: 3000,

  // First contentful paint in milliseconds
  firstContentfulPaint: 1500,

  // Largest contentful paint in milliseconds
  largestContentfulPaint: 2500,
} as const;

/**
 * Accessibility thresholds
 */
export const accessibilityThresholds = {
  // Maximum number of accessibility violations allowed
  // Set to 0 for strict compliance
  maxViolations: 0,

  // Minimum color contrast ratio (WCAG AA = 4.5:1, AAA = 7:1)
  colorContrastRatio: 4.5,

  // Minimum touch target size in pixels (WCAG 2.1 Level AAA = 44x44)
  minTouchTargetSize: 44,

  // Acceptable for Level AA
  minTouchTargetSizeAA: 32,
} as const;

/**
 * Test timeout thresholds
 */
export const timeoutThresholds = {
  // Default test timeout
  default: 30000,

  // Timeout for expect assertions
  expect: 5000,

  // Timeout for navigation
  navigation: 10000,

  // Timeout for animations
  animation: 2000,

  // Timeout for page load
  pageLoad: 15000,
} as const;

/**
 * Retry configuration
 */
export const retryConfig = {
  // Number of retries in CI
  ci: 2,

  // Number of retries locally
  local: 0,

  // Delay between retries in milliseconds
  retryDelay: 1000,
} as const;
