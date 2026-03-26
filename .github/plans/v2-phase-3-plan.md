# V2 Phase 3 Implementation Plan: Left Rail Redesign

**Source**: AI_CONSULTANT_V2_PROJECT_PLAN.md — Phase 3
**Generated**: 2026-03-26
**Status**: Planning Complete
**Impeccable Skills**: frontend-design, arrange, adapt, colorize, bolder, harden, extract, critique

## Success Criteria

- [ ] OutcomePrompts React component renders outcome items from content provider
- [ ] OutcomePrompts fires `onPromptInject` on click
- [ ] TrustPanel ordering: (1) identity, (2) OutcomePrompts, (3) lighter services, (4) TrustSignals, (5) PanelCTA
- [ ] Outcome prompts visually distinct from service items (larger, bolder, icon-led)
- [ ] Service items de-emphasized to compact list style
- [ ] ConsultantSection.astro passes outcome prompts to TrustPanel
- [ ] Prompt injection works for both outcomes and services
- [ ] All tests pass (existing + new)
- [ ] i18n parity maintained (EN + ES)

## Dependency Graph

```
Phase 1 (Content Model) ✅
    │
    ├── 3.1 OutcomePrompts tests (TDD)
    │       │
    │       └── 3.2 OutcomePrompts component
    │               │
    │               ├── 3.3 Update TrustPanel ordering + props
    │               │       │
    │               │       ├── 3.4 De-emphasize ServiceItem
    │               │       └── 3.5 TrustPanel tests
    │               │
    │               └── 3.6 Style outcome prompts
    │
    └── 3.7 Update ConsultantSection.astro + ConsultantLayout.tsx
            │
            └── 3.8 Integration verification
```

## Implementation Groups

### Group 1: Foundation (Sequential — Critical Path)

| #   | Task                                              | Files                                                    | Skills                                     | Depends On         | Done Criteria                                        | Est. |
| --- | ------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------ | ------------------ | ---------------------------------------------------- | ---- |
| 1   | Add `outcomesLabel` key to i18n panelTranslations | `en.json`, `es.json`                                     | —                                          | Phase 1            | Key exists in both files                             | 15m  |
| 2   | Write OutcomePrompts unit tests (TDD)             | `src/components/react/__tests__/OutcomePrompts.test.tsx` | harden                                     | Phase 1 types      | Tests cover rendering, click, a11y, empty state      | 1h   |
| 3   | Implement OutcomePrompts React component          | `src/components/react/OutcomePrompts.tsx`                | frontend-design, arrange, colorize, bolder | Tests              | Renders outcome prompts, handles click, icon mapping | 1.5h |
| 4   | Update TrustPanelTranslations + TrustPanelProps   | `src/components/react/TrustPanel.tsx`                    | —                                          | OutcomePrompts     | Props accept outcomePrompts + outcomesLabel          | 30m  |
| 5   | Reorder TrustPanel sections                       | `src/components/react/TrustPanel.tsx`                    | arrange                                    | Props updated      | Identity → Outcomes → Services → Trust → CTA         | 1h   |
| 6   | De-emphasize ServiceItem styling                  | `src/components/react/ServiceItem.tsx`                   | arrange, distill                           | TrustPanel updated | Compact list, no card borders, subtle hover          | 1h   |

### Group 2: Integration (Sequential)

| #   | Task                                             | Files                                                | Skills | Depends On | Done Criteria                               | Est. |
| --- | ------------------------------------------------ | ---------------------------------------------------- | ------ | ---------- | ------------------------------------------- | ---- |
| 7   | Update TrustPanel tests for new ordering         | `src/components/react/__tests__/TrustPanel.test.tsx` | harden | Group 1    | Tests verify new section order and outcomes | 1h   |
| 8   | Update ConsultantLayout to pass outcomePrompts   | `src/components/react/chat/ConsultantLayout.tsx`     | —      | Group 1    | Layout threads outcome data to TrustPanel   | 30m  |
| 9   | Update ConsultantSection.astro to fetch outcomes | `src/components/ConsultantSection.astro`             | —      | Group 1    | Astro fetches and passes outcome prompts    | 30m  |
| 10  | Update ConsultantLayout tests                    | existing test files                                  | harden | Tasks 8-9  | Layout tests pass with new props            | 30m  |

### Group 3: Verification

| #   | Task                           | Files | Skills | Depends On | Done Criteria      | Est. |
| --- | ------------------------------ | ----- | ------ | ---------- | ------------------ | ---- |
| 11  | Run full test suite            | —     | —      | All above  | `pnpm test` passes | 15m  |
| 12  | Run astro:check + lint + build | —     | —      | All above  | Zero errors        | 15m  |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                              | Impact | Mitigation                                                     |
| ------------------------------------------------- | ------ | -------------------------------------------------------------- |
| Existing TrustPanel tests break with new ordering | Medium | Update tests systematically, verify each section independently |
| ConsultantLayout test snapshot mismatches         | Low    | Update mock data to include outcomePrompts                     |
| Icon mapping complexity                           | Low    | Use simple inline SVGs mapped by string ID                     |
