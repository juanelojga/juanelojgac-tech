import { describe, expect, it, vi } from "vitest";

import {
  calculateBackoffDelay,
  DEFAULT_RETRY_CONFIG,
  getErrorMessageKey,
  isOpenRouterError,
  withRetry,
} from "../http-utils";
import { OpenRouterError } from "../open-router-client";

// ──────────────────────────────────────────────
// Tests for HTTP utilities (retry, backoff, errors)
// ──────────────────────────────────────────────

describe("HTTP Utilities", () => {
  describe("calculateBackoffDelay", () => {
    it("should return a positive delay for attempt 0", () => {
      // Use fixed random to test deterministically
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const delay = calculateBackoffDelay(0);
      expect(delay).toBeGreaterThanOrEqual(0);
      vi.restoreAllMocks();
    });

    it("should increase delay with each attempt", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const delay0 = calculateBackoffDelay(0);
      const delay1 = calculateBackoffDelay(1);
      const delay2 = calculateBackoffDelay(2);

      // Delays should generally increase (with jitter they may vary)
      expect(delay1).toBeGreaterThan(delay0 * 0.5);
      expect(delay2).toBeGreaterThan(delay1 * 0.5);
      vi.restoreAllMocks();
    });

    it("should not exceed maxDelayMs", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const config = { ...DEFAULT_RETRY_CONFIG, maxDelayMs: 5000 };
      const delay = calculateBackoffDelay(100, config);

      // With jitter of ±25%, max is 5000 * 1.25 = 6250
      expect(delay).toBeLessThanOrEqual(config.maxDelayMs * 1.25);
      vi.restoreAllMocks();
    });

    it("should use custom config when provided", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const config = {
        maxRetries: 5,
        baseDelayMs: 500,
        maxDelayMs: 3000,
        backoffMultiplier: 3,
      };
      const delay = calculateBackoffDelay(0, config);
      // Base delay is 500, no jitter at random=0.5 (jitter = 500*0.25*(2*0.5-1) = 0)
      expect(delay).toBe(500);
      vi.restoreAllMocks();
    });
  });

  describe("withRetry", () => {
    it("should return result on first successful attempt", async () => {
      const operation = vi.fn().mockResolvedValue("success");

      const result = await withRetry(operation, { ...DEFAULT_RETRY_CONFIG, maxRetries: 3 });

      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it("should retry on retryable errors", async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new OpenRouterError("network_error", "fail", true))
        .mockResolvedValue("success");

      const result = await withRetry(operation, {
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 3,
        baseDelayMs: 1,
      });

      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it("should not retry on non-retryable errors", async () => {
      const operation = vi
        .fn()
        .mockRejectedValue(new OpenRouterError("auth_error", "invalid key", false));

      await expect(
        withRetry(operation, { ...DEFAULT_RETRY_CONFIG, maxRetries: 3, baseDelayMs: 1 })
      ).rejects.toMatchObject({ code: "auth_error" });

      expect(operation).toHaveBeenCalledTimes(1);
    });

    it("should throw after exhausting all retries", async () => {
      const operation = vi
        .fn()
        .mockRejectedValue(new OpenRouterError("server_error", "down", true));

      await expect(
        withRetry(operation, { ...DEFAULT_RETRY_CONFIG, maxRetries: 2, baseDelayMs: 1 })
      ).rejects.toMatchObject({ code: "server_error" });

      // 1 initial + 2 retries = 3 calls
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it("should retry on generic errors (not OpenRouterError)", async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error("generic error"))
        .mockResolvedValue("recovered");

      const result = await withRetry(operation, {
        ...DEFAULT_RETRY_CONFIG,
        maxRetries: 2,
        baseDelayMs: 1,
      });

      expect(result).toBe("recovered");
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it("should work with zero retries", async () => {
      const operation = vi
        .fn()
        .mockRejectedValue(new OpenRouterError("server_error", "fail", true));

      await expect(
        withRetry(operation, { ...DEFAULT_RETRY_CONFIG, maxRetries: 0, baseDelayMs: 1 })
      ).rejects.toThrow();

      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe("getErrorMessageKey", () => {
    it("should return rate limit key for rate_limit code", () => {
      expect(getErrorMessageKey("rate_limit")).toBe("chat.messages.errorRateLimit");
    });

    it("should return network key for network_error code", () => {
      expect(getErrorMessageKey("network_error")).toBe("chat.messages.errorNetwork");
    });

    it("should return network key for timeout code", () => {
      expect(getErrorMessageKey("timeout")).toBe("chat.messages.errorNetwork");
    });

    it("should return generic key for auth_error code", () => {
      expect(getErrorMessageKey("auth_error")).toBe("chat.messages.errorGeneric");
    });

    it("should return generic key for server_error code", () => {
      expect(getErrorMessageKey("server_error")).toBe("chat.messages.errorGeneric");
    });

    it("should return generic key for invalid_request code", () => {
      expect(getErrorMessageKey("invalid_request")).toBe("chat.messages.errorGeneric");
    });
  });

  describe("isOpenRouterError", () => {
    it("should return true for OpenRouterError instances", () => {
      const error = new OpenRouterError("server_error", "test", true);
      expect(isOpenRouterError(error)).toBe(true);
    });

    it("should return false for regular Error instances", () => {
      const error = new Error("test");
      expect(isOpenRouterError(error)).toBe(false);
    });

    it("should return false for non-Error values", () => {
      expect(isOpenRouterError("string")).toBe(false);
      expect(isOpenRouterError(null)).toBe(false);
      expect(isOpenRouterError(undefined)).toBe(false);
      expect(isOpenRouterError(42)).toBe(false);
    });
  });
});
