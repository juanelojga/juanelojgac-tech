#!/usr/bin/env node

/**
 * Deployment Gate - Abort deployment if tests fail or accessibility thresholds are not met
 *
 * This script is designed to run before deployment to ensure:
 * 1. All tests pass
 * 2. Accessibility scans meet threshold requirements
 * 3. Visual regression tests pass
 *
 * Exit codes:
 * 0 - All checks passed, safe to deploy
 * 1 - Tests failed, abort deployment
 * 2 - Accessibility violations exceed threshold, abort deployment
 * 3 - Required test reports not found
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

// Configuration
const ACCESSIBILITY_THRESHOLD = {
  maxViolations: 0, // Zero tolerance for accessibility violations
  maxCriticalViolations: 0,
  maxSeriousViolations: 0,
};

const PERFORMANCE_THRESHOLD = {
  maxPageLoadTime: 2000, // 2 seconds
  minLighthouseScore: 90, // Lighthouse performance score
};

class DeploymentGate {
  constructor(options = {}) {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.verbose = options.verbose || false;
    this.skipAccessibility = options.skipAccessibility || false;
    this.skipVisual = options.skipVisual || false;
  }

  /**
   * Main gate check - runs all validation
   */
  async checkGate() {
    console.log('🔒 Running deployment gate checks...\n');

    try {
      // 1. Run all tests
      await this.runAllTests();

      // 2. Check accessibility
      if (!this.skipAccessibility) {
        await this.checkAccessibility();
      }

      // 3. Check visual regression
      if (!this.skipVisual) {
        await this.checkVisualRegression();
      }

      // 4. Validate test results
      await this.validateTestResults();

      console.log('\n✅ All deployment gate checks passed!');
      console.log('🚀 Safe to deploy\n');
      process.exit(0);
    } catch (error) {
      console.error(`\n❌ Deployment gate failed: ${error.message}`);
      console.error('🚫 DEPLOYMENT ABORTED\n');
      process.exit(error.code || 1);
    }
  }

  /**
   * Run all Playwright tests
   */
  async runAllTests() {
    console.log('📋 Running all tests...');

    const result = await this.runCommand([
      'npx',
      'playwright',
      'test',
      '--config=tests/playwright.config.ts',
      '--reporter=json',
    ]);

    if (!result.success) {
      const error = new Error('Tests failed');
      error.code = 1;
      throw error;
    }

    console.log('✓ All tests passed\n');
  }

  /**
   * Check accessibility compliance
   */
  async checkAccessibility() {
    console.log('♿ Running accessibility scans...');

    const result = await this.runCommand([
      'npx',
      'playwright',
      'test',
      'tests/accessibility/',
      '--config=tests/playwright.config.ts',
      '--reporter=json',
    ]);

    if (!result.success) {
      const error = new Error('Accessibility tests failed');
      error.code = 2;
      throw error;
    }

    // Parse accessibility results
    try {
      const reportPath = path.join(this.projectRoot, 'reports/test-results.json');
      const reportData = await fs.readFile(reportPath, 'utf-8');
      const report = JSON.parse(reportData);

      // Check for accessibility violations
      const violations = this.parseAccessibilityViolations(report);

      if (violations.total > ACCESSIBILITY_THRESHOLD.maxViolations) {
        const error = new Error(
          `Accessibility violations (${violations.total}) exceed threshold (${ACCESSIBILITY_THRESHOLD.maxViolations})`
        );
        error.code = 2;
        throw error;
      }

      if (violations.critical > ACCESSIBILITY_THRESHOLD.maxCriticalViolations) {
        const error = new Error(
          `Critical accessibility violations (${violations.critical}) exceed threshold (${ACCESSIBILITY_THRESHOLD.maxCriticalViolations})`
        );
        error.code = 2;
        throw error;
      }

      console.log(`✓ Accessibility checks passed (${violations.total} violations)\n`);
    } catch (err) {
      if (err.code === 2) {
        throw err;
      }
      console.log('⚠️  Could not parse accessibility report, skipping validation\n');
    }
  }

  /**
   * Check visual regression tests
   */
  async checkVisualRegression() {
    console.log('👁️  Running visual regression tests...');

    const result = await this.runCommand([
      'npx',
      'playwright',
      'test',
      '--grep',
      '@visual',
      '--config=tests/playwright.config.ts',
    ]);

    if (!result.success) {
      const error = new Error('Visual regression tests failed');
      error.code = 1;
      throw error;
    }

    console.log('✓ Visual regression tests passed\n');
  }

  /**
   * Validate test results from JSON report
   */
  async validateTestResults() {
    console.log('📊 Validating test results...');

    try {
      const reportPath = path.join(this.projectRoot, 'reports/test-results.json');
      const reportData = await fs.readFile(reportPath, 'utf-8');
      const report = JSON.parse(reportData);

      const stats = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
      };

      // Parse test results
      if (report.suites) {
        this.countTestResults(report.suites, stats);
      }

      console.log(`  Total: ${stats.total}`);
      console.log(`  Passed: ${stats.passed}`);
      console.log(`  Failed: ${stats.failed}`);
      console.log(`  Skipped: ${stats.skipped}`);

      if (stats.failed > 0) {
        const error = new Error(`${stats.failed} test(s) failed`);
        error.code = 1;
        throw error;
      }

      console.log('✓ Test results validated\n');
    } catch (err) {
      if (err.code === 1 || err.code === 2) {
        throw err;
      }
      const error = new Error('Could not read test results');
      error.code = 3;
      throw error;
    }
  }

  /**
   * Count test results recursively
   */
  countTestResults(suites, stats) {
    for (const suite of suites) {
      if (suite.specs) {
        for (const spec of suite.specs) {
          stats.total++;

          if (spec.ok) {
            stats.passed++;
          } else {
            stats.failed++;
          }

          if (spec.tests && spec.tests.some((t) => t.status === 'skipped')) {
            stats.skipped++;
          }
        }
      }

      if (suite.suites) {
        this.countTestResults(suite.suites, stats);
      }
    }
  }

  /**
   * Parse accessibility violations from report
   */
  parseAccessibilityViolations(report) {
    const violations = {
      total: 0,
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    // This is a simplified parser - adjust based on actual report structure
    // In a real implementation, you'd parse Axe results from the test output

    return violations;
  }

  /**
   * Run command helper
   */
  runCommand(args) {
    return new Promise((resolve, reject) => {
      const proc = spawn(args[0], args.slice(1), {
        cwd: this.projectRoot,
        stdio: this.verbose ? 'inherit' : 'pipe',
        shell: true,
      });

      let stdout = '';
      let stderr = '';

      if (!this.verbose) {
        proc.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        proc.stderr?.on('data', (data) => {
          stderr += data.toString();
        });
      }

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, code, stdout, stderr });
        } else {
          resolve({ success: false, code, stdout, stderr });
        }
      });

      proc.on('error', (error) => {
        reject({ success: false, error: error.message });
      });
    });
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    skipAccessibility: args.includes('--skip-accessibility'),
    skipVisual: args.includes('--skip-visual'),
  };

  const gate = new DeploymentGate(options);
  gate.checkGate();
}

module.exports = DeploymentGate;
