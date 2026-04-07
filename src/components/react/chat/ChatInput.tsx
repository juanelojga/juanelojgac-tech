import React, { useCallback, useRef, useState } from "react";

import { sanitizeUserInput } from "../../../lib/chat/validators";

export interface ChatInputProps {
  readonly placeholder: string;
  readonly sendLabel: string;
  readonly characterLimitLabel: string;
  readonly onSubmit: (message: string) => void;
  readonly disabled?: boolean;
  readonly maxLength?: number;
  readonly helperText?: string;
}

const DEFAULT_MAX_LENGTH = 500;

export default function ChatInput({
  placeholder,
  sendLabel,
  characterLimitLabel,
  onSubmit,
  disabled = false,
  maxLength = DEFAULT_MAX_LENGTH,
  helperText,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = maxLength - value.length;
  const canSubmit = value.trim().length > 0 && !disabled;

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const sanitized = sanitizeUserInput(trimmed);
    if (!sanitized) return;
    onSubmit(sanitized);
    setValue("");
  }, [value, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= maxLength) {
        setValue(newValue);
      } else {
        setValue(newValue.slice(0, maxLength));
      }
    },
    [maxLength]
  );

  const handleFocus = useCallback(() => {
    // Scroll input into view when mobile keyboard opens
    if (textareaRef.current) {
      requestAnimationFrame(() => {
        textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }, []);

  return (
    <div className="border-chat-input-border bg-chat-panel-input-bg shrink-0 border-t px-4 py-3">
      <div className="mx-auto flex max-w-[var(--spacing-chat-input-max-width)] items-center gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            aria-label={placeholder}
            aria-describedby="chat-char-count"
            data-testid="chat-input"
            className="border-chat-input-border focus:border-chat-input-focus-border focus:ring-chat-input-focus-ring placeholder:text-chat-input-placeholder text-text-bright w-full resize-none rounded-xl border bg-transparent px-3 py-2.5 text-sm leading-relaxed transition-colors focus:ring-2 focus:outline-none disabled:opacity-50 sm:px-4"
          />
          <span
            id="chat-char-count"
            data-testid="character-count"
            className={`mt-1 block text-right text-xs ${remaining < 50 ? "text-coral" : "text-text-muted"}`}
          >
            {characterLimitLabel.replace("{{count}}", String(remaining))}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label={sendLabel}
          data-testid="chat-send-button"
          className="bg-chat-cta-primary hover:bg-chat-cta-primary-hover text-chat-cta-primary-text min-h-[44px] min-w-[44px] rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sendLabel}
        </button>
      </div>
      {helperText && (
        <p
          data-testid="chat-helper-text"
          className="text-text-muted mx-auto mt-1.5 max-w-[var(--spacing-chat-input-max-width)] text-xs leading-relaxed opacity-70"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
