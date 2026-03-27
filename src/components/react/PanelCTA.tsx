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
        className="from-accent-cyan to-accent-teal text-midnight hover:from-accent-cyan/90 hover:to-accent-teal/90 focus-visible:ring-accent-cyan flex items-center justify-center rounded-lg bg-gradient-to-r px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {bookingLabel}
      </a>
      <a
        href={`mailto:${contactEmail}`}
        className="border-white-10 bg-white-5 text-text-bright hover:border-accent-cyan/30 hover:bg-white-10 focus-visible:ring-accent-cyan flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {contactLabel}
      </a>
    </div>
  );
}
