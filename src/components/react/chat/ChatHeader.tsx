import React from "react";

export interface ChatHeaderProps {
  readonly title: string;
  readonly subtitle: string;
  readonly scopeDescription?: string;
}

export default function ChatHeader({ title, subtitle, scopeDescription }: ChatHeaderProps) {
  return (
    <header className="bg-chat-panel-header-bg text-chat-panel-header-text px-4 py-3 sm:px-5 sm:py-4">
      <h2 className="font-sora text-base font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed opacity-80">{subtitle}</p>
      {scopeDescription && (
        <p
          data-testid="chat-scope-description"
          className="mt-1.5 text-xs leading-relaxed opacity-60"
        >
          {scopeDescription}
        </p>
      )}
    </header>
  );
}
