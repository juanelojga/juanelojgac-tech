# Redesign Phase 8 Implementation Plan: Testing & Final Validation

**Source**: REDESIGN_IMPLEMENTATION_PLAN.md — Phase 8
**Generated**: 2026-03-27
**Status**: Planning Complete
**Impeccable Skills**: audit, normalize, polish, harden

## Current State

- **All 1170 unit tests pass** (54 test files)
- **astro:check**: 0 errors, 0 warnings, 10 hints
- **Phase 6 (Process + Final CTA) was never built** — pages don't include ProcessSection or FinalCTA
- **E2E tests are stale** — reference old ConsultantHero text ("AI-Powered Consulting for Your Business", "Start a Conversation"), old footer text ("Contact Us", "Privacy Policy" as simple links), and old hero for Spanish
- Current page structure: RedesignedHeader → HeroSection → ServicesPreview → ConsultantSection → RedesignedFooter

## Success Criteria

- [ ] E2E tests updated to match new page structure (header, hero, services, footer)
- [ ] All E2E tests pass on desktop, mobile, tablet
- [ ] Unit tests updated — PageShellComposition tests reference new components
- [ ] All unit tests pass (no regressions from 1170 baseline)
- [ ] `pnpm run astro:check` — 0 errors
- [ ] `pnpm run lint:fix` — 0 errors
- [ ] `pnpm run build` — clean production build
- [ ] EN/ES parity verified — all sections render in both languages
- [ ] No missing i18n keys

## Dependency Graph

```
8.1 E2E Updates ──────┐
                       ├──> 8.3 Validation Pipeline ──> 8.4 Lighthouse ──> Done
8.2 Unit Test Updates ─┘                            ──> 8.5 EN/ES Parity ──> Done
```

## Implementation Groups

### Group 1: E2E Test Updates (Sequential — Critical Path)

| #   | Task                                 | Files                            | Depends On | Done Criteria                                                                                                                             |
| --- | ------------------------------------ | -------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | Update desktop E2E — header tests    | `e2e/consultant-desktop.spec.ts` | —          | Tests verify: logo visible, nav links (Services/Process/About/Contact), CTA button, social icons, language switcher, scroll blur behavior |
| 1.2 | Update desktop E2E — hero tests      | `e2e/consultant-desktop.spec.ts` | —          | Tests verify: new headline, micro-label, CTAs (Book a Free Consultation / Explore Services), trust metrics                                |
| 1.3 | Update desktop E2E — services tests  | `e2e/consultant-desktop.spec.ts` | —          | Tests verify: services section visible, 5 cards, card titles match i18n                                                                   |
| 1.4 | Update desktop E2E — footer tests    | `e2e/consultant-desktop.spec.ts` | —          | Tests verify: 4-column footer, social links, nav links, trust notes, copyright                                                            |
| 1.5 | Update desktop E2E — ES parity tests | `e2e/consultant-desktop.spec.ts` | 1.1–1.4    | Tests verify: Spanish header, hero, services, footer                                                                                      |
| 1.6 | Update mobile E2E tests              | `e2e/consultant-mobile.spec.ts`  | —          | Tests verify: mobile header (hamburger), hero stacked, services section, footer, ES parity                                                |
| 1.7 | Update tablet E2E tests              | `e2e/consultant-tablet.spec.ts`  | —          | Tests verify: tablet header, hero, services, footer, ES parity                                                                            |

### Group 2: Unit Test Updates (Can parallel with Group 1)

| #   | Task                              | Files                                                     | Depends On | Done Criteria                                                                                             |
| --- | --------------------------------- | --------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| 2.1 | Update PageShellComposition tests | `src/components/__tests__/PageShellComposition.test.ts`   | —          | Tests reference new components (source template analysis since AstroContainer can't render React islands) |
| 2.2 | Add redesign i18n symmetry tests  | `src/components/redesign/__tests__/i18n-redesign.test.ts` | —          | Verify all `redesign.*` keys exist symmetrically in both EN and ES                                        |

### Group 3: Validation Pipeline (After Groups 1–2)

| #   | Task               | Files | Depends On | Done Criteria          |
| --- | ------------------ | ----- | ---------- | ---------------------- |
| 3.1 | Run astro:check    | —     | 1.x, 2.x   | 0 errors               |
| 3.2 | Run lint:fix       | —     | 1.x, 2.x   | 0 errors               |
| 3.3 | Run format         | —     | 1.x, 2.x   | Clean                  |
| 3.4 | Run build          | —     | 1.x, 2.x   | Clean production build |
| 3.5 | Run all unit tests | —     | 1.x, 2.x   | All pass               |

### Group 4: Final Verification

| #   | Task                           | Depends On | Done Criteria                                                                      |
| --- | ------------------------------ | ---------- | ---------------------------------------------------------------------------------- |
| 4.1 | EN/ES parity check             | 3.x        | All sections render correctly in both languages, no missing keys, no layout issues |
| 4.2 | Grep for TODO/placeholder text | 3.x        | No leftover TODO placeholders in translation files                                 |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                                  | Impact | Mitigation                                                                                    |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| E2E tests can't run without dev server                | Medium | Tests are validated structurally; full E2E run requires `npx playwright test` with dev server |
| Old E2E tests reference removed DOM elements          | High   | Rewrite tests to match new component structure                                                |
| Phase 6 not built — Process/FinalCTA tests impossible | Medium | Skip Process/FinalCTA E2E tests; add TODO comments noting dependency on Phase 6               |

## Notes

- Phase 6 (Process Section & Final CTA) was never built. E2E tests for Process and Final CTA sections are **skipped** in this phase. When Phase 6 is built, E2E tests for those sections should be added.
- Lighthouse audits (8.4) require manual Chrome DevTools testing — cannot be automated in CI. Document targets in the verification summary.
