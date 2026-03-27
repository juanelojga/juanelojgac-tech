# V2 Phase 7 Implementation Plan: Test Updates & Final Validation

**Source**: AI_CONSULTANT_V2_PROJECT_PLAN.md — Phase 7
**Generated**: 2026-03-27
**Status**: Planning Complete
**Impeccable Skills**: audit, normalize, polish, critique

## Success Criteria

- [ ] E2E desktop spec updated: header, hero, footer, outcome prompts, grouped chips, live assistant response, redirect UX, CTA visibility
- [ ] E2E mobile spec updated: header compression, chat-first layout, panel toggle, mobile prompt interaction, live assistant on mobile
- [ ] E2E tablet spec updated: tablet layout, header, panel behavior on medium viewports
- [ ] E2E language switch flow test: EN header → click ES → Spanish page renders with Spanish copy
- [ ] E2E live assistant round-trip test: send message → typing indicator → response rendered
- [ ] Unit tests updated for TrustPanel, ServiceItem, TrustSignals, PanelCTA redesigned structure
- [ ] Unit tests updated for ChatContainer, ChatHeader, ChatInput, PromptChips redesigned UX
- [ ] Unit tests updated for ConsultantLayout live assistant integration (mocked API)
- [ ] Unit tests added for ConsultantHeader, ConsultantHero, ConsultantFooter (already exist — verify coverage)
- [ ] `pnpm run astro:check` — zero type errors
- [ ] `pnpm test` — all unit tests pass (existing + new)
- [ ] `pnpm run test:coverage` — coverage ≥ previous baseline
- [ ] `pnpm run lint:fix` — zero lint errors
- [ ] `pnpm run build` — production build succeeds
- [ ] Accessibility audit tests pass
- [ ] Performance audit tests pass

## Current Baseline

- **929 tests** across 42 files, all passing
- **0 type errors** (astro:check clean)
- **Build**: clean (2 pages, 1.06s)

## Dependency Graph

```
Phase 6 (Complete) ──> Phase 7 (This Phase)

Group 1 (E2E Updates) ──┬──> 7.1.1 Desktop E2E
                        ├──> 7.1.2 Mobile E2E      ← parallel
                        ├──> 7.1.3 Tablet E2E       ← parallel
                        ├──> 7.1.4 Language Switch E2E
                        └──> 7.1.5 Live Assistant E2E

Group 2 (Unit Test Updates) ──┬──> 7.2.1 Panel tests
                              ├──> 7.2.2 Chat tests    ← parallel
                              ├──> 7.2.3 Layout integration tests
                              └──> 7.2.4 Shell component tests (verify coverage)

Group 3 (Final Validation) ── Sequential pipeline
```

## Implementation Groups

### Group 1: E2E Test Updates (Parallel)

| #     | Task                                                                                             | Files                            | Skills | Depends On | Done Criteria                            | Est. |
| ----- | ------------------------------------------------------------------------------------------------ | -------------------------------- | ------ | ---------- | ---------------------------------------- | ---- |
| 7.1.1 | Update desktop E2E: header, hero, footer, outcomes, grouped chips, live assistant, redirect, CTA | `e2e/consultant-desktop.spec.ts` | audit  | Phase 6    | Desktop E2E covers new shell + chat flow | 6h   |
| 7.1.2 | Update mobile E2E: header compression, chat-first, panel toggle, mobile prompts, live assistant  | `e2e/consultant-mobile.spec.ts`  | audit  | Phase 6    | Mobile E2E covers responsive behavior    | 5h   |
| 7.1.3 | Update tablet E2E: tablet layout, header, panel behavior                                         | `e2e/consultant-tablet.spec.ts`  | audit  | Phase 6    | Tablet E2E covers intermediate viewport  | 4h   |
| 7.1.4 | Add language switch E2E flow                                                                     | `e2e/consultant-desktop.spec.ts` | audit  | Phase 2    | Language switch tested end-to-end        | 3h   |
| 7.1.5 | Add live assistant round-trip E2E                                                                | `e2e/consultant-desktop.spec.ts` | audit  | Phase 5    | Full assistant flow verified             | 4h   |

### Group 2: Unit Test Updates (Parallel)

| #     | Task                                                                                        | Files                                                             | Skills    | Depends On | Done Criteria                             | Est. |
| ----- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------- | ---------- | ----------------------------------------- | ---- |
| 7.2.1 | Verify/update panel tests (TrustPanel, ServiceItem, TrustSignals, PanelCTA, OutcomePrompts) | `src/components/react/__tests__/*.test.tsx`                       | normalize | Phase 3    | All panel tests pass with new composition | 4h   |
| 7.2.2 | Verify/update chat tests (ChatContainer, ChatHeader, ChatInput, GroupedPromptChips)         | `src/components/react/chat/__tests__/*.test.tsx`                  | normalize | Phase 4    | All chat tests pass with grouped prompts  | 4h   |
| 7.2.3 | Verify/update ConsultantLayout integration tests                                            | `src/components/react/chat/__tests__/ConsultantLayout.*.test.tsx` | normalize | Phase 5    | Integration tests cover all send paths    | 4h   |
| 7.2.4 | Verify shell component tests (Header, Hero, Footer, PageShell)                              | `src/components/__tests__/*.test.ts`                              | normalize | Phase 2    | Shell components have full test coverage  | 4h   |

### Group 3: Final Validation Pipeline (Sequential)

| #     | Task                                                | Files | Skills | Depends On    | Done Criteria                     | Est. |
| ----- | --------------------------------------------------- | ----- | ------ | ------------- | --------------------------------- | ---- |
| 7.3.1 | Run `pnpm run astro:check` — zero type errors       | —     | audit  | All code      | Clean typecheck                   | 30m  |
| 7.3.2 | Run `pnpm test` — all unit tests pass               | —     | audit  | All tests     | Zero failures                     | 1h   |
| 7.3.3 | Run `pnpm run test:coverage` — verify no regression | —     | audit  | Tests passing | Coverage ≥ 929 baseline           | 1h   |
| 7.3.4 | Run `pnpm run lint:fix` and `pnpm run format`       | —     | audit  | All code      | Zero lint errors                  | 30m  |
| 7.3.5 | Run `pnpm run build` — clean production build       | —     | audit  | All above     | Build succeeds, zero warnings     | 30m  |
| 7.3.6 | Verify accessibility audit tests pass               | —     | audit  | Build clean   | WCAG 2.1 AA compliance maintained | 1h   |
| 7.3.7 | Verify performance audit tests pass                 | —     | audit  | Build clean   | Bundle size within budget         | 1h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                                                         | Impact | Mitigation                                                                    |
| ---------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| E2E tests require running dev server — may be slow                           | Medium | Use `webServer` config in playwright.config.ts with reuseExistingServer       |
| Existing E2E tests may have selectors that don't match redesigned components | High   | Read existing selectors from chat.ts helper, verify against actual components |
| Test coverage regression from restructured tests                             | Medium | Run coverage before and after to compare                                      |
