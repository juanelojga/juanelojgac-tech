import React from "react";

export interface PanelCTAProps {
  readonly bookingLabel: string;
  readonly bookingUrl: string;
  readonly contactLabel: string;
  readonly contactEmail: string;
}

export default function PanelCTA({
  bookingLabel,
  bookingUrl,
  contactLabel,
  contactEmail,
}: PanelCTAProps) {
  return (
    <div data-testid="panel-cta" className="flex flex-col gap-2.5">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-chat-cta-primary text-chat-cta-primary-text hover:bg-chat-cta-primary-hover focus-visible:ring-chat-input-focus-border flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {bookingLabel}
      </a>
      <a
        href={`mailto:${contactEmail}`}
        className="border-chat-chip-border bg-chat-panel-bg text-tarawera hover:border-tarawera hover:bg-chat-chip-hover-bg focus-visible:ring-chat-input-focus-border flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {contactLabel}
      </a>
    </div>
  );
}
