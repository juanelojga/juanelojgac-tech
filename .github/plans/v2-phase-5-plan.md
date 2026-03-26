        # V2 Phase 5 Implementation Plan: Live Assistant Integration

**Source**: AI_CONSULTANT_V2_PROJECT_PLAN.md — Phase 5
**Generated**: 2026-03-26
**Status**: ✅ Implementation Complete
**Impeccable Skills**: harden, clarify, animate

## Success Criteria

- [ ] `handleSendMessage` in ConsultantLayout wired to ChatAssistantService.sendMessage()
- [ ] ScopeEnforcer evaluates intent before API call; out-of-scope gets soft redirect
- [ ] GuidedFlowManager provides follow-up suggestions after assistant responses
- [ ] CTAInjector injects booking/contact CTAs at appropriate conversation depth
- [ ] Typing indicator visible during API call, dismissed on response/error
- [ ] Error state renders with retry capability
- [ ] Conversation state (phase, leadAttributes) persists across messages
- [ ] Turnstile token passed with API requests
- [ ] Integration tests cover all 4 send paths (in-scope, out-of-scope, error, typing)

## Dependency Graph

```
Phase 4 (Chat UX) ──> Phase 5 tasks
   5.1.1 Wire handleSendMessage ──┬──> 5.1.2 Wire ScopeEnforcer
                                  ├──> 5.1.3 Wire GuidedFlowManager
                                  └──> 5.1.4 Wire CTAInjector
   5.1.1 ──> 5.2.1 Typing state
   5.1.1 ──> 5.2.2 Error state
   5.1.1 ──> 5.2.3 Conversation state tracking
   All wiring ──> 5.3 Integration tests
```

## Implementation Groups

### Group 1: Core Wiring (Sequential — Critical Path)

| #   | Task                                                          | Files                                       | Skills  | Depends On    | Done Criteria                                     | Est. |
| --- | ------------------------------------------------------------- | ------------------------------------------- | ------- | ------------- | ------------------------------------------------- | ---- |
| 1   | Write integration tests for full send flow (TDD)              | `ConsultantLayout.test.tsx`                 | harden  | —             | Tests define expected behavior for all 4 paths    |      |
| 2   | Replace handleSendMessage stub with ChatAssistantService call | `ConsultantLayout.tsx`                      | harden  | Tests written | User messages sent to API, responses rendered     |      |
| 3   | Wire ScopeEnforcer pre-send                                   | `ConsultantLayout.tsx`                      | clarify | #2            | In-scope → API; out-of-scope → soft redirect      |      |
| 4   | Wire GuidedFlowManager for follow-ups                         | `ConsultantLayout.tsx`, `ChatContainer.tsx` | —       | #2            | Follow-up prompts appear after assistant responds |      |
| 5   | Wire CTAInjector for CTA placement                            | `ConsultantLayout.tsx`                      | —       | #2            | CTAs injected at conversation depth thresholds    |      |

### Group 2: State Management (Sequential after Group 1)

| #   | Task                                                       | Files                                       | Skills          | Depends On | Done Criteria                           | Est. |
| --- | ---------------------------------------------------------- | ------------------------------------------- | --------------- | ---------- | --------------------------------------- | ---- |
| 6   | Typing state: show/dismiss TypingIndicator during API call | `ConsultantLayout.tsx`                      | animate         | #2         | Typing indicator lifecycle correct      |      |
| 7   | Error state: render error with retry, i18n keys            | `ConsultantLayout.tsx`, `ChatContainer.tsx` | harden, clarify | #2         | Error banner with retry, both languages |      |
| 8   | Conversation state tracking across messages                | `ConsultantLayout.tsx`                      | —               | #3, #4     | Phase transitions tracked               |      |
| 9   | Pass Turnstile token with API requests                     | `ConsultantLayout.tsx`                      | —               | #2         | Token included in request headers       |      |

### Group 3: i18n & Integration (Sequential after Group 2)

| #   | Task                                                   | Files                     | Skills  | Depends On | Done Criteria                      | Est. |
| --- | ------------------------------------------------------ | ------------------------- | ------- | ---------- | ---------------------------------- | ---- |
| 10  | Add retry button i18n keys                             | `en.json`, `es.json`      | clarify | #7         | Both files updated symmetrically   |      |
| 11  | Update ConsultantSection.astro with new prop threading | `ConsultantSection.astro` | —       | #2         | Astro passes all new data to React |      |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                                      | Impact | Mitigation                                                               |
| --------------------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| ChatAssistantService instantiation in React component     | High   | Create service instance via useRef to persist across renders             |
| ScopeEnforcer needs ContentProvider (server-side concern) | Medium | Pass pre-built scope patterns or create lightweight client-side provider |
| Error state UX unclear                                    | Medium | Use existing i18n error keys + add retry button translation              |
