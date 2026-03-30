import React, { useCallback, useEffect, useRef, useState } from "react";

export interface ContactFormTranslations {
  readonly chipLabel: string;
  readonly modalTitle: string;
  readonly modalSubtitle: string;
  readonly nameLabel: string;
  readonly namePlaceholder: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly companyLabel: string;
  readonly companyPlaceholder: string;
  readonly summaryLabel: string;
  readonly summaryLoading: string;
  readonly summaryCharCount: string;
  readonly submitLabel: string;
  readonly successMessage: string;
  readonly errorMessage: string;
  readonly closeLabel: string;
}

export interface ContactFormModalProps {
  readonly translations: ContactFormTranslations;
  readonly conversationSummary: string;
  readonly isLoadingSummary?: boolean;
  readonly onClose: () => void;
}

const FORMSPARK_URL = "https://submit-form.com/xlnH1OrvV";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactFormModal({
  translations,
  conversationSummary,
  isLoadingSummary = false,
  onClose,
}: ContactFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState(conversationSummary);
  const [status, setStatus] = useState<FormStatus>("idle");

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on mount
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Sync summary when AI summary arrives asynchronously
  useEffect(() => {
    if (conversationSummary) {
      setSummary(conversationSummary);
    }
  }, [conversationSummary]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'input, textarea, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Auto-close after success
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [status, onClose]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("submitting");

      try {
        const response = await fetch(FORMSPARK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            company: company.trim(),
            conversationSummary: summary.trim(),
          }),
        });

        if (!response.ok) {
          setStatus("error");
          return;
        }

        setStatus("success");
      } catch {
        setStatus("error");
      }
    },
    [name, email, company, summary]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const inputClasses =
    "border-white-10 focus:border-accent-cyan focus:ring-accent-cyan/30 bg-midnight-surface text-text-bright placeholder:text-text-muted w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none";
  const labelClasses = "text-text-bright mb-1.5 block text-sm font-medium";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={translations.modalTitle}
    >
      <div
        ref={modalRef}
        className="border-white-10 bg-midnight-surface w-full max-w-lg rounded-2xl border p-6 shadow-2xl sm:p-8"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-text-bright text-xl font-semibold">{translations.modalTitle}</h2>
            <p className="text-text-muted mt-1 text-sm">{translations.modalSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={translations.closeLabel}
            className="text-text-muted hover:text-text-bright -mt-2 -mr-2 rounded-lg p-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Success state */}
        {status === "success" ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="bg-accent-cyan/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="text-accent-cyan h-7 w-7"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-text-bright text-lg font-medium">{translations.successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="contact-name" className={labelClasses}>
                {translations.nameLabel}
              </label>
              <input
                ref={firstInputRef}
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={translations.namePlaceholder}
                className={inputClasses}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className={labelClasses}>
                {translations.emailLabel}
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={translations.emailPlaceholder}
                className={inputClasses}
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="contact-company" className={labelClasses}>
                {translations.companyLabel}
              </label>
              <input
                id="contact-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={translations.companyPlaceholder}
                className={inputClasses}
              />
            </div>

            {/* Conversation Summary */}
            <div>
              <label htmlFor="contact-summary" className={labelClasses}>
                {translations.summaryLabel}
              </label>
              {isLoadingSummary ? (
                <div className="border-white-10 bg-midnight-surface flex h-[6.5rem] items-center justify-center rounded-xl border">
                  <div className="flex items-center gap-2">
                    <svg
                      className="text-accent-cyan h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span className="text-text-muted text-sm">{translations.summaryLoading}</span>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    id="contact-summary"
                    rows={4}
                    maxLength={500}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className={`${inputClasses} resize-y`}
                  />
                  <p className="text-text-muted mt-1 text-right text-xs">
                    {summary.length}
                    {translations.summaryCharCount}
                  </p>
                </>
              )}
            </div>

            {/* Error message */}
            {status === "error" && (
              <p role="alert" className="text-coral text-sm">
                {translations.errorMessage}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-accent-cyan hover:bg-accent-cyan/90 text-midnight w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "..." : translations.submitLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
