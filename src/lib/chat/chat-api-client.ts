// ──────────────────────────────────────────────
// Chat API Client — client-side proxy caller
// Calls the Netlify Function proxy (never touches
// the OpenRouter API key directly)
// ──────────────────────────────────────────────

import { DEFAULT_RETRY_CONFIG, type RetryConfig, withRetry } from "./http-utils";
import {
  type ChatCompletionResult,
  OpenRouterError,
  type OpenRouterMessage,
  type OpenRouterUsage,
} from "./open-router-client";

/** Configuration for the chat API client */
export interface ChatAPIClientConfig {
  readonly endpoint: string;
  readonly timeoutMs?: number;
  readonly retryConfig?: RetryConfig;
}

/** Default endpoint for the Netlify Function */
const DEFAULT_ENDPOINT = "/.netlify/functions/chat";
const DEFAULT_TIMEOUT_MS = 35000;

/**
 * Client-side API caller that proxies chat requests through
 * the Netlify Function. Never uses the API key directly.
 */
export class ChatAPIClient {
  private readonly endpoint: string;
  private readonly timeoutMs: number;
  private readonly retryConfig: RetryConfig;
  private turnstileToken?: string;

  constructor(config?: Partial<ChatAPIClientConfig>) {
    this.endpoint = config?.endpoint ?? DEFAULT_ENDPOINT;
    this.timeoutMs = config?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.retryConfig = config?.retryConfig ?? DEFAULT_RETRY_CONFIG;
  }

  /**
   * Sets the Turnstile verification token to include in requests.
   */
  setTurnstileToken(token: string): void {
    this.turnstileToken = token;
  }

  /**
   * Sends a chat completion request through the server-side proxy.
   * Automatically retries on transient failures with exponential backoff.
   */
  async sendMessage(
    messages: readonly OpenRouterMessage[],
    language: "en" | "es" = "en"
  ): Promise<ChatCompletionResult> {
    return withRetry(() => this.sendMessageOnce(messages, language), this.retryConfig);
  }

  /**
   * Single attempt to send a message (no retry).
   */
  private async sendMessageOnce(
    messages: readonly OpenRouterMessage[],
    language: "en" | "es"
  ): Promise<ChatCompletionResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          language,
          ...(this.turnstileToken && { turnstileToken: this.turnstileToken }),
        }),
        signal: controller.signal,
      });
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new OpenRouterError("timeout", "Request timed out", true);
      }

      const errMsg = error instanceof Error ? error.message : "Network request failed";
      throw new OpenRouterError("network_error", errMsg, true);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw await this.handleErrorResponse(response);
    }

    return this.parseResponse(response);
  }

  private async handleErrorResponse(response: Response): Promise<OpenRouterError> {
    let message = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) {
        message = body.error.message;
      }
    } catch {
      // Use default message
    }

    switch (response.status) {
      case 429:
        return new OpenRouterError("rate_limit", message, true);
      case 400:
        return new OpenRouterError("invalid_request", message, false);
      case 404:
        return new OpenRouterError(
          "server_error",
          "Chat endpoint not found. Run 'pnpm run dev:netlify' for full-stack development.",
          false
        );
      case 502:
      case 503:
        return new OpenRouterError("server_error", message, true);
      default:
        return new OpenRouterError("server_error", message, true);
    }
  }

  private async parseResponse(response: Response): Promise<ChatCompletionResult> {
    let data: {
      id: string;
      choices: Array<{
        message: { role: string; content: string };
        finish_reason: string;
      }>;
      usage: OpenRouterUsage;
    };

    try {
      data = await response.json();
    } catch {
      throw new OpenRouterError("server_error", "Failed to parse API response", true);
    }

    if (!data.choices || data.choices.length === 0) {
      throw new OpenRouterError("server_error", "Empty response from chat service", true);
    }

    const choice = data.choices[0];
    return {
      content: choice.message.content,
      finishReason: choice.finish_reason,
      usage: data.usage,
    };
  }
}
