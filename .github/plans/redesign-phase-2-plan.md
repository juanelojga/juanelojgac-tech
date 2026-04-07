# Redesign Phase 2 Implementation Plan: Header & Footer Redesign

**Source**: REDESIGN_IMPLEMENTATION_PLAN.md — Phase 2
**Generated**: 2026-03-27
**Status**: Planning Complete
**Impeccable Skills**: frontend-design, arrange, adapt, typeset, colorize, bolder, harden

## Success Criteria

- [ ] RedesignedHeader.astro renders on both EN/ES pages
- [ ] Header is transparent on hero, gains backdrop-blur + dark bg on scroll
- [ ] Nav links, social icons, language switch, CTA all functional
- [ ] Mobile shows logo + hamburger; menu opens with full nav, a11y, focus trap
- [ ] RedesignedFooter.astro renders 4-column layout on both pages
- [ ] Social links open in new tab with `rel="noopener noreferrer"` and `aria-label`
- [ ] Footer columns stack responsively on mobile
- [ ] Layout.astro uses dark body background
- [ ] All existing 1013 tests still pass
- [ ] `pnpm run build` succeeds
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run lint:fix` clean

## Dependency Graph

```
Phase 1 (Complete ✅)
  │
  ├── 2.1 Layout dark background ──┐
  │                                │
  ├── 2.2 RedesignedHeader.astro ──┤
  │       │                        │
  │       └── 2.3 MobileMenu.tsx ──┤
  │                                │
  ├── 2.4 RedesignedFooter.astro ──┤
  │                                │
  └── 2.5 Wire into pages ─────────┘ (depends on 2.2 + 2.4)
          │
          └── 2.6 Update tests
```

## Implementation Groups

### Group 1: Foundation (Sequential — Critical Path)

| #   | Task                                | Files                      | Skills   | Depends On | Done Criteria                                  | Est. |
| --- | ----------------------------------- | -------------------------- | -------- | ---------- | ---------------------------------------------- | ---- |
| 2.1 | Update Layout.astro dark background | `src/layouts/Layout.astro` | colorize | Phase 1    | Dark body bg, skip-link updated for dark theme | 0.5h |

### Group 2: Header (Sequential)

| #   | Task                              | Files                                            | Skills                                              | Depends On | Done Criteria                                                                            | Est. |
| --- | --------------------------------- | ------------------------------------------------ | --------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------- | ---- |
| 2.2 | Build RedesignedHeader.astro      | `src/components/redesign/RedesignedHeader.astro` | frontend-design, arrange, typeset, colorize, bolder | 2.1        | Header renders, transparent→scrolled transition via IntersectionObserver, nav/social/CTA | 3h   |
| 2.3 | Build MobileMenu.tsx React island | `src/components/redesign/react/MobileMenu.tsx`   | frontend-design, adapt, harden                      | 2.2        | Hamburger triggers overlay, focus trap, Escape close, all nav items, animation           | 2h   |

### Group 3: Footer (Parallel with Group 2)

| #   | Task                         | Files                                            | Skills                                    | Depends On | Done Criteria                                              | Est. |
| --- | ---------------------------- | ------------------------------------------------ | ----------------------------------------- | ---------- | ---------------------------------------------------------- | ---- |
| 2.4 | Build RedesignedFooter.astro | `src/components/redesign/RedesignedFooter.astro` | frontend-design, arrange, adapt, colorize | 2.1        | 4-column grid, social glow, responsive stacking, copyright | 2h   |

### Group 4: Integration (Sequential — depends on Groups 2+3)

| #   | Task                          | Files                                         | Skills | Depends On    | Done Criteria                                                      | Est. |
| --- | ----------------------------- | --------------------------------------------- | ------ | ------------- | ------------------------------------------------------------------ | ---- |
| 2.5 | Wire header/footer into pages | `src/pages/index.astro`, `src/pages/es.astro` | —      | 2.2, 2.3, 2.4 | Both pages render with new header/footer, old components preserved | 0.5h |

### Group 5: Tests

| #   | Task                                 | Files                                                                                                                                                                               | Skills | Depends On | Done Criteria                                      | Est. |
| --- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | -------------------------------------------------- | ---- |
| 2.6 | Write unit tests for header & footer | `src/components/redesign/__tests__/RedesignedHeader.test.ts`, `src/components/redesign/__tests__/RedesignedFooter.test.ts`, `src/components/redesign/__tests__/MobileMenu.test.tsx` | harden | 2.5        | All new tests pass, existing 1013 tests still pass | 2h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                                                              | Impact | Mitigation                                                               |
| --------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| Scroll detection via IntersectionObserver may conflict with existing header tests | Medium | Keep old ConsultantHeader intact, new tests for RedesignedHeader         |
| MobileMenu focus trap complexity                                                  | Medium | Use simple manual focus trap implementation, test with keyboard          |
| Dark body bg breaking existing consultant section styling                         | High   | Consultant section has its own bg classes — verify no inheritance issues |
| Logo visibility on dark background                                                | Low    | Logo PNG may need contrast adjustment — verify visually                  |
