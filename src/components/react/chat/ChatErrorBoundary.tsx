import React, { Component, type ErrorInfo, type ReactNode } from "react";

// ──────────────────────────────────────────────
// ChatErrorBoundary — React error boundary for chat
// SRP: catches render errors, shows fallback UI
// ──────────────────────────────────────────────

export interface ErrorBoundaryTranslations {
  readonly title: string;
  readonly description: string;
  readonly retry: string;
}

interface ChatErrorBoundaryProps {
  readonly translations: ErrorBoundaryTranslations;
  readonly children: ReactNode;
}

interface ChatErrorBoundaryState {
  readonly hasError: boolean;
}

export default class ChatErrorBoundary extends Component<
  ChatErrorBoundaryProps,
  ChatErrorBoundaryState
> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ChatErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for monitoring — no PII exposed
    console.error("[ChatErrorBoundary]", error.message, errorInfo.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { translations } = this.props;

      return (
        <div
          className="bg-chat-panel-bg flex h-full flex-col items-center justify-center px-6 py-8"
          role="alert"
        >
          <div className="mx-auto max-w-sm text-center">
            <div className="bg-coral/10 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full">
              <svg
                className="text-coral h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h2 className="font-sora text-text-bright mb-2 text-lg font-bold">
              {translations.title}
            </h2>
            <p className="text-text-muted mb-6 text-sm leading-relaxed">
              {translations.description}
            </p>

            <button
              type="button"
              onClick={this.handleRetry}
              className="from-accent-cyan to-accent-teal text-midnight hover:from-accent-cyan/90 hover:to-accent-teal/90 focus-visible:ring-accent-cyan inline-flex items-center rounded-lg bg-gradient-to-r px-5 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {translations.retry}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
