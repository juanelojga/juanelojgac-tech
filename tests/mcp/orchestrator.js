#!/usr/bin/env node

/**
 * MCP Orchestrator for Playwright Tests
 * Watches for file changes and triggers appropriate tests
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class PlaywrightOrchestrator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.testResults = {
      lastRun: null,
      results: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
      },
    };
  }

  /**
   * Determine which tests to run based on changed files
   */
  getTestsForChangedFiles(files) {
    const tests = new Set();

    for (const file of files) {
      // Component changes -> UI tests
      if (file.includes('/components/')) {
        tests.add('ui');
      }

      // Page changes -> Page tests
      if (file.includes('/pages/')) {
        tests.add('pages');
      }

      // Layout changes -> All tests
      if (file.includes('/layouts/')) {
        tests.add('all');
        break; // No need to check more
      }

      // Style changes -> Visual regression
      if (file.includes('/styles/') || file.includes('.css')) {
        tests.add('visual');
      }

      // i18n changes -> i18n tests
      if (file.includes('/i18n/')) {
        tests.add('i18n');
      }
    }

    return Array.from(tests);
  }

  /**
   * Run Playwright tests
   */
  async runTests(testType = 'all', options = {}) {
    const args = ['npx', 'playwright', 'test'];

    // Add test path based on type
    switch (testType) {
      case 'ui':
        args.push('tests/ui/');
        break;
      case 'pages':
        args.push('tests/pages/');
        break;
      case 'accessibility':
        args.push('--grep', '@accessibility');
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

    // Add reporter options
    args.push('--reporter=line');
    args.push('--reporter=html');
    args.push('--reporter=json');

    // Add config
    args.push('--config=tests/playwright.config.ts');

    // Run in specific browser if specified
    if (options.browser) {
      args.push('--project', options.browser);
    }

    // Headed mode for debugging
    if (options.headed) {
      args.push('--headed');
    }

    console.log(`🧪 Running ${testType} tests...`);
    console.log(`Command: ${args.join(' ')}`);

    return new Promise((resolve, reject) => {
      const proc = spawn(args[0], args.slice(1), {
        cwd: this.projectRoot,
        stdio: 'inherit',
        shell: true,
      });

      proc.on('close', (code) => {
        this.testResults.lastRun = new Date().toISOString();

        if (code === 0) {
          console.log('✅ Tests passed!');
          resolve({ success: true, code });
        } else {
          console.log('❌ Tests failed!');
          reject({ success: false, code });
        }
      });

      proc.on('error', (error) => {
        console.error('Error running tests:', error);
        reject({ success: false, error: error.message });
      });
    });
  }

  /**
   * Run accessibility scan on specific URL
   */
  async runAccessibilityScan(url) {
    console.log(`♿ Running accessibility scan on ${url}...`);

    const args = [
      'npx',
      'playwright',
      'test',
      '--grep',
      'accessibility',
      '--config=tests/playwright.config.ts',
    ];

    return this.runCommand(args);
  }

  /**
   * Watch files for changes
   */
  async watchFiles(patterns) {
    console.log('👀 Watching files for changes...');
    console.log('Patterns:', patterns);

    // This would integrate with a file watcher like chokidar
    // For now, we'll just log the intention
    return {
      watching: true,
      patterns,
    };
  }

  /**
   * Get latest test results
   */
  async getLatestResults() {
    try {
      const reportPath = path.join(
        this.projectRoot,
        'reports/test-results.json',
      );
      const data = await fs.readFile(reportPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return {
        error: 'No test results available',
        lastRun: this.testResults.lastRun,
      };
    }
  }

  /**
   * Run command helper
   */
  runCommand(args) {
    return new Promise((resolve, reject) => {
      const proc = spawn(args[0], args.slice(1), {
        cwd: this.projectRoot,
        stdio: 'inherit',
        shell: true,
      });

      proc.on('close', (code) => {
        resolve({ success: code === 0, code });
      });

      proc.on('error', (error) => {
        reject({ success: false, error: error.message });
      });
    });
  }
}

// MCP Server Implementation
if (require.main === module) {
  const orchestrator = new PlaywrightOrchestrator();

  // Handle MCP requests
  process.stdin.on('data', async (data) => {
    try {
      const request = JSON.parse(data.toString());

      let response;

      switch (request.method) {
        case 'run_tests':
          response = await orchestrator.runTests(
            request.params.testType,
            request.params,
          );
          break;

        case 'watch_files':
          response = await orchestrator.watchFiles(request.params.patterns);
          break;

        case 'run_accessibility_scan':
          response = await orchestrator.runAccessibilityScan(
            request.params.url,
          );
          break;

        case 'get_results':
          response = await orchestrator.getLatestResults();
          break;

        default:
          throw new Error(`Unknown method: ${request.method}`);
      }

      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: request.id,
          result: response,
        }) + '\n',
      );
    } catch (error) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32603,
            message: error.message,
          },
        }) + '\n',
      );
    }
  });

  console.log('🚀 MCP Playwright Orchestrator started');
}

module.exports = PlaywrightOrchestrator;
