#!/usr/bin/env node

/**
 * Pre-commit hook for running tests on staged files
 * Prevents commits if tests fail
 */

const { execSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');

try {
  console.log('🔍 Running pre-commit tests on staged files...\n');

  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only', {
    cwd: projectRoot,
    encoding: 'utf-8',
  })
    .trim()
    .split('\n')
    .filter(Boolean);

  console.log(`Found ${stagedFiles.length} staged file(s)\n`);

  // Determine which tests to run
  const shouldRunUITests = stagedFiles.some((file) => file.includes('src/components/'));
  const shouldRunPageTests = stagedFiles.some((file) => file.includes('src/pages/'));
  const shouldRunAccessibilityTests =
    shouldRunUITests || shouldRunPageTests || stagedFiles.some((file) => file.includes('src/layouts/'));

  const testsToRun = [];

  if (shouldRunUITests) {
    testsToRun.push('ui');
  }

  if (shouldRunPageTests) {
    testsToRun.push('pages');
  }

  if (shouldRunAccessibilityTests) {
    testsToRun.push('accessibility');
  }

  if (testsToRun.length === 0) {
    console.log('✓ No test files affected, skipping tests\n');
    process.exit(0);
  }

  console.log(`Running tests: ${testsToRun.join(', ')}\n`);

  // Run tests
  for (const testType of testsToRun) {
    console.log(`Running ${testType} tests...`);

    let testPath;
    switch (testType) {
      case 'ui':
        testPath = 'tests/ui/';
        break;
      case 'pages':
        testPath = 'tests/pages/';
        break;
      case 'accessibility':
        testPath = 'tests/accessibility/';
        break;
      default:
        testPath = 'tests/';
    }

    execSync(`npx playwright test ${testPath} --config=tests/playwright.config.ts --reporter=line`, {
      cwd: projectRoot,
      stdio: 'inherit',
    });
  }

  console.log('\n✅ All pre-commit tests passed!\n');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Pre-commit tests failed!');
  console.error('Please fix the failing tests before committing.\n');
  console.error('To skip this check, use: git commit --no-verify\n');
  process.exit(1);
}
