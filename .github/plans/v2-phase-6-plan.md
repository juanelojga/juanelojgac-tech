# V2 Phase 6 Implementation Plan: Responsive Verification & Polish

**Source**: AI_CONSULTANT_V2_PROJECT_PLAN.md — Phase 6
**Generated**: 2026-03-26
**Status**: Planning Complete
**Impeccable Skills**: adapt, polish, frontend-design, arrange, harden, extract, normalize

## Success Criteria

- [ ] Mobile consultant experience is chat-first: chat panel takes primary viewport, left rail collapsed
- [ ] Sticky header compresses on mobile: reduced height, scaled logo, language switch accessible (≥44px touch targets)
- [ ] Hero section compresses on mobile: less padding, no excessive viewport consumption
- [ ] Chat input not obscured by mobile keyboard (scroll-into-view behavior)
- [ ] Panel toggle accessible: ARIA labels, keyboard operable, focus management
- [ ] Chat panel always visible on desktop (≥1024px) without toggle
- [ ] Full-height layout: header + hero + consultant section + footer fill viewport without awkward gaps
- [ ] Prompt injection from panel to chat works on both desktop and mobile
- [ ] All 5 Playwright viewports pass (320px, 375px, 768px, 1280px, 1920px)
- [ ] EN/ES language switch works from header on all viewports
- [ ] All interactive elements ≥44px touch targets on mobile
- [ ] No layout breaks, overflow, or truncation on any viewport

## Issues Identified in Audit

| #   | Component          | Issue                                                                     | Priority |
| --- | ------------------ | ------------------------------------------------------------------------- | -------- |
| 1   | ConsultantHeader   | Language switch links `px-2.5 py-1.5` are ~28px tall — below 44px minimum | HIGH     |
| 2   | ConsultantHero     | `py-10` on mobile consumes ~195px — pushes chat too far down              | MEDIUM   |
| 3   | ChatHeader         | No responsive padding — fixed `px-5 py-4` on all viewports                | LOW      |
| 4   | Follow-up chips    | `px-3 py-1` = ~24px height — well below 44px minimum                      | HIGH     |
| 5   | Error retry button | `px-3 py-1` = ~24px height — below 44px minimum                           | HIGH     |
| 6   | ConsultantFooter   | Footer links have no explicit min height — could be undersized            | MEDIUM   |
| 7   | ConsultantLayout   | Height calc `100dvh-6rem` doesn't adapt to changes in shell height        | LOW      |

## Dependency Graph

```
6.1.1 Fix language switch touch targets ──┐
6.1.2 Compress hero on mobile ────────────┤
6.1.3 Fix follow-up chip touch targets ───┤
6.1.4 Fix error retry button touch target ┤
6.1.5 Fix footer link touch targets ──────┼──> 6.2 Unit Tests ──> 6.3 Verification
6.1.6 Polish ChatHeader responsive ───────┤
6.1.7 Verify desktop full-height layout ──┘
```

## Implementation Groups

### Group 1: Touch Target & Responsive Fixes (Sequential — Critical Path)

| #   | Task                                                                 | Files                    | Skills         | Depends On | Done Criteria                                       | Est. |
| --- | -------------------------------------------------------------------- | ------------------------ | -------------- | ---------- | --------------------------------------------------- | ---- |
| 1   | Fix language switch touch targets in header — ensure ≥44px on mobile | `ConsultantHeader.astro` | adapt, polish  | —          | Touch targets ≥44px on all mobile viewports         |
| 2   | Compress hero on mobile — reduce vertical padding for small screens  | `ConsultantHero.astro`   | adapt, arrange | —          | Hero consumes ≤120px on mobile, scales up on larger |
| 3   | Fix follow-up chip touch targets — ensure ≥44px min-height           | `ChatContainer.tsx`      | adapt, polish  | —          | Follow-up buttons have min-h-[44px]                 |
| 4   | Fix error retry button touch target — ensure ≥44px min-height        | `ChatContainer.tsx`      | adapt, polish  | —          | Retry button has min-h-[44px]                       |
| 5   | Fix footer link touch targets — ensure ≥44px on mobile               | `ConsultantFooter.astro` | adapt, polish  | —          | Footer links ≥44px touch targets on mobile          |
| 6   | Polish ChatHeader responsive padding                                 | `ChatHeader.tsx`         | adapt, polish  | —          | Reduce padding on small screens                     |
| 7   | Add input scroll-into-view on focus for mobile keyboard              | `ChatInput.tsx`          | harden         | —          | Input scrolls into view when focused                |

### Group 2: Unit Tests (After Group 1)

| #   | Task                                                      | Files                      | Skills | Depends On | Done Criteria                           | Est. |
| --- | --------------------------------------------------------- | -------------------------- | ------ | ---------- | --------------------------------------- | ---- |
| 8   | Update ConsultantHeader tests for touch target classes    | `ConsultantHeader.test.ts` | —      | #1         | Tests verify min-h or padding classes   |
| 9   | Update ConsultantHero tests for compressed mobile classes | `ConsultantHero.test.ts`   | —      | #2         | Tests verify reduced padding classes    |
| 10  | Update ChatContainer tests for follow-up chip sizing      | `ChatContainer.test.tsx`   | —      | #3,#4      | Tests verify min-h-[44px] on buttons    |
| 11  | Update ConsultantFooter tests for touch target classes    | `ConsultantFooter.test.ts` | —      | #5         | Tests verify min-h or padding classes   |
| 12  | Add ChatHeader responsive test                            | `ChatHeader.test.tsx`      | —      | #6         | Tests verify responsive padding classes |

### Group 3: Verification (After Group 2)

| #   | Task                         | Files | Skills | Depends On | Done Criteria  | Est. |
| --- | ---------------------------- | ----- | ------ | ---------- | -------------- | ---- |
| 13  | Run all unit tests           | —     | —      | #8-#12     | All tests pass |
| 14  | Run astro:check, lint, build | —     | —      | #13        | All clean      |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                                       | Impact | Mitigation                                                   |
| ---------------------------------------------------------- | ------ | ------------------------------------------------------------ |
| Touch target changes break existing layout density         | Medium | Use min-h only on mobile viewports; desktop layout unchanged |
| Hero compression makes content unreadable on small screens | Low    | Test on 320px viewport; keep text readable at all sizes      |
| Footer link changes may affect centered alignment          | Low    | Test footer layout on all viewports                          |
