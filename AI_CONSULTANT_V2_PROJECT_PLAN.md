# Project Plan: Consultant Experience V2

**Goal**: Rebuild the consultant area into a premium guided consulting funnel with a branded page shell (sticky header, hero, footer), redesigned outcome-first left rail, branded chat UX with grouped prompts, live assistant integration replacing the current stub, softer guardrail messaging, and full bilingual parity — driving conversion through a polished, trust-building experience.

**Timeline**: 5 weeks (7 phases)
**Team**: 1 full-stack engineer (AI + frontend)
**Constraints**: Existing Astro v6 + React 19 + Tailwind v4 stack; SSG on Netlify; 786 passing unit tests + 90 E2E tests as baseline; no new backend infrastructure; EN + ES parity mandatory; all 9 prior phases (foundation through performance audit) complete and stable.

**Baseline**: Phases 1–9 delivered a fully typed, tested, bilingual consultant experience with Turnstile verification, rate limiting, content provider, chat UI shell, and conversation orchestration modules. The chat send flow is still a placeholder — `handleSendMessage` in `ConsultantLayout.tsx` creates messages and simulates typing but makes no API call. The page has no header, hero, or footer.

---

## Milestones

| #   | Milestone                         | Target     | Owner    | Success Criteria                                                                                                                      |
| --- | --------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Content Model & i18n Contract     | End Week 1 | Engineer | All new copy keys defined in both en.json and es.json; content provider extended; prop shapes finalized for all redesigned components |
| 2   | Page Shell — Header, Hero, Footer | End Week 1 | Engineer | Sticky bilingual header with logo + EN/ES switch, short hero section, minimal footer — all Astro, server-rendered                     |
| 3   | Left Rail Redesign                | End Week 2 | Engineer | TrustPanel rebuilt outcome-first: business outcomes → lighter services → trust signals → CTAs; prompt injection preserved             |
| 4   | Chat UX Redesign                  | End Week 3 | Engineer | ChatContainer, ChatHeader, ChatInput redesigned with branded copy, grouped prompt chips, welcome state, helper text, scope messaging  |
| 5   | Live Assistant Integration        | End Week 4 | Engineer | `handleSendMessage` wired to ChatAssistantService; in-scope, out-of-scope redirect, error, and typing states all functional           |
| 6   | Responsive Verification & Polish  | Mid Week 5 | Engineer | Mobile chat-first, sticky header compresses, panel toggle accessible, desktop chat always visible; no layout regressions              |
| 7   | Test Updates & Final Validation   | End Week 5 | Engineer | E2E + unit tests updated for redesign; astro:check, lint, build clean; accessibility/performance audits pass                          |

---

## Dependencies Visualization

```
Phase 1 (Content Model) ──┬──> Phase 2 (Page Shell)
                           ├──> Phase 3 (Left Rail Redesign)
                           └──> Phase 4 (Chat UX Redesign)
                                        │
                                        └──> Phase 5 (Live Assistant)
Phase 2 + 3 + 4 + 5 ──────────> Phase 6 (Responsive Polish)
Phase 6 ───────────────────────> Phase 7 (Tests & Validation)
```

**Critical Path**: Phase 1 → Phase 4 → Phase 5 → Phase 6 → Phase 7
**Parallel Work**: Phases 2, 3, 4 can run concurrently after Phase 1.

---

## Phase 1: Content Model & i18n Contract (Week 1, Days 1–3)

**Purpose**: Define all new copy, extend the translation contract, expand the content provider, and lock prop shapes before any UI work begins. This phase blocks everything else.

### 1.1 — Define MVP Content Model

| Task                                                                                                                                                                   | Size   | Depends On | Done Criteria                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | -------------------------------------------------------------------- |
| Define content structure for page shell: header (logo, EN/ES switch labels), hero (headline, subheadline, CTA label), footer (copyright, links)                        | S (2h) | —          | Content model documented, key names agreed                           |
| Define outcome prompts for left rail: 4–6 business-outcome-first items (e.g., "Grow revenue with AI", "Automate operations") with bilingual labels and prompt payloads | M (4h) | —          | Outcome prompt structure defined with id, label, prompt, icon fields |
| Define grouped starter prompt categories for chat welcome: organize existing 5 starter prompts into 2–3 named groups (e.g., "Explore Services", "Get Started")         | S (3h) | —          | Group structure defined: `{ groupLabel, prompts[] }`                 |
| Define softer redirect messaging for out-of-scope queries: replace current redirect with empathetic language acknowledging the query while steering back               | S (2h) | —          | New redirect copy drafted in EN + ES                                 |
| Define chat helper text and scope description for input area                                                                                                           | S (1h) | —          | Helper text copy defined for both languages                          |

### 1.2 — Expand Translation Contract

| Task                                                                                               | Size     | Depends On              | Done Criteria                       |
| -------------------------------------------------------------------------------------------------- | -------- | ----------------------- | ----------------------------------- |
| Add `consultant.header.*` keys to en.json and es.json: logo alt, language switch labels, nav items | S (2h)   | Content model           | Both files updated symmetrically    |
| Add `consultant.hero.*` keys: headline, subheadline, CTA label                                     | S (2h)   | Content model           | Both files updated symmetrically    |
| Add `consultant.footer.*` keys: copyright, link labels                                             | S (1h)   | Content model           | Both files updated symmetrically    |
| Add `chat.outcomes.*` keys for left rail outcome prompts                                           | S (2h)   | Outcome prompts defined | Keys namespaced, both languages     |
| Add `chat.promptGroups.*` keys for grouped starter prompt labels                                   | S (1h)   | Groups defined          | Both files updated                  |
| Update `chat.messages.redirect` with softer redirect copy                                          | S (1h)   | Redirect copy defined   | Old redirect replaced in both files |
| Add `chat.input.helperText` and `chat.input.scopeDescription` keys                                 | S (1h)   | Helper text defined     | Both files updated                  |
| Run i18n parity test to verify EN/ES symmetry                                                      | XS (30m) | All keys added          | `i18n-parity.test.ts` passes        |

### 1.3 — Extend Content Provider & Lock Prop Shapes

| Task                                                                                                                                                                                                  | Size   | Depends On       | Done Criteria                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------- | -------------------------------------------------- |
| Add outcome prompts to `prompts.json` (both languages) with new `outcomePrompts` section                                                                                                              | M (4h) | Outcome model    | JSON validated against types                       |
| Add grouped prompt structure to `prompts.json`: `promptGroups` with `groupLabel` + `promptIds[]`                                                                                                      | S (2h) | Group model      | JSON validated                                     |
| Update softer redirect messaging in `prompts.json`                                                                                                                                                    | S (1h) | Redirect copy    | Old redirect replaced                              |
| Extend `StaticContentProvider` with `getOutcomePrompts(lang)` and `getPromptGroups(lang)` methods                                                                                                     | M (4h) | JSON updates     | Methods return frozen typed arrays                 |
| Write unit tests for new content provider methods (TDD)                                                                                                                                               | M (4h) | Provider methods | Tests cover EN + ES, empty/edge cases              |
| Define updated TypeScript interfaces for redesigned component props: `ConsultantHeaderProps`, `ConsultantHeroProps`, `ConsultantFooterProps`, updated `TrustPanelProps`, updated `ChatContainerProps` | M (4h) | All content      | Interfaces exported, no `any`, strict mode passing |

**Phase 1 Total Effort**: ~39 hours

---

## Phase 2: Page Shell — Header, Hero, Footer (Week 1, Days 3–5)

**Purpose**: Add page-level framing around the consultant surface. All Astro (server-rendered) to keep language shaping consistent. This runs in parallel with Phases 3 and 4 after Phase 1 completes.

### 2.1 — Sticky Header

| Task                                                                                                                                                                         | Size   | Depends On        | Done Criteria                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------- | ------------------------------------------------------------ |
| Create `ConsultantHeader.astro` — sticky header with logo from `/public/assets/logo/logo.png`, EN/ES language switch (links to `/` and `/es`), responsive collapse on mobile | M (6h) | Phase 1 i18n keys | Header renders logo, language switch works, sticks on scroll |
| Write unit tests for header rendering: logo present, language links correct, sticky positioning                                                                              | S (3h) | Header component  | Tests pass for both EN and ES                                |
| Mobile behavior: header compresses height on small screens, logo scales down, language switch remains accessible                                                             | S (2h) | Header component  | Touch targets ≥ 44px, no overflow                            |

### 2.2 — Hero Section

| Task                                                                                                                                                                      | Size   | Depends On        | Done Criteria                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------- | ----------------------------------------------- |
| Create `ConsultantHero.astro` — short hero block below header with headline, subheadline, and optional scroll-down CTA; uses brand typography (Sora headings, Inter body) | M (4h) | Phase 1 i18n keys | Hero renders bilingual copy, responsive spacing |
| Write unit tests for hero rendering                                                                                                                                       | S (2h) | Hero component    | Tests verify translated content renders         |

### 2.3 — Footer

| Task                                                                                                    | Size   | Depends On        | Done Criteria                             |
| ------------------------------------------------------------------------------------------------------- | ------ | ----------------- | ----------------------------------------- |
| Create `ConsultantFooter.astro` — minimal footer with copyright, contact link, and optional legal links | S (3h) | Phase 1 i18n keys | Footer renders bilingual copy, responsive |
| Write unit tests for footer rendering                                                                   | S (1h) | Footer component  | Tests pass for both languages             |

### 2.4 — Page Composition

| Task                                                                                                                     | Size     | Depends On           | Done Criteria                                                          |
| ------------------------------------------------------------------------------------------------------------------------ | -------- | -------------------- | ---------------------------------------------------------------------- |
| Update `index.astro` and `es.astro` to compose: ConsultantHeader → ConsultantHero → ConsultantSection → ConsultantFooter | M (4h)   | All shell components | Pages render full shell, existing consultant section untouched         |
| Update `Layout.astro` if needed for full-height layout with sticky header                                                | S (2h)   | Pages updated        | Layout supports new shell structure without breaking existing behavior |
| Adjust `ConsultantSection.astro` padding/spacing to account for header height offset                                     | S (2h)   | Shell composed       | Consultant section positioned correctly below header + hero            |
| Verify build and type checks pass                                                                                        | XS (30m) | All above            | `astro:check` and `pnpm run build` clean                               |

**Phase 2 Total Effort**: ~30 hours

---

## Phase 3: Left Rail Redesign (Week 2)

**Purpose**: Shift TrustPanel emphasis from service cards to business outcomes first, then lighter services, trust signals, and CTAs. Preserve prompt injection behavior.

### 3.1 — Outcome-First Architecture

| Task                                                                                                                                             | Size   | Depends On               | Done Criteria                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ------------------------ | ----------------------------------------------------------------------- |
| Write unit tests for new `OutcomePrompts` React component — renders outcome items, fires `onPromptInject` on click (TDD)                         | M (4h) | Phase 1 types + content  | Tests cover rendering, click behavior, accessibility                    |
| Implement `OutcomePrompts` React component — outcome-first section replacing old services header position                                        | M (5h) | Tests                    | Renders outcome prompts from content provider, styled with brand tokens |
| Update `TrustPanel.tsx` section ordering: (1) company identity, (2) OutcomePrompts, (3) lighter ServiceItem list, (4) TrustSignals, (5) PanelCTA | M (6h) | OutcomePrompts component | Panel renders in new order, all sections present                        |
| Write unit tests for updated TrustPanel composition and ordering                                                                                 | S (3h) | Updated TrustPanel       | Tests verify new section order and content                              |

### 3.2 — Styling & Integration

| Task                                                                                                            | Size     | Depends On         | Done Criteria                                           |
| --------------------------------------------------------------------------------------------------------------- | -------- | ------------------ | ------------------------------------------------------- |
| Style outcome prompts: visually distinct from service items (larger, bolder, icon-led) while using brand tokens | M (4h)   | OutcomePrompts     | Outcomes feel premium, differentiated from service list |
| De-emphasize service items: reduce to compact list style with subtle hover, not card-style                      | S (3h)   | TrustPanel updated | Services readable but secondary to outcomes             |
| Update `ConsultantSection.astro` to pass outcome prompts and new translations to TrustPanel                     | S (2h)   | All components     | Astro wrapper passes outcome data to React island       |
| Verify prompt injection still works: outcome click → message sent to chat, service click → message sent to chat | S (2h)   | Integration        | Both prompt paths fire correctly                        |
| Run existing TrustPanel tests + new tests                                                                       | XS (30m) | All above          | All tests pass                                          |

**Phase 3 Total Effort**: ~30 hours

---

## Phase 4: Chat UX Redesign (Week 3)

**Purpose**: Redesign chat presentation with branded copy, grouped prompt chips, clearer welcome state, helper text, and updated scope messaging. This can run in parallel with Phase 3 after Phase 1.

### 4.1 — Chat Header Redesign

| Task                                                                                          | Size   | Depends On     | Done Criteria                                               |
| --------------------------------------------------------------------------------------------- | ------ | -------------- | ----------------------------------------------------------- |
| Update `ChatHeader.tsx` with branded copy, scope description, and consultant identity styling | M (4h) | Phase 1 i18n   | Header feels branded, communicates consultant scope clearly |
| Write/update unit tests for ChatHeader changes                                                | S (2h) | Header updated | Tests verify new copy and structure                         |

### 4.2 — Welcome State & Grouped Prompts

| Task                                                                                                                                | Size   | Depends On         | Done Criteria                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------ | ---------------------------------------------------------------- |
| Write unit tests for `GroupedPromptChips` React component — renders prompts in labeled groups, fires `onSendMessage` on click (TDD) | M (4h) | Phase 1 types      | Tests cover group rendering, click behavior, empty groups        |
| Implement `GroupedPromptChips` React component — replaces flat `PromptChips` with categorized groups                                | M (6h) | Tests              | Renders prompt groups from content provider, styled consistently |
| Update `ChatContainer.tsx` welcome state: branded welcome message, grouped prompt chips, helper text below prompts                  | M (5h) | GroupedPromptChips | Welcome state feels polished and guided, not blank               |
| Write/update unit tests for ChatContainer welcome state changes                                                                     | S (3h) | Container updated  | Tests verify new welcome state composition                       |

### 4.3 — Input & Scope Messaging

| Task                                                                                                                                   | Size   | Depends On            | Done Criteria                                                |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------- | ------------------------------------------------------------ |
| Update `ChatInput.tsx`: add helper text below input area (scope guidance), update placeholder with new copy                            | S (3h) | Phase 1 i18n          | Input shows helper text, placeholder uses new bilingual copy |
| Update scope-redirect messaging in ChatContainer: softer language when user goes off-topic, empathetic redirect rather than hard block | S (3h) | Phase 1 redirect copy | Redirect messages feel helpful, not dismissive               |
| Write/update unit tests for ChatInput helper text and redirect messaging                                                               | S (2h) | Components updated    | Tests verify new text, both languages                        |

### 4.4 — Chat Integration

| Task                                                                                                | Size     | Depends On          | Done Criteria                                 |
| --------------------------------------------------------------------------------------------------- | -------- | ------------------- | --------------------------------------------- |
| Update `ChatPanel.astro` to pass new translations and grouped prompt data to ChatContainer          | S (2h)   | All chat components | Astro wrapper passes all new props correctly  |
| Update `ConsultantLayout.tsx` to pass grouped prompts and new translations through to ChatContainer | S (2h)   | ChatPanel updated   | Layout correctly threads new props            |
| Verify chat rendering on desktop and mobile                                                         | S (2h)   | All above           | Chat renders correctly, no visual regressions |
| Run all chat-related unit tests                                                                     | XS (30m) | All above           | All tests pass                                |

**Phase 4 Total Effort**: ~37 hours

---

## Phase 5: Live Assistant Integration (Week 4)

**Purpose**: Replace the placeholder send flow in ConsultantLayout with real assistant orchestration. This is the most critical integration phase.

### 5.1 — Wire ChatAssistantService

| Task                                                                                                              | Size   | Depends On              | Done Criteria                                                                    |
| ----------------------------------------------------------------------------------------------------------------- | ------ | ----------------------- | -------------------------------------------------------------------------------- |
| Replace `handleSendMessage` stub in `ConsultantLayout.tsx` with real call to `ChatAPIClient.sendMessage()`        | M (6h) | Phase 4 complete        | User messages sent to Netlify function, responses rendered as assistant messages |
| Wire `ScopeEnforcer` into send flow: classify intent before sending, handle out-of-scope with new softer redirect | M (5h) | handleSendMessage wired | In-scope → API call; out-of-scope → soft redirect message                        |
| Wire `GuidedFlowManager` for phase-based follow-up suggestions after assistant responses                          | M (4h) | Send flow working       | Follow-up prompts appear after assistant responds                                |
| Wire `CTAInjector` to inject booking/contact CTAs at appropriate conversation points                              | S (3h) | Flow manager working    | CTAs appear after sufficient conversation depth                                  |

### 5.2 — State Management & Error Handling

| Task                                                                                                         | Size   | Depends On         | Done Criteria                                                      |
| ------------------------------------------------------------------------------------------------------------ | ------ | ------------------ | ------------------------------------------------------------------ |
| Implement typing state: show TypingIndicator during API call, dismiss on response/error                      | S (2h) | Send flow wired    | Typing indicator appears during API call, disappears on response   |
| Implement error state: render error message on API failure (network, rate limit, server error), offer retry  | M (4h) | Send flow wired    | Error banner appears with retry button, clears on successful retry |
| Implement conversation state tracking: maintain `ConversationState` across messages, track phase progression | M (4h) | Flow manager wired | State persists across messages, phase transitions correctly        |
| Pass Turnstile token with chat API requests (from verification state)                                        | S (2h) | Send flow wired    | Token included in request headers, server validates                |

### 5.3 — Integration Testing

| Task                                                                                        | Size   | Depends On           | Done Criteria                                        |
| ------------------------------------------------------------------------------------------- | ------ | -------------------- | ---------------------------------------------------- |
| Write integration tests: verified user sends in-scope message → receives assistant response | M (5h) | All wiring complete  | Test verifies full flow with mocked API              |
| Write integration tests: out-of-scope message → soft redirect, no API call                  | S (3h) | Scope enforcer wired | Test verifies redirect path                          |
| Write integration tests: API error → error state rendered → retry clears error              | S (3h) | Error handling done  | Test verifies error + retry flow                     |
| Write integration tests: typing state shown during API call → dismissed on response         | S (2h) | Typing state done    | Test verifies typing indicator lifecycle             |
| Verify Netlify function handles new request format correctly                                | S (2h) | Token passing done   | Function processes requests, returns valid responses |

**Phase 5 Total Effort**: ~45 hours

---

## Phase 6: Responsive Verification & Polish (Week 5, Days 1–3)

**Purpose**: Ensure the complete redesigned experience works across all viewports. Mobile must be chat-first. Desktop chat must remain always visible. Sticky header must compress on small screens.

### 6.1 — Mobile Behavior

| Task                                                                                                                  | Size   | Depends On     | Done Criteria                                               |
| --------------------------------------------------------------------------------------------------------------------- | ------ | -------------- | ----------------------------------------------------------- |
| Verify mobile consultant experience is chat-first: chat panel takes primary viewport, left rail accessible via toggle | M (4h) | Phases 2–5     | Chat visible by default on mobile, panel collapsible        |
| Verify sticky header compresses on mobile: reduced height, scaled logo, language switch accessible                    | S (2h) | Phase 2 header | Header does not consume excessive viewport on small screens |
| Verify hero section collapses or simplifies on mobile                                                                 | S (2h) | Phase 2 hero   | Hero does not push chat out of initial viewport             |
| Verify chat input doesn't get obscured by mobile keyboard                                                             | S (2h) | Phase 4 input  | Input remains visible when virtual keyboard opens           |
| Test panel toggle accessibility on mobile: ARIA labels, keyboard operable, focus management                           | S (2h) | Phase 3 panel  | Toggle meets WCAG 2.1 AA                                    |

### 6.2 — Desktop Behavior

| Task                                                                                                      | Size   | Depends On  | Done Criteria                                            |
| --------------------------------------------------------------------------------------------------------- | ------ | ----------- | -------------------------------------------------------- |
| Verify chat panel always visible on desktop (≥1024px) — no toggle needed                                  | S (2h) | Phases 3–5  | Chat and panel both visible simultaneously on desktop    |
| Verify full-height layout: header + hero + consultant section + footer fill viewport without awkward gaps | M (4h) | All phases  | Layout fills viewport naturally, no excessive whitespace |
| Verify prompt injection from left rail to chat works with new outcome prompts on desktop                  | S (2h) | Phase 3 + 5 | Clicking outcome/service in panel sends message to chat  |

### 6.3 — Cross-Viewport Polish

| Task                                                                                                                  | Size   | Depends On          | Done Criteria                                             |
| --------------------------------------------------------------------------------------------------------------------- | ------ | ------------------- | --------------------------------------------------------- |
| Test all 5 Playwright viewports (mobile-small 320px, mobile 375px, tablet 768px, desktop 1280px, desktop-wide 1440px) | M (6h) | All responsive work | No layout breaks, overflow, or truncation on any viewport |
| Verify EN/ES language switch works from header: switches page, preserves viewport state                               | S (2h) | Phase 2 header      | Language switch navigates correctly on all viewports      |
| Touch target audit: all interactive elements ≥ 44px on mobile viewports                                               | S (2h) | All mobile work     | No undersized touch targets                               |

**Phase 6 Total Effort**: ~30 hours

---

## Phase 7: Test Updates & Final Validation (Week 5, Days 3–5)

**Purpose**: Update all test suites to cover the redesigned experience. Run full validation pipeline.

### 7.1 — E2E Test Updates

| Task                                                                                                                                                                         | Size   | Depends On | Done Criteria                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- | ---------------------------------------- |
| Update `consultant-desktop.spec.ts`: add tests for header, hero, footer, outcome prompts in rail, grouped prompt chips, live assistant response, redirect UX, CTA visibility | M (6h) | All phases | Desktop E2E covers new shell + chat flow |
| Update `consultant-mobile.spec.ts`: add tests for header compression, chat-first layout, panel toggle, mobile prompt interaction, live assistant on mobile                   | M (5h) | All phases | Mobile E2E covers responsive behavior    |
| Update `consultant-tablet.spec.ts`: add tests for tablet layout, header, panel behavior on medium viewports                                                                  | M (4h) | All phases | Tablet E2E covers intermediate viewport  |
| Add E2E test for language switch flow: EN header → click ES → Spanish page renders with Spanish copy                                                                         | S (3h) | Phase 2    | Language switch tested end-to-end        |
| Add E2E test for live assistant round-trip: send message → typing indicator → response rendered                                                                              | M (4h) | Phase 5    | Full assistant flow verified in E2E      |

### 7.2 — Unit Test Updates

| Task                                                                                                     | Size   | Depends On | Done Criteria                                             |
| -------------------------------------------------------------------------------------------------------- | ------ | ---------- | --------------------------------------------------------- |
| Update existing TrustPanel, ServiceItem, TrustSignals, PanelCTA tests for redesigned structure           | M (4h) | Phase 3    | All panel tests pass with new composition                 |
| Update existing ChatContainer, ChatHeader, ChatInput, PromptChips tests for redesigned UX                | M (4h) | Phase 4    | All chat tests pass with new grouped prompts, helper text |
| Update ConsultantLayout tests for live assistant integration (mocked API)                                | M (4h) | Phase 5    | Integration tests cover all 4 send paths                  |
| Add tests for new components: ConsultantHeader, ConsultantHero, ConsultantFooter (Astro container tests) | M (4h) | Phase 2    | New shell components have test coverage                   |

### 7.3 — Final Validation Pipeline

| Task                                                                  | Size     | Depends On        | Done Criteria                          |
| --------------------------------------------------------------------- | -------- | ----------------- | -------------------------------------- |
| Run `pnpm run astro:check` — zero type errors                         | XS (30m) | All code complete | Clean typecheck                        |
| Run `pnpm test` — all unit tests pass (existing + new)                | S (1h)   | All test updates  | Zero failures                          |
| Run `pnpm run test:coverage` — verify coverage does not regress       | S (1h)   | Tests passing     | Coverage ≥ previous baseline           |
| Run Playwright consultant suites on all viewports for EN and ES       | M (4h)   | E2E updated       | All E2E pass                           |
| Run `pnpm run lint:fix` and `pnpm run format`                         | XS (30m) | All code          | Zero lint errors                       |
| Run `pnpm run build` — clean production build                         | XS (30m) | All above         | Build succeeds, zero warnings          |
| Verify accessibility audit tests still pass                           | S (1h)   | Build clean       | WCAG 2.1 AA compliance maintained      |
| Verify performance audit tests still pass (bundle size within budget) | S (1h)   | Build clean       | Bundle size ≤ previous + 20K tolerance |

**Phase 7 Total Effort**: ~43 hours

---

## Risks & Mitigation

| Risk                                                             | Impact | Probability | Mitigation                                                                                                |
| ---------------------------------------------------------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------- |
| Assistant API latency causes poor UX                             | High   | Medium      | Show typing indicator immediately; consider constrained fallback response if API exceeds 8s timeout       |
| Content model changes cascade through many components            | High   | Medium      | Lock content model in Phase 1 before any UI work; use TypeScript strict mode to catch prop mismatches     |
| Grouped prompt chips increase ChatContainer complexity           | Medium | Medium      | Extract GroupedPromptChips as isolated component with own tests; compose into ChatContainer               |
| Sticky header + hero consume too much mobile viewport            | Medium | Low         | Design header to compress ≤ 48px on mobile; hero can auto-hide on scroll or collapse to single line       |
| Language switch breaks page state (verification, messages)       | Medium | Medium      | Language switch navigates to new page (SSG) — state reset is expected and acceptable for SSG              |
| Scope enforcer false positives increase with new outcome prompts | Medium | Low         | Test outcome prompt payloads against scope enforcer; ensure all outcome-related prompts pass verification |
| TrustPanel redesign breaks existing prompt injection flow        | High   | Low         | Test injection path explicitly in Phase 3; preserve existing `onPromptInject` callback interface          |

---

## Resource Allocation

| Role                | Hours/Week | Weeks Active | Key Responsibilities                     |
| ------------------- | ---------- | ------------ | ---------------------------------------- |
| Full-stack engineer | 40–50h     | Weeks 1–5    | All implementation, testing, integration |

**Total Effort**: ~254 hours across 5 weeks

---

## Scope Boundaries

### Included

- Premium header and footer shell with brand logo
- Hero framing section
- EN/ES language switch in header (link-based, SSG)
- Redesigned left rail (outcome-first)
- Branded chat UX with grouped prompt chips
- Live assistant integration (ChatAssistantService → Netlify function → OpenRouter)
- Softer out-of-scope redirect messaging
- Desktop always-visible chat behavior
- Mobile chat-first experience
- Full bilingual parity
- E2E + unit test updates
- Accessibility and performance regression checks

### Excluded

- Project Summary card (deferred to later phase)
- Analytics instrumentation
- CRM persistence or lead storage
- Session persistence (messages lost on page refresh — acceptable for SSG)
- Pricing discussion UI (handled via content provider + prompt updates, not UI changes)
- Any expansion beyond JuaneloJGAC Tech service guidance

---

## Verification Checklist

1. `pnpm run astro:check` — zero Astro and TypeScript errors
2. `pnpm test` — all unit tests pass (target: baseline + ~80 new tests)
3. `pnpm run test:coverage` — coverage does not regress from 786-test baseline
4. Playwright consultant specs pass across desktop, mobile, and tablet for EN and ES
5. Accessibility audit tests pass (WCAG 2.1 AA)
6. Performance audit tests pass (bundle size within budget)
7. `pnpm run build` — clean production build, zero warnings
8. Manual smoke: booking CTA, contact CTA, header language switch, desktop always-visible chat, mobile panel toggle, verification gate, in-scope reply, off-topic redirect
