# V2 Phase 1 Memory: Content Model & i18n Contract

**Completed**: 2026-03-26
**Status**: ✅ Complete

## What Was Built

### Files Created

- `.github/plans/v2-phase-1-plan.md` — Implementation plan with task breakdown and dependency graph

### Files Modified

- `src/lib/chat/types.ts` — Added `OutcomePrompt`, `PromptGroup`, `ConsultantHeaderProps`, `ConsultantHeroProps`, `ConsultantFooterProps` interfaces; extended `ContentProvider` with `getOutcomePrompts()` and `getPromptGroups()` methods
- `src/lib/chat/validators.ts` — Added `isValidOutcomePrompt()` and `isValidPromptGroup()` validator functions
- `src/lib/chat/content/static-content-provider.ts` — Extended `StaticContentProvider` with `getOutcomePrompts(lang)` and `getPromptGroups(lang)` methods, updated JSON type interfaces
- `src/lib/chat/content/prompts.json` — Added `outcomePrompts` (5 items EN/ES) and `promptGroups` (2 groups EN/ES); updated `outOfScopeRedirect` with softer messaging
- `src/i18n/en.json` — Added `consultant.header.*`, `consultant.hero.*`, `consultant.footer.*`, `chat.outcomes.*`, `chat.promptGroups.*`, `chat.input.helperText`, `chat.input.scopeDescription`, `chat.messages.redirect`
- `src/i18n/es.json` — Symmetric Spanish translations for all new keys
- `src/lib/chat/__tests__/content-provider.test.ts` — Added 20 tests for `getOutcomePrompts` and `getPromptGroups`
- `src/lib/chat/__tests__/validators.test.ts` — Added 13 tests for `isValidOutcomePrompt` and `isValidPromptGroup`
- `src/lib/chat/__tests__/content-validation.test.ts` — Added 12 tests for outcome prompts parity, prompt groups parity, and consultant i18n keys parity
- `src/lib/chat/__tests__/factories.ts` — Extended `MockContentProvider` with `getOutcomePrompts` and `getPromptGroups` mocks

### Key Decisions

- **Outcome prompts use icon string identifiers** (e.g., `"chart-up"`, `"cog"`) rather than component references — allows JSON serialization and flexible icon rendering in Phase 3
- **Prompt groups reference starter prompt IDs** via `promptIds[]` array rather than embedding full prompt objects — maintains single source of truth
- **Softer redirect messaging** uses empathetic language ("That's an interesting question!") instead of direct boundary statement
- **Consultant namespace** (`consultant.header.*`, `consultant.hero.*`, `consultant.footer.*`) separates page shell i18n from chat i18n
- **5 outcome prompts** defined: grow-revenue, automate-ops, build-platform, transform-marketing, get-strategy
- **2 prompt groups** defined: "Explore Services" (services, pricing, AI) and "Get Started" (web-platform, automation)

### Interfaces & Types

- `OutcomePrompt` in `src/lib/chat/types.ts` — id, label, prompt, icon
- `PromptGroup` in `src/lib/chat/types.ts` — groupLabel, promptIds[]
- `ConsultantHeaderProps` in `src/lib/chat/types.ts` — logoAlt, languageSwitchLabel, currentLanguageLabel, targetLanguageLabel, targetLanguageUrl
- `ConsultantHeroProps` in `src/lib/chat/types.ts` — headline, subheadline, ctaLabel
- `ConsultantFooterProps` in `src/lib/chat/types.ts` — copyright, contactLabel, contactEmail, privacyLabel?, privacyUrl?

### Tests

- `src/lib/chat/__tests__/content-provider.test.ts` — 70 tests (20 new: outcome prompts + prompt groups)
- `src/lib/chat/__tests__/validators.test.ts` — 138 tests (13 new: OutcomePrompt + PromptGroup validators)
- `src/lib/chat/__tests__/content-validation.test.ts` — 40 tests (12 new: V2 content parity)

## Architecture Notes

- ContentProvider interface follows OCP — extended with new methods without modifying existing contract
- StaticContentProvider reads JSON once at construction, freezes arrays for immutability
- All new types follow the existing readonly pattern for prop safety
- Prompt groups use ID references (not embedded objects) to maintain DRY with starter prompts

## Dependencies on Future Phases

- Phase 2 depends on: `ConsultantHeaderProps`, `ConsultantHeroProps`, `ConsultantFooterProps`, `consultant.*` i18n keys
- Phase 3 depends on: `OutcomePrompt` type, `getOutcomePrompts()` method, `chat.outcomes.*` i18n keys
- Phase 4 depends on: `PromptGroup` type, `getPromptGroups()` method, `chat.promptGroups.*` keys, `chat.input.helperText`, `chat.input.scopeDescription`, `chat.messages.redirect`
- Phase 5 depends on: Updated redirect messaging in prompts.json

## Verification Results

```
=== Phase 1 Verification Summary ===
Static Analysis:
  - astro:check:  ✅ (0 errors, 0 warnings)
  - lint:         ✅ (0 errors)
  - format:       ✅ (all unchanged)
  - build:        ✅ (2 pages, 983ms, 0 warnings)

Unit Tests:
  - Total:   831 tests
  - Passed:  831
  - Failed:  0
  - New:     45 tests added (786 → 831)

Verdict: PASS
```
