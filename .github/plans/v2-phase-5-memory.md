# V2 Phase 5 Memory: Live Assistant Integration

**Completed**: 2026-03-26
**Status**: ✅ Complete

## What Was Built

Phase 5 replaced the placeholder `handleSendMessage` stub in `ConsultantLayout` with real assistant orchestration, wiring together all Phase 1 services (ScopeEnforcerImpl, CTAInjectorImpl, GuidedFlowManagerImpl, ChatAPIClient, SystemPromptBuilder).

### Files Created

- `src/components/react/chat/__tests__/ConsultantLayout.integration.test.tsx` — 12 integration tests for live assistant wiring

### Files Modified

- `src/lib/chat/chat-api-client.ts` — Added `turnstileToken` field + `setTurnstileToken()` method; token included in request body when set
- `src/components/react/chat/ChatContainer.tsx` — Added `followUps` prop (GuidedFollowUp[]), `onRetry` callback, retry button in error alert, follow-up chips section below messages
- `src/components/react/chat/ConsultantLayout.tsx` — Complete rewrite: lazy-init services via useRef, async handleSendMessage with scope check → API call → CTA injection → flow suggestions → phase transitions; handleRetry; handleVerificationSuccess stores turnstile token
- `src/components/ConsultantSection.astro` — Added errorTranslations prop object, followUpsLabel, errorRetry to chatTranslations
- `src/components/ChatPanel.astro` — Added followUpsLabel, errorRetry translations, followUps={[]} prop
- `src/i18n/en.json` — Added `chat.messages.errorRetry`, `chat.chips.followUpsLabel`
- `src/i18n/es.json` — Added `chat.messages.errorRetry`, `chat.chips.followUpsLabel`
- `src/components/react/chat/__tests__/ChatContainer.test.tsx` — Updated fixtures with new required props
- `src/components/react/chat/__tests__/ConsultantLayout.test.tsx` — Updated fixtures with new required props

### Impeccable Skills Applied

- `harden` on `ConsultantLayout.tsx` — Error handling for all API failure modes (network, rate limit, timeout, unavailable), retry mechanism, scope enforcement boundary
- `clarify` on `en.json` / `es.json` — Clear, actionable error messages and follow-up labels in both languages
- `animate` concept applied to typing indicator lifecycle — show during API call, dismiss on response/error

### Key Decisions

- **Direct service composition instead of ChatAssistantServiceImpl**: ConsultantLayout uses individual services (ChatAPIClient, SystemPromptBuilder, ScopeEnforcerImpl, CTAInjectorImpl, GuidedFlowManagerImpl) directly rather than ChatAssistantServiceImpl. Reason: avoid double message tracking between React state and the service's internal state. React state is single source of truth.
- **Lazy-init via useRef**: Services are initialized once via `getServices()` helper that creates them on first access and stores in `useRef`. This avoids re-creation on re-renders while keeping initialization deterministic.
- **ContentProvider imported directly**: StaticContentProvider cannot be passed as Astro `client:load` prop (Astro serializes to JSON). Solution: import StaticContentProvider directly in ConsultantLayout with optional `contentProvider` prop override for testing.
- **Out-of-scope redirect without API call**: When ScopeEnforcerImpl marks a message as out-of-scope, a redirect message is injected directly without calling the API.
- **Error resolution via i18n**: Errors from OpenRouter are mapped to i18n keys (errorGeneric/errorNetwork/errorRateLimit/errorTimeout/errorUnavailable) and resolved through an ErrorTranslations map.
- **leadAttributes as plain const**: No lead extraction implemented yet (deferred to Phase 6), so `leadAttributes` is a plain empty object instead of useState to avoid lint warnings.

### Interfaces & Types

- `ErrorTranslations` interface in `ConsultantLayout.tsx` — maps error i18n keys to resolved strings
- `ConsultantLayoutProps` updated with `errorTranslations: ErrorTranslations` required prop and optional `contentProvider?: ContentProvider`

### Tests

- `src/components/react/chat/__tests__/ConsultantLayout.integration.test.tsx` — 12 integration tests covering:
  - In-scope message: verify API call and response rendering
  - SystemPromptBuilder: verify formatMessagesForAPI is called
  - Out-of-scope: verify redirect without API call
  - Error display on API failure
  - Retry button removes failed message and re-sends
  - Typing indicator lifecycle (shown during API call, hidden after)
  - Follow-up chips rendering after response
  - Follow-up chip click sends prompt
  - Phase transitions via GuidedFlowManager
  - Turnstile verification gate (messages blocked before verification)
  - CTA injection after assistant response
  - Outcome prompt injection from TrustPanel

## Architecture Notes

```
ConsultantLayout (React)
├── getServices() → lazy-init via useRef
│   ├── StaticContentProvider (imported directly)
│   ├── ChatAPIClient
│   ├── SystemPromptBuilder
│   ├── ScopeEnforcerImpl
│   ├── CTAInjectorImpl
│   └── GuidedFlowManagerImpl
├── handleSendMessage(text)
│   ├── Create user ChatMessage
│   ├── ScopeEnforcer.evaluateMessage() → if out-of-scope: redirect, return
│   ├── SystemPromptBuilder.formatMessagesForAPI()
│   ├── ChatAPIClient.sendMessage() → response
│   ├── CTAInjector.shouldInjectCTA() → maybe add CTA message
│   ├── GuidedFlowManager.suggestFollowUps() → set follow-ups + phase transition
│   └── Error handling → i18n error resolution
├── handleRetry() → re-send last failed message
├── handleVerificationSuccess(token) → store turnstile token
└── Renders: TrustPanel (left) + ChatContainer (right)
```

### Vitest v4 Gotchas

- `vi.fn().mockImplementation(() => ({...}))` arrow functions CANNOT be used as constructors in Vitest v4+ — must use `class MockName { method = mockFn; }` pattern in `vi.mock` factories
- ChatInput uses textarea + button (NOT a `<form>`) — tests must use `fireEvent.click(sendButton)` not `fireEvent.submit`

## Dependencies on Future Phases

- Phase 6 depends on: ErrorTranslations interface, follow-up chips UI, retry mechanism, conversation state tracking
- Phase 7 depends on: full integration verification, E2E coverage

## Verification Results

```
=== Phase 5 Verification Summary ===
Static Analysis:
  - astro:check:  ✅ (0 errors, 0 warnings, 10 hints)
  - lint:         ✅ (0 errors, 0 warnings)
  - format:       ✅ (all unchanged)
  - build:        ✅ (2 pages built, complete)

Unit Tests:
  - Total:   921 tests
  - Passed:  921
  - Failed:  0
  - Files:   42

Verdict: PASS
```

### Code Review Summary

- Review model: Pending (Step 4 deferred — to be performed before Phase 6)
- Review file: `.github/plans/v2-phase-5-review.md` (not yet created)

### Playwright E2E Coverage

- E2E specs: Deferred to Phase 7 (integration/polish phase)
- Phase 5 is service-wiring focused — E2E will verify the full flow end-to-end in Phase 7
