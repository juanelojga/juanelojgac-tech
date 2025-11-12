#!/usr/bin/env node

/**
 * File Watcher for Playwright Tests
 * Watches component and page changes and triggers appropriate tests
 */

const chokidar = require('chokidar');
const { spawn } = require('child_process');
const path = require('path');

class TestWatcher {
  constructor(options = {}) {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.debounceTime = options.debounceTime || 1000;
    this.testQueue = new Set();
    this.isRunning = false;
    this.debounceTimer = null;
  }

  /**
   * Start watching files
   */
  start() {
    console.log('👀 Starting file watcher for continuous testing...\n');

    // Watch patterns
    const patterns = [
      'src/components/**/*.{astro,tsx,jsx,ts,js}',
      'src/pages/**/*.{astro,tsx,jsx,ts,js}',
      'src/layouts/**/*.{astro,tsx,jsx,ts,js}',
      'src/styles/**/*.{css,scss}',
      'src/i18n/**/*.{ts,js,json}',
    ];

    const watcher = chokidar.watch(patterns, {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.astro/**',
      ],
      persistent: true,
      ignoreInitial: true,
      cwd: this.projectRoot,
    });

    watcher
      .on('change', (filePath) => this.handleChange(filePath, 'changed'))
      .on('add', (filePath) => this.handleChange(filePath, 'added'))
      .on('unlink', (filePath) => this.handleChange(filePath, 'removed'))
      .on('error', (error) => console.error('Watcher error:', error));

    console.log('Watching patterns:');
    patterns.forEach((pattern) => console.log(`  - ${pattern}`));
    console.log('\n✨ Ready to detect changes and run tests!\n');

    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n👋 Stopping file watcher...');
      watcher.close();
      process.exit(0);
    });
  }

  /**
   * Handle file change event
   */
  handleChange(filePath, changeType) {
    console.log(`📝 File ${changeType}: ${filePath}`);

    // Determine which tests to run
    const testType = this.determineTestType(filePath);
    this.testQueue.add(testType);

    // Debounce test execution
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.runQueuedTests();
    }, this.debounceTime);
  }

  /**
   * Determine which tests to run based on file path
   */
  determineTestType(filePath) {
    // Special handling for Button component - run both unit and E2E tests
    if (filePath.includes('/components/ui/button')) {
      return 'button-component';
    }

    // Special handling for Hero section component - run E2E tests
    if (filePath.includes('/components/sections/Hero')) {
      return 'hero-section';
    }

    if (filePath.includes('/components/sections/')) {
      return 'sections';
    }

    if (filePath.includes('/components/')) {
      return 'ui';
    }

    if (filePath.includes('/pages/')) {
      return 'pages';
    }

    if (filePath.includes('/layouts/')) {
      return 'all';
    }

    if (filePath.includes('/styles/')) {
      return 'visual';
    }

    if (filePath.includes('/i18n/')) {
      return 'i18n';
    }

    return 'all';
  }

  /**
   * Run queued tests
   */
  async runQueuedTests() {
    if (this.isRunning) {
      console.log('⏳ Tests already running, queuing...');
      return;
    }

    const tests = Array.from(this.testQueue);
    this.testQueue.clear();

    // If 'all' is in the queue, just run all tests
    const testType = tests.includes('all') ? 'all' : tests[0];

    this.isRunning = true;
    console.log(`\n🧪 Running ${testType} tests...\n`);

    try {
      await this.runTests(testType);
      console.log('\n✅ Tests completed successfully!\n');
    } catch (error) {
      console.log('\n❌ Tests failed!\n');
    } finally {
      this.isRunning = false;

      // If more tests were queued during execution, run them
      if (this.testQueue.size > 0) {
        setTimeout(() => this.runQueuedTests(), 100);
      }
    }
  }

  /**
   * Run tests (Vitest unit tests and/or Playwright E2E tests)
   */
  async runTests(testType) {
    // Special handling for Button component - run both unit and E2E tests
    if (testType === 'button-component') {
      console.log('🧪 Running Button component tests (unit + E2E)...\n');

      try {
        // Run Vitest unit tests for Button
        await this.runVitestTests('src/components/ui/button.test.tsx');
        console.log('✅ Unit tests passed!\n');

        // Run Playwright E2E tests for Button
        await this.runPlaywrightTests('tests/ui/button.spec.ts');
        console.log('✅ E2E tests passed!\n');
      } catch (error) {
        throw error;
      }
      return;
    }

    // Special handling for Hero section - run E2E tests
    if (testType === 'hero-section') {
      console.log('🧪 Running Hero section E2E tests...\n');

      try {
        await this.runPlaywrightTests('tests/sections/Hero.spec.ts');
        console.log('✅ Hero section E2E tests passed!\n');
      } catch (error) {
        throw error;
      }
      return;
    }

    // Run Playwright tests for other test types
    return this.runPlaywrightTests(null, testType);
  }

  /**
   * Run Vitest unit tests
   */
  runVitestTests(testPath) {
    return new Promise((resolve, reject) => {
      const args = ['vitest', 'run'];

      if (testPath) {
        args.push(testPath);
      }

      const proc = spawn('npx', args, {
        cwd: this.projectRoot,
        stdio: 'inherit',
        shell: true,
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Vitest tests failed with code ${code}`));
        }
      });

      proc.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Run Playwright E2E tests
   */
  runPlaywrightTests(testPath, testType) {
    return new Promise((resolve, reject) => {
      const args = ['playwright', 'test'];

      // Add specific test path if provided
      if (testPath) {
        args.push(testPath);
      } else if (testType) {
        // Add test path based on type
        switch (testType) {
          case 'ui':
            args.push('tests/ui/');
            break;
          case 'sections':
            args.push('tests/sections/');
            break;
          case 'pages':
            args.push('tests/pages/');
            break;
          case 'visual':
            args.push('--grep', '@visual');
            break;
          case 'i18n':
            args.push('tests/pages/i18n.spec.ts');
            break;
          case 'all':
          default:
            // Run all tests
            break;
        }
      }

      // Add config
      args.push('--config=tests/playwright.config.ts');
      args.push('--reporter=line');

      const proc = spawn('npx', args, {
        cwd: this.projectRoot,
        stdio: 'inherit',
        shell: true,
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Playwright tests failed with code ${code}`));
        }
      });

      proc.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// Run watcher if executed directly
if (require.main === module) {
  const watcher = new TestWatcher({
    debounceTime: 2000, // Wait 2 seconds after last change
  });

  watcher.start();
}

module.exports = TestWatcher;
