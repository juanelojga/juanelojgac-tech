# Product Requirements Document: Landing Page to AI Consultant

## 1. Executive Summary

- **Problem Statement**: JuaneloJGAC Tech's current landing-page flow depends on visitors scrolling through sections, interpreting service offerings on their own, and deciding manually whether to reach out. That adds friction, weakens qualification, and misses the chance to demonstrate AI capability during the first interaction.
- **Proposed Solution**: Replace the scroll-first homepage with a bilingual conversational experience that combines a persistent trust-and-conversion panel with a guided AI consultant chat. The assistant will stay constrained to company services, pricing ranges, process, examples, and company information while driving qualified prospects toward a consultation.
- **Success Criteria**:
  - Consultation booking conversion rate from unique visitors reaches at least 4% within the first 90 days.
  - Qualified lead completion rate reaches at least 20% of chat sessions.
  - Average engaged conversation length reaches at least 4 user turns per session.
  - Project summary generation rate reaches at least 15% of chat sessions.
  - Median assistant response latency stays at or below 2.5 seconds in production.

## 2. User Experience & Functionality

- **User Personas**:
  - Startup founders who need fast validation, rough scoping, and a path to delivery.
  - SME owners and operators who want to automate workflows, marketing, or internal operations.
  - Technical or product leads who need confidence in implementation capability, timeline, and solution fit.
  - Warm prospects arriving from referrals, social media, or outbound campaigns who need a fast trust-building interaction.
- **User Stories**:
  - As a startup founder, I want to describe my idea in plain language so that I can understand what JuaneloJGAC Tech could build for me.
  - As an SME operator, I want guided prompts for automation, AI, and web-platform use cases so that I can identify the right service path quickly.
  - As a prospect, I want the assistant to stay focused on services, pricing ranges, examples, process, and company information so that the conversation remains relevant.
  - As a bilingual visitor, I want the experience to work in English and Spanish so that I can engage in my preferred language.
  - As a qualified lead, I want a concise project summary after the chat so that I can move into a consultation with clarity.
  - As a mobile user, I want the full experience to remain clear and usable on a small viewport so that I can engage from my phone.
- **Acceptance Criteria**:
  - The desktop layout presents a persistent left panel and a primary chat panel.
  - The left panel contains identity, compact service summaries, trust signals, and persistent CTAs.
  - The left-panel service items are clickable and inject predefined prompts into the chat.
  - The chat header clearly communicates that the assistant answers questions about services, pricing ranges, process, company information, and examples.
  - The initial state includes starter prompt chips for the main business intents.
  - Free-text input is supported with guided follow-up behavior for vague requests.
  - Out-of-scope prompts are redirected toward service discovery instead of answered as general knowledge.
  - The assistant can guide users through project type, target users, goals, timeline, and delivery expectations.
  - The assistant can generate a project summary with recommended solution type, indicative timeline, and price range.
  - Contextual CTAs for booking a consultation or contacting the agency appear naturally inside relevant responses.
  - The experience supports English and Spanish from MVP.
  - Raw chat transcripts are not persisted beyond the active session.
  - The chat is protected by a human-verification mechanism to reduce automated or bot-driven usage.
  - The system prevents prompt-injection attempts from changing the assistant's scope, behavior, or hidden instructions.
  - All interactive components are implemented in React.
  - The experience is validated for desktop and mobile viewport behavior before release.
  - Unit tests cover all interactive components and conversation logic.
  - Integration tests cover end-to-end flows across component boundaries.
  - E2E tests cover the primary conversion journeys on desktop and mobile.
  - Linting and unit tests run after each implementation iteration.
- **Non-Goals**:
  - Open-domain chatbot behavior.
  - General coding help or unrelated technical support.
  - Full CRM workflow management in the frontend.
  - Cross-session memory.
  - Detailed proposal generation or line-item quoting in MVP.
  - Payment, contract, or invoicing workflows.

## 3. AI System Requirements

- **Tool Requirements**:
  - A production LLM API for scoped conversational responses, routed through OpenRouter or an equivalent broker.
  - A chat assistant service layer that enforces scope, CTA patterns, and guided follow-up logic.
  - Session-only state management for recent turns, lead attributes, and project-summary generation.
  - A structured content source for bilingual company messaging, services, trust signals, pricing ranges, and examples.
  - Analytics events for chat starts, chip clicks, qualified flow completion, summary generation, and CTA clicks.
  - Calendly or equivalent booking integration for the primary CTA.
  - Email handoff for the secondary CTA.
  - A human-verification layer such as Cloudflare Turnstile, hCaptcha, or equivalent bot-mitigation control before or during chat access.
  - React-based chat UI components for the container, messages, chips, and input.
- **Evaluation Strategy**:
  - Build a scope-adherence benchmark with at least 75 prompts covering allowed, vague, and blocked intents.
  - Require at least 95% of benchmark responses to stay within the defined service scope.
  - Include prompt-injection test cases in the benchmark and require at least 99% of attempts to fail to override the assistant's allowed scope and system behavior.
  - Build at least 40 guided conversation scenarios across startup, SME, and uncertain-intent user paths.
  - Require at least 85% of scenarios to reach a valid next-step recommendation within 6 assistant turns.
  - Evaluate at least 30 generated project summaries and require at least 90% to include solution type, timeline, and price range without contradicting chat context.
  - Validate English and Spanish flow parity for starter prompts, blocked responses, and summary generation.
  - Measure median response latency and keep it at or below 2.5 seconds.

## 4. Technical Specifications

- **Architecture Overview**:
  - Astro renders the page shell, layout, SEO, and i18n wiring.
  - React islands own all interactive behavior, including prompt injection, chat state, guided branching, and CTA rendering.
  - A dedicated `ChatAssistantService` mediates between the UI and the model API.
  - Conversation orchestration applies constrained prompt rules and structured guidance to keep responses focused on agency services.
  - Session-only memory stores recent messages, extracted lead attributes, and the evolving summary.
  - A configuration layer provides bilingual service content, company facts, trust signals, and pricing ranges.
  - Testing follows a TDD-oriented workflow across unit, integration, and E2E layers.
- **Integration Points**:
  - OpenRouter as the model gateway for MVP.
  - Default response model must be the lowest-cost model available through OpenRouter that still passes the defined quality, scope-adherence, and prompt-injection benchmarks.
  - Calendly or equivalent consultation booking link.
  - Email CTA handoff.
  - Optional analytics platform for anonymous funnel measurement.
  - Existing Astro i18n dictionaries for English and Spanish.
  - Existing React, Tailwind, and motion tooling already present in the repository.
- **Security & Privacy**:
  - Do not persist raw chat transcripts after the session ends.
  - Sanitize and validate user input before rendering or sending it to the model API.
  - Enforce strict domain boundaries in the assistant to reduce prompt-injection success.
  - Add application-level prompt-injection protections, including input filtering, instruction isolation, scope-based response templates, and refusal or redirection paths for override attempts.
  - Do not expose internal prompts, system instructions, or implementation details to the user.
  - Minimize collection of personally identifiable information until the user takes an explicit contact action.
  - Limit analytics to event-level tracking where possible.
  - Require bot-mitigation controls so the chat is intended for human users only and cannot be used freely by automated agents.
  - Apply abuse protection and rate limiting once the production model is enabled.

## 5. Risks & Roadmap

- **Phased Rollout**:
  - MVP:
    - Responsive left-panel plus guided-chat layout.
    - Static starter prompts and free-text input.
    - Production AI integration with strict scope control.
    - Natural CTA injection inside responses.
    - Project summary generation.
    - English and Spanish support.
    - Unit test coverage for interactive components and conversation logic.
    - Integration and E2E coverage for desktop and mobile conversion flows.
  - v1.1:
    - Improved project-summary formatting and optional delivery/export behavior.
    - Better example retrieval and richer service-specific guided paths.
    - Analytics-informed CTA and prompt-chip optimization.
  - v2.0:
    - Quick Mode versus Guided Mode.
    - Traffic-source-aware personalization.
    - CRM or lead-routing integration if the sales process warrants it.
- **Technical Risks**:
  - Scope drift could turn the assistant into a generic chatbot and weaken conversion.
  - Bot traffic could consume model budget, distort analytics, and degrade lead quality without a human-verification gate.
  - The absolute cheapest available model could fail quality or safety expectations if cost is optimized without benchmark enforcement.
  - Model output could hallucinate pricing, delivery dates, or unsupported capabilities.
  - Mobile layout decisions could weaken usability if the persistent-panel concept is not adapted carefully.
  - English and Spanish flows could diverge in quality without mirrored test coverage.
  - Production AI latency or cost could degrade UX or ROI.
  - Weak test discipline could allow regressions in guided flows and CTA insertion.
