# Phase 9 Implementation Plan: Performance & Accessibility Audit

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 9
**Generated**: 2026-03-26
**Status**: Planning Complete

## Success Criteria

- [ ] Lighthouse Performance ≥90
- [ ] Lighthouse Accessibility ≥90
- [ ] Lighthouse Best Practices ≥90
- [ ] Lighthouse SEO ≥90
- [ ] WCAG 2.1 AA compliance — keyboard navigation, screen reader, color contrast, focus management
- [ ] All interactive elements keyboard-accessible
- [ ] Screen reader announces state changes
- [ ] Bundle optimized — no dead code in production build
- [ ] Chat components loaded efficiently, no unnecessary JS in initial bundle
- [ ] Median response latency ≤2.5s, typing indicator shows immediately
- [ ] Full test suite — unit + E2E — all green

## Baseline Measurements

| Metric         | Current Value                                                |
| -------------- | ------------------------------------------------------------ |
| JS Bundles     | client.js (182K), ConsultantLayout.js (17K), index.js (7.5K) |
| CSS Bundle     | Layout.css (28K)                                             |
| HTML Pages     | index.html (34K), es/index.html (34K)                        |
| Unit Tests     | 756 passing                                                  |
| Build Time     | ~1s                                                          |
| Build Warnings | 2 Vite dynamic import warnings                               |

## Dependency Graph

```
Group 1 (Sequential — Critical Path):
  Tests → Font optimization → Import fixes → Bundle reduction → A11y → Verify

Group 2 (Parallel after tests):
  Font loading ║ Import fixes ║ Meta/headers

Group 3 (Sequential after Group 2):
  Lazy loading → Bundle optimization → A11y remediation → Final verify
```

## Implementation Groups

### Group 1: Performance Tests & Baseline (Sequential — Critical Path)

| #   | Task                          | Files                                              | Depends On | Done Criteria                                      | Est. |
| --- | ----------------------------- | -------------------------------------------------- | ---------- | -------------------------------------------------- | ---- |
| 1   | Write performance audit tests | `src/lib/chat/__tests__/performance-audit.test.ts` | —          | Tests verify build output, font loading, meta tags | 2h   |

### Group 2: Performance Optimizations (Parallel Track)

| #   | Task                                           | Files                       | Depends On | Done Criteria                           | Est. |
| --- | ---------------------------------------------- | --------------------------- | ---------- | --------------------------------------- | ---- |
| 2   | Fix Vite dynamic import warnings               | `ConsultantSection.astro`   | Tests      | No build warnings                       | 1h   |
| 3   | Optimize font loading (preload + font-display) | `Layout.astro`              | Tests      | Fonts use display=swap, preloaded       | 1h   |
| 4   | Add resource hints and meta viewport           | `Layout.astro`, `Seo.astro` | Tests      | Preconnect, dns-prefetch, viewport meta | 1h   |
| 5   | Optimize image/asset loading                   | Various                     | Tests      | Preload hints for critical assets       | 1h   |

### Group 3: Bundle & Component Optimization (Sequential)

| #   | Task                                  | Files                     | Depends On | Done Criteria                                  | Est. |
| --- | ------------------------------------- | ------------------------- | ---------- | ---------------------------------------------- | ---- |
| 6   | Change chat to client:visible         | `ConsultantSection.astro` | Group 2    | Chat loads on viewport entry, not on page load | 1h   |
| 7   | Remove dead code, verify tree shaking | Various                   | Step 6     | No unused exports in production build          | 1h   |

### Group 4: Accessibility Audit & Fixes (Sequential)

| #   | Task                                   | Files                                                | Depends On | Done Criteria                                       | Est. |
| --- | -------------------------------------- | ---------------------------------------------------- | ---------- | --------------------------------------------------- | ---- |
| 8   | Write accessibility audit tests        | `src/lib/chat/__tests__/accessibility-audit.test.ts` | —          | Tests verify ARIA, roles, focus management          | 2h   |
| 9   | Fix WCAG 2.1 AA issues                 | React components                                     | Tests      | All a11y tests pass, keyboard nav works             | 3h   |
| 10  | Add skip-to-content & focus management | `Layout.astro`, components                           | Step 9     | Skip link visible on focus, focus trapped in modals | 1h   |

### Group 5: Verification & Documentation

| #   | Task                        | Files                             | Depends On | Done Criteria                                     | Est. |
| --- | --------------------------- | --------------------------------- | ---------- | ------------------------------------------------- | ---- |
| 11  | Run full verification gate  | —                                 | All above  | pnpm test, build, lint:fix, astro:check all green | 1h   |
| 12  | Create memory documentation | `.github/plans/phase-9-memory.md` | Step 11    | Complete memory file                              | 0.5h |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds with no warnings

## Risks & Mitigations

| Risk                                          | Impact | Mitigation                               |
| --------------------------------------------- | ------ | ---------------------------------------- |
| client:visible may delay chat hydration       | Medium | Test UX to ensure acceptable delay       |
| Font preloading may flash FOUT                | Low    | Use font-display:swap with preload hints |
| A11y fixes may change existing component APIs | Medium | Run existing tests after each change     |
