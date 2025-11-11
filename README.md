# JuaneloJGAC Tech - Astro Portfolio

[![CI/CD Pipeline](https://github.com/juanelojga/juanelojgac-tech/actions/workflows/ci.yml/badge.svg)](https://github.com/juanelojga/juanelojgac-tech/actions/workflows/ci.yml)
[![Playwright Tests](https://github.com/juanelojga/juanelojgac-tech/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/juanelojga/juanelojgac-tech/actions/workflows/playwright-tests.yml)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green?logo=accessibility)](https://github.com/juanelojga/juanelojgac-tech/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-NETLIFY-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)

> A modern, accessible, and performant portfolio website built with Astro, featuring comprehensive testing with MCP, Playwright, and shadcn/ui components.

## ✨ Features

- 🚀 **Blazing Fast** - Built with Astro for optimal performance
- ♿ **Accessible** - WCAG 2.1 Level AA compliant
- 🎨 **Modern UI** - Styled with Tailwind CSS and shadcn/ui
- 🌐 **Bilingual** - Full i18n support
- 🧪 **Comprehensive Testing** - E2E, unit, accessibility, and visual regression tests
- 📊 **MCP Integration** - Automated test orchestration and file monitoring
- 🔄 **CI/CD** - Automated testing and deployment with GitHub Actions
- 🌍 **SEO Optimized** - Built-in SEO best practices

## 🏗️ Project Structure

```text
/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Main CI/CD pipeline
│       └── playwright-tests.yml      # Playwright test workflow
├── public/                           # Static assets
├── src/
│   ├── assets/                       # Images, fonts, etc.
│   ├── components/                   # Astro & React components
│   ├── layouts/                      # Page layouts
│   ├── pages/                        # Route pages
│   ├── i18n/                         # Internationalization
│   └── styles/                       # Global styles
├── tests/
│   ├── accessibility/                # Axe accessibility tests
│   ├── pages/                        # Page navigation tests
│   ├── ui/                           # Component tests
│   ├── mcp/                          # MCP orchestration scripts
│   │   ├── watcher.js               # File change watcher
│   │   ├── deployment-gate.js       # Pre-deployment checks
│   │   ├── pre-deploy-hook.sh       # Deployment hook
│   │   └── pre-commit-hook.js       # Pre-commit validation
│   ├── fixtures/                     # Test fixtures
│   └── playwright.config.ts          # Playwright configuration
├── reports/                          # Test reports (generated)
├── netlify.toml                      # Netlify configuration
├── .env.example                      # Environment variables template
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or later
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/juanelojga/juanelojgac-tech.git
cd juanelojgac-tech

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Copy environment variables
cp .env.example .env
# Edit .env and add your configuration
```

### Development

```bash
# Start development server
npm run dev

# Run development server with file watcher
npm run test:watch
```

Visit `http://localhost:4321` to see your site.

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

### Test Suites

Our comprehensive testing strategy includes:

#### E2E Testing (Playwright)
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

#### Component Testing
```bash
# Run UI component tests
npm run test:components

# Run with file watcher
npm run test:watch
```

#### Page Testing
```bash
# Run page navigation tests
npm run test:pages
```

#### Accessibility Testing
```bash
# Run accessibility scans (WCAG 2.1 AA)
npm run test:accessibility
```

#### Visual Regression Testing
```bash
# Run visual regression tests
npm run test:visual
```

#### Unit Testing (Vitest)
```bash
# Run unit tests
npm run test

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### MCP (Model Context Protocol) Integration

Our MCP integration provides automated test orchestration:

```bash
# Start MCP file watcher
npm run test:watch

# Run deployment gate checks
npm run test:deployment-gate

# Run pre-deployment validation
npm run pre-deploy
```

The MCP watcher automatically detects file changes and triggers relevant tests:
- **Component changes** → UI tests
- **Page changes** → Page navigation tests
- **Style changes** → Visual regression tests
- **i18n changes** → i18n tests

### Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

Reports are also generated automatically in CI/CD and uploaded as artifacts.

## 🔄 CI/CD Pipeline

Our GitHub Actions workflow provides comprehensive continuous integration and deployment:

### Workflow Jobs

1. **Setup** - Install dependencies and cache node_modules
2. **Build** - Compile Astro site
3. **MCP Watcher** - Verify file monitoring setup
4. **Test Suites** (Parallel execution with sharding):
   - UI Component Tests (2 shards)
   - Page Navigation Tests (2 shards)
   - Accessibility Tests (WCAG 2.1 AA)
   - Visual Regression Tests
   - Cross-Browser Tests (Chromium, Firefox, WebKit)
5. **Reports** - Generate and upload test reports
6. **MCP Summary** - Consolidated test results
7. **Deployment Gate** - Validate all checks before deployment
8. **Netlify Deploy** - Automatic deployment on success

### Triggers

- **Push** to `main` or `develop` branches
- **Pull Requests** to `main` or `develop`
- **Manual** via workflow_dispatch

### Quality Gates

The CI/CD pipeline enforces these quality standards:

✅ **Build Success** - Astro compilation must succeed
✅ **Test Coverage** - All test suites must pass
✅ **Accessibility** - Zero tolerance for WCAG 2.1 AA violations
✅ **Performance** - Pages must load within 2 seconds
✅ **Visual Regression** - Pixel differences within threshold (100px, 20%)
✅ **Browser Compatibility** - Tests pass on Chromium, Firefox, and WebKit

Deployment is automatically blocked if any check fails.

### GitHub Secrets Setup

Required secrets for CI/CD (set in GitHub Repository Settings → Secrets):

```bash
NETLIFY_AUTH_TOKEN  # Your Netlify authentication token
NETLIFY_SITE_ID     # Your Netlify site ID
```

Optional secrets (add as needed):
- Analytics IDs (Google Analytics, Plausible, etc.)
- API keys for third-party services
- Environment-specific configurations

See `.env.example` for the complete list of available environment variables.

## 📊 Performance & Accessibility

### Performance Targets

- ⚡ **Page Load Time**: < 2 seconds
- 🎯 **Lighthouse Score**: > 90
- 📦 **Bundle Size**: Optimized with code splitting

### Accessibility Standards

- ♿ **WCAG 2.1 Level AA** compliance
- 🎨 **Color Contrast**: Minimum 4.5:1 ratio
- ⌨️ **Keyboard Navigation**: Full keyboard support
- 🔍 **Screen Readers**: Semantic HTML with proper ARIA labels
- 🖼️ **Images**: Alt text for all images
- 📋 **Forms**: Proper labels and error messages

All pages are continuously tested for accessibility violations with zero tolerance policy.

## 🌐 Deployment

### Netlify (Automatic)

Deployment happens automatically when:
- Code is pushed to `main` (production) or `develop` (staging)
- All CI/CD checks pass
- Deployment gate approves the release

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Netlify using Netlify CLI
netlify deploy --prod
```

### Environment Configuration

Configure environments in `netlify.toml`:
- **Production**: `main` branch → production deployment
- **Staging**: `develop` branch → staging deployment
- **Preview**: Pull requests → deploy previews

## 🛠️ Development Tools

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Pre-commit Hooks

Husky is configured to run checks before commits:
- ESLint for code quality
- Prettier for formatting
- MCP pre-commit validation

### VS Code Extensions (Recommended)

- **Astro** - Syntax highlighting and IntelliSense
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Playwright Test for VSCode** - Test running and debugging
- **Tailwind CSS IntelliSense** - CSS class autocomplete

## 📖 Documentation

### Key Configuration Files

- `astro.config.mjs` - Astro configuration
- `playwright.config.ts` - Playwright test configuration
- `netlify.toml` - Netlify deployment configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `.github/workflows/ci.yml` - CI/CD pipeline configuration

### Testing Documentation

- Tests follow the **Arrange-Act-Assert** pattern
- Page Object Model for E2E tests
- Accessibility tests use **@axe-core/playwright**
- Visual regression with Playwright's screenshot comparison
- MCP orchestration for automated test triggering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test:all`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

All PRs must pass CI/CD checks before merging.

## 📝 Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests with Vitest |
| `npm run test:e2e` | Run all Playwright E2E tests |
| `npm run test:components` | Run UI component tests |
| `npm run test:pages` | Run page navigation tests |
| `npm run test:accessibility` | Run accessibility tests |
| `npm run test:visual` | Run visual regression tests |
| `npm run test:watch` | Start MCP file watcher |
| `npm run test:all` | Run all tests (unit + E2E) |
| `npm run test:deployment-gate` | Run deployment gate checks |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |

## 🔗 Links

- [Astro Documentation](https://docs.astro.build)
- [Playwright Documentation](https://playwright.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Juan Eloy**

- Website: [juanelojgac.tech](https://juanelojgac.tech)
- GitHub: [@juanelojga](https://github.com/juanelojga)

---

Built with ❤️ using [Astro](https://astro.build)
