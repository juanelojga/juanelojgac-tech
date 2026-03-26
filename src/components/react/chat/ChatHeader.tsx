import React from "react";

export interface ChatHeaderProps {
  readonly title: string;
  readonly subtitle: string;
}

export default function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  return (
    <header role="banner" className="bg-chat-panel-header-bg text-chat-panel-header-text px-5 py-4">
      <h2 className="font-sora text-base font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed opacity-80">{subtitle}</p>
    </header>
  );
}
