# CI/CD Setup Guide

This guide will help you configure the GitHub Actions CI/CD pipeline and Netlify deployment for your Astro project.

## Prerequisites

Before you begin, make sure you have:

- ✅ A GitHub repository for your project
- ✅ A Netlify account (free tier is sufficient)
- ✅ Node.js 20+ installed locally
- ✅ Git installed and configured

## Step 1: Netlify Setup

### 1.1 Create a Netlify Site

1. Go to [Netlify](https://www.netlify.com/) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20`
5. Click **"Deploy site"**

### 1.2 Get Your Netlify Credentials

You need two pieces of information:

#### Netlify Auth Token

1. Go to [User Settings → Applications](https://app.netlify.com/user/applications)
2. Click **"New access token"**
3. Give it a name (e.g., "GitHub Actions")
4. Click **"Generate token"**
5. **Copy the token immediately** (you won't be able to see it again)

#### Netlify Site ID

1. Go to your site in Netlify dashboard
2. Click **"Site settings"**
3. Under **"Site details"**, find **"Site ID"**
4. Copy the Site ID (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Step 2: Configure GitHub Secrets

### 2.1 Add Required Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

Add these two **required** secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `NETLIFY_AUTH_TOKEN` | Your Netlify personal access token | `nfp_xxxxxxxxxxxxxxxxxxxxx` |
| `NETLIFY_SITE_ID` | Your Netlify site ID | `12345678-1234-1234-1234-123456789abc` |

### 2.2 Add Optional Secrets

If you're using any of these services, add their secrets too:

<details>
<summary>Analytics Services</summary>

| Secret Name | Service |
|-------------|---------|
| `GA_TRACKING_ID` | Google Analytics |
| `GTM_ID` | Google Tag Manager |
| `PLAUSIBLE_DOMAIN` | Plausible Analytics |

</details>

<details>
<summary>Error Tracking</summary>

| Secret Name | Service |
|-------------|---------|
| `SENTRY_DSN` | Sentry |
| `SENTRY_AUTH_TOKEN` | Sentry |

</details>

<details>
<summary>CMS Integration</summary>

| Secret Name | Service |
|-------------|---------|
| `CONTENTFUL_SPACE_ID` | Contentful |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful |
| `SANITY_PROJECT_ID` | Sanity |
| `SANITY_TOKEN` | Sanity |

</details>

See `.env.example` for the complete list of available environment variables.

## Step 3: Configure Environment Variables in Netlify

Some environment variables should also be set in Netlify for runtime access:

1. Go to your Netlify site dashboard
2. Click **Site settings** → **Environment variables**
3. Add the following:

```bash
NODE_ENV=production
NODE_VERSION=20
```

Add any other environment variables your app needs at runtime (API keys, etc.).

## Step 4: Update README Badge URLs

In `README.md`, update these badge URLs with your actual information:

### Netlify Badge

Replace this line:
```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-NETLIFY-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)
```

With your actual values:
1. Get your badge ID from Netlify: **Site settings** → **Status badges**
2. Copy the badge markdown
3. Replace the placeholder in README.md

### GitHub Actions Badges

The following badges should work automatically with your repository:
```markdown
[![CI/CD Pipeline](https://github.com/YOUR-USERNAME/YOUR-REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR-USERNAME/YOUR-REPO/actions/workflows/ci.yml)
```

Replace `YOUR-USERNAME` and `YOUR-REPO` with your actual GitHub username and repository name.

## Step 5: Test the Workflow

### 5.1 Manual Test

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **"CI/CD Pipeline"** workflow
4. Click **"Run workflow"** → **"Run workflow"**
5. Watch the workflow execute

### 5.2 Automatic Test

1. Make a small change to your code
2. Commit and push to a feature branch:
   ```bash
   git checkout -b test/ci-cd-setup
   echo "# Testing CI/CD" >> test.md
   git add test.md
   git commit -m "Test: CI/CD pipeline"
   git push origin test/ci-cd-setup
   ```
3. Create a Pull Request
4. The CI/CD pipeline will automatically run
5. Check the **Actions** tab to see the results

## Step 6: Verify All Checks Pass

The CI/CD pipeline includes these checks:

- ✅ **Setup & Build** - Dependencies and Astro build
- ✅ **MCP Watcher** - File monitoring verification
- ✅ **UI Tests** - Component tests with sharding
- ✅ **Page Tests** - Navigation and routing tests
- ✅ **Accessibility Tests** - WCAG 2.1 AA compliance
- ✅ **Visual Regression** - Screenshot comparison
- ✅ **Browser Tests** - Chromium, Firefox, WebKit
- ✅ **Reports** - Consolidated test reports
- ✅ **Deployment Gate** - Quality gate checks

All checks must pass before deployment to Netlify.

## Step 7: Configure Branch Protection (Recommended)

Protect your main branch to ensure all checks pass before merging:

1. Go to **Settings** → **Branches**
2. Click **"Add rule"** for `main` branch
3. Enable these settings:
   - ☑️ **Require a pull request before merging**
   - ☑️ **Require status checks to pass before merging**
   - Select these required checks:
     - `Setup & Install Dependencies`
     - `Build Astro Site`
     - `MCP File Monitoring Check`
     - `UI Component Tests`
     - `Page Navigation Tests`
     - `Accessibility Tests`
     - `Visual Regression Tests`
     - `Browser Tests`
   - ☑️ **Require branches to be up to date before merging**
   - ☑️ **Require conversation resolution before merging**
4. Click **"Create"** or **"Save changes"**

Repeat for the `develop` branch if you use one.

## Step 8: Local Development Setup

Set up your local environment:

### 8.1 Install Dependencies

```bash
npm install
npx playwright install --with-deps
```

### 8.2 Configure Local Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your local configuration
# You don't need Netlify credentials for local development
```

### 8.3 Run Tests Locally

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:accessibility

# All tests
npm run test:all
```

### 8.4 Start MCP File Watcher (Optional)

For automatic test execution on file changes:

```bash
npm run test:watch
```

This will:
- Watch for changes in `src/components/`, `src/pages/`, `src/layouts/`
- Automatically run relevant tests when files change
- Provide immediate feedback during development

## Troubleshooting

### Workflow Fails on First Run

**Issue**: The workflow fails because Netlify secrets are not set.

**Solution**: Make sure you've added `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` to GitHub Secrets (Step 2.1).

### Deployment Blocked

**Issue**: Deployment is blocked even though all tests pass.

**Solution**:
- Check the **Deployment Gate** job logs
- Verify all test jobs completed successfully
- Ensure you're pushing to `main` or `develop` branch

### Accessibility Tests Fail

**Issue**: Accessibility tests are failing with violations.

**Solution**:
- Check the accessibility report in workflow artifacts
- Fix violations in your code (color contrast, ARIA labels, etc.)
- Run `npm run test:accessibility` locally to debug
- Review [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Visual Regression Tests Fail

**Issue**: Visual tests fail due to pixel differences.

**Solution**:
- Download the visual diff artifacts from the workflow
- Review the differences in the screenshots
- If changes are intentional:
  ```bash
  npm run test:visual -- --update-snapshots
  git add tests/snapshots
  git commit -m "Update visual snapshots"
  ```

### Node Version Mismatch

**Issue**: Tests fail due to Node.js version mismatch.

**Solution**:
- Ensure Node.js 20+ is installed locally
- Check `.nvmrc` file if using nvm:
  ```bash
  nvm use
  ```

### Playwright Browser Installation

**Issue**: Playwright tests fail with "Browser not found".

**Solution**:
```bash
npx playwright install --with-deps
```

### Cache Issues

**Issue**: Workflow uses outdated dependencies.

**Solution**:
1. Go to **Actions** → **Caches**
2. Delete old caches
3. Re-run the workflow

## Performance Optimization

### Workflow Runtime

The CI/CD pipeline is optimized for speed:

- **Dependency caching** - Cached `node_modules` and Playwright browsers
- **Parallel execution** - Tests run in parallel with sharding
- **Job dependencies** - Smart job ordering to fail fast
- **Artifact caching** - Build artifacts shared between jobs

Expected runtime: **8-12 minutes** for full pipeline

### Cost Optimization

Free tier limits on GitHub Actions:

- **Public repos**: Unlimited minutes
- **Private repos**: 2,000 minutes/month (free tier)

To optimize costs:
- Use conditional jobs (skip deployment on PRs)
- Reduce test shards if needed
- Cache aggressively

## Monitoring & Alerts

### GitHub Actions Notifications

Configure notifications:

1. Go to **Settings** → **Notifications** → **Actions**
2. Choose notification preferences:
   - Email notifications for workflow failures
   - Slack/Discord integration (via webhooks)

### Netlify Notifications

Configure deployment notifications:

1. Go to **Site settings** → **Notifications**
2. Add notifications for:
   - Deploy started
   - Deploy succeeded
   - Deploy failed

## Next Steps

- ✅ Configure GitHub Secrets ← Start here
- ✅ Test the workflow
- ✅ Set up branch protection
- ✅ Configure monitoring
- 🚀 Start developing!

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Documentation](https://docs.netlify.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Astro Documentation](https://docs.astro.build/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review workflow logs in the **Actions** tab
3. Check Netlify deploy logs in your Netlify dashboard
4. Review test reports in workflow artifacts

---

**Happy deploying! 🚀**
