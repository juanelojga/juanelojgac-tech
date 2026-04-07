# Phase 6 Implementation Plan: Conversation Orchestration & Summary

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 6
**Generated**: 2026-03-25
**Status**: Planning Complete

## Success Criteria

- [ ] `ScopeEnforcer` classifies intents as allowed, vague, or blocked with 75+ test scenarios
- [ ] `GuidedFlowManager` tracks conversation stage and suggests follow-ups in EN + ES
- [ ] `CTAInjector` determines when and which CTA to insert, not too early or too often
- [ ] `LeadExtractor` extracts project type, users, goals, timeline from conversation history
- [ ] `SummaryGenerator` produces bilingual project summaries with solution, timeline, price range
- [ ] `InputSanitizer` validates, sanitizes, and filters user input (XSS, injection, oversized)
- [ ] Instruction isolation prevents system prompt override by user input
- [ ] All tests green, astro:check passes, lint clean, build succeeds

## Dependency Graph

```
Phase 1 Types ──┐
Phase 2 Content ─┤
Phase 5 Service ─┤
                 ▼
    ┌─── ScopeEnforcer (6.1)
    │         │
    │    GuidedFlowManager (6.1) ◄── ContentProvider
    │         │
    │    CTAInjector (6.1) ◄── GuidedFlowManager
    │
    ├─── LeadExtractor (6.2) ◄── GuidedFlowManager
    │         │
    │    SummaryGenerator (6.2) ◄── LeadExtractor + ContentProvider
    │
    └─── InputSanitizer (6.3)
              │
         InstructionIsolation (6.3) ◄── SystemPromptBuilder
```

## Implementation Groups

### Group 1: Scope Enforcement & Guided Flows (Sequential — Critical Path)

| #   | Task                          | Files                                                | Depends On        | Done Criteria                                                       | Est. |
| --- | ----------------------------- | ---------------------------------------------------- | ----------------- | ------------------------------------------------------------------- | ---- |
| 1   | Write ScopeEnforcer tests     | `src/lib/chat/__tests__/scope-enforcer.test.ts`      | Phase 1 types     | 75+ prompt scenarios covering service queries, off-topic, injection | 5h   |
| 2   | Implement ScopeEnforcer       | `src/lib/chat/scope-enforcer.ts`                     | Tests             | Classifies intents, redirects out-of-scope to service discovery     | 5h   |
| 3   | Write GuidedFlowManager tests | `src/lib/chat/__tests__/guided-flow-manager.test.ts` | ScopeEnforcer     | Flow progression: project type → users → goals → timeline → summary | 5h   |
| 4   | Implement GuidedFlowManager   | `src/lib/chat/guided-flow-manager.ts`                | Tests             | Tracks stage, returns contextual follow-ups, EN + ES                | 5h   |
| 5   | Write CTAInjector tests       | `src/lib/chat/__tests__/cta-injector.test.ts`        | GuidedFlowManager | CTA after qualified signals, not too early/often                    | 3h   |
| 6   | Implement CTAInjector         | `src/lib/chat/cta-injector.ts`                       | Tests             | Inserts booking/email CTA at natural points                         | 3h   |

### Group 2: Lead Extraction & Project Summary (Sequential)

| #   | Task                         | Files                                              | Depends On    | Done Criteria                                    | Est. |
| --- | ---------------------------- | -------------------------------------------------- | ------------- | ------------------------------------------------ | ---- |
| 7   | Write LeadExtractor tests    | `src/lib/chat/__tests__/lead-extractor.test.ts`    | Group 1       | Extraction from various conversation patterns    | 4h   |
| 8   | Implement LeadExtractor      | `src/lib/chat/lead-extractor.ts`                   | Tests         | Extracts LeadAttributes bilingual from history   | 4h   |
| 9   | Write SummaryGenerator tests | `src/lib/chat/__tests__/summary-generator.test.ts` | LeadExtractor | Summary includes solution, timeline, price range | 4h   |
| 10  | Implement SummaryGenerator   | `src/lib/chat/summary-generator.ts`                | Tests         | Bilingual summary with next steps                | 4h   |

### Group 3: Prompt Injection Protection (Parallel with Group 2)

| #   | Task                              | Files                                                  | Depends On          | Done Criteria                                      | Est. |
| --- | --------------------------------- | ------------------------------------------------------ | ------------------- | -------------------------------------------------- | ---- |
| 11  | Write InputSanitizer tests        | `src/lib/chat/__tests__/input-sanitizer.test.ts`       | —                   | XSS, injection, oversized, special chars           | 4h   |
| 12  | Implement InputSanitizer          | `src/lib/chat/input-sanitizer.ts`                      | Tests               | Sanitizes HTML, limits length, filters injection   | 3h   |
| 13  | Write instruction isolation tests | `src/lib/chat/__tests__/instruction-isolation.test.ts` | SystemPromptBuilder | 99%+ injection attempts fail                       | 3h   |
| 14  | Implement instruction isolation   | `src/lib/chat/instruction-isolation.ts`                | Tests               | User input wrapped, system isolated, refusal paths | 3h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                  | Impact                                      | Mitigation                                                             |
| ------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| Scope classification too strict/loose | Users get frustrated or chat goes off-topic | Use keyword + pattern matching with confidence scores, tune thresholds |
| CTA injection feels spammy            | Damages trust                               | Minimum message count + conversation phase gating                      |
| Lead extraction misses attributes     | Incomplete summaries                        | Graceful defaults for missing attributes, don't block flow             |
| Injection patterns evolve             | Security risk                               | Layered defense: sanitizer + isolation + system prompt hardening       |
