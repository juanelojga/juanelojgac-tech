import { FullConfig } from '@playwright/test';

/**
 * Global teardown runs after all tests
 * Use this to clean up the test environment
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up test environment...');

  // You can add cleanup logic here:
  // - Clear test database
  // - Stop services
  // - Remove test data
  // - Clean up temporary files

  console.log('✓ Test environment cleaned');
}

export default globalTeardown;
