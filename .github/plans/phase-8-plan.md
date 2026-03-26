# Phase 8 Implementation Plan: i18n Parity & Responsive Polish

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 8
**Generated**: 2026-03-26
**Status**: Planning Complete

## Success Criteria

- [ ] Automated test confirms every EN chat key has an ES counterpart (and vice versa)
- [ ] Playwright E2E test completes full EN conversation flow on desktop (chip → guided → summary)
- [ ] Playwright E2E test completes full ES conversation flow on desktop
- [ ] Language detection from `Accept-Language` header verified for chat content
- [ ] Mobile layout tested: chat input above keyboard, smooth scrolling, panel accessible
- [ ] All spacing, colors, typography use design tokens, no arbitrary values
- [ ] Pixel-perfect alignment, consistent padding, no visual glitches
- [ ] Mobile E2E passes on 375×812, visual regression snapshots stable
- [ ] Tablet layout renders correctly on 768×1024, panel behavior appropriate
- [ ] No critical UX issues, conversion path clear on all devices

## Dependency Graph

```
Phase 7 (complete)
  │
  ├─── 8.1 i18n Parity ──────────────────────────────────────────
  │    │
  │    ├── T1: i18n parity unit tests (content + JSON keys)
  │    │    └── T2: Verify Accept-Language header works for chat
  │    │
  │    └── T3: Playwright EN desktop E2E
  │         └── T4: Playwright ES desktop E2E
  │
  └─── 8.2 Responsive Polish (parallel with 8.1.T1-T2) ────────
       │
       ├── T5: Mobile responsive refinements (adapt)
       │    └── T6: Normalize components to design tokens
       │         └── T7: Polish micro-fixes
       │              └── T8: Playwright mobile E2E (375×812)
       │                   └── T9: Playwright tablet E2E (768×1024)
       │                        └── T10: UX critique across viewports
```

## Implementation Groups

### Group 1: i18n Parity Tests (Sequential — Critical Path)

| #   | Task                                                                                          | Files                                        | Depends On | Done Criteria                                                                                                        | Est. |
| --- | --------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- | ---- |
| T1  | Extend i18n parity tests — verify EN/ES symmetry for all chat content, keys, and placeholders | `src/lib/chat/__tests__/i18n-parity.test.ts` | Phase 7    | New test file with comprehensive parity checks for content JSONs + i18n JSONs; includes placeholder pattern matching | 3h   |
| T2  | Test Accept-Language header detection for chat content                                        | `src/lib/chat/__tests__/i18n-parity.test.ts` | T1         | Tests verify EN and ES language loads correct translations                                                           | 1h   |

### Group 2: Responsive Polish (Parallel with Group 1)

| #   | Task                                                                                                     | Files                                                                                                                                                                             | Depends On | Done Criteria                                                      | Est. |
| --- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ | ---- |
| T5  | Mobile responsive refinements — touch targets ≥44px, scroll behavior, input above keyboard, panel toggle | `src/components/react/chat/ConsultantLayout.tsx`, `src/components/react/TrustPanel.tsx`, `src/components/react/chat/ChatInput.tsx`, `src/components/react/chat/ChatContainer.tsx` | Phase 7    | Mobile layout works cleanly with no overflow, proper touch targets | 3h   |
| T6  | Normalize all components to design tokens — audit spacing, colors, typography                            | All chat/panel components                                                                                                                                                         | T5         | No arbitrary values, all CSS uses theme tokens                     | 2h   |
| T7  | Polish micro-fixes — alignment, padding, visual consistency                                              | All chat/panel components                                                                                                                                                         | T6         | Consistent visual quality, no glitches                             | 2h   |

### Group 3: Playwright E2E Tests (Sequential — depends on Groups 1+2)

| #   | Task                                                | Files                            | Depends On | Done Criteria                                                             | Est. |
| --- | --------------------------------------------------- | -------------------------------- | ---------- | ------------------------------------------------------------------------- | ---- |
| T3  | Playwright EN desktop E2E — full conversation flow  | `e2e/consultant-desktop.spec.ts` | T1, T7     | E2E test renders components, sends messages, verifies UI state in English | 4h   |
| T4  | Playwright ES desktop E2E — same journey in Spanish | `e2e/consultant-desktop.spec.ts` | T3         | E2E test verifies ES translations load correctly                          | 2h   |
| T8  | Playwright mobile E2E — 375×812 viewport            | `e2e/consultant-mobile.spec.ts`  | T7         | Mobile flow works: panel toggle, chat scroll, input handling              | 4h   |
| T9  | Playwright tablet E2E — 768×1024 viewport           | `e2e/consultant-tablet.spec.ts`  | T8         | Tablet layout renders correctly, panel behavior appropriate               | 2h   |

### Group 4: Final UX Evaluation

| #   | Task                             | Files         | Depends On     | Done Criteria                                               | Est. |
| --- | -------------------------------- | ------------- | -------------- | ----------------------------------------------------------- | ---- |
| T10 | UX critique across all viewports | Review output | T3, T4, T8, T9 | No critical UX issues, conversion path clear on all devices | 2h   |

## Playwright E2E Test Plan

### Test Scenarios

| #   | Feature / Deliverable | Spec File                        | Scenarios                                                             | Viewports          |
| --- | --------------------- | -------------------------------- | --------------------------------------------------------------------- | ------------------ |
| 1   | Desktop EN chat flow  | `e2e/consultant-desktop.spec.ts` | rendering, navigation, chip clicks, message sending, trust panel, CTA | Desktop (1280×720) |
| 2   | Desktop ES chat flow  | `e2e/consultant-desktop.spec.ts` | same as above with ES translations                                    | Desktop (1280×720) |
| 3   | Mobile chat flow      | `e2e/consultant-mobile.spec.ts`  | panel toggle, chat scroll, input focus, responsive layout             | Mobile (375×812)   |
| 4   | Tablet chat flow      | `e2e/consultant-tablet.spec.ts`  | panel behavior, layout adaptation                                     | Tablet (768×1024)  |

### i18n Assertions

- EN → ES language switch: all visible text changes
- No layout shifts or overflow from longer ES translations
- No missing translation keys rendered as raw keys

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds
- [ ] `npx playwright test` — E2E tests pass across viewports

## Risks & Mitigations

| Risk                                                   | Impact | Mitigation                                                   |
| ------------------------------------------------------ | ------ | ------------------------------------------------------------ |
| E2E tests flaky due to API mocking needed              | Medium | Use route interception to mock chat API responses            |
| Mobile keyboard behavior hard to test                  | Low    | Focus on viewport-based assertions, not actual keyboard      |
| Accept-Language header not sent in Playwright defaults | Low    | Use `setExtraHTTPHeaders` via existing `e2e/helpers/i18n.ts` |
