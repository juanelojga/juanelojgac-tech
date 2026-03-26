import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

// ──────────────────────────────────────────────
// Types for the OpenRouterClient under test
// ──────────────────────────────────────────────

/** OpenRouter API message format */
interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Configuration for the OpenRouterClient */
interface OpenRouterConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

/** Response from the OpenRouter API */
interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ──────────────────────────────────────────────
// Mock fetch
// ──────────────────────────────────────────────

const mockFetch = vi.fn() as Mock;

vi.stubGlobal("fetch", mockFetch);

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function createSuccessResponse(content: string): Response {
  const body: OpenRouterResponse = {
    id: "gen-test-123",
    choices: [
      {
        message: { role: "assistant", content },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150,
    },
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function createErrorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ──────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────

describe("OpenRouterClient", () => {
  let OpenRouterClient: typeof import("../open-router-client").OpenRouterClient;
  let client: InstanceType<typeof OpenRouterClient>;

  const defaultConfig: OpenRouterConfig = {
    apiKey: "test-api-key-12345",
    model: "meta-llama/llama-3-8b-instruct",
    baseUrl: "https://openrouter.ai/api/v1",
    maxTokens: 1024,
    temperature: 0.7,
    timeoutMs: 30000,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../open-router-client");
    OpenRouterClient = mod.OpenRouterClient;
    client = new OpenRouterClient(defaultConfig);
  });

  // ── Construction ──

  describe("constructor", () => {
    it("should create a client with required config", () => {
      const c = new OpenRouterClient({
        apiKey: "key",
        model: "test-model",
      });
      expect(c).toBeDefined();
    });

    it("should use default values for optional config", () => {
      const c = new OpenRouterClient({
        apiKey: "key",
        model: "test-model",
      });
      expect(c).toBeDefined();
    });

    it("should throw for empty API key", () => {
      expect(() => new OpenRouterClient({ apiKey: "", model: "m" })).toThrow();
    });

    it("should throw for empty model", () => {
      expect(() => new OpenRouterClient({ apiKey: "k", model: "" })).toThrow();
    });
  });

  // ── Request construction ──

  describe("sendChatCompletion", () => {
    it("should send a properly formatted request to OpenRouter API", async () => {
      mockFetch.mockResolvedValueOnce(createSuccessResponse("Hello!"));

      const messages: OpenRouterMessage[] = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hi there" },
      ];

      await client.sendChatCompletion(messages);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
      expect(options.method).toBe("POST");
      expect(options.headers).toEqual(
        expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer test-api-key-12345",
        })
      );

      const body = JSON.parse(options.body as string);
      expect(body.model).toBe("meta-llama/llama-3-8b-instruct");
      expect(body.messages).toEqual(messages);
      expect(body.max_tokens).toBe(1024);
      expect(body.temperature).toBe(0.7);
    });

    it("should return the assistant message content on success", async () => {
      mockFetch.mockResolvedValueOnce(createSuccessResponse("I can help with that!"));

      const messages: OpenRouterMessage[] = [
        { role: "user", content: "What services do you offer?" },
      ];

      const result = await client.sendChatCompletion(messages);

      expect(result.content).toBe("I can help with that!");
      expect(result.usage).toEqual({
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      });
    });

    it("should include HTTP-Referer and X-Title headers", async () => {
      mockFetch.mockResolvedValueOnce(createSuccessResponse("Hi"));

      await client.sendChatCompletion([{ role: "user", content: "test" }]);

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      const headers = options.headers as Record<string, string>;
      expect(headers["HTTP-Referer"]).toBeDefined();
      expect(headers["X-Title"]).toBeDefined();
    });
  });

  // ── Error handling ──

  describe("error handling", () => {
    it("should throw OpenRouterError with rate_limit code for 429 response", async () => {
      mockFetch.mockResolvedValueOnce(createErrorResponse(429, "Rate limit exceeded"));

      const messages: OpenRouterMessage[] = [{ role: "user", content: "test" }];

      await expect(client.sendChatCompletion(messages)).rejects.toMatchObject({
        code: "rate_limit",
        retryable: true,
      });
    });

    it("should throw OpenRouterError with auth_error code for 401 response", async () => {
      mockFetch.mockResolvedValueOnce(createErrorResponse(401, "Invalid API key"));

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "auth_error",
        retryable: false,
      });
    });

    it("should throw OpenRouterError with auth_error code for 403 response", async () => {
      mockFetch.mockResolvedValueOnce(createErrorResponse(403, "Forbidden"));

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "auth_error",
        retryable: false,
      });
    });

    it("should throw OpenRouterError with invalid_request code for 400 response", async () => {
      mockFetch.mockResolvedValueOnce(createErrorResponse(400, "Invalid request"));

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "invalid_request",
        retryable: false,
      });
    });

    it("should throw OpenRouterError with server_error code for 500 response", async () => {
      mockFetch.mockResolvedValueOnce(createErrorResponse(500, "Internal server error"));

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "server_error",
        retryable: true,
      });
    });

    it("should throw OpenRouterError with server_error code for 503 response", async () => {
      mockFetch.mockResolvedValueOnce(createErrorResponse(503, "Service unavailable"));

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "server_error",
        retryable: true,
      });
    });

    it("should throw OpenRouterError with network_error for fetch failure", async () => {
      mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "network_error",
        retryable: true,
      });
    });

    it("should throw OpenRouterError with timeout code for AbortError", async () => {
      const abortError = new DOMException("The operation was aborted", "AbortError");
      mockFetch.mockRejectedValueOnce(abortError);

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "timeout",
        retryable: true,
      });
    });

    it("should handle malformed JSON response", async () => {
      mockFetch.mockResolvedValueOnce(
        new Response("not json", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "server_error",
      });
    });

    it("should handle response with empty choices array", async () => {
      const body = {
        id: "gen-test",
        choices: [],
        usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 },
      };
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(body), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

      await expect(
        client.sendChatCompletion([{ role: "user", content: "test" }])
      ).rejects.toMatchObject({
        code: "server_error",
        message: expect.stringContaining("empty"),
      });
    });
  });

  // ── Abort signal / timeout ──

  describe("timeout handling", () => {
    it("should pass an AbortSignal to fetch", async () => {
      mockFetch.mockResolvedValueOnce(createSuccessResponse("ok"));

      await client.sendChatCompletion([{ role: "user", content: "test" }]);

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(options.signal).toBeDefined();
    });
  });
});
