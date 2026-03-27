# Redesign Phase 5 Implementation Plan: AI Assistant Visual Redesign

**Source**: REDESIGN_IMPLEMENTATION_PLAN.md — Phase 5
**Generated**: 2026-03-27
**Status**: Planning Complete
**Impeccable Skills**: frontend-design, colorize, adapt, harden, distill

## Success Criteria

- [ ] ConsultantSection.astro has dark premium container (`bg-midnight`, `rounded-3xl`, `border-white/5`)
- [ ] TrustPanel.tsx has glassmorphism panel, dark premium colors, accent-cyan hover states
- [ ] All chat UI components restyled with dark surfaces, glassmorphism, accent-cyan focus rings
- [ ] Chat UI tokens in tailwind.css updated to dark palette values
- [ ] All existing chat functionality preserved (send, receive, error, retry, typing, chips, CTAs, verification)
- [ ] EN/ES content displays correctly
- [ ] `pnpm test` passes, `pnpm run astro:check` passes, `pnpm run build` succeeds

## Dependency Graph

```
Phase 1 (Foundation) ── complete ✅
     │
     ├──> 5.4 Chat token updates (independent — can start first)
     │         │
     ├──> 5.1 ConsultantSection restyle (depends on Phase 1 only)
     │         │
     │         ├──> 5.2 TrustPanel restyle (depends on 5.1)
     │         │
     │         └──> 5.3 Chat UI restyle (depends on 5.1, 5.4)
     │
     └──> Tests (after all styling changes)
```

## Implementation Groups

### Group 1: Chat Token Updates (Sequential — Foundation)

| #   | Task                                         | Files                     | Skills   | Depends On | Done Criteria                                                          | Est. |
| --- | -------------------------------------------- | ------------------------- | -------- | ---------- | ---------------------------------------------------------------------- | ---- |
| 1   | Update chat UI design tokens to dark palette | `src/styles/tailwind.css` | colorize | Phase 1    | Token values point to dark colors, components using tokens auto-update | 30m  |

### Group 2: Section Container Restyle (Sequential)

| #   | Task                                          | Files                                            | Skills                    | Depends On   | Done Criteria                                   | Est. |
| --- | --------------------------------------------- | ------------------------------------------------ | ------------------------- | ------------ | ----------------------------------------------- | ---- |
| 2   | Restyle ConsultantSection.astro outer section | `src/components/ConsultantSection.astro`         | frontend-design, colorize | 5.4, Phase 1 | Dark bg, rounded-3xl container, padding updated | 30m  |
| 3   | Restyle ConsultantLayout.tsx container        | `src/components/react/chat/ConsultantLayout.tsx` | frontend-design, colorize | 5.1          | Dark border, shadow, glassmorphism container    | 30m  |

### Group 3: Left Panel Restyle (Sequential)

| #   | Task                       | Files                                     | Skills                           | Depends On | Done Criteria                                       | Est. |
| --- | -------------------------- | ----------------------------------------- | -------------------------------- | ---------- | --------------------------------------------------- | ---- |
| 4   | Restyle TrustPanel.tsx     | `src/components/react/TrustPanel.tsx`     | frontend-design, colorize, adapt | 5.1        | Glassmorphism panel, dark text colors, accent hover | 45m  |
| 5   | Restyle OutcomePrompts.tsx | `src/components/react/OutcomePrompts.tsx` | frontend-design, colorize        | 5.2        | Glass chips, accent-cyan icons, dark text           | 30m  |
| 6   | Restyle ServiceItem.tsx    | `src/components/react/ServiceItem.tsx`    | frontend-design, colorize        | 5.2        | Dark hover states, bright text, accent-cyan arrow   | 20m  |
| 7   | Restyle TrustSignals.tsx   | `src/components/react/TrustSignals.tsx`   | frontend-design, colorize        | 5.2        | Dark surfaces, accent-cyan stat values              | 20m  |
| 8   | Restyle PanelCTA.tsx       | `src/components/react/PanelCTA.tsx`       | frontend-design, colorize        | 5.2        | Gradient primary CTA, ghost secondary, dark theme   | 20m  |

### Group 4: Chat UI Restyle (Parallel with Group 3)

| #   | Task                                      | Files                                              | Skills                    | Depends On | Done Criteria                              | Est. |
| --- | ----------------------------------------- | -------------------------------------------------- | ------------------------- | ---------- | ------------------------------------------ | ---- |
| 9   | Restyle ChatHeader.tsx                    | `src/components/react/chat/ChatHeader.tsx`         | frontend-design           | 5.1, 5.4   | Dark surface header with bright text       | 15m  |
| 10  | Restyle ChatContainer.tsx welcome message | `src/components/react/chat/ChatContainer.tsx`      | frontend-design           | 5.4        | Dark panel bg, bright welcome text         | 15m  |
| 11  | Restyle ChatMessage.tsx bubbles           | `src/components/react/chat/ChatMessage.tsx`        | frontend-design, colorize | 5.4        | User = accent-cyan, Assistant = glass dark | 15m  |
| 12  | Restyle ChatInput.tsx                     | `src/components/react/chat/ChatInput.tsx`          | frontend-design, colorize | 5.4        | Dark input, accent focus ring, bright text | 15m  |
| 13  | Restyle PromptChips.tsx                   | `src/components/react/chat/PromptChips.tsx`        | frontend-design           | 5.4        | Glass chips with accent-cyan hover border  | 15m  |
| 14  | Restyle GroupedPromptChips.tsx            | `src/components/react/chat/GroupedPromptChips.tsx` | frontend-design           | 5.4        | Glass chips, bright group labels           | 15m  |
| 15  | Restyle TypingIndicator.tsx               | `src/components/react/chat/TypingIndicator.tsx`    | frontend-design           | 5.4        | Dark bubble, muted dots                    | 10m  |
| 16  | Restyle ChatErrorBoundary.tsx             | `src/components/react/chat/ChatErrorBoundary.tsx`  | frontend-design, harden   | 5.4        | Dark error panel, accent colors            | 15m  |
| 17  | Restyle HumanVerification.tsx             | `src/components/react/chat/HumanVerification.tsx`  | frontend-design           | 5.4        | Dark verification panel, accent colors     | 15m  |

### Group 5: Test Updates

| #   | Task                             | Files               | Skills | Depends On | Done Criteria                                | Est. |
| --- | -------------------------------- | ------------------- | ------ | ---------- | -------------------------------------------- | ---- |
| 18  | Update tests for new class names | Multiple test files | —      | All above  | All tests pass with updated class assertions | 1h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                | Impact | Mitigation                                                                                    |
| ----------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| Tests break from class name changes | Medium | Update test assertions to match new classes. Most chat tests test functionality, not styling. |
| Token updates cascade unexpectedly  | Low    | Tokens only used by chat components. Visual-only changes.                                     |
| Chat functionality regression       | High   | Only change Tailwind classes. Never modify state, props, callbacks, or logic.                 |
