#!/bin/bash

###############################################################################
# Pre-deployment Hook Script
# Runs comprehensive test suite before deployment
# Aborts deployment if tests fail or accessibility thresholds are not met
###############################################################################

set -e  # Exit on any error

echo "🚀 Pre-deployment checks starting..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
DEPLOYMENT_ALLOWED=true
ERRORS=()

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to run tests and capture results
run_test_suite() {
    local test_name=$1
    local test_command=$2

    echo "Running $test_name..."

    if eval "$test_command"; then
        print_success "$test_name passed"
        return 0
    else
        print_error "$test_name failed"
        ERRORS+=("$test_name failed")
        DEPLOYMENT_ALLOWED=false
        return 1
    fi
}

# 1. Build the project
echo "📦 Building project..."
if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed"
    ERRORS+=("Build failed")
    DEPLOYMENT_ALLOWED=false
fi
echo ""

# 2. Run unit tests
echo "🧪 Running unit tests..."
run_test_suite "Unit Tests" "npm run test -- --run"
echo ""

# 3. Run E2E tests
echo "🎭 Running E2E tests..."
run_test_suite "E2E Tests" "npm run test:e2e"
echo ""

# 4. Run accessibility tests
echo "♿ Running accessibility tests..."
run_test_suite "Accessibility Tests" "npm run test:accessibility"
echo ""

# 5. Run visual regression tests
echo "👁️  Running visual regression tests..."
run_test_suite "Visual Regression Tests" "npm run test:visual"
echo ""

# 6. Run linting
echo "🔍 Running linter..."
run_test_suite "Linting" "npm run lint"
echo ""

# 7. Check for security vulnerabilities (optional)
echo "🔒 Checking for security vulnerabilities..."
if npm audit --audit-level=high; then
    print_success "No high-severity vulnerabilities found"
else
    print_warning "Security vulnerabilities detected (review npm audit output)"
    # Not blocking deployment for this, but logging
fi
echo ""

# Final verdict
echo "================================================"
echo "DEPLOYMENT GATE SUMMARY"
echo "================================================"

if [ "$DEPLOYMENT_ALLOWED" = true ]; then
    print_success "All checks passed - DEPLOYMENT ALLOWED"
    echo ""
    echo "🚀 Ready to deploy!"
    exit 0
else
    print_error "Some checks failed - DEPLOYMENT BLOCKED"
    echo ""
    echo "Failed checks:"
    for error in "${ERRORS[@]}"; do
        echo "  - $error"
    done
    echo ""
    echo "🚫 Deployment aborted. Please fix the issues above."
    exit 1
fi
