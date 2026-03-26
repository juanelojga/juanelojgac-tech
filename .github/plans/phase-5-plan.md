# Phase 5 Implementation Plan: Chat Assistant Service Layer

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 5
**Generated**: 2026-03-25
**Status**: Planning Complete

## Success Criteria

- [ ] `OpenRouterClient` sends properly formatted requests, parses responses, handles all error codes
- [ ] API key never reaches client bundle — loaded server-side only
- [ ] Secure API proxy endpoint proxies to OpenRouter, validates requests
- [ ] `ChatAssistantService` manages conversation state, delegates to orchestrator for scope/guidance
- [ ] System prompt dynamically built from content provider, bilingual, scope-constrained, injection-resistant
- [ ] Error recovery: network failures show user-friendly message, automatic retry for transient errors
- [ ] Common patterns extracted to shared utilities (DRY)
- [ ] All unit tests green, ≥80% branch coverage on new files
- [ ] `pnpm test`, `pnpm run astro:check`, `pnpm run lint:fix`, `pnpm run build` all pass

## Dependency Graph

```
Phase 1 types/interfaces ─┐
Phase 2 content provider ──┼─► [OpenRouterClient] ─► [API Proxy Endpoint]
                           │                              │
                           └─► [SystemPromptBuilder] ─────┤
                                                          │
                               [ChatAssistantService] ◄───┘
                                      │
                               [Harden + Extract]
```

## Implementation Groups

### Group 1: Core HTTP Client (Sequential — Critical Path)

| #   | Task                           | Files                                               | Depends On       | Done Criteria                                              | Est. |
| --- | ------------------------------ | --------------------------------------------------- | ---------------- | ---------------------------------------------------------- | ---- |
| 1   | Write OpenRouterClient tests   | `src/lib/chat/__tests__/open-router-client.test.ts` | Phase 1 types    | Tests mock HTTP: success, rate-limit, timeout, malformed   | 5h   |
| 2   | Implement OpenRouterClient     | `src/lib/chat/open-router-client.ts`                | Tests            | Sends formatted requests, parses responses, handles errors | 5h   |
| 3   | Write API key management tests | `src/lib/chat/__tests__/api-config.test.ts`         | OpenRouterClient | Key not exposed client-side, loaded from env               | 2h   |
| 4   | Implement API proxy endpoint   | `netlify/functions/chat.ts`                         | Key tests        | Server-side proxy, key hidden, request validation          | 5h   |

### Group 2: System Prompt Builder (Parallel Track A)

| #   | Task                              | Files                                                  | Depends On      | Done Criteria                                                    | Est. |
| --- | --------------------------------- | ------------------------------------------------------ | --------------- | ---------------------------------------------------------------- | ---- |
| 5   | Write system prompt builder tests | `src/lib/chat/__tests__/system-prompt-builder.test.ts` | Phase 2 content | Tests verify scope boundaries, language context, service content | 4h   |
| 6   | Implement system prompt builder   | `src/lib/chat/system-prompt-builder.ts`                | Tests           | Dynamically built from content, bilingual, never exposed to user | 4h   |

### Group 3: ChatAssistantService (Sequential — depends on Group 1 & 2)

| #   | Task                             | Files                                                   | Depends On | Done Criteria                                            | Est. |
| --- | -------------------------------- | ------------------------------------------------------- | ---------- | -------------------------------------------------------- | ---- |
| 7   | Write ChatAssistantService tests | `src/lib/chat/__tests__/chat-assistant-service.test.ts` | Groups 1-2 | Tests: send, receive, state, errors, scope enforcement   | 6h   |
| 8   | Implement ChatAssistantService   | `src/lib/chat/chat-assistant-service.ts`                | Tests      | All tests green, manages state, delegates scope/guidance | 8h   |

### Group 4: Hardening & Extraction (Sequential — after Group 3)

| #   | Task                                   | Files                                  | Depends On | Done Criteria                                                  | Est. |
| --- | -------------------------------------- | -------------------------------------- | ---------- | -------------------------------------------------------------- | ---- |
| 9   | Apply harden skill — error recovery    | Multiple                               | Group 3    | Retry with backoff, graceful degradation, user-friendly errors | 4h   |
| 10  | Apply extract skill — shared utilities | `src/lib/chat/http-utils.ts`           | Group 3    | Common HTTP/error patterns extracted, DRY                      | 3h   |
| 11  | Update i18n for new error strings      | `src/i18n/en.json`, `src/i18n/es.json` | Group 4    | Both files updated symmetrically                               | 1h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                       | Impact   | Mitigation                                                             |
| ------------------------------------------ | -------- | ---------------------------------------------------------------------- |
| SSG site can't have server-side API routes | High     | Use Netlify Functions for the proxy endpoint                           |
| OpenRouter API changes                     | Medium   | Abstract behind interface, easy to swap                                |
| API key exposure in client bundle          | Critical | Proxy all calls through Netlify Function, never import key client-side |
| Rate limiting from OpenRouter              | Medium   | Implement backoff + retry, cache system prompts                        |

## Architecture Decisions

1. **Netlify Functions** for the API proxy — SSG site can't have Astro API routes
2. **OpenRouterClient** is a pure HTTP client class (SRP) — only knows how to call OpenRouter API
3. **SystemPromptBuilder** constructs the system prompt from ContentProvider data — separation from API client
4. **ChatAssistantService** is the main orchestrator implementing the ISP interfaces from Phase 1
5. **Client-side uses `fetch`** to call the Netlify Function endpoint — no direct API key access
6. All error handling follows the `harden` skill — retry with backoff, graceful degradation, user-friendly messages
