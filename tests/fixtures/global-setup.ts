import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup runs before all tests
 * Use this to prepare the test environment
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up test environment...');

  // Verify that the web server is ready
  const { baseURL } = config.projects[0].use;

  if (baseURL) {
    console.log(`✓ Base URL configured: ${baseURL}`);
  }

  // You can add additional setup here:
  // - Seed test database
  // - Start services
  // - Generate test data
  // - Authenticate test users

  console.log('✓ Test environment ready');
}

export default globalSetup;
