# Phase 7 Implementation Plan: Integration & Security Hardening

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 7
**Generated**: 2026-03-26
**Status**: Planning Complete

## Success Criteria

- [ ] TrustPanel + ChatPanel render side-by-side on desktop, stacked on mobile
- [ ] ServiceItem click → chat prompt injection works across component boundaries
- [ ] Full round-trip: user sends → service processes → orchestrator scopes → UI renders response
- [ ] Integration tests verify: panel click → chat message, chat response → CTA render, summary generation
- [ ] Human verification gate blocks chat before verification, allows after, token validated server-side
- [ ] Turnstile widget renders, token sent with first chat request, server validates
- [ ] Rate limiting enforced server-side, user sees "slow down" message
- [ ] Requests within limit succeed, over-limit returns 429
- [ ] Error boundaries on React components, graceful fallbacks, no unhandled exceptions
- [ ] No critical security issues, WCAG 2.1 AA compliance, OWASP top 10 addressed

## Dependency Graph

```
Group 1 (Sequential Critical Path):
  7.1.1 Two-Panel Layout Integration
    ↓
  7.1.2 Service Click → Chat Injection Wiring
    ↓
  7.1.3 ChatAssistantService → Orchestrator → UI Flow
    ↓
  7.1.4 Cross-Component Integration Tests

Group 2 (Parallel — Security, after 7.1.1 baseline):
  7.2.1 Human Verification Tests (TDD) → 7.2.2 Implementation
  7.2.3 Rate Limiting Tests (TDD) → 7.2.4 Implementation

Group 3 (Sequential — Hardening, after Groups 1+2):
  7.2.5 Harden Skill Pass → 7.2.6 Audit Skill Pass

i18n: Updated throughout all groups
```

## Implementation Groups

### Group 1: Full Component Integration (Sequential — Critical Path)

| #   | Task                                                                      | Files                                                           | Depends On | Done Criteria                                                  | Est. |
| --- | ------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------- | -------------------------------------------------------------- | ---- |
| 1   | Write integration tests for two-panel layout rendering (desktop + mobile) | `src/components/react/__tests__/ConsultantLayout.test.tsx`      | —          | Tests verify side-by-side desktop, stacked mobile              | 2h   |
| 2   | Create ConsultantLayout React component (two-panel orchestrator)          | `src/components/react/chat/ConsultantLayout.tsx`                | #1 tests   | TrustPanel + ChatContainer rendered together, state shared     | 3h   |
| 3   | Create ConsultantSection Astro wrapper with i18n                          | `src/components/ConsultantSection.astro`                        | #2         | Astro wrapper hydrates ConsultantLayout with translations      | 1h   |
| 4   | Integrate ConsultantSection into index.astro                              | `src/pages/index.astro`                                         | #3         | Section visible on page                                        | 0.5h |
| 5   | Write tests for service click → chat injection                            | `src/components/react/chat/__tests__/ConsultantLayout.test.tsx` | #2         | Tests verify: ServiceItem click populates chat input and sends | 1h   |
| 6   | Wire ServiceItem onPromptInject → ChatContainer onSendMessage             | `src/components/react/chat/ConsultantLayout.tsx`                | #5 tests   | Clicking service in left panel sends message to chat           | 1h   |
| 7   | Write tests for full round-trip flow (send → process → render)            | `src/lib/chat/__tests__/integration.test.ts`                    | #6         | Tests verify ChatAssistantService → response → UI state        | 2h   |
| 8   | Wire ChatAssistantService → orchestration → React UI state                | `src/components/react/chat/ConsultantLayout.tsx`                | #7 tests   | Full round-trip works: message sent → API → response rendered  | 2h   |

### Group 2: Human Verification & Rate Limiting (Parallel after Group 1 baseline)

| #   | Task                                                        | Files                                                            | Depends On | Done Criteria                                              | Est. |
| --- | ----------------------------------------------------------- | ---------------------------------------------------------------- | ---------- | ---------------------------------------------------------- | ---- |
| 9   | Add verification + rate-limit i18n keys (EN + ES)           | `src/i18n/en.json`, `src/i18n/es.json`                           | —          | Keys for verification UI, rate-limit messages              | 0.5h |
| 10  | Write unit tests for HumanVerification component (TDD)      | `src/components/react/chat/__tests__/HumanVerification.test.tsx` | —          | Tests: blocked before verify, allowed after, error states  | 2h   |
| 11  | Implement HumanVerification React component                 | `src/components/react/chat/HumanVerification.tsx`                | #10 tests  | Turnstile-style verification widget, token callback        | 2h   |
| 12  | Write tests for verification token validation (server-side) | `src/lib/chat/__tests__/verification.test.ts`                    | —          | Tests: valid token passes, invalid fails, expired fails    | 1.5h |
| 13  | Implement server-side verification token validator          | `src/lib/chat/verification.ts`                                   | #12 tests  | Validates Turnstile token via Cloudflare API               | 1.5h |
| 14  | Integrate verification gate into Netlify function           | `netlify/functions/chat.ts`                                      | #13        | Token required on API requests, validated server-side      | 1h   |
| 15  | Write unit tests for rate limiter (TDD)                     | `src/lib/chat/__tests__/rate-limiter.test.ts`                    | —          | Tests: under limit passes, over limit returns 429          | 1.5h |
| 16  | Implement in-memory rate limiter                            | `src/lib/chat/rate-limiter.ts`                                   | #15 tests  | Sliding window rate limit per IP                           | 1.5h |
| 17  | Integrate rate limiter into Netlify function                | `netlify/functions/chat.ts`                                      | #16        | Rate limiting enforced, 429 returned with friendly message | 0.5h |
| 18  | Integrate verification gate into ConsultantLayout           | `src/components/react/chat/ConsultantLayout.tsx`                 | #11, #8    | Chat blocked until verified, gate renders before chat      | 1h   |

### Group 3: Hardening & Audit (Sequential after Groups 1+2)

| #   | Task                                                         | Files                                                            | Depends On | Done Criteria                                          | Est. |
| --- | ------------------------------------------------------------ | ---------------------------------------------------------------- | ---------- | ------------------------------------------------------ | ---- |
| 19  | Add React error boundaries to all chat/panel components      | `src/components/react/chat/ChatErrorBoundary.tsx`                | Groups 1+2 | Graceful fallback on component errors                  | 1.5h |
| 20  | Write tests for error boundary behavior                      | `src/components/react/chat/__tests__/ChatErrorBoundary.test.tsx` | #19        | Tests: catches errors, renders fallback, reports error | 1h   |
| 21  | Harden edge cases: empty states, network failures, long text | All chat components                                              | #19        | No unhandled exceptions across all components          | 1.5h |
| 22  | Security audit: OWASP top 10 review of all new code          | All Phase 7 files                                                | #21        | No critical security issues                            | 1h   |
| 23  | Accessibility audit: WCAG 2.1 AA verification                | All Phase 7 UI components                                        | #21        | ARIA labels, keyboard nav, focus management correct    | 1h   |

### Group 4: E2E Error State Tests

| #   | Task                                        | Files                           | Depends On | Done Criteria                                            | Est. |
| --- | ------------------------------------------- | ------------------------------- | ---------- | -------------------------------------------------------- | ---- |
| 24  | Write Playwright E2E tests for error states | `e2e/consultant-errors.spec.ts` | Group 3    | Network failure, rate limit, verification failure tested | 2h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                                 | Impact | Mitigation                                                                  |
| ---------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| Turnstile requires external script + API key         | Medium | Use lightweight mock/interface pattern; real widget injected via env config |
| In-memory rate limiter resets on function cold start | Low    | Acceptable for MVP; document Redis upgrade path for v1.1                    |
| Cross-component state complexity                     | Medium | Single state owner (ConsultantLayout) with props drilling, no global state  |
| Netlify function stateless — no session tracking     | Low    | Rate limit per IP via Netlify context headers                               |
