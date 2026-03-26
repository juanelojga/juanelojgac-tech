import React, { useCallback, useEffect, useRef } from "react";

import type { ChatMessage as ChatMessageType, StarterPrompt } from "../../../lib/chat/types";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import PromptChips from "./PromptChips";
import TypingIndicator from "./TypingIndicator";

export interface ChatContainerTranslations {
  readonly headerTitle: string;
  readonly headerSubtitle: string;
  readonly inputPlaceholder: string;
  readonly inputSend: string;
  readonly inputCharacterLimit: string;
  readonly welcomeMessage: string;
  readonly typingText: string;
  readonly chipsLabel: string;
  readonly chatRegionLabel: string;
  readonly messageListLabel: string;
}

export interface ChatContainerProps {
  readonly messages: readonly ChatMessageType[];
  readonly starterPrompts: readonly StarterPrompt[];
  readonly isTyping: boolean;
  readonly error: string | null;
  readonly onSendMessage: (message: string) => void;
  readonly translations: ChatContainerTranslations;
}

export default function ChatContainer({
  messages,
  starterPrompts,
  isTyping,
  error,
  onSendMessage,
  translations,
}: ChatContainerProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  // Scroll to bottom when new messages arrive or typing starts
  useEffect(() => {
    if (typeof messageEndRef.current?.scrollIntoView === "function") {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isTyping]);

  const handleChipClick = useCallback(
    (prompt: string) => {
      onSendMessage(prompt);
    },
    [onSendMessage]
  );

  return (
    <section
      role="region"
      aria-label={translations.chatRegionLabel}
      data-testid="chat-container"
      className="bg-chat-panel-bg flex h-full flex-col"
    >
      <ChatHeader title={translations.headerTitle} subtitle={translations.headerSubtitle} />

      {/* Message Area */}
      <div
        role="log"
        aria-label={translations.messageListLabel}
        aria-live="polite"
        data-testid="chat-message-list"
        className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4"
      >
        {/* Conversation messages */}
        <div className="mx-auto max-w-[var(--spacing-chat-message-max-width)] space-y-3">
          {/* Welcome message when no conversation messages */}
          {!hasMessages && (
            <div className="flex justify-start">
              <div className="bg-chat-bubble-assistant text-chat-bubble-assistant-text max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3">
                <p className="text-sm leading-relaxed">{translations.welcomeMessage}</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <TypingIndicator typingText={translations.typingText} />
            </div>
          )}
        </div>

        {/* Scroll anchor */}
        <div ref={messageEndRef} />
      </div>

      {/* Error Alert */}
      {error && (
        <div role="alert" className="bg-coral-lightest text-coral-dark px-4 py-2.5 text-sm">
          {error}
        </div>
      )}

      {/* Prompt Chips — visible only when no messages */}
      <PromptChips
        chips={starterPrompts}
        onChipClick={handleChipClick}
        label={translations.chipsLabel}
        visible={!hasMessages}
      />

      {/* Input Area */}
      <ChatInput
        placeholder={translations.inputPlaceholder}
        sendLabel={translations.inputSend}
        characterLimitLabel={translations.inputCharacterLimit}
        onSubmit={onSendMessage}
        disabled={isTyping}
      />
    </section>
  );
}
