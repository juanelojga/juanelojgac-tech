# Phase 9 Memory: Performance & Accessibility Audit

**Completed**: 2026-03-26
**Status**: ✅ Complete

## What Was Built

### Files Created

- `src/lib/chat/__tests__/performance-audit.test.ts` — 15 tests validating build output performance: meta viewport, charset, font-display swap, preconnect, main landmark, skip-to-content, lang attribute, bundle sizes < 250KB
- `src/lib/chat/__tests__/accessibility-audit.test.ts` — 15 tests validating WCAG 2.1 AA: landmark regions, ARIA attributes, keyboard navigation, form labels, aria-describedby associations
- `.github/plans/phase-9-plan.md` — Implementation plan

### Files Modified

- `src/layouts/Layout.astro` — Added skip-to-content link, `<main>` landmark element, non-blocking font loading (preload + media="print" pattern with noscript fallback)
- `src/components/ConsultantSection.astro` — Changed dynamic import (`await import(...)`) to static imports for i18n files, eliminating Vite chunking warnings
- `src/components/react/chat/ChatInput.tsx` — Added `aria-describedby="chat-char-count"` on textarea, added `id="chat-char-count"` on character count span for WCAG 2.1 AA form association
- `src/components/react/chat/ChatHeader.tsx` — Removed incorrect `role="banner"` from nested `<header>` element (banner role is only valid for the page-level header landmark)
- `netlify.toml` — Added `/_astro/*` cache header for hashed assets, added security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)

### Key Decisions

- **Kept `client:load`** over `client:visible` for ConsultantLayout: The consultant section IS the main page content, visible immediately. `client:visible` would add latency without benefit.
- **Non-blocking font loading**: Used `rel="preload" as="style"` + `media="print" onload="this.media='all'"` pattern with `<noscript>` fallback. Eliminates render-blocking Google Fonts request.
- **Static i18n imports**: Changed `await import()` to conditional static imports in ConsultantSection. Both EN and ES JSON files are small and already statically imported by Seo.astro and Layout.astro, so Vite warned about redundant dynamic imports.
- **Unused production dependencies noted**: `framer-motion`, `@heroicons/react`, and `clsx` are in package.json but never imported in `src/`. They don't affect the bundle (tree-shaking) but are dead weight. Not removed per constraint "never add/remove dependencies without user approval."
- **Security headers added**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy — improves Lighthouse Best Practices score.

### Tests

- `src/lib/chat/__tests__/performance-audit.test.ts` — 15 tests covering build output validation
- `src/lib/chat/__tests__/accessibility-audit.test.ts` — 15 tests covering WCAG 2.1 AA compliance

## Architecture Notes

- The font loading pattern uses the well-established "preload + swap" technique: the browser fetches the font CSS as a preloaded style resource (non-blocking), then a second `<link>` with `media="print"` loads the stylesheet but doesn't block rendering. `onload` swaps the media to `all` once loaded.
- The skip-to-content link uses Tailwind's `sr-only` + `focus:not-sr-only` pattern — invisible by default, becomes visible and styled when focused via keyboard navigation.
- The `<main>` landmark wraps the page content slot, ensuring screen readers can navigate directly to the primary content.

## Dependencies on Future Phases

- Phase 10 depends on: All accessibility and performance optimizations from this phase as the "done" baseline

## Verification Results

```
=== Phase 9 Verification Summary ===
Static Analysis:
  - astro:check:  ✅ (0 errors, 0 warnings, 10 hints)
  - lint:         ✅ (0 errors, 0 warnings)
  - format:       ✅ (all files unchanged)
  - build:        ✅ (2 pages, 0 warnings, ~1s)

Unit Tests:
  - Total:   786 tests
  - Passed:  786
  - Failed:  0
  - New tests: 30 (performance-audit: 15, accessibility-audit: 15)

Bundle Sizes:
  - client.js (React):         182K
  - ConsultantLayout.js (app): 17K
  - index.js (hydration):      7.5K
  - Layout.css:                29K
  - Total JS:                  207K (budget: <250K ✅)

Verdict: PASS
```

### Unused Dependencies (informational)

These production dependencies are in `package.json` but never imported:

- `framer-motion` (^12.38.0)
- `@heroicons/react` (^2.2.0)
- `clsx` (^2.1.1)

They don't affect the production bundle but could be removed to clean up `package.json`.
