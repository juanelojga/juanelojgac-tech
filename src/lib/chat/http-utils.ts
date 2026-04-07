// ──────────────────────────────────────────────
// HTTP Utilities — shared retry & error handling
// Extracted via `extract` skill (DRY)
// Hardened via `harden` skill (resilience)
// ──────────────────────────────────────────────

import { OpenRouterError, type OpenRouterErrorCode } from "./open-router-client";

/** Configuration for retry behavior */
export interface RetryConfig {
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
  readonly backoffMultiplier: number;
}

/** Default retry configuration */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * Calculates exponential backoff delay with jitter.
 * Prevents thundering herd on retries.
 */
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const exponentialDelay = config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);
  // Add jitter: ±25% random variation
  const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.max(0, cappedDelay + jitter);
}

/**
 * Delays execution for the specified number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes an async operation with retry logic.
 * Only retries on transient (retryable) errors.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;

      // Only retry on retryable errors
      if (error instanceof OpenRouterError && !error.retryable) {
        throw error;
      }

      // Don't wait after the last attempt
      if (attempt < config.maxRetries) {
        const waitMs = calculateBackoffDelay(attempt, config);
        await delay(waitMs);
      }
    }
  }

  throw lastError;
}

/**
 * Maps OpenRouterErrorCode to a user-friendly i18n error key.
 * The actual message text is resolved from the i18n translation files.
 */
export function getErrorMessageKey(code: OpenRouterErrorCode): string {
  switch (code) {
    case "rate_limit":
      return "chat.messages.errorRateLimit";
    case "network_error":
    case "timeout":
      return "chat.messages.errorNetwork";
    case "auth_error":
    case "invalid_request":
    case "server_error":
    default:
      return "chat.messages.errorGeneric";
  }
}

/**
 * Type guard to check if an error is an OpenRouterError.
 */
export function isOpenRouterError(error: unknown): error is OpenRouterError {
  return error instanceof OpenRouterError;
}
