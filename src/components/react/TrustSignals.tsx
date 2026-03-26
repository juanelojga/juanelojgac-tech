import React from "react";

import type { TrustSignal } from "../../lib/chat/types";

export interface TrustSignalsProps {
  readonly signals: readonly TrustSignal[];
  readonly label: string;
}

function StatSignal({ signal }: { signal: TrustSignal }) {
  return (
    <li
      data-testid={`trust-signal-${signal.id}`}
      className="flex flex-col items-center text-center"
    >
      <span className="font-sora text-persian-green text-xl font-bold">{signal.value}</span>
      <span className="text-neutral-dark mt-0.5 text-xs">{signal.label}</span>
    </li>
  );
}

function BadgeSignal({ signal }: { signal: TrustSignal }) {
  return (
    <li
      data-testid={`trust-signal-${signal.id}`}
      className="bg-chat-chip-bg col-span-3 flex items-center gap-2 rounded-md px-3 py-1.5"
    >
      <span className="text-tarawera text-xs font-medium">{signal.label}</span>
      <span className="text-neutral-dark text-xs">{signal.value}</span>
    </li>
  );
}

export default function TrustSignals({ signals, label }: TrustSignalsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-sora text-neutral text-xs font-semibold tracking-wider uppercase">
        {label}
      </h3>
      <ul className="grid grid-cols-3 gap-2">
        {signals.map((signal) =>
          signal.type === "stat" ? (
            <StatSignal key={signal.id} signal={signal} />
          ) : (
            <BadgeSignal key={signal.id} signal={signal} />
          )
        )}
      </ul>
    </div>
  );
}
