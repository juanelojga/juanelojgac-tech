# Redesign Phase 7 Implementation Plan: Animation Polish & Responsive Verification

**Source**: REDESIGN_IMPLEMENTATION_PLAN.md — Phase 7
**Generated**: 2026-03-27
**Status**: Planning Complete
**Impeccable Skills**: adapt, animate, polish, normalize

## Success Criteria

- [ ] All animated elements respect `prefers-reduced-motion` — no "invisible until animated" bugs
- [ ] Mobile layouts (320px–767px) have no horizontal overflow, readable text, touch targets ≥ 44px
- [ ] Tablet layouts (768px–1023px) are polished with clear visual hierarchy
- [ ] Animation timing tuned for premium feel (entrance 500–800ms, hover 200–300ms, drift 15–25s)
- [ ] 60fps confirmed during hero animations, no layout-triggering animations
- [ ] JS bundle within budget (< 15KB gzipped increase)
- [ ] All unit tests pass, build clean

## Note on Phase 6 Dependency

Phase 6 (Process Section & Final CTA) has not been built yet. This plan covers animation polish and responsive verification for all **existing** redesigned components (Phases 2–5): Header, Hero, Services Preview, AI Assistant Section, and Footer. Process Section and Final CTA will receive the same treatment when Phase 6 is complete.

## Dependency Graph

```
Phase 7.1 (Reduced Motion)  ──┐
Phase 7.2 (Mobile Polish)   ──┤──> Phase 7.5 (Performance Check)
Phase 7.3 (Tablet Polish)   ──┤
Phase 7.4 (Animation Timing) ─┘
```

7.1–7.4 are independent and can run in any order. 7.5 is final verification after all changes.

## Implementation Groups

### Group 1: Reduced Motion Verification (Sequential — Critical Path)

| #   | Task                                                                                          | Files                    | Skills         | Depends On | Done Criteria                                       | Est.  |
| --- | --------------------------------------------------------------------------------------------- | ------------------------ | -------------- | ---------- | --------------------------------------------------- | ----- |
| 1.1 | Audit hero entrance animations — ensure opacity:0 elements become visible with reduced motion | `HeroSection.astro`      | animate, adapt | —          | No invisible elements when reduced motion enabled   | 1h    |
| 1.2 | Audit HeroVisual floating — static with reduced motion                                        | `react/HeroVisual.tsx`   | animate        | —          | Cards visible and static                            | 0.5h  |
| 1.3 | Audit TrustMetrics — show final values immediately                                            | `react/TrustMetrics.tsx` | animate        | —          | Values display without animation                    | 0.25h |
| 1.4 | Audit ServiceCard scroll-reveal — show all cards immediately                                  | `react/ServiceCard.tsx`  | animate        | —          | Cards visible without scroll-reveal                 | 0.5h  |
| 1.5 | Audit MobileMenu animation — show/hide without slide                                          | `react/MobileMenu.tsx`   | animate        | —          | Menu appears/disappears instantly                   | 0.25h |
| 1.6 | Audit header scroll transition — keep functional, minimize motion                             | `RedesignedHeader.astro` | animate        | —          | Header background changes work, transitions minimal | 0.25h |

### Group 2: Mobile Polish (Parallel Track A)

| #   | Task                                                        | Files                                      | Skills        | Depends On | Done Criteria                                     | Est.  |
| --- | ----------------------------------------------------------- | ------------------------------------------ | ------------- | ---------- | ------------------------------------------------- | ----- |
| 2.1 | Header mobile — verify logo + hamburger, no overflow        | `RedesignedHeader.astro`, `MobileMenu.tsx` | adapt, polish | —          | No horizontal scroll at 320px                     | 0.25h |
| 2.2 | Hero mobile — single column, CTAs stack, trust metrics wrap | `HeroSection.astro`, `TrustMetrics.tsx`    | adapt, polish | —          | Readable headline, stacked CTAs, wrapping metrics | 0.5h  |
| 2.3 | Services mobile — 1-col at 320px, 2-col at sm:              | `ServicesPreview.astro`, `ServiceCard.tsx` | adapt, polish | —          | Adequate padding, touch targets ≥ 44px            | 0.25h |
| 2.4 | Consultant section mobile — panel stacks, full-width input  | `ConsultantSection.astro`                  | adapt         | —          | All chat functionality works on mobile            | 0.25h |
| 2.5 | Footer mobile — columns stack, social centered              | `RedesignedFooter.astro`                   | adapt, polish | —          | Adequate spacing, centered social icons           | 0.25h |

### Group 3: Tablet Polish (Parallel Track B)

| #   | Task                                                              | Files                    | Skills | Depends On | Done Criteria                     | Est.  |
| --- | ----------------------------------------------------------------- | ------------------------ | ------ | ---------- | --------------------------------- | ----- |
| 3.1 | Header tablet — nav visibility decision, CTA visible              | `RedesignedHeader.astro` | adapt  | —          | Consistent behavior at 768–1023px | 0.25h |
| 3.2 | Hero tablet — single/dual column decision, visual hidden or shown | `HeroSection.astro`      | adapt  | —          | No awkward spacing                | 0.25h |
| 3.3 | Services tablet — 2 or 3 column grid                              | `ServicesPreview.astro`  | adapt  | —          | Balanced card layout              | 0.25h |
| 3.4 | Footer tablet — 2-column grid                                     | `RedesignedFooter.astro` | adapt  | —          | Polished 2-col layout             | 0.25h |

### Group 4: Animation Timing (Parallel Track C)

| #   | Task                                              | Files                                              | Skills             | Depends On | Done Criteria                      | Est.  |
| --- | ------------------------------------------------- | -------------------------------------------------- | ------------------ | ---------- | ---------------------------------- | ----- |
| 4.1 | Tune entrance animation durations & easing curves | `tailwind.css`, `HeroSection.astro`                | animate, polish    | —          | 500–800ms ease-out entrances       | 0.5h  |
| 4.2 | Tune hover transition consistency                 | `ServiceCard.tsx`, `MobileMenu.tsx`, header/footer | animate, normalize | —          | 200–300ms ease hover transitions   | 0.5h  |
| 4.3 | Tune background orb drift timing                  | `tailwind.css`                                     | animate            | —          | 15–25s ease-in-out, premium rhythm | 0.25h |
| 4.4 | Tune stagger intervals for consistency            | `HeroSection.astro`, `ServiceCard.tsx`             | animate, normalize | —          | 80–150ms between items             | 0.25h |

### Group 5: Performance & Tests (Sequential — Final)

| #   | Task                                                        | Files                   | Skills | Depends On | Done Criteria                        | Est.  |
| --- | ----------------------------------------------------------- | ----------------------- | ------ | ---------- | ------------------------------------ | ----- |
| 5.1 | Verify will-change on animated elements                     | All animated components | polish | 1–4        | will-change applied appropriately    | 0.25h |
| 5.2 | Verify only transform/opacity animated (no layout triggers) | All animated components | polish | 1–4        | No forced reflows                    | 0.25h |
| 5.3 | Write unit tests for reduced-motion behavior                | `__tests__/`            | —      | 1.1–1.6    | Tests verify reduced motion handling | 1h    |
| 5.4 | Run full verification suite                                 | —                       | —      | All        | All checks pass                      | 0.5h  |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                                                                                                 | Impact | Mitigation                                                     |
| -------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------- |
| Phase 6 not built — Process/FinalCTA can't be polished                                                               | Low    | Document as deferred; Phase 6 will apply these patterns        |
| `opacity: 0` with `animation-fill-mode: forwards` creates invisible elements when reduced motion disables animations | High   | Add CSS fallback or use JS-based visibility for reduced motion |
| `will-change` overuse causes memory issues                                                                           | Medium | Only apply to currently-animating elements                     |
