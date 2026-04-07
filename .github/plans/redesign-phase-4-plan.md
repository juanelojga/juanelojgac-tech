# Redesign Phase 4 Implementation Plan: Services Preview

**Source**: REDESIGN_IMPLEMENTATION_PLAN.md — Phase 4
**Generated**: 2026-03-27
**Status**: Planning Complete
**Impeccable Skills**: frontend-design, arrange, adapt, typeset, colorize, harden, animate, clarify

## Success Criteria

- [ ] `ServicesPreview.astro` renders section with header + 5-card responsive grid
- [ ] `ServiceCard.tsx` React island with icons, hover interactions, scroll-reveal
- [ ] Responsive grid: 1-col mobile, 2-col sm, 3-col md, 5-col lg
- [ ] Scroll-triggered stagger-reveal animation (IntersectionObserver)
- [ ] `prefers-reduced-motion` respected — skip animations, show immediately
- [ ] All text sourced from `redesign.services.*` i18n keys (already exist)
- [ ] 5 inline SVG icons — no external icon library
- [ ] Hover: card lifts, border glows, icon scales, arrow slides
- [ ] Section wired into both `index.astro` and `es.astro`
- [ ] All tests pass, build clean, lint clean, astro:check clean

## Dependency Graph

```
Phase 1 (types.ts, i18n, tokens, keyframes) ── COMPLETE ✅
Phase 3 (Hero — provides #hero-section context) ── COMPLETE ✅
     │
     └──> Phase 4 (Services Preview)
            ├── 4.1: Tests for ServicesPreview (TDD)
            ├── 4.2: Tests for ServiceCard (TDD)
            ├── 4.3: ServicesPreview.astro
            ├── 4.4: ServiceCard.tsx
            └── 4.5: Wire into pages
```

## Implementation Groups

### Group 1: Tests First (Sequential — TDD)

| #   | Task                              | Files                                                       | Skills | Depends On | Done Criteria                         | Est. |
| --- | --------------------------------- | ----------------------------------------------------------- | ------ | ---------- | ------------------------------------- | ---- |
| 1   | Write ServiceCard.tsx tests       | `src/components/redesign/__tests__/ServiceCard.test.tsx`    | harden | —          | Tests exist, fail (no impl yet)       | 1h   |
| 2   | Write ServicesPreview.astro tests | `src/components/redesign/__tests__/ServicesPreview.test.ts` | harden | —          | Tests exist, source-template analysis | 1h   |

### Group 2: Implementation (Sequential — Critical Path)

| #   | Task                        | Files                                           | Skills                             | Depends On | Done Criteria                                          | Est. |
| --- | --------------------------- | ----------------------------------------------- | ---------------------------------- | ---------- | ------------------------------------------------------ | ---- |
| 3   | Build ServiceCard.tsx       | `src/components/redesign/react/ServiceCard.tsx` | frontend-design, colorize, animate | 1          | 5 cards render, hover works, scroll reveal, tests pass | 2h   |
| 4   | Build ServicesPreview.astro | `src/components/redesign/ServicesPreview.astro` | arrange, adapt, typeset            | 2, 3       | Section renders, responsive grid, tests pass           | 1.5h |
| 5   | Wire into pages             | `src/pages/index.astro`, `src/pages/es.astro`   | —                                  | 4          | Both pages show services below hero                    | 0.5h |

### Group 3: Verification

| #   | Task                  | Files | Skills | Depends On | Done Criteria                                | Est. |
| --- | --------------------- | ----- | ------ | ---------- | -------------------------------------------- | ---- |
| 6   | Run full verification | —     | —      | 5          | pnpm test, astro:check, lint, build all pass | 0.5h |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                      | Impact | Mitigation                                        |
| ----------------------------------------- | ------ | ------------------------------------------------- |
| AstroContainer can't render React islands | Medium | Use source-template testing (proven in Phase 2/3) |
| SVG icon complexity inline                | Low    | Keep icons minimal, single-path where possible    |
| 5-col grid may crowd on narrow desktops   | Low    | Use lg:grid-cols-5, test at 1024px breakpoint     |
