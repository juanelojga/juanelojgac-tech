# Phase 4 Memory: Chat UI Shell

**Completed**: 2026-03-25
**Status**: ✅ Complete

## What Was Built

### Files Created

- `src/components/react/chat/ChatHeader.tsx` — Chat header displaying title + subtitle with design tokens
- `src/components/react/chat/ChatMessage.tsx` — User/assistant message bubbles with inline CTA buttons
- `src/components/react/chat/ChatInput.tsx` — Text input with send button, character limit, XSS sanitization via `sanitizeUserInput`
- `src/components/react/chat/PromptChips.tsx` — Starter prompt chips with click-to-inject behavior
- `src/components/react/chat/TypingIndicator.tsx` — Animated bouncing dots with `aria-live="polite"` for screen readers
- `src/components/react/chat/ChatContainer.tsx` — Orchestrator: composes header, message list, welcome state, chips, typing indicator, error alert, and input
- `src/components/ChatPanel.astro` — Astro wrapper fetching i18n translations + StaticContentProvider starter prompts, hydrates with `client:load`
- `src/components/react/chat/__tests__/ChatHeader.test.tsx` — 7 tests
- `src/components/react/chat/__tests__/ChatMessage.test.tsx` — 13 tests
- `src/components/react/chat/__tests__/ChatInput.test.tsx` — 20 tests
- `src/components/react/chat/__tests__/PromptChips.test.tsx` — 10 tests
- `src/components/react/chat/__tests__/TypingIndicator.test.tsx` — 7 tests
- `src/components/react/chat/__tests__/ChatContainer.test.tsx` — 16 tests

### Key Decisions

- **UI Shell only**: `ChatPanel.astro` passes `onSendMessage={() => {}}` — actual message handling deferred to Phase 5 (ChatAssistantService) and Phase 7 (integration wiring)
- **scrollIntoView guard**: Wrapped in `typeof ... === "function"` check since jsdom doesn't implement `scrollIntoView`
- **Sanitization at input boundary**: `ChatInput` calls `sanitizeUserInput` before firing `onSubmit`, preventing XSS at the source
- **PromptChips visibility**: Controlled by `visible` boolean prop; ChatContainer hides chips when messages exist

### Interfaces & Types

- `ChatHeaderProps` in `ChatHeader.tsx` — `{ title, subtitle }`
- `ChatMessageProps` in `ChatMessage.tsx` — `{ message: ChatMessage }`
- `ChatInputProps` in `ChatInput.tsx` — `{ placeholder, sendLabel, characterLimitLabel, onSubmit, disabled?, maxLength? }`
- `PromptChipsProps` in `PromptChips.tsx` — `{ chips: StarterPrompt[], onChipClick, label, visible }`
- `TypingIndicatorProps` in `TypingIndicator.tsx` — `{ typingText }`
- `ChatContainerTranslations` in `ChatContainer.tsx` — 10 translation keys
- `ChatContainerProps` in `ChatContainer.tsx` — `{ messages, starterPrompts, isTyping, error, onSendMessage, translations }`

### Tests

- 73 new tests across 6 test files covering: rendering, interaction (click, keyboard, submit), accessibility (roles, aria attributes), i18n (EN/ES variants), styling (design tokens), XSS protection, empty/error/disabled states, visibility toggling

## Architecture Notes

- All chat components are in `src/components/react/chat/` — separate from panel components in `src/components/react/`
- Follows the same pattern as TrustPanel: Astro wrapper → React island with `client:load`
- ChatContainer follows SRP — only orchestrates layout and delegates to sub-components
- ChatInput uses `sanitizeUserInput` from `src/lib/chat/validators.ts` (Phase 1)
- StarterPrompts come from `StaticContentProvider` (Phase 2)

## Dependencies on Future Phases

- Phase 5 depends on: `ChatContainerProps.onSendMessage` callback — will be wired to `ChatAssistantService`
- Phase 7 depends on: `ChatPanel.astro` and `TrustPanel.astro` — will be composed into two-panel layout with cross-component data flow (onPromptInject → chat input)

## Verification Results

```
=== Phase 4 Verification Summary ===
Static Analysis:
  - astro:check:  ✅ (0 errors, 0 warnings, 8 hints)
  - lint:         ✅ (0 errors, 0 warnings)
  - format:       ✅
  - build:        ✅ (1 page built)

Unit Tests:
  - Total:   346 tests
  - Passed:  346
  - Failed:  0
  - New:     73 tests (Phase 4)

Playwright E2E:
  - Skipped: UI shell only, no interactive integration yet

Verdict: PASS
```

### Code Review Summary

- Review model: Claude Opus 4.6 (self-review)
- Review file: `.github/plans/phase-4-review.md`
- Critical issues found: 0
- High issues found: 0
- Medium issues found: 1 — resolved: 1 (removed unused sendButtonLabel)
- Low issues found: 2 — resolved: 1, deferred: 1 (closure pattern acceptable)
