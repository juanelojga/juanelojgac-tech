// ──────────────────────────────────────────────
// OpenRouterClient — SRP: API communication only
// ──────────────────────────────────────────────

/** OpenRouter API message format */
export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Configuration for the OpenRouterClient */
export interface OpenRouterConfig {
  readonly apiKey: string;
  readonly model: string;
  readonly baseUrl?: string;
  readonly maxTokens?: number;
  readonly temperature?: number;
  readonly timeoutMs?: number;
}

/** Usage stats from OpenRouter API response */
export interface OpenRouterUsage {
  readonly prompt_tokens: number;
  readonly completion_tokens: number;
  readonly total_tokens: number;
}

/** Parsed result from a successful chat completion */
export interface ChatCompletionResult {
  readonly content: string;
  readonly finishReason: string;
  readonly usage: OpenRouterUsage;
}

/** Error types from the OpenRouter API */
export type OpenRouterErrorCode =
  | "rate_limit"
  | "auth_error"
  | "invalid_request"
  | "server_error"
  | "timeout"
  | "network_error";

/** Structured error thrown by the OpenRouterClient */
export class OpenRouterError extends Error {
  readonly code: OpenRouterErrorCode;
  readonly retryable: boolean;

  constructor(code: OpenRouterErrorCode, message: string, retryable: boolean) {
    super(message);
    this.name = "OpenRouterError";
    this.code = code;
    this.retryable = retryable;
  }
}

// ── Defaults ──

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_SITE_URL = "https://juanelojgac-tech.com";
const DEFAULT_SITE_TITLE = "JuaneloJGAC Tech AI Consultant";

// ── Response type (internal) ──

interface OpenRouterAPIResponse {
  id: string;
  choices: Array<{
    message: { role: "assistant"; content: string };
    finish_reason: string;
  }>;
  usage: OpenRouterUsage;
}

// ──────────────────────────────────────────────
// Implementation
// ──────────────────────────────────────────────

export class OpenRouterClient {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly maxTokens: number;
  private readonly temperature: number;
  private readonly timeoutMs: number;
  private readonly siteUrl: string;
  private readonly siteTitle: string;

  constructor(config: OpenRouterConfig) {
    if (!config.apiKey || config.apiKey.trim().length === 0) {
      throw new Error("OpenRouterClient: apiKey is required");
    }
    if (!config.model || config.model.trim().length === 0) {
      throw new Error("OpenRouterClient: model is required");
    }

    this.apiKey = config.apiKey;
    this.model = config.model;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.maxTokens = config.maxTokens ?? DEFAULT_MAX_TOKENS;
    this.temperature = config.temperature ?? DEFAULT_TEMPERATURE;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.siteUrl =
      typeof process !== "undefined"
        ? (process.env.SITE_URL ?? DEFAULT_SITE_URL)
        : DEFAULT_SITE_URL;
    this.siteTitle =
      typeof process !== "undefined"
        ? (process.env.SITE_TITLE ?? DEFAULT_SITE_TITLE)
        : DEFAULT_SITE_TITLE;
  }

  /**
   * Sends a chat completion request to the OpenRouter API.
   * Returns the assistant's response content and usage stats.
   */
  async sendChatCompletion(messages: readonly OpenRouterMessage[]): Promise<ChatCompletionResult> {
    const url = `${this.baseUrl}/chat/completions`;

    const body = JSON.stringify({
      model: this.model,
      messages,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.siteUrl,
          "X-Title": this.siteTitle,
        },
        body,
        signal: controller.signal,
      });
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      throw this.handleFetchError(error);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw await this.handleHTTPError(response);
    }

    return this.parseResponse(response);
  }

  // ── Private helpers ──

  private handleFetchError(error: unknown): OpenRouterError {
    if (error instanceof DOMException && error.name === "AbortError") {
      return new OpenRouterError("timeout", "Request timed out", true);
    }
    const message = error instanceof Error ? error.message : "Network request failed";
    return new OpenRouterError("network_error", message, true);
  }

  private async handleHTTPError(response: Response): Promise<OpenRouterError> {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorBody = (await response.json()) as { error?: { message?: string } };
      if (errorBody.error?.message) {
        errorMessage = errorBody.error.message;
      }
    } catch {
      // Use default status-based message
    }

    switch (response.status) {
      case 429:
        return new OpenRouterError("rate_limit", errorMessage, true);
      case 401:
      case 403:
        return new OpenRouterError("auth_error", errorMessage, false);
      case 400:
      case 422:
        return new OpenRouterError("invalid_request", errorMessage, false);
      default:
        return new OpenRouterError("server_error", errorMessage, true);
    }
  }

  private async parseResponse(response: Response): Promise<ChatCompletionResult> {
    let data: OpenRouterAPIResponse;
    try {
      data = (await response.json()) as OpenRouterAPIResponse;
    } catch {
      throw new OpenRouterError("server_error", "Failed to parse API response", true);
    }

    if (!data.choices || data.choices.length === 0) {
      throw new OpenRouterError("server_error", "API response contained empty choices", true);
    }

    const choice = data.choices[0];
    return {
      content: choice.message.content,
      finishReason: choice.finish_reason,
      usage: data.usage,
    };
  }
}
