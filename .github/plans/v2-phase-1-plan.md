# V2 Phase 1 Implementation Plan: Content Model & i18n Contract

**Source**: AI_CONSULTANT_V2_PROJECT_PLAN.md — Phase 1
**Generated**: 2026-03-26
**Status**: Planning Complete
**Impeccable Skills**: clarify, harden

## Success Criteria

- [ ] All new copy keys defined in both en.json and es.json
- [ ] Content provider extended with `getOutcomePrompts(lang)` and `getPromptGroups(lang)`
- [ ] Prop shapes finalized for ConsultantHeaderProps, ConsultantHeroProps, ConsultantFooterProps
- [ ] Updated TrustPanelProps and ChatContainerProps interfaces
- [ ] Outcome prompt structure defined with id, label, prompt, icon fields
- [ ] Group structure defined: `{ groupLabel, prompts[] }`
- [ ] Softer redirect copy in both languages
- [ ] Helper text and scope description defined
- [ ] `i18n-parity.test.ts` passes
- [ ] All new content provider tests pass

## Dependency Graph

```
Task 1 (Types/Interfaces) ──> Task 2 (i18n keys)
                              Task 3 (prompts.json)
                              ├──> Task 4 (Content Provider extension)
                              └──> Task 5 (Unit Tests)
Task 2 + 3 complete ──> Task 5 (Tests)
```

## Implementation Groups

### Group 1: Types & Interfaces (Sequential — Critical Path)

| #   | Task                               | Files                   | Skills  | Depends On | Done Criteria                                  | Est. |
| --- | ---------------------------------- | ----------------------- | ------- | ---------- | ---------------------------------------------- | ---- |
| 1.1 | Define `OutcomePrompt` interface   | `src/lib/chat/types.ts` | clarify | —          | Interface with id, label, prompt, icon fields  | 30m  |
| 1.2 | Define `PromptGroup` interface     | `src/lib/chat/types.ts` | clarify | —          | Interface with groupLabel, promptIds[]         | 30m  |
| 1.3 | Extend `ContentProvider` interface | `src/lib/chat/types.ts` | —       | 1.1, 1.2   | Add getOutcomePrompts, getPromptGroups methods | 30m  |
| 1.4 | Define `ConsultantHeaderProps`     | `src/lib/chat/types.ts` | —       | —          | Logo alt, nav items, language labels           | 30m  |
| 1.5 | Define `ConsultantHeroProps`       | `src/lib/chat/types.ts` | —       | —          | Headline, subheadline, CTA label               | 30m  |
| 1.6 | Define `ConsultantFooterProps`     | `src/lib/chat/types.ts` | —       | —          | Copyright, links                               | 30m  |

### Group 2: i18n Contract (Parallel Track A)

| #   | Task                                         | Files                | Skills  | Depends On | Done Criteria                     | Est. |
| --- | -------------------------------------------- | -------------------- | ------- | ---------- | --------------------------------- | ---- |
| 2.1 | Add `consultant.header.*` keys               | `en.json`, `es.json` | clarify | 1.4        | Both files updated symmetrically  | 1h   |
| 2.2 | Add `consultant.hero.*` keys                 | `en.json`, `es.json` | clarify | 1.5        | Both files updated symmetrically  | 1h   |
| 2.3 | Add `consultant.footer.*` keys               | `en.json`, `es.json` | clarify | 1.6        | Both files updated symmetrically  | 30m  |
| 2.4 | Add `chat.outcomes.*` keys                   | `en.json`, `es.json` | clarify | 1.1        | Outcome prompts in both languages | 1h   |
| 2.5 | Add `chat.promptGroups.*` keys               | `en.json`, `es.json` | clarify | 1.2        | Group labels in both languages    | 30m  |
| 2.6 | Update `chat.messages.redirect`              | `en.json`, `es.json` | clarify | —          | Softer redirect copy              | 30m  |
| 2.7 | Add `chat.input.helperText/scopeDescription` | `en.json`, `es.json` | clarify | —          | Both files updated                | 30m  |

### Group 3: Content Provider Extension (Parallel Track B)

| #   | Task                                   | Files                        | Skills  | Depends On | Done Criteria                                      | Est. |
| --- | -------------------------------------- | ---------------------------- | ------- | ---------- | -------------------------------------------------- | ---- |
| 3.1 | Add `outcomePrompts` to prompts.json   | `prompts.json`               | clarify | 2.4        | EN+ES outcome prompts with id, label, prompt, icon | 2h   |
| 3.2 | Add `promptGroups` to prompts.json     | `prompts.json`               | —       | 2.5        | Group structure with groupLabel + promptIds        | 1h   |
| 3.3 | Update softer redirect in prompts.json | `prompts.json`               | clarify | 2.6        | Old redirect replaced                              | 30m  |
| 3.4 | Extend StaticContentProvider           | `static-content-provider.ts` | —       | 3.1, 3.2   | getOutcomePrompts + getPromptGroups methods        | 2h   |

### Group 4: Unit Tests (Sequential — Verification)

| #   | Task                             | Files                        | Skills | Depends On | Done Criteria                             | Est. |
| --- | -------------------------------- | ---------------------------- | ------ | ---------- | ----------------------------------------- | ---- |
| 4.1 | Tests for getOutcomePrompts      | `content-provider.test.ts`   | harden | 3.4        | EN+ES, structure, frozen arrays           | 1h   |
| 4.2 | Tests for getPromptGroups        | `content-provider.test.ts`   | harden | 3.4        | EN+ES, valid prompt refs                  | 1h   |
| 4.3 | i18n parity test verification    | `i18n-parity.test.ts`        | harden | 2.1-2.7    | Existing parity test passes with new keys | 30m  |
| 4.4 | Content validation for new types | `content-validation.test.ts` | harden | 3.1-3.3    | New validators pass                       | 1h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                              | Impact | Mitigation                                      |
| --------------------------------- | ------ | ----------------------------------------------- |
| i18n key naming conflicts         | Medium | Use `consultant.*` namespace for new shell keys |
| Type changes break existing tests | High   | Run test suite after each type change           |
| Outcome prompt content quality    | Low    | Apply clarify skill for copy review             |
