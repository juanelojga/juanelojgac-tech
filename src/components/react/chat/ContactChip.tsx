import React from "react";

export interface ContactChipProps {
  readonly label: string;
  readonly onClick: () => void;
}

export default function ContactChip({ label, onClick }: ContactChipProps) {
  return (
    <div className="border-white-10 shrink-0 border-t px-3 py-2 sm:px-4">
      <button
        type="button"
        onClick={onClick}
        data-testid="contact-chip"
        className="bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30 hover:bg-accent-cyan/20 hover:border-accent-cyan/50 inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
          <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
        </svg>
        {label}
      </button>
    </div>
  );
}
