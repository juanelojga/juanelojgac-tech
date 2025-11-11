/**
 * Standard viewport configurations for responsive testing
 * Used across all test suites to ensure consistent testing
 */

export const viewports = {
  // Desktop viewports
  desktop: {
    width: 1920,
    height: 1080,
  },
  desktopSmall: {
    width: 1280,
    height: 720,
  },

  // Tablet viewports
  tabletLandscape: {
    width: 1024,
    height: 768,
  },
  tabletPortrait: {
    width: 768,
    height: 1024,
  },

  // Mobile viewports
  mobileLarge: {
    width: 414,
    height: 896,
  },
  mobile: {
    width: 375,
    height: 667,
  },
  mobileSmall: {
    width: 320,
    height: 568,
  },
} as const;

/**
 * Helper to test across multiple viewports
 */
export function getResponsiveViewports() {
  return [
    { name: 'Desktop', ...viewports.desktop },
    { name: 'Tablet', ...viewports.tabletLandscape },
    { name: 'Mobile', ...viewports.mobile },
  ];
}

/**
 * Helper to test all viewports
 */
export function getAllViewports() {
  return Object.entries(viewports).map(([name, viewport]) => ({
    name,
    ...viewport,
  }));
}
