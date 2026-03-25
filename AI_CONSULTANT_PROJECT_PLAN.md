# Project Plan: AI Consultant Landing Page

**Goal**: Replace the scroll-first homepage with a bilingual conversational experience combining a persistent trust-and-conversion panel with a guided AI consultant chat, constrained to company services, pricing ranges, process, examples, and company information — driving qualified prospects toward a consultation booking.

**Timeline**: 8 weeks (10 phases)  
**Team**: 1 full-stack engineer (AI + frontend)  
**Constraints**: Existing Astro v6 + React 19 + Tailwind v4 stack; SSG on Netlify; must support EN + ES from MVP; no new backend infrastructure (serverless API routes or edge functions only); TDD workflow with SOLID and DRY principles throughout.

**Methodology**: SOLID architecture, TDD (tests written before implementation), DRY (shared abstractions extracted via `extract` skill), React for all interactive components, Playwright for visual regression on desktop and mobile.

---

## Milestones

| #   | Milestone                            | Target     | Owner    | Success Criteria                                                                                                                    |
| --- | ------------------------------------ | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Foundation & Architecture            | End Week 1 | Engineer | Project scaffolding complete, types defined, service interfaces passing tests, design tokens extended, Playwright configured        |
| 2   | Content & Configuration Layer        | End Week 2 | Engineer | Bilingual content source for services, pricing, trust signals, company facts — all tested and validated                             |
| 3   | Left Panel — Trust & Conversion      | End Week 3 | Engineer | Persistent left panel renders identity, services, trust signals, CTAs — responsive, accessible, polished, all unit tests green      |
| 4   | Chat UI Shell                        | End Week 4 | Engineer | Chat container, message bubbles, input bar, starter prompt chips — rendered correctly, all unit tests green, Playwright checks pass |
| 5   | Chat Assistant Service Layer         | End Week 5 | Engineer | `ChatAssistantService` mediates UI ↔ OpenRouter, scope enforcement, guided follow-ups, CTA injection — unit tested with mocked API  |
| 6   | Conversation Orchestration & Summary | End Week 6 | Engineer | Guided branching, lead attribute extraction, project summary generation, prompt-injection protection — all tested                   |
| 7   | Integration & Security Hardening     | Mid Week 7 | Engineer | Human verification gate, rate limiting, input sanitization, full integration tests across components — E2E flows passing            |
| 8   | i18n Parity & Responsive Polish      | End Week 7 | Engineer | EN/ES flow parity verified, mobile layout adapted, Playwright visual checks on all viewports                                        |
| 9   | Performance & Accessibility Audit    | Mid Week 8 | Engineer | Lighthouse ≥90, WCAG 2.1 AA compliance, bundle optimized, latency ≤2.5s median                                                      |
| 10  | Launch Readiness                     | End Week 8 | Engineer | All tests green, E2E conversion flows verified, production deployment, post-launch monitoring                                       |

---

## Phase 1: Foundation & Architecture (Week 1)

**Impeccable Skills**: `frontend-design` (project context), `extract` (type system), `teach-impeccable` (design context setup)

### 1.1 — Project Scaffolding & Type System

| Task                                                                                                                                       | Size   | Depends On     | Done Criteria                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------- | -------------------------------------------------------------------------------------- |
| Define core TypeScript interfaces: `ChatMessage`, `ConversationState`, `LeadAttributes`, `ProjectSummary`, `ServiceContent`, `TrustSignal` | M (4h) | —              | Interfaces exported from `src/lib/chat/types.ts`, no `any`, strict mode passing        |
| Define `ChatAssistantService` interface (SRP — single responsibility: mediate UI ↔ API)                                                    | S (3h) | Types          | Interface follows ISP (Interface Segregation), separates send/receive/summary concerns |
| Define `ContentProvider` interface for bilingual service data (OCP — open for extension)                                                   | S (2h) | Types          | Interface allows adding new content categories without modifying existing code         |
| Define `ConversationOrchestrator` interface for guided flow logic (SRP)                                                                    | S (3h) | Types          | Interface separates scope enforcement, CTA injection, and follow-up guidance           |
| Write unit tests for all type guards and validation utilities                                                                              | M (4h) | All interfaces | Tests written first (TDD), all green, 100% branch coverage on validators               |

### 1.2 — Design System Extension

| Task                                                                                                                            | Size   | Depends On        | Done Criteria                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------- | ------------------------------------------------------------------------------- |
| Extend `@theme` tokens in `tailwind.css` for chat UI: message bubble colors, panel backgrounds, chip styles, input focus states | S (3h) | —                 | Tokens defined using existing brand palette, no arbitrary values                |
| Define responsive breakpoint strategy for two-panel layout (left panel + chat)                                                  | S (2h) | Tokens            | Mobile: full-screen chat with collapsible panel; Desktop: persistent left panel |
| Create Tailwind utility compositions for chat components (DRY — reusable class groups)                                          | S (2h) | Tokens + Strategy | Documented in comments within `tailwind.css`                                    |

### 1.3 — Testing Infrastructure

| Task                                                                                                                                            | Size    | Depends On        | Done Criteria                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------- | ----------------------------------------------------------------------------------------- |
| Install and configure Playwright for E2E and visual regression                                                                                  | M (4h)  | —                 | `playwright.config.ts` created, desktop (1280×720) and mobile (375×812) viewports defined |
| Create Playwright test helpers: page fixtures, i18n switchers, chat interaction utilities                                                       | M (4h)  | Playwright config | Helpers exported, reusable across all E2E specs                                           |
| Create Vitest test utilities: mock factories for `ChatAssistantService`, `ContentProvider`, render helpers for React components with i18n props | M (5h)  | Core interfaces   | Factories produce valid typed mocks, helpers wrap RTL `render` with common props          |
| Verify existing tests still pass after scaffolding                                                                                              | XS (1h) | All above         | `pnpm test` and `pnpm run astro:check` green                                              |

**Phase 1 Total Effort**: ~37 hours

---

## Phase 2: Content & Configuration Layer (Week 2)

**Impeccable Skills**: `clarify` (UX copy quality), `harden` (i18n edge cases, content validation)

### 2.1 — Bilingual Content Source

| Task                                                                                                                                          | Size   | Depends On         | Done Criteria                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------ | --------------------------------------------------------------------------------- |
| Write tests for `ContentProvider` implementation — service descriptions, pricing ranges, trust signals, company facts (TDD)                   | M (4h) | Phase 1 interfaces | Tests cover EN + ES, all content categories, edge cases for missing keys          |
| Implement `StaticContentProvider` — reads from structured JSON config files                                                                   | M (5h) | Tests              | All tests green, returns typed content objects, follows LSP (Liskov Substitution) |
| Create `src/lib/chat/content/services.json` — bilingual service catalog with pricing ranges, examples, delivery timelines                     | M (6h) | Content types      | JSON validated against TypeScript interfaces, EN + ES parity verified             |
| Create `src/lib/chat/content/company.json` — company facts, process steps, team info, trust signals                                           | M (4h) | Content types      | All content entries present in both languages                                     |
| Create `src/lib/chat/content/prompts.json` — starter prompt chips, guided follow-up templates, out-of-scope redirect messages                 | M (5h) | Content types      | Prompt chips cover all major business intents, bilingual                          |
| Update `src/i18n/en.json` and `src/i18n/es.json` — add keys for chat UI chrome: panel labels, input placeholder, header copy, CTA button text | M (4h) | —                  | Both files updated symmetrically, all new keys namespaced under `chat.*`          |

### 2.2 — Content Validation & Edge Cases

| Task                                                                                                      | Size   | Depends On    | Done Criteria                                       |
| --------------------------------------------------------------------------------------------------------- | ------ | ------------- | --------------------------------------------------- |
| Write validation tests for content completeness — every EN key has ES counterpart and vice versa          | S (3h) | Content files | Automated test catches any missing translation keys |
| Apply `clarify` skill — review all user-facing copy for clarity, tone, and conversion effectiveness       | S (3h) | All content   | Copy reviewed, unclear labels or messages improved  |
| Apply `harden` skill — test for text overflow, long translations, special characters, RTL-safe structures | S (3h) | All content   | Edge cases handled, no truncation or layout breaks  |

**Phase 2 Total Effort**: ~37 hours

---

## Phase 3: Left Panel — Trust & Conversion (Week 3)

**Impeccable Skills**: `frontend-design` (implementation), `arrange` (layout/spacing), `typeset` (typography), `colorize` (brand warmth), `adapt` (responsive), `critique` (UX evaluation)

### 3.1 — Panel Component Architecture

| Task                                                                                                           | Size   | Depends On      | Done Criteria                                                        |
| -------------------------------------------------------------------------------------------------------------- | ------ | --------------- | -------------------------------------------------------------------- |
| Write unit tests for `TrustPanel` React component — renders identity, services, trust signals, CTAs (TDD)      | M (5h) | Phase 2 content | Tests cover all sections, click handlers, accessibility attributes   |
| Implement `TrustPanel` React component (SRP — only trust/conversion display)                                   | L (8h) | Tests           | All tests green, renders all sections with correct props             |
| Write unit tests for `ServiceItem` sub-component — clickable service items that inject prompts into chat (TDD) | S (3h) | TrustPanel      | Tests verify click callback fires with correct prompt payload        |
| Implement `ServiceItem` React component                                                                        | S (3h) | Tests           | Renders service name + icon, fires `onPromptInject(prompt)` on click |
| Write unit tests for `TrustSignals` sub-component — trust badges, stats, social proof (TDD)                    | S (2h) | TrustPanel      | Tests verify rendering of all signal types                           |
| Implement `TrustSignals` React component                                                                       | S (2h) | Tests           | Renders badges, numbers, logos from content provider                 |
| Write unit tests for `PanelCTA` sub-component — persistent booking + contact buttons (TDD)                     | S (2h) | TrustPanel      | Tests verify Calendly link and email CTA render correctly            |
| Implement `PanelCTA` React component                                                                           | S (2h) | Tests           | Renders primary (Calendly) and secondary (email) CTAs                |

### 3.2 — Panel Astro Integration & Styling

| Task                                                                                                             | Size   | Depends On       | Done Criteria                                                              |
| ---------------------------------------------------------------------------------------------------------------- | ------ | ---------------- | -------------------------------------------------------------------------- |
| Create `TrustPanel.astro` wrapper — fetches translations, shapes props, hydrates React island with `client:load` | M (4h) | React components | Astro component follows existing section pattern                           |
| Apply `arrange` skill — optimize layout spacing, visual rhythm within panel sections                             | S (2h) | Astro wrapper    | Spacing consistent with design system tokens                               |
| Apply `typeset` skill — ensure heading hierarchy, font weights, and sizes follow brand system                    | S (2h) | Arranged layout  | Typography uses Sora for headings, Inter for body, Poppins for accents     |
| Apply `colorize` skill — ensure warm, trustworthy color application using brand palette                          | S (2h) | Typography set   | Colors use tarawera, persian-green, coral design tokens                    |
| Apply `adapt` skill — responsive behavior: panel collapses to drawer on mobile                                   | M (4h) | Styled panel     | Mobile: collapsible overlay; Tablet: slide-in; Desktop: persistent sidebar |
| Write Playwright tests — panel renders correctly on desktop (1280px) and mobile (375px)                          | M (4h) | Responsive panel | Visual regression snapshots captured, all assertions pass                  |
| Apply `critique` skill — UX evaluation of panel effectiveness for trust and conversion                           | S (2h) | All panel work   | Feedback incorporated, no critical UX issues                               |

**Phase 3 Total Effort**: ~45 hours

---

## Phase 4: Chat UI Shell (Week 4)

**Impeccable Skills**: `frontend-design` (implementation), `arrange` (message layout), `animate` (transitions), `delight` (micro-interactions), `adapt` (responsive), `onboard` (empty/initial state)

### 4.1 — Chat Container & Messages

| Task                                                                                                  | Size   | Depends On    | Done Criteria                                                                          |
| ----------------------------------------------------------------------------------------------------- | ------ | ------------- | -------------------------------------------------------------------------------------- |
| Write unit tests for `ChatContainer` React component — renders header, message list, input area (TDD) | M (4h) | Phase 1 types | Tests cover empty state, message rendering, scroll behavior                            |
| Implement `ChatContainer` React component (SRP — orchestrates chat sub-components)                    | M (6h) | Tests         | All tests green, renders chat header, message area, input bar                          |
| Write unit tests for `ChatMessage` React component — user and assistant message bubbles (TDD)         | S (3h) | ChatContainer | Tests cover user vs assistant styling, markdown rendering, CTA buttons within messages |
| Implement `ChatMessage` React component                                                               | M (4h) | Tests         | Renders message content with proper bubble styling, supports inline CTAs               |
| Write unit tests for `ChatHeader` React component — scope description and language indicator (TDD)    | S (2h) | ChatContainer | Tests verify header text renders from i18n props                                       |
| Implement `ChatHeader` React component                                                                | S (2h) | Tests         | Displays assistant scope description, bilingual                                        |

### 4.2 — Input & Prompt Chips

| Task                                                                                                  | Size    | Depends On    | Done Criteria                                                                        |
| ----------------------------------------------------------------------------------------------------- | ------- | ------------- | ------------------------------------------------------------------------------------ |
| Write unit tests for `ChatInput` React component — text input, send button, character limit (TDD)     | S (3h)  | ChatContainer | Tests cover typing, submit, empty validation, input sanitization                     |
| Implement `ChatInput` React component (SRP — only input handling)                                     | M (4h)  | Tests         | Text input with send button, `onSubmit(sanitizedMessage)` callback, XSS-safe         |
| Write unit tests for `PromptChips` React component — starter prompts and contextual suggestions (TDD) | S (3h)  | ChatContainer | Tests verify chip rendering, click-to-inject behavior, disappear after first message |
| Implement `PromptChips` React component                                                               | S (3h)  | Tests         | Renders bilingual chips from content provider, fires `onChipClick(prompt)`           |
| Write unit tests for `TypingIndicator` React component — assistant thinking animation (TDD)           | XS (1h) | ChatContainer | Tests verify render and accessibility                                                |
| Implement `TypingIndicator` React component                                                           | XS (1h) | Tests         | Animated dots with `aria-live="polite"` announcement                                 |

### 4.3 — Chat Shell Integration & Polish

| Task                                                                                                 | Size   | Depends On          | Done Criteria                                                   |
| ---------------------------------------------------------------------------------------------------- | ------ | ------------------- | --------------------------------------------------------------- |
| Create `ChatPanel.astro` wrapper — fetches translations, composes React chat island                  | M (4h) | All chat components | Astro wrapper follows existing pattern, `client:load` directive |
| Apply `onboard` skill — design compelling initial empty state with welcome message and starter chips | S (3h) | ChatPanel           | First-visit experience feels guided, not blank                  |
| Apply `animate` skill — message appear transitions, chip hover effects, send button feedback         | M (4h) | ChatPanel           | Framer Motion animations smooth (60fps), not distracting        |
| Apply `delight` skill — micro-interactions on chip selection, message send, CTA hover                | S (3h) | Animations          | Interactions feel responsive and polished                       |
| Apply `adapt` skill — chat fills available space on mobile, proper keyboard handling                 | M (4h) | ChatPanel           | Mobile keyboard doesn't obscure input, scroll behavior correct  |
| Write Playwright tests — chat shell renders on desktop and mobile, chips clickable, input functional | M (5h) | Responsive chat     | E2E tests pass on both viewports, visual snapshots captured     |

**Phase 4 Total Effort**: ~59 hours

---

## Phase 5: Chat Assistant Service Layer (Week 5)

**Impeccable Skills**: `harden` (error handling, resilience), `extract` (reusable service patterns)

### 5.1 — OpenRouter Integration

| Task                                                                                                    | Size   | Depends On           | Done Criteria                                                                                        |
| ------------------------------------------------------------------------------------------------------- | ------ | -------------------- | ---------------------------------------------------------------------------------------------------- |
| Write unit tests for `OpenRouterClient` — API call construction, response parsing, error handling (TDD) | M (5h) | Phase 1 interfaces   | Tests mock HTTP responses (success, rate-limit, timeout, malformed), all green                       |
| Implement `OpenRouterClient` (SRP — only API communication)                                             | M (5h) | Tests                | Sends properly formatted requests, parses streaming/non-streaming responses, handles all error codes |
| Write unit tests for API key management — secure loading from environment, validation (TDD)             | S (2h) | OpenRouterClient     | Tests verify key not exposed to client, loaded from server-side env                                  |
| Implement secure API route (Astro API endpoint or Netlify function) for proxying chat requests          | M (5h) | Key management tests | Server-side endpoint proxies to OpenRouter, API key never reaches client bundle                      |

### 5.2 — ChatAssistantService Implementation

| Task                                                                                                       | Size   | Depends On       | Done Criteria                                                                                 |
| ---------------------------------------------------------------------------------------------------------- | ------ | ---------------- | --------------------------------------------------------------------------------------------- |
| Write unit tests for `ChatAssistantService` — message sending, response handling, conversation state (TDD) | M (6h) | OpenRouterClient | Tests cover: send message, receive response, maintain history, handle errors, enforce scope   |
| Implement `ChatAssistantService` (SRP — mediates UI ↔ API, DIP — depends on abstractions)                  | L (8h) | Tests            | All tests green, manages conversation state, delegates to orchestrator for scope/guidance     |
| Write unit tests for system prompt construction — bilingual, scope-constrained, injection-resistant (TDD)  | M (4h) | Service          | Tests verify system prompt includes scope boundaries, language context, service content       |
| Implement system prompt builder — constructs scoped instructions from content provider                     | M (4h) | Tests            | System prompt dynamically built from content, never exposed to user                           |
| Apply `harden` skill — error recovery, timeout handling, graceful degradation, retry with backoff          | M (4h) | Service          | Network failures show user-friendly message, no crashes, automatic retry for transient errors |
| Apply `extract` skill — extract reusable HTTP client patterns, error handling utilities (DRY)              | S (3h) | Hardened service | Common patterns extracted to shared utilities                                                 |

**Phase 5 Total Effort**: ~46 hours

---

## Phase 6: Conversation Orchestration & Summary (Week 6)

**Impeccable Skills**: `clarify` (response quality), `harden` (injection protection), `distill` (summary clarity)

### 6.1 — Scope Enforcement & Guided Flows

| Task                                                                                            | Size   | Depends On         | Done Criteria                                                                    |
| ----------------------------------------------------------------------------------------------- | ------ | ------------------ | -------------------------------------------------------------------------------- |
| Write unit tests for `ScopeEnforcer` — classifies intents as allowed, vague, or blocked (TDD)   | M (5h) | Phase 1 interfaces | Tests cover 75+ prompt scenarios: service queries, off-topic, injection attempts |
| Implement `ScopeEnforcer` (SRP — only scope classification)                                     | M (5h) | Tests              | Correctly classifies intents, redirects out-of-scope toward service discovery    |
| Write unit tests for `GuidedFlowManager` — tracks conversation stage, suggests follow-ups (TDD) | M (5h) | ScopeEnforcer      | Tests verify flow progression: project type → users → goals → timeline → summary |
| Implement `GuidedFlowManager` (SRP — only flow progression logic)                               | M (5h) | Tests              | Tracks current stage, returns contextual follow-up prompts, works in EN + ES     |
| Write unit tests for `CTAInjector` — determines when and which CTA to insert in responses (TDD) | S (3h) | GuidedFlowManager  | Tests verify CTA appears after qualified signals, not too early or too often     |
| Implement `CTAInjector` (SRP — only CTA placement logic)                                        | S (3h) | Tests              | Inserts Calendly booking or email CTA at natural conversation points             |

### 6.2 — Lead Extraction & Project Summary

| Task                                                                                                         | Size   | Depends On             | Done Criteria                                                          |
| ------------------------------------------------------------------------------------------------------------ | ------ | ---------------------- | ---------------------------------------------------------------------- |
| Write unit tests for `LeadExtractor` — extracts project type, users, goals, timeline from conversation (TDD) | M (4h) | GuidedFlowManager      | Tests verify extraction from various conversation patterns             |
| Implement `LeadExtractor` (SRP — only attribute extraction)                                                  | M (4h) | Tests                  | Extracts `LeadAttributes` from conversation history, bilingual         |
| Write unit tests for `SummaryGenerator` — produces project summary from lead attributes (TDD)                | M (4h) | LeadExtractor          | Tests verify summary includes solution type, timeline, price range     |
| Implement `SummaryGenerator`                                                                                 | M (4h) | Tests                  | Generates formatted bilingual summary, includes recommended next steps |
| Apply `distill` skill — ensure generated summaries are concise and actionable                                | S (2h) | Summary implementation | Summaries stripped of filler, focused on decision-useful information   |
| Apply `clarify` skill — review all guided prompts and redirects for clarity                                  | S (2h) | All orchestration      | Follow-up prompts clear, redirects feel helpful not restrictive        |

### 6.3 — Prompt Injection Protection

| Task                                                                                                | Size   | Depends On          | Done Criteria                                                                        |
| --------------------------------------------------------------------------------------------------- | ------ | ------------------- | ------------------------------------------------------------------------------------ |
| Write unit tests for `InputSanitizer` — validates, sanitizes, filters user input (TDD)              | M (4h) | —                   | Tests cover XSS vectors, injection patterns, oversized input, special characters     |
| Implement `InputSanitizer` (SRP — only input cleaning)                                              | S (3h) | Tests               | Sanitizes HTML, limits length, filters known injection patterns                      |
| Write unit tests for instruction isolation — system prompt cannot be overridden by user input (TDD) | S (3h) | SystemPromptBuilder | Tests verify 99%+ injection attempts fail to change assistant behavior               |
| Implement instruction isolation layer — separates system context from user turns                    | S (3h) | Tests               | User input wrapped in delimiters, system instructions isolated, refusal paths active |

**Phase 6 Total Effort**: ~59 hours

---

## Phase 7: Integration & Security Hardening (Week 7, first half)

**Impeccable Skills**: `harden` (full resilience pass), `audit` (security + accessibility check)

### 7.1 — Full Component Integration

| Task                                                                                                 | Size   | Depends On      | Done Criteria                                                                               |
| ---------------------------------------------------------------------------------------------------- | ------ | --------------- | ------------------------------------------------------------------------------------------- |
| Integrate `TrustPanel` + `ChatPanel` into two-panel layout on `index.astro` (or new consultant page) | M (6h) | Phases 3–6      | Both panels render side-by-side on desktop, stacked on mobile                               |
| Wire `ServiceItem` click → chat prompt injection across component boundaries                         | M (4h) | Integration     | Clicking a service in left panel populates chat input and submits                           |
| Wire `ChatAssistantService` → `ConversationOrchestrator` → React UI state flow                       | M (5h) | Integration     | Full round-trip: user sends → service processes → orchestrator scopes → UI renders response |
| Write integration tests covering cross-component data flow                                           | M (6h) | Wiring complete | Tests verify: panel click → chat message, chat response → CTA render, summary generation    |

### 7.2 — Human Verification & Security

| Task                                                                                  | Size   | Depends On     | Done Criteria                                                                              |
| ------------------------------------------------------------------------------------- | ------ | -------------- | ------------------------------------------------------------------------------------------ |
| Write unit tests for human verification gate (Cloudflare Turnstile or hCaptcha) (TDD) | S (3h) | —              | Tests verify: chat blocked before verification, allowed after, token validated server-side |
| Implement human verification — gate chat access behind bot-mitigation control         | M (5h) | Tests          | Turnstile/hCaptcha widget renders, token sent with first chat request, server validates    |
| Write unit tests for rate limiting — requests per session, per IP (TDD)               | S (3h) | API endpoint   | Tests verify: requests within limit succeed, over-limit returns 429                        |
| Implement rate limiting on API endpoint                                               | S (3h) | Tests          | Rate limit enforced server-side, user sees friendly "slow down" message                    |
| Apply `harden` skill — full resilience pass across all components                     | M (4h) | All integrated | Error boundaries on React components, graceful fallbacks, no unhandled exceptions          |
| Apply `audit` skill — security and accessibility audit                                | M (4h) | Hardened       | No critical security issues, WCAG 2.1 AA compliance, OWASP top 10 addressed                |

**Phase 7 Total Effort**: ~43 hours

---

## Phase 8: i18n Parity & Responsive Polish (Week 7, second half)

**Impeccable Skills**: `adapt` (responsive refinement), `polish` (final quality pass), `normalize` (design system alignment), `critique` (UX evaluation)

### 8.1 — i18n Flow Parity

| Task                                                                                                        | Size   | Depends On    | Done Criteria                                           |
| ----------------------------------------------------------------------------------------------------------- | ------ | ------------- | ------------------------------------------------------- |
| Verify EN and ES parity for all chat content: starter prompts, guided follow-ups, summaries, error messages | M (4h) | Phase 7       | Automated test confirms every EN key has ES counterpart |
| Write Playwright tests for full EN conversation flow — starter chip → guided questions → summary            | M (5h) | i18n verified | E2E test completes full flow in English on desktop      |
| Write Playwright tests for full ES conversation flow — same journey in Spanish                              | M (5h) | EN tests      | E2E test completes full flow in Spanish on desktop      |
| Verify language detection from `Accept-Language` header works correctly for chat content                    | S (2h) | Both flows    | Correct language loads based on browser setting         |

### 8.2 — Responsive & Visual Polish

| Task                                                                                               | Size   | Depends On     | Done Criteria                                                                       |
| -------------------------------------------------------------------------------------------------- | ------ | -------------- | ----------------------------------------------------------------------------------- |
| Apply `adapt` skill — final responsive refinement for mobile chat experience                       | M (4h) | Phase 7        | Mobile layout tested: chat input above keyboard, smooth scrolling, panel accessible |
| Apply `normalize` skill — align all new components with existing design system tokens and patterns | M (4h) | Adapt pass     | All spacing, colors, typography use design tokens, no arbitrary values              |
| Apply `polish` skill — final alignment, spacing, consistency micro-fixes                           | M (4h) | Normalize pass | Pixel-perfect alignment, consistent padding, no visual glitches                     |
| Write Playwright tests for mobile viewport — complete flow on 375×812                              | M (5h) | Polish pass    | Mobile E2E passes, visual regression snapshots stable                               |
| Write Playwright tests for tablet viewport — complete flow on 768×1024                             | S (3h) | Mobile tests   | Tablet layout renders correctly, panel behavior appropriate                         |
| Apply `critique` skill — final UX evaluation across all viewports                                  | S (3h) | All responsive | No critical UX issues, conversion path clear on all devices                         |

**Phase 8 Total Effort**: ~39 hours

---

## Phase 9: Performance & Accessibility Audit (Week 8, first half)

**Impeccable Skills**: `optimize` (performance), `audit` (comprehensive quality), `distill` (bundle reduction)

### 9.1 — Performance Optimization

| Task                                                                                       | Size   | Depends On       | Done Criteria                                                              |
| ------------------------------------------------------------------------------------------ | ------ | ---------------- | -------------------------------------------------------------------------- |
| Measure baseline Lighthouse scores for consultant page                                     | S (2h) | Phase 8          | Baseline recorded for Performance, Accessibility, Best Practices, SEO      |
| Apply `optimize` skill — bundle analysis, code splitting, lazy loading for chat components | M (5h) | Baseline         | Chat components loaded efficiently, no unnecessary JS in initial bundle    |
| Optimize OpenRouter response latency — streaming responses, optimistic UI updates          | M (4h) | Optimize pass    | Median response latency ≤2.5s, typing indicator shows immediately          |
| Apply `distill` skill — remove unused code, minimize bundle size                           | S (3h) | Optimization     | Bundle size reduced, no dead code in production build                      |
| Verify Lighthouse scores ≥90 across all categories                                         | S (2h) | All optimization | Lighthouse Performance ≥90, Accessibility ≥90, Best Practices ≥90, SEO ≥90 |

### 9.2 — Comprehensive Audit

| Task                                                                                                                | Size   | Depends On   | Done Criteria                                                                       |
| ------------------------------------------------------------------------------------------------------------------- | ------ | ------------ | ----------------------------------------------------------------------------------- |
| Apply `audit` skill — full technical quality audit (accessibility, performance, theming, responsive, anti-patterns) | M (6h) | Phase 8      | Scored report generated with P0–P3 severity ratings                                 |
| Fix all P0 (critical) and P1 (high) issues from audit                                                               | M (6h) | Audit report | All critical and high issues resolved                                               |
| Verify WCAG 2.1 AA compliance — keyboard navigation, screen reader, color contrast, focus management                | M (4h) | P0/P1 fixes  | All interactive elements keyboard-accessible, screen reader announces state changes |
| Run full test suite — unit, integration, E2E — all green                                                            | S (2h) | All fixes    | `pnpm test` and Playwright both pass with zero failures                             |

**Phase 9 Total Effort**: ~34 hours

---

## Phase 10: Launch Readiness (Week 8, second half)

**Impeccable Skills**: `polish` (final pass), `harden` (production resilience)

### 10.1 — Pre-Launch Verification

| Task                                                                               | Size   | Depends On       | Done Criteria                                               |
| ---------------------------------------------------------------------------------- | ------ | ---------------- | ----------------------------------------------------------- |
| Run scope-adherence benchmark — 75+ prompts across allowed, vague, blocked intents | M (4h) | Phase 9          | ≥95% of responses stay within defined service scope         |
| Run prompt-injection benchmark — injection test cases                              | S (3h) | Scope benchmark  | ≥99% of injection attempts fail to override assistant scope |
| Run guided-conversation scenarios — 40+ scenarios across personas                  | M (5h) | Scope benchmark  | ≥85% reach valid next-step recommendation within 6 turns    |
| Evaluate project summary quality — 30+ generated summaries                         | M (4h) | Guided scenarios | ≥90% include solution type, timeline, price range           |
| Verify EN/ES parity in benchmarks                                                  | S (2h) | All benchmarks   | Both languages pass same quality thresholds                 |

### 10.2 — Production Deployment

| Task                                                                                                    | Size   | Depends On          | Done Criteria                                                                   |
| ------------------------------------------------------------------------------------------------------- | ------ | ------------------- | ------------------------------------------------------------------------------- |
| Configure production environment variables — OpenRouter API key, Turnstile site key, Calendly URL       | S (2h) | All benchmarks pass | Environment variables set in Netlify dashboard, documented                      |
| Apply `polish` skill — absolute final quality pass                                                      | S (3h) | Env config          | No visual or functional issues remaining                                        |
| Apply `harden` skill — production resilience: error monitoring, fallback messages, graceful degradation | S (3h) | Polish pass         | Production error paths tested, fallbacks render cleanly                         |
| Run production build and preview locally                                                                | S (2h) | Hardened            | `pnpm run build && pnpm run preview` — no errors, site functional               |
| Deploy to Netlify production                                                                            | S (1h) | Local preview       | Site live, no build errors, DNS resolving                                       |
| Post-launch smoke test — verify full flow on production URL                                             | S (2h) | Deployed            | Chat loads, messages send/receive, booking CTA works, both languages functional |
| Set up monitoring — error tracking, API health, response latency                                        | S (3h) | Smoke test          | Monitoring active, alerts configured for failures                               |

**Phase 10 Total Effort**: ~34 hours

---

## Dependencies Visualization

```
Phase 1: Foundation ──────────────────────────────────────────────┐
  ├── Types & Interfaces                                          │
  ├── Design Tokens Extension                                     │
  └── Testing Infrastructure (Vitest mocks + Playwright setup)    │
       │                                                          │
       ▼                                                          │
Phase 2: Content Layer ───────────────────────────────────────┐   │
  ├── ContentProvider + Static JSON                            │   │
  ├── i18n Key Updates (en.json, es.json)                      │   │
  └── Content Validation Tests                                 │   │
       │                                                       │   │
       ├───────────────────────┐                               │   │
       ▼                       ▼                               │   │
Phase 3: Left Panel      Phase 4: Chat UI Shell                │   │
  ├── TrustPanel            ├── ChatContainer                  │   │
  ├── ServiceItem           ├── ChatMessage                    │   │
  ├── TrustSignals          ├── ChatInput                      │   │
  ├── PanelCTA              ├── PromptChips                    │   │
  └── Responsive adapt      └── Responsive adapt               │   │
       │                       │                               │   │
       │                       ▼                               │   │
       │                  Phase 5: Service Layer               │   │
       │                    ├── OpenRouterClient               │   │
       │                    ├── ChatAssistantService           │   │
       │                    └── System Prompt Builder          │   │
       │                       │                               │   │
       │                       ▼                               │   │
       │                  Phase 6: Orchestration               │   │
       │                    ├── ScopeEnforcer                  │   │
       │                    ├── GuidedFlowManager              │   │
       │                    ├── CTAInjector                    │   │
       │                    ├── LeadExtractor                  │   │
       │                    ├── SummaryGenerator               │   │
       │                    └── InputSanitizer                 │   │
       │                       │                               │   │
       └───────────────────────┤                               │   │
                               ▼                               │   │
                          Phase 7: Integration & Security      │   │
                            ├── Two-panel layout wiring        │   │
                            ├── Cross-component data flow      │   │
                            ├── Human verification gate        │   │
                            └── Rate limiting                  │   │
                               │                               │   │
                               ▼                               │   │
                          Phase 8: i18n & Polish               │   │
                            ├── EN/ES parity tests             │   │
                            ├── Responsive refinement          │   │
                            └── Visual polish                  │   │
                               │                               │   │
                               ▼                               │   │
                          Phase 9: Audit & Optimization        │   │
                            ├── Lighthouse optimization        │   │
                            ├── Accessibility compliance       │   │
                            └── Full audit + fixes             │   │
                               │                               │   │
                               ▼                               │   │
                          Phase 10: Launch                     │   │
                            ├── Benchmarks (scope, injection)  │   │
                            ├── Production deploy              │   │
                            └── Post-launch monitoring         │   │
```

**Critical Path**: Phase 1 → Phase 2 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10

**Parallelizable**: Phase 3 (Left Panel) and Phase 4 (Chat UI Shell) can run in parallel after Phase 2.

---

## Risks & Mitigation

| Risk                                                                                    | Impact | Probability | Mitigation                                                                                                            |
| --------------------------------------------------------------------------------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| **Scope drift** — assistant becomes generic chatbot, weakens conversion                 | High   | Medium      | Strict scope enforcement with 75-prompt benchmark; ScopeEnforcer tested in Phase 6; ongoing benchmark runs            |
| **Bot traffic** — consumes model budget, distorts analytics                             | High   | High        | Cloudflare Turnstile gate in Phase 7; rate limiting; abuse monitoring post-launch                                     |
| **Prompt injection** — user overrides assistant behavior or extracts system prompts     | High   | Medium      | Input sanitization + instruction isolation in Phase 6; 99% benchmark threshold; refusal paths                         |
| **Model quality vs cost** — cheapest model fails quality/safety expectations            | Medium | Medium      | Benchmark all candidate models before selection; define minimum quality gate; fallback to next-cheapest passing model |
| **Model hallucination** — fabricates pricing, capabilities, or timelines                | High   | Medium      | All factual content sourced from structured JSON, not generated; system prompt constrains to known content            |
| **Mobile UX degradation** — two-panel layout doesn't translate to small screens         | Medium | Medium      | Mobile-first responsive design from Phase 3; dedicated mobile Playwright tests; collapsible panel approach            |
| **EN/ES quality divergence** — one language gets better responses or flows              | Medium | Low         | Mirrored test coverage for both languages; parity validation in Phase 8; bilingual benchmarks in Phase 10             |
| **API latency** — OpenRouter response time exceeds 2.5s threshold                       | Medium | Medium      | Streaming responses for perceived speed; typing indicator; latency monitoring; model selection considers speed        |
| **Test maintenance burden** — TDD overhead slows development                            | Low    | Medium      | Test utilities and mock factories built in Phase 1; DRY test patterns; well-sized tests (not over-testing)            |
| **SSG constraint** — chat requires server-side API proxy, Netlify static hosting limits | Medium | Low         | Netlify Functions or Edge Functions for API proxy; evaluate serverless cold-start impact                              |
| **Dependency on external services** — OpenRouter, Turnstile, or Calendly downtime       | Medium | Low         | Graceful degradation: show fallback CTA if chat unavailable; error boundaries on all externals                        |
| **Bundle size increase** — chat components significantly increase page weight           | Medium | Medium      | Code splitting in Phase 9; `client:visible` for non-critical components; tree-shaking verification                    |

---

## Resource Allocation

| Role                | Hours/Week | Weeks Active | Key Responsibilities                                                              |
| ------------------- | ---------- | ------------ | --------------------------------------------------------------------------------- |
| Full-Stack Engineer | 40–45h     | Weeks 1–8    | Architecture, React components, service layer, orchestration, testing, deployment |

**Total Effort Estimate**: ~433 hours across 8 weeks

### Three-Point Estimation

| Scenario        | Hours | Weeks    |
| --------------- | ----- | -------- |
| **Optimistic**  | 350h  | 7 weeks  |
| **Most Likely** | 433h  | 8 weeks  |
| **Pessimistic** | 550h  | 10 weeks |

**Expected** = (350 + 4×433 + 550) / 6 = **439 hours**

Buffer included: ~20% contingency factored into pessimistic estimate.

---

## Impeccable Skills Application Map

| Phase             | Skills Applied                                                           | Purpose                                                                            |
| ----------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1 — Foundation    | `frontend-design`, `extract`, `teach-impeccable`                         | Project context, type system extraction, design context setup                      |
| 2 — Content       | `clarify`, `harden`                                                      | UX copy quality, i18n edge cases                                                   |
| 3 — Left Panel    | `frontend-design`, `arrange`, `typeset`, `colorize`, `adapt`, `critique` | Implementation, layout, typography, color, responsive, UX review                   |
| 4 — Chat UI       | `frontend-design`, `arrange`, `animate`, `delight`, `adapt`, `onboard`   | Implementation, layout, transitions, micro-interactions, responsive, initial state |
| 5 — Service Layer | `harden`, `extract`                                                      | Error resilience, reusable patterns                                                |
| 6 — Orchestration | `clarify`, `harden`, `distill`                                           | Response quality, injection protection, summary clarity                            |
| 7 — Integration   | `harden`, `audit`                                                        | Full resilience, security + a11y audit                                             |
| 8 — i18n & Polish | `adapt`, `polish`, `normalize`, `critique`                               | Responsive refinement, final quality, design alignment, UX review                  |
| 9 — Audit         | `optimize`, `audit`, `distill`                                           | Performance, comprehensive quality, bundle reduction                               |
| 10 — Launch       | `polish`, `harden`                                                       | Final quality, production resilience                                               |

---

## Testing Strategy Summary

### Unit Tests (Vitest + React Testing Library)

| Category                                                                                   | Coverage Target | Written In |
| ------------------------------------------------------------------------------------------ | --------------- | ---------- |
| React UI components (TrustPanel, ChatContainer, ChatMessage, ChatInput, PromptChips, etc.) | ≥95% branch     | Phases 3–4 |
| ChatAssistantService                                                                       | ≥95% branch     | Phase 5    |
| ScopeEnforcer, GuidedFlowManager, CTAInjector                                              | ≥95% branch     | Phase 6    |
| LeadExtractor, SummaryGenerator                                                            | ≥90% branch     | Phase 6    |
| InputSanitizer, system prompt builder                                                      | ≥95% branch     | Phase 6    |
| ContentProvider, content validation                                                        | ≥90% branch     | Phase 2    |
| Type guards and validators                                                                 | 100% branch     | Phase 1    |

### Integration Tests (Vitest)

| Flow                                                    | Written In |
| ------------------------------------------------------- | ---------- |
| Panel service click → chat prompt injection → response  | Phase 7    |
| User message → service → orchestrator → response render | Phase 7    |
| Guided flow progression → summary generation            | Phase 7    |
| Human verification → chat access grant                  | Phase 7    |

### E2E Tests (Playwright)

| Flow                                                            | Viewports       | Written In |
| --------------------------------------------------------------- | --------------- | ---------- |
| Full EN conversation: chip → guided flow → summary → CTA        | Desktop, Mobile | Phase 8    |
| Full ES conversation: same journey                              | Desktop, Mobile | Phase 8    |
| Panel interaction: service click → chat injection               | Desktop         | Phase 8    |
| Mobile navigation: panel toggle, chat scroll, keyboard handling | Mobile          | Phase 8    |
| Tablet: panel behavior, layout adaptation                       | Tablet          | Phase 8    |
| Error states: network failure, rate limit, verification failure | Desktop         | Phase 7    |

### Benchmark Tests (Custom)

| Benchmark                     | Count           | Threshold                        | Written In |
| ----------------------------- | --------------- | -------------------------------- | ---------- |
| Scope adherence prompts       | 75+             | ≥95% in-scope                    | Phase 10   |
| Prompt injection attempts     | Included in 75+ | ≥99% blocked                     | Phase 10   |
| Guided conversation scenarios | 40+             | ≥85% reach next-step in ≤6 turns | Phase 10   |
| Project summary evaluations   | 30+             | ≥90% include all required fields | Phase 10   |

---

## Definition of Done (Project Level)

- [ ] All unit tests pass (`pnpm test`)
- [ ] All Playwright E2E tests pass on desktop (1280×720), tablet (768×1024), and mobile (375×812)
- [ ] Lighthouse scores ≥90 across Performance, Accessibility, Best Practices, SEO
- [ ] WCAG 2.1 AA compliance verified
- [ ] Scope-adherence benchmark ≥95%
- [ ] Prompt-injection benchmark ≥99% blocked
- [ ] Guided-conversation scenarios ≥85% successful
- [ ] Project summary quality ≥90%
- [ ] EN/ES parity confirmed across all flows
- [ ] Median response latency ≤2.5s
- [ ] Human verification gate active
- [ ] Rate limiting active
- [ ] No raw chat transcripts persisted beyond session
- [ ] API key not exposed in client bundle
- [ ] ESLint + Prettier pass (`pnpm run lint:fix && pnpm run format`)
- [ ] TypeScript strict mode — no `any` types (`pnpm run astro:check`)
- [ ] Production build succeeds (`pnpm run build`)
- [ ] Deployed to Netlify, smoke test passing

---

## Weekly Checkpoints

- **End of each phase**: All phase tests green, linting passes, code reviewed
- **After Phases 3–4**: Visual review of panel and chat UI across viewports
- **After Phase 7**: Full security review, integration tests complete
- **After Phase 9**: Audit report reviewed, all P0/P1 issues resolved
- **After Phase 10**: Benchmarks pass, production deployed, monitoring active

---

## File Structure (New Files)

```
src/
├── lib/
│   └── chat/
│       ├── types.ts                    → Core interfaces (Phase 1)
│       ├── content/
│       │   ├── services.json           → Bilingual service catalog (Phase 2)
│       │   ├── company.json            → Company facts + trust signals (Phase 2)
│       │   └── prompts.json            → Starter chips + follow-ups (Phase 2)
│       ├── ContentProvider.ts          → Content access abstraction (Phase 2)
│       ├── ChatAssistantService.ts     → UI ↔ API mediator (Phase 5)
│       ├── OpenRouterClient.ts         → API communication (Phase 5)
│       ├── SystemPromptBuilder.ts      → Scoped prompt construction (Phase 5)
│       ├── ScopeEnforcer.ts            → Intent classification (Phase 6)
│       ├── GuidedFlowManager.ts        → Conversation stage tracking (Phase 6)
│       ├── CTAInjector.ts              → CTA placement logic (Phase 6)
│       ├── LeadExtractor.ts            → Attribute extraction (Phase 6)
│       ├── SummaryGenerator.ts         → Project summary creation (Phase 6)
│       ├── InputSanitizer.ts           → Input validation + XSS protection (Phase 6)
│       └── __tests__/
│           ├── types.test.ts           → Type guard tests (Phase 1)
│           ├── ContentProvider.test.ts  → Content tests (Phase 2)
│           ├── ChatAssistantService.test.ts (Phase 5)
│           ├── OpenRouterClient.test.ts (Phase 5)
│           ├── ScopeEnforcer.test.ts   (Phase 6)
│           ├── GuidedFlowManager.test.ts (Phase 6)
│           ├── CTAInjector.test.ts     (Phase 6)
│           ├── LeadExtractor.test.ts   (Phase 6)
│           ├── SummaryGenerator.test.ts (Phase 6)
│           └── InputSanitizer.test.ts  (Phase 6)
├── components/
│   ├── TrustPanel.astro                → Panel Astro wrapper (Phase 3)
│   ├── ChatPanel.astro                 → Chat Astro wrapper (Phase 4)
│   └── react/
│       ├── chat/
│       │   ├── ChatContainer.tsx       → Chat orchestrator (Phase 4)
│       │   ├── ChatMessage.tsx         → Message bubbles (Phase 4)
│       │   ├── ChatHeader.tsx          → Scope description (Phase 4)
│       │   ├── ChatInput.tsx           → Text input + send (Phase 4)
│       │   ├── PromptChips.tsx         → Starter/contextual chips (Phase 4)
│       │   ├── TypingIndicator.tsx     → Loading animation (Phase 4)
│       │   └── __tests__/
│       │       ├── ChatContainer.test.tsx
│       │       ├── ChatMessage.test.tsx
│       │       ├── ChatInput.test.tsx
│       │       ├── PromptChips.test.tsx
│       │       └── TypingIndicator.test.tsx
│       ├── panel/
│       │   ├── TrustPanel.tsx          → Panel root (Phase 3)
│       │   ├── ServiceItem.tsx         → Clickable service (Phase 3)
│       │   ├── TrustSignals.tsx        → Trust badges (Phase 3)
│       │   ├── PanelCTA.tsx            → Booking + contact CTAs (Phase 3)
│       │   └── __tests__/
│       │       ├── TrustPanel.test.tsx
│       │       ├── ServiceItem.test.tsx
│       │       ├── TrustSignals.test.tsx
│       │       └── PanelCTA.test.tsx
│       └── verification/
│           ├── HumanVerification.tsx   → Turnstile/hCaptcha (Phase 7)
│           └── __tests__/
│               └── HumanVerification.test.tsx
├── pages/
│   └── api/
│       └── chat.ts                     → Server-side API proxy (Phase 5)
tests/
├── e2e/
│   ├── consultant-desktop.spec.ts      → Desktop E2E flows (Phase 8)
│   ├── consultant-mobile.spec.ts       → Mobile E2E flows (Phase 8)
│   ├── consultant-tablet.spec.ts       → Tablet E2E flows (Phase 8)
│   └── consultant-errors.spec.ts       → Error state E2E (Phase 7)
├── benchmarks/
│   ├── scope-adherence.bench.ts        → 75+ prompt benchmark (Phase 10)
│   ├── prompt-injection.bench.ts       → Injection test cases (Phase 10)
│   ├── guided-flows.bench.ts           → 40+ scenario benchmark (Phase 10)
│   └── summary-quality.bench.ts        → 30+ summary evaluation (Phase 10)
playwright.config.ts                     → Playwright configuration (Phase 1)
```

---

## Success Metrics (from PRD)

| Metric                          | Target                 | Measurement                               |
| ------------------------------- | ---------------------- | ----------------------------------------- |
| Consultation booking conversion | ≥4% of unique visitors | Analytics tracking on Calendly CTA clicks |
| Qualified lead completion       | ≥20% of chat sessions  | Sessions reaching summary generation      |
| Engaged conversation length     | ≥4 user turns          | Average turns per session                 |
| Project summary generation      | ≥15% of chat sessions  | Summary generated events                  |
| Response latency (median)       | ≤2.5 seconds           | Server-side timing measurement            |
