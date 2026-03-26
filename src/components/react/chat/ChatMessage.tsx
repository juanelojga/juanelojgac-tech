import React from "react";

import type { ChatMessage as ChatMessageType, InlineCTA } from "../../../lib/chat/types";

export interface ChatMessageProps {
  readonly message: ChatMessageType;
}

function CTAButton({ cta }: { readonly cta: InlineCTA }) {
  const isPrimary = cta.type === "booking";
  return (
    <a
      href={cta.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
        isPrimary
          ? "bg-chat-cta-primary hover:bg-chat-cta-primary-hover text-chat-cta-primary-text"
          : "bg-chat-cta-secondary hover:bg-chat-cta-secondary-hover text-chat-cta-secondary-text"
      }`}
    >
      {cta.label}
    </a>
  );
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const hasCTAs = message.ctas && message.ctas.length > 0;

  return (
    <div
      data-testid={`message-${message.id}`}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <article
        data-testid={`message-bubble-${message.id}`}
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-chat-bubble-user text-chat-bubble-user-text rounded-br-sm"
            : "bg-chat-bubble-assistant text-chat-bubble-assistant-text rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

        {hasCTAs && (
          <div data-testid={`message-ctas-${message.id}`} className="mt-3 flex flex-wrap gap-2">
            {message.ctas!.map((cta) => (
              <CTAButton key={`${cta.type}-${cta.url}`} cta={cta} />
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
