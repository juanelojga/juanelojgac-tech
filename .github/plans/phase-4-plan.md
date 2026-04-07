# Phase 4 Implementation Plan: Chat UI Shell

**Source**: AI_CONSULTANT_PROJECT_PLAN.md — Phase 4
**Generated**: 2026-03-25
**Status**: Planning Complete

## Success Criteria

- [ ] ChatContainer renders header, message list, input area; tests cover empty state, message rendering, scroll behavior
- [ ] ChatMessage renders user & assistant bubbles with proper styling, markdown rendering, CTA buttons; tests green
- [ ] ChatHeader displays scope description from i18n props; tests verify rendering
- [ ] ChatInput has text input, send button, character limit, XSS-safe submit; tests cover typing, submit, validation, sanitization
- [ ] PromptChips renders bilingual chips from content provider, fires onChipClick, disappears after first message; tests green
- [ ] TypingIndicator renders animated dots with aria-live="polite"; tests verify render and accessibility
- [ ] ChatPanel.astro wrapper fetches translations, composes React chat island with client:load
- [ ] Animations: message appear transitions, chip hover effects, send button feedback (60fps, not distracting)
- [ ] Responsive: chat fills available space on mobile, proper keyboard handling
- [ ] All verification passes: pnpm test, astro:check, lint:fix, build

## Dependency Graph

```
Phase 1 types + Phase 2 content → ChatContainer tests → ChatContainer impl
                                     │
                  ┌──────────────────┼────────────────────┐
                  ▼                  ▼                    ▼
        ChatMessage tests   ChatInput tests    ChatHeader tests
              │                   │                   │
              ▼                   ▼                   ▼
        ChatMessage impl   ChatInput impl      ChatHeader impl
                                 │
                  ┌──────────────┼──────────────┐
                  ▼                             ▼
        PromptChips tests            TypingIndicator tests
              │                             │
              ▼                             ▼
        PromptChips impl           TypingIndicator impl
                  │                         │
                  └────────┬────────────────┘
                           ▼
                    ChatPanel.astro (integration)
                           │
                    ┌──────┼──────┐
                    ▼      ▼      ▼
              Animations  Adapt  Onboard (empty state)
```

## Implementation Groups

### Group 1: ChatContainer (Sequential — Critical Path)

| #   | Task                              | Files                                                        | Depends On    | Done Criteria                                                                                                         | Est. |
| --- | --------------------------------- | ------------------------------------------------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------- | ---- |
| 1.1 | Write ChatContainer tests (TDD)   | `src/components/react/chat/__tests__/ChatContainer.test.tsx` | Phase 1 types | Tests cover: empty state with welcome + chips, message list rendering, scroll behavior, typing indicator, error state | 4h   |
| 1.2 | Implement ChatContainer component | `src/components/react/chat/ChatContainer.tsx`                | 1.1           | Orchestrates header, message list, input bar; renders welcome state with chips; manages scroll-to-bottom              | 6h   |

### Group 2: Chat Sub-Components (Parallel Track A — after 1.2)

| #   | Task                    | Files                                                      | Depends On | Done Criteria                                                                         | Est. |
| --- | ----------------------- | ---------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- | ---- |
| 2.1 | Write ChatMessage tests | `src/components/react/chat/__tests__/ChatMessage.test.tsx` | 1.2        | Tests cover user vs assistant styling, CTA buttons within messages, timestamp display | 3h   |
| 2.2 | Implement ChatMessage   | `src/components/react/chat/ChatMessage.tsx`                | 2.1        | Renders user/assistant bubbles with design tokens, inline CTAs                        | 4h   |
| 2.3 | Write ChatHeader tests  | `src/components/react/chat/__tests__/ChatHeader.test.tsx`  | 1.2        | Tests verify header text from i18n, subtitle renders                                  | 2h   |
| 2.4 | Implement ChatHeader    | `src/components/react/chat/ChatHeader.tsx`                 | 2.3        | Displays title + subtitle from translations                                           | 2h   |

### Group 3: Input & Chips (Parallel Track B — after 1.2)

| #   | Task                        | Files                                                          | Depends On | Done Criteria                                                                     | Est. |
| --- | --------------------------- | -------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------- | ---- |
| 3.1 | Write ChatInput tests       | `src/components/react/chat/__tests__/ChatInput.test.tsx`       | 1.2        | Tests cover typing, submit, empty validation, character limit, sanitization       | 3h   |
| 3.2 | Implement ChatInput         | `src/components/react/chat/ChatInput.tsx`                      | 3.1        | Text input with send button, onSubmit callback, XSS-safe, character limit display | 4h   |
| 3.3 | Write PromptChips tests     | `src/components/react/chat/__tests__/PromptChips.test.tsx`     | 1.2        | Tests verify chip rendering, click-to-inject, disappear after first message       | 3h   |
| 3.4 | Implement PromptChips       | `src/components/react/chat/PromptChips.tsx`                    | 3.3        | Renders chips from starter prompts, fires onChipClick, hides when hasMessages     | 3h   |
| 3.5 | Write TypingIndicator tests | `src/components/react/chat/__tests__/TypingIndicator.test.tsx` | 1.2        | Tests verify render and aria-live="polite"                                        | 1h   |
| 3.6 | Implement TypingIndicator   | `src/components/react/chat/TypingIndicator.tsx`                | 3.5        | Animated dots, accessible announcement                                            | 1h   |

### Group 4: Integration & Polish (Sequential — after Groups 2 & 3)

| #   | Task                             | Files                            | Depends On          | Done Criteria                                                               | Est. |
| --- | -------------------------------- | -------------------------------- | ------------------- | --------------------------------------------------------------------------- | ---- |
| 4.1 | Create ChatPanel.astro wrapper   | `src/components/ChatPanel.astro` | All chat components | Fetches translations + content, hydrates React chat island with client:load | 4h   |
| 4.2 | Apply animations (framer-motion) | All chat components              | 4.1                 | Message appear transitions, chip hover, send feedback — 60fps               | 4h   |
| 4.3 | Apply responsive adapt           | All chat components              | 4.1                 | Mobile fills viewport, keyboard handling, scroll behavior correct           | 4h   |
| 4.4 | Design initial empty state       | ChatContainer.tsx                | 4.1                 | Welcome message + starter chips feel guided, not blank                      | 3h   |

## Verification Checklist

- [ ] `pnpm test` — all tests green
- [ ] `pnpm run astro:check` — no TypeScript errors
- [ ] `pnpm run lint:fix` — no lint errors
- [ ] `pnpm run build` — production build succeeds

## Risks & Mitigations

| Risk                                 | Impact | Mitigation                                                                |
| ------------------------------------ | ------ | ------------------------------------------------------------------------- |
| Scroll behavior complexity on mobile | Medium | Test with multiple viewports, use CSS scroll-snap or ref-based scrolling  |
| Framer-motion bundle size            | Low    | Use tree-shaking, import only needed modules                              |
| Keyboard obscuring input on mobile   | High   | Use visualViewport API for safe input positioning, test on real viewports |
| Character limit UX                   | Low    | Show remaining count, disable send when empty                             |
