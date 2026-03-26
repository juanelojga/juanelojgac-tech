import React from "react";

export interface TypingIndicatorProps {
  readonly typingText: string;
}

export default function TypingIndicator({ typingText }: TypingIndicatorProps) {
  return (
    <div
      data-testid="typing-indicator"
      className="bg-chat-bubble-assistant text-chat-bubble-assistant-text inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          data-testid="typing-dot"
          className="bg-chat-typing-dot inline-block h-2 w-2 animate-bounce rounded-full"
          style={{ animationDelay: `${i * 150}ms` }}
          aria-hidden="true"
        />
      ))}
      <span role="status" aria-live="polite" className="sr-only">
        {typingText}
      </span>
    </div>
  );
}
