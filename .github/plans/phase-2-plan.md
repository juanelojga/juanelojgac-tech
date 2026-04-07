# Phase 2 Implementation Plan: Content & Configuration Layer

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 2
**Generated**: 2026-03-25
**Status**: Planning Complete

## Success Criteria

- [ ] Tests for `ContentProvider` implementation cover EN + ES, all content categories, edge cases for missing keys
- [ ] `StaticContentProvider` passes all tests, returns typed content objects, follows LSP
- [ ] `services.json` validated against TypeScript interfaces, EN + ES parity verified
- [ ] `company.json` — all content entries present in both languages
- [ ] `prompts.json` — starter chips cover all major business intents, bilingual
- [ ] i18n files updated symmetrically with `chat.*` namespaced keys
- [ ] Automated test catches any missing translation keys between EN/ES content
- [ ] Copy reviewed for clarity, tone, and conversion effectiveness
- [ ] Edge cases handled — no truncation or layout breaks from long translations

## Dependency Graph

```
Phase 1 types/interfaces (DONE)
        │
        ├──────────────────────────────────────────────┐
        │                                              │
   [Content JSON files]                    [i18n chat keys]
   services.json                           en.json + es.json
   company.json                                  │
   prompts.json                                  │
        │                                        │
        ▼                                        │
   [ContentProvider tests] ◀─────────────────────┘
        │
        ▼
   [StaticContentProvider implementation]
        │
        ▼
   [Content validation tests - EN/ES parity]
        │
        ▼
   [Clarify + Harden passes]
```

## Implementation Groups

### Group 1: Content Data Files (Parallel — Independent)

| #   | Task                                 | Files                                  | Depends On    | Done Criteria                                             | Est. |
| --- | ------------------------------------ | -------------------------------------- | ------------- | --------------------------------------------------------- | ---- |
| 1   | Create bilingual services catalog    | `src/lib/chat/content/services.json`   | Phase 1 types | JSON validated against ServiceContent interface, EN + ES  | 6h   |
| 2   | Create company facts & trust signals | `src/lib/chat/content/company.json`    | Phase 1 types | All entries in both languages                             | 4h   |
| 3   | Create prompts & follow-ups          | `src/lib/chat/content/prompts.json`    | Phase 1 types | Starter chips, guided follow-ups, out-of-scope in EN + ES | 5h   |
| 4   | Add chat UI chrome i18n keys         | `src/i18n/en.json`, `src/i18n/es.json` | —             | Symmetric keys under `chat.*` namespace                   | 4h   |

### Group 2: ContentProvider Tests & Implementation (Sequential — Critical Path)

| #   | Task                              | Files                                             | Depends On | Done Criteria                                 | Est. |
| --- | --------------------------------- | ------------------------------------------------- | ---------- | --------------------------------------------- | ---- |
| 5   | Write ContentProvider tests (TDD) | `src/lib/chat/__tests__/content-provider.test.ts` | Group 1    | Tests cover all methods, EN + ES, edge cases  | 4h   |
| 6   | Implement StaticContentProvider   | `src/lib/chat/content/static-content-provider.ts` | Task 5     | All tests green, follows LSP, reads from JSON | 5h   |

### Group 3: Validation & Quality (Sequential — After Group 2)

| #   | Task                             | Files                                               | Depends On | Done Criteria                                     | Est. |
| --- | -------------------------------- | --------------------------------------------------- | ---------- | ------------------------------------------------- | ---- |
| 7   | Content parity validation tests  | `src/lib/chat/__tests__/content-validation.test.ts` | Group 2    | Automated EN↔ES parity check                      | 3h   |
| 8   | Clarify skill — review UX copy   | Content & i18n files                                | Task 7     | Copy clear, action-oriented, conversion-effective | 3h   |
| 9   | Harden skill — edge case testing | Content & i18n files                                | Task 8     | Long translations handled, special chars safe     | 3h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                        | Impact          | Mitigation                                             |
| ------------------------------------------- | --------------- | ------------------------------------------------------ |
| Content doesn't match TypeScript interfaces | Tests fail      | Write JSON against exact interface shapes from Phase 1 |
| EN/ES translations diverge in meaning       | Bad UX          | Automated parity tests + manual review                 |
| Long Spanish translations break layouts     | Visual bugs     | Harden skill tests for overflow, max-length validation |
| Service data becomes stale                  | Misleading info | JSON files are easy to update, single source of truth  |
