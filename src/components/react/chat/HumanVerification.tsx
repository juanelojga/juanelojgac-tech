import React, { useCallback, useEffect, useRef, useState } from "react";

// ──────────────────────────────────────────────
// HumanVerification — Bot-mitigation gate
// SRP: renders verification widget, reports token
// Does NOT validate token (server-side responsibility)
// ──────────────────────────────────────────────

export interface HumanVerificationTranslations {
  readonly title: string;
  readonly description: string;
  readonly verifying: string;
  readonly success: string;
  readonly error: string;
  readonly expired: string;
  readonly networkError: string;
  readonly ariaLabel: string;
}

export interface HumanVerificationProps {
  readonly siteKey: string;
  readonly onVerified: (token: string) => void;
  readonly translations: HumanVerificationTranslations;
}

type VerificationStatus = "idle" | "verifying" | "success" | "error" | "expired";

export default function HumanVerification({
  siteKey,
  onVerified,
  translations,
}: HumanVerificationProps) {
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const handleSuccess = useCallback(
    (token: string) => {
      setStatus("success");
      onVerified(token);
    },
    [onVerified]
  );

  const handleError = useCallback(() => {
    setStatus("error");
  }, []);

  const handleExpired = useCallback(() => {
    setStatus("expired");
  }, []);

  // Dynamically load the Turnstile script and render the widget
  useEffect(() => {
    if (!siteKey || !widgetRef.current) return;

    let cancelled = false;

    const renderWidget = () => {
      const turnstile = (window as TurnstileWindow).turnstile;
      if (!turnstile || !widgetRef.current || cancelled) return;
      setStatus("verifying");
      widgetIdRef.current = turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        callback: handleSuccess,
        "error-callback": handleError,
        "expired-callback": handleExpired,
        theme: "dark",
      });
    };

    // If Turnstile is already available, render immediately
    if ((window as TurnstileWindow).turnstile) {
      renderWidget();
      return () => {
        cancelled = true;
        const turnstileCleanup = (window as TurnstileWindow).turnstile;
        if (turnstileCleanup && widgetIdRef.current) {
          turnstileCleanup.remove(widgetIdRef.current);
        }
      };
    }

    // Dynamically inject the Turnstile script if not already present
    const SCRIPT_ID = "cf-turnstile-script";
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      document.head.appendChild(script);
    }

    const onLoad = () => renderWidget();
    script.addEventListener("load", onLoad);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", onLoad);
      const turnstileCleanup = (window as TurnstileWindow).turnstile;
      if (turnstileCleanup && widgetIdRef.current) {
        turnstileCleanup.remove(widgetIdRef.current);
      }
    };
  }, [siteKey, handleSuccess, handleError, handleExpired]);

  const statusMessage = getStatusMessage(status, translations);

  return (
    <div
      className="bg-chat-panel-bg flex h-full flex-col items-center justify-center px-6 py-8"
      role="region"
      aria-label={translations.ariaLabel}
    >
      <div className="mx-auto max-w-sm text-center">
        <div className="bg-accent-cyan/10 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full">
          <svg
            className="text-accent-cyan h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <h2 className="font-sora text-text-bright mb-2 text-lg font-bold">{translations.title}</h2>
        <p className="text-text-muted mb-6 text-sm leading-relaxed">{translations.description}</p>

        {/* Turnstile widget container */}
        <div ref={widgetRef} data-testid="turnstile-widget" className="mb-4 flex justify-center" />

        {/* Status message */}
        {statusMessage && (
          <p role="status" aria-live="polite" className={`text-sm ${getStatusColor(status)}`}>
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──

interface TurnstileInstance {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      theme: string;
    }
  ) => string;
  remove: (widgetId: string) => void;
}

interface TurnstileWindow extends Window {
  turnstile?: TurnstileInstance;
}

function getStatusMessage(
  status: VerificationStatus,
  translations: HumanVerificationTranslations
): string | null {
  switch (status) {
    case "verifying":
      return translations.verifying;
    case "success":
      return translations.success;
    case "error":
      return translations.error;
    case "expired":
      return translations.expired;
    default:
      return null;
  }
}

function getStatusColor(status: VerificationStatus): string {
  switch (status) {
    case "success":
      return "text-accent-teal";
    case "error":
    case "expired":
      return "text-coral";
    default:
      return "text-text-muted";
  }
}
