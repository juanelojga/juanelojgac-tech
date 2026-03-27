# Redesign Phase 3 Implementation Plan: Hero Section

**Source**: REDESIGN_IMPLEMENTATION_PLAN.md — Phase 3
**Generated**: 2026-03-27
**Status**: Planning Complete
**Impeccable Skills**: frontend-design, arrange, adapt, typeset, colorize, animate, delight, onboard, bolder, harden, critique

## Success Criteria

- [ ] HeroSection.astro renders with dark gradient, animated orbs, text hierarchy (micro-label, h1, subheadline), and CTAs
- [ ] HeroVisual.tsx floating glass panel visual renders on desktop with 60fps CSS animations
- [ ] TrustMetrics.tsx count-up animation triggers on viewport entry
- [ ] Staggered entrance animation sequence plays on load
- [ ] Background orbs drift slowly with GPU-accelerated CSS
- [ ] `prefers-reduced-motion` respected everywhere (static fallback)
- [ ] Both EN/ES pages render the new hero in place of ConsultantHero
- [ ] Screen reader accessibility: aria-live for metrics, semantic HTML
- [ ] All existing tests pass + new tests for Phase 3 components
- [ ] Build, lint, astro:check all pass

## Dependency Graph

```
Phase 1 (tokens, types, i18n, keyframes) ── DONE
Phase 2 (header with #hero-section observer) ── DONE
  │
  └──> Phase 3
       ├── 3.4 Background orb CSS (independent)
       ├── 3.2 HeroVisual.tsx (depends on keyframes from Phase 1)
       ├── 3.3 TrustMetrics.tsx (depends on types from Phase 1)
       ├── 3.1 HeroSection.astro (depends on 3.2, 3.3, 3.4)
       └── 3.5 Wire into pages (depends on 3.1)
```

## Implementation Groups

### Group 1: Independent Components (Parallel Track)

| # | Task | Files | Skills | Depends On | Done Criteria | Est. |
|---|------|-------|--------|------------|---------------|------|
| 1 | Background orb CSS | `src/styles/tailwind.css` | colorize, bolder | Phase 1 keyframes | Orb classes defined, GPU-accelerated | 0.5h |
| 2 | HeroVisual.tsx | `src/components/redesign/react/HeroVisual.tsx` | frontend-design, animate, delight, bolder | Phase 1 keyframes | Floating glass panel renders, 60fps | 2h |
| 3 | TrustMetrics.tsx | `src/components/redesign/react/TrustMetrics.tsx` | frontend-design, animate, harden | Phase 1 types | Count-up, a11y, reduced motion | 2h |

### Group 2: Hero Assembly (Sequential — Critical Path)

| # | Task | Files | Skills | Depends On | Done Criteria | Est. |
|---|------|-------|--------|------------|---------------|------|
| 4 | HeroSection.astro | `src/components/redesign/HeroSection.astro` | frontend-design, arrange, adapt, typeset, onboard | Group 1 | 2-col layout, dark gradient, staggered entrance | 2.5h |
| 5 | Wire into pages | `src/pages/index.astro`, `src/pages/es.astro` | — | Task 4 | Both pages render new hero | 0.5h |

### Group 3: Tests (TDD — before each implementation)

| # | Task | Files | Depends On | Done Criteria | Est. |
|---|------|-------|------------|---------------|------|
| T1 | HeroSection tests | `src/components/redesign/__tests__/HeroSection.test.ts` | — | Source-template tests for structure, i18n | 0.5h |
| T2 | HeroVisual tests | `src/components/redesign/__tests__/HeroVisual.test.tsx` | — | Render + a11y + reduced motion tests | 0.5h |
| T3 | TrustMetrics tests | `src/components/redesign/__tests__/TrustMetrics.test.tsx` | — | Count-up, static fallback, a11y tests | 0.5h |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AstroContainer can't render React islands in tests | Medium | Use source-template testing pattern (proven in Phase 2) |
| Hero visual animation janky on low-end devices | Medium | Use will-change, GPU-accelerated transforms only, test on throttled CPU |
| Count-up animation causes CLS | Low | Reserve space with min-height, use font-variant-numeric: tabular-nums |
