## Plan: Consultant Experience V2

Rebuild the current consultant area into a premium guided consulting funnel by separating page framing from chat mechanics, then integrating the existing assistant stack behind a redesigned UI. This plan keeps MVP focused on a polished bilingual shell, live scoped assistant behavior, and conversion-oriented structure while deferring the Project Summary card to a later phase.

**Steps**

1. Define the MVP content model for the new experience: sticky header with EN/ES language switch, logo usage from `/home/juanelojga/Code/juanelojgac-tech/public/assets/logo/logo.png`, hero copy, left-panel outcome prompts, trust copy, chat header, welcome message, grouped starter prompts, input helper text, redirect language, and footer content. This blocks all UI work because the React and Astro components depend on the final prop shape.
2. Expand the translation contract in `/home/juanelojga/Code/juanelojgac-tech/src/i18n/en.json` and `/home/juanelojga/Code/juanelojgac-tech/src/i18n/es.json` so every visible string for the new shell and chat behavior exists in both languages with matching structure. This can begin after step 1 and should complete before validation.
3. Add page-level structure around the consultant surface by composing a new sticky header, short hero section, and minimal footer around the existing consultant section. The header must include an EN/ES language switch and the brand logo from `/home/juanelojga/Code/juanelojgac-tech/public/assets/logo/logo.png`. This should stay in Astro so language shaping remains server-side and consistent with the current architecture.
4. Redesign the left rail in `/home/juanelojga/Code/juanelojgac-tech/src/components/react/TrustPanel.tsx` to shift emphasis from service cards to business outcomes first, then lighter services, trust signals, and CTAs. Preserve prompt injection behavior so outcome and service clicks still feed the chat flow.
5. Redesign the chat presentation in `/home/juanelojga/Code/juanelojgac-tech/src/components/react/chat/ChatContainer.tsx`, `/home/juanelojga/Code/juanelojgac-tech/src/components/react/chat/ChatHeader.tsx`, and `/home/juanelojga/Code/juanelojgac-tech/src/components/react/chat/ChatInput.tsx` with branded copy, grouped prompt chips, clearer welcome state, helper text, and updated scope messaging. This can run in parallel with step 4 once the copy model is fixed.
6. Replace the placeholder send flow in `/home/juanelojga/Code/juanelojgac-tech/src/components/react/chat/ConsultantLayout.tsx` with real assistant orchestration using `/home/juanelojga/Code/juanelojgac-tech/src/lib/chat/chat-assistant-service.ts` and `/home/juanelojga/Code/juanelojgac-tech/src/lib/chat/scope-enforcer.ts`. Handle four paths explicitly: verified in-scope send, verified out-of-scope redirect, assistant error state, and typing state.
7. Extend `/home/juanelojga/Code/juanelojgac-tech/src/lib/chat/content/static-content-provider.ts` and its backing content files so the UI can source new outcome prompts, refined trust facts, grouped starter prompts, and softer redirect messaging without hard-coded React text.
8. Verify responsive behavior deliberately: keep the mobile consultant experience chat-first, ensure the sticky header compresses appropriately on small screens, preserve accessible panel toggling rather than forcing desktop density into mobile, and keep the chat panel always visible on desktop viewports.
9. Update tests in `/home/juanelojga/Code/juanelojgac-tech/e2e/consultant-desktop.spec.ts`, `/home/juanelojga/Code/juanelojgac-tech/e2e/consultant-mobile.spec.ts`, and `/home/juanelojga/Code/juanelojgac-tech/e2e/consultant-tablet.spec.ts` plus relevant component and chat logic tests so the redesign is covered in both English and Spanish. Cover shell rendering, prompt injection, live assistant response path, redirect behavior, and CTA visibility.
10. Run final validation with Astro type checks, targeted chat and component tests, consultant E2E suites, and the existing accessibility and performance audits. Fix only regressions introduced by this scope.

**Relevant files**

- `/home/juanelojga/Code/juanelojgac-tech/src/components/ConsultantSection.astro` — current Astro bridge that should either compose or feed the redesigned shell
- `/home/juanelojga/Code/juanelojgac-tech/public/assets/logo/logo.png` — header logo asset for the redesigned consultant shell
- `/home/juanelojga/Code/juanelojgac-tech/src/components/react/chat/ConsultantLayout.tsx` — current placeholder orchestrator that must become the real interaction layer
- `/home/juanelojga/Code/juanelojgac-tech/src/components/react/TrustPanel.tsx` — left-panel redesign target
- `/home/juanelojga/Code/juanelojgac-tech/src/components/react/chat/ChatContainer.tsx` — message area and prompt/welcome composition
- `/home/juanelojga/Code/juanelojgac-tech/src/components/react/chat/ChatHeader.tsx` — branded consultant header
- `/home/juanelojga/Code/juanelojgac-tech/src/components/react/chat/ChatInput.tsx` — input scope guidance and helper UI
- `/home/juanelojga/Code/juanelojgac-tech/src/lib/chat/chat-assistant-service.ts` — live assistant integration
- `/home/juanelojga/Code/juanelojgac-tech/src/lib/chat/scope-enforcer.ts` — out-of-scope handling and redirect trigger
- `/home/juanelojga/Code/juanelojgac-tech/src/lib/chat/content/static-content-provider.ts` — source for services, prompts, trust signals, and redirects
- `/home/juanelojga/Code/juanelojgac-tech/src/i18n/en.json` — English source of truth for new copy
- `/home/juanelojga/Code/juanelojgac-tech/src/i18n/es.json` — Spanish parity for all new copy

**Verification**

1. Run `pnpm run astro:check` to validate Astro and React typing after prop and translation changes.
2. Run targeted Vitest coverage for consultant components and chat orchestration.
3. Run Playwright consultant specs across desktop, mobile, and tablet for EN and ES.
4. Re-run accessibility and performance audit tests to confirm the new shell does not regress quality.
5. Perform a manual smoke test for booking CTA behavior, contact CTA behavior, header language switching, desktop always-visible chat behavior, mobile panel behavior, verification gating, in-scope replies, and off-topic redirect UX.

**Decisions**

- Included in this plan: premium header and footer shell, hero framing, redesigned left rail, branded chat UX, header EN/ES language switch, desktop always-visible chat behavior, live assistant integration, softer guardrail messaging, bilingual parity, and test updates.
- Excluded from this plan: Project Summary card, analytics instrumentation, CRM persistence, and any expansion beyond JuaneloJGAC Tech service guidance.
- Recommended mobile behavior: keep chat as the primary surface and treat the left rail as supporting content, not equal-weight content. On desktop, the chat must remain persistently visible.

**Further Considerations**

1. If consultation conversion measurement is important immediately, add analytics as a follow-up plan rather than mixing it into this redesign scope.
2. If assistant latency proves unstable, introduce a constrained fallback response strategy without changing the layout or content model.
3. If the pricing discussion becomes more explicit later, that should be handled through content-provider and prompt updates rather than hard-coded UI copy.
