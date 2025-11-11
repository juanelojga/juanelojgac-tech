#!/usr/bin/env node

/**
 * MCP Reporter for Playwright Tests
 * Serves test reports and results via MCP
 */

const path = require('path');
const fs = require('fs').promises;

class TestReporter {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.reportsDir = path.join(this.projectRoot, 'reports');
  }

  /**
   * Get latest JSON test results
   */
  async getLatestReport() {
    try {
      const reportPath = path.join(this.reportsDir, 'test-results.json');
      const data = await fs.readFile(reportPath, 'utf-8');
      const results = JSON.parse(data);

      return {
        timestamp: new Date().toISOString(),
        results: results,
        summary: this.calculateSummary(results),
      };
    } catch (error) {
      return {
        error: 'No test results available',
        message: error.message,
      };
    }
  }

  /**
   * Get HTML report
   */
  async getHtmlReport() {
    try {
      const reportPath = path.join(
        this.reportsDir,
        'playwright-html/index.html',
      );
      const html = await fs.readFile(reportPath, 'utf-8');

      return {
        contentType: 'text/html',
        content: html,
      };
    } catch (error) {
      return {
        error: 'HTML report not available',
        message: error.message,
      };
    }
  }

  /**
   * Get test summary
   */
  async getTestSummary() {
    try {
      const report = await this.getLatestReport();

      if (report.error) {
        return report;
      }

      return {
        summary: report.summary,
        lastRun: report.timestamp,
        reportUrl: `file://${this.reportsDir}/playwright-html/index.html`,
      };
    } catch (error) {
      return {
        error: 'Failed to generate summary',
        message: error.message,
      };
    }
  }

  /**
   * Calculate test summary from results
   */
  calculateSummary(results) {
    const summary = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      flaky: 0,
      duration: 0,
    };

    if (results.suites) {
      this.processSuites(results.suites, summary);
    }

    return summary;
  }

  /**
   * Process test suites recursively
   */
  processSuites(suites, summary) {
    for (const suite of suites) {
      if (suite.specs) {
        for (const spec of suite.specs) {
          summary.total++;

          if (spec.ok) {
            summary.passed++;
          } else {
            summary.failed++;
          }

          if (spec.tests) {
            for (const test of spec.tests) {
              summary.duration += test.results[0]?.duration || 0;
            }
          }
        }
      }

      if (suite.suites) {
        this.processSuites(suite.suites, summary);
      }
    }
  }

  /**
   * Get accessibility violations report
   */
  async getAccessibilityReport() {
    try {
      // Look for accessibility-specific results
      const reportPath = path.join(this.reportsDir, 'test-results.json');
      const data = await fs.readFile(reportPath, 'utf-8');
      const results = JSON.parse(data);

      const violations = this.extractAccessibilityViolations(results);

      return {
        timestamp: new Date().toISOString(),
        violations,
        summary: {
          total: violations.length,
          critical: violations.filter((v) => v.impact === 'critical').length,
          serious: violations.filter((v) => v.impact === 'serious').length,
          moderate: violations.filter((v) => v.impact === 'moderate').length,
          minor: violations.filter((v) => v.impact === 'minor').length,
        },
      };
    } catch (error) {
      return {
        error: 'Failed to generate accessibility report',
        message: error.message,
      };
    }
  }

  /**
   * Extract accessibility violations from test results
   */
  extractAccessibilityViolations(results) {
    const violations = [];

    // This would parse the test results for accessibility violations
    // Implementation depends on how axe results are stored

    return violations;
  }

  /**
   * List all available reports
   */
  async listReports() {
    try {
      const files = await fs.readdir(this.reportsDir);

      const reports = files
        .filter(
          (file) =>
            file.endsWith('.json') ||
            file.endsWith('.html') ||
            file.endsWith('.xml'),
        )
        .map((file) => ({
          name: file,
          path: path.join(this.reportsDir, file),
          type: path.extname(file),
        }));

      return {
        reports,
        count: reports.length,
      };
    } catch (error) {
      return {
        error: 'Failed to list reports',
        message: error.message,
      };
    }
  }
}

// MCP Server Implementation
if (require.main === module) {
  const reporter = new TestReporter();

  // Handle MCP resource requests
  process.stdin.on('data', async (data) => {
    try {
      const request = JSON.parse(data.toString());

      let response;

      switch (request.method) {
        case 'resources/read':
          if (request.params.uri === 'test://latest_report') {
            response = await reporter.getLatestReport();
          } else if (request.params.uri === 'test://html_report') {
            response = await reporter.getHtmlReport();
          } else if (request.params.uri === 'test://summary') {
            response = await reporter.getTestSummary();
          } else if (request.params.uri === 'test://accessibility') {
            response = await reporter.getAccessibilityReport();
          } else {
            throw new Error(`Unknown resource: ${request.params.uri}`);
          }
          break;

        case 'resources/list':
          response = await reporter.listReports();
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

  console.log('📊 MCP Test Reporter started');
}

module.exports = TestReporter;
