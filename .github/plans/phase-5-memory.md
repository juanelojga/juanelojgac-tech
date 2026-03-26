# Phase 5 Memory: Chat Assistant Service Layer

**Completed**: 2025-07-24
**Status**: ✅ Complete

## What Was Built

### Files Created

- `src/lib/chat/open-router-client.ts` — SRP HTTP client for OpenRouter API communication with typed error handling
- `src/lib/chat/system-prompt-builder.ts` — Bilingual system prompt constructor with anti-injection safeguards, phase-specific guidance, and conversation history formatting
- `src/lib/chat/api-config.ts` — Server-side config loader for OpenRouter API key and model from environment variables
- `src/lib/chat/chat-api-client.ts` — Client-side proxy caller that routes through Netlify Function, with retry/backoff integration
- `src/lib/chat/chat-assistant-service.ts` — Main service implementing ISP interfaces (ChatMessageSender, ChatStateManager, ChatSummaryGenerator), mediates UI ↔ API with phase transitions, error mapping, and summary generation
- `src/lib/chat/http-utils.ts` — Shared retry/backoff and error utilities extracted via `extract` skill and hardened via `harden` skill
- `netlify/functions/chat.ts` — Netlify Function proxy that keeps the API key server-side, validates requests, and maps errors to user-friendly responses
- `src/lib/chat/__tests__/open-router-client.test.ts` — 18 tests for OpenRouterClient
- `src/lib/chat/__tests__/system-prompt-builder.test.ts` — 18 tests for SystemPromptBuilder
- `src/lib/chat/__tests__/api-config.test.ts` — 10 tests for API config
- `src/lib/chat/__tests__/chat-assistant-service.test.ts` — 31 tests for ChatAssistantServiceImpl
- `src/lib/chat/__tests__/http-utils.test.ts` — 19 tests for HTTP utilities
- `.github/plans/phase-5-plan.md` — Implementation plan

### Files Modified

- `src/i18n/en.json` — Added `chat.messages.errorTimeout` and `chat.messages.errorUnavailable` keys
- `src/i18n/es.json` — Added `chat.messages.errorTimeout` and `chat.messages.errorUnavailable` keys
- `eslint.config.js` — Added `argsIgnorePattern: "^_"` and `varsIgnorePattern: "^_"` to `@typescript-eslint/no-unused-vars` rule
- `src/components/react/chat/__tests__/ChatContainer.test.tsx` — Fixed duplicate import (merged type and default import from `../ChatContainer`)

### Key Decisions

- **Netlify Functions for API proxy**: Since the site is SSG (static), Astro API routes aren't available at runtime. Netlify Functions serve as the server-side proxy to keep the OpenRouter API key safe.
- **Default model**: `meta-llama/llama-3.1-8b-instruct` — cost-effective, fast, good quality for conversational AI consulting
- **MAX_HISTORY_TURNS = 40**: Limits context window usage while maintaining conversation coherence
- **Retry with exponential backoff**: maxRetries=3, baseDelay=1000ms, maxDelay=10000ms, ±25% jitter to prevent thundering herd
- **Anti-injection in system prompt**: Explicit scope boundaries instructing the model to refuse off-topic requests
- **Phase-based conversation flow**: greeting → discovery → services → deepDive → summary, with automatic transition after first exchange
- **Error code to i18n key mapping**: Maps OpenRouter error codes to user-facing translation keys for localized error messages

### Interfaces & Types

- `OpenRouterConfig` in `open-router-client.ts` — Configuration for API client (apiKey, model, baseUrl, maxTokens, temperature, timeoutMs)
- `OpenRouterMessage` in `open-router-client.ts` — API message format (role, content)
- `ChatCompletionResult` in `open-router-client.ts` — API response (content, usage, finishReason)
- `OpenRouterUsage` in `open-router-client.ts` — Token usage tracking
- `OpenRouterErrorCode` in `open-router-client.ts` — Union type of error codes (rate_limit, auth_error, invalid_request, server_error, timeout, network_error)
- `OpenRouterError` class in `open-router-client.ts` — Typed error with code, retryable flag, and status
- `ChatAPIClientConfig` in `chat-api-client.ts` — Client config (endpoint, timeoutMs, retryConfig)
- `RetryConfig` in `http-utils.ts` — Retry behavior config (maxRetries, baseDelayMs, maxDelayMs, backoffMultiplier)

### Tests

- `src/lib/chat/__tests__/open-router-client.test.ts` — 18 tests: constructor validation, request construction (headers, body, URL), response parsing, error code mapping (429→rate_limit, 401/403→auth_error, 400→invalid_request, 500/503→server_error), timeout handling, network error handling
- `src/lib/chat/__tests__/system-prompt-builder.test.ts` — 18 tests: prompt generation for EN/ES, identity section, scope boundaries, anti-injection, services catalog, company info, phase guidance for all 5 phases, message formatting with history truncation
- `src/lib/chat/__tests__/api-config.test.ts` — 10 tests: env variable loading, default model fallback, missing key handling, key format validation (min length, empty, whitespace)
- `src/lib/chat/__tests__/chat-assistant-service.test.ts` — 31 tests: constructor with defaults, getState returns correct structure, sendMessage flow (user message creation, API call, assistant response, phase transition), resetConversation, updateLanguage, canGenerateSummary conditions, generateSummary with JSON parsing and fallback
- `src/lib/chat/__tests__/http-utils.test.ts` — 19 tests: backoff calculation (base, multiplier, max cap, jitter range), withRetry success/failure/exhaustion, retryable vs non-retryable errors, error message key mapping for all codes, isOpenRouterError type guard

## Architecture Notes

### Service Layer Architecture

```
UI Components (React)
    ↓ calls
ChatAssistantServiceImpl (mediator)
    ↓ uses
SystemPromptBuilder (prompt construction)
ChatAPIClient (HTTP communication)
    ↓ calls
Netlify Function /chat (server-side proxy)
    ↓ calls
OpenRouterClient (API client)
    ↓ HTTP
OpenRouter API
```

### Error Flow

```
OpenRouter API error
    → OpenRouterError (typed, with code + retryable flag)
    → withRetry (retries if retryable, up to 3 times with backoff)
    → ChatAssistantServiceImpl (catches, maps code to i18n key)
    → UI (displays localized error message)
```

### Security Architecture

- API key stored in Netlify environment variables, never reaches client
- Netlify Function validates: request method, message count (≤50), message length (≤5000 chars), valid roles
- System prompt includes anti-injection instructions
- CORS headers configured for security

## Dependencies on Future Phases

- Phase 6 depends on: ChatAssistantServiceImpl for provider/factory wiring, ChatAPIClient for React hook integration
- Phase 7 depends on: All service layer components for full integration testing

## Verification Results

```
=== Phase 5 Verification Summary ===
Static Analysis:
  - astro:check:  ✅ (0 errors, 0 warnings, 14 hints)
  - lint:         ✅ (0 errors, 0 warnings)
  - format:       ✅
  - build:        ✅ (1 page built, Complete!)

Unit Tests:
  - Total:   442 tests
  - Passed:  442
  - Failed:  0
  - New Phase 5 tests: 96 tests across 5 files
  - Coverage (Phase 5 files):
    - api-config.ts: 100% statements, 100% branches, 100% functions, 100% lines
    - chat-assistant-service.ts: 96.22% statements, 58.53% branches, 100% functions, 96.22% lines
    - http-utils.ts: 100% all metrics
    - open-router-client.ts: 98.14% statements, 94.44% branches, 85.71% functions, 100% lines
    - system-prompt-builder.ts: 100% statements, 95.83% branches, 100% functions, 100% lines

Playwright E2E:
  - N/A (Phase 5 is service layer only, no UI components)

Verdict: PASS
```
