import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ──────────────────────────────────────────────
// Tests for API configuration and key management
// ──────────────────────────────────────────────

describe("API Config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getOpenRouterConfig", () => {
    it("should load API key from OPENROUTER_API_KEY env variable", async () => {
      process.env.OPENROUTER_API_KEY = "test-key-123";
      const { getOpenRouterConfig } = await import("../api-config");

      const config = getOpenRouterConfig();

      expect(config.apiKey).toBe("test-key-123");
    });

    it("should load model from OPENROUTER_MODEL env variable", async () => {
      process.env.OPENROUTER_API_KEY = "key";
      process.env.OPENROUTER_MODEL = "custom-model/v1";
      const { getOpenRouterConfig } = await import("../api-config");

      const config = getOpenRouterConfig();

      expect(config.model).toBe("custom-model/v1");
    });

    it("should use default model if OPENROUTER_MODEL is not set", async () => {
      process.env.OPENROUTER_API_KEY = "key";
      delete process.env.OPENROUTER_MODEL;
      const { getOpenRouterConfig } = await import("../api-config");

      const config = getOpenRouterConfig();

      expect(config.model).toBeDefined();
      expect(config.model.length).toBeGreaterThan(0);
    });

    it("should throw if OPENROUTER_API_KEY is not set", async () => {
      delete process.env.OPENROUTER_API_KEY;
      const { getOpenRouterConfig } = await import("../api-config");

      expect(() => getOpenRouterConfig()).toThrow("OPENROUTER_API_KEY");
    });

    it("should throw if OPENROUTER_API_KEY is empty", async () => {
      process.env.OPENROUTER_API_KEY = "";
      const { getOpenRouterConfig } = await import("../api-config");

      expect(() => getOpenRouterConfig()).toThrow("OPENROUTER_API_KEY");
    });

    it("should include default maxTokens and temperature", async () => {
      process.env.OPENROUTER_API_KEY = "key";
      const { getOpenRouterConfig } = await import("../api-config");

      const config = getOpenRouterConfig();

      expect(config.maxTokens).toBeGreaterThan(0);
      expect(config.temperature).toBeGreaterThanOrEqual(0);
      expect(config.temperature).toBeLessThanOrEqual(1);
    });
  });

  describe("validateApiKeyFormat", () => {
    it("should accept a valid API key format", async () => {
      const { validateApiKeyFormat } = await import("../api-config");

      expect(validateApiKeyFormat("sk-or-v1-abcdef1234567890")).toBe(true);
    });

    it("should reject an empty API key", async () => {
      const { validateApiKeyFormat } = await import("../api-config");

      expect(validateApiKeyFormat("")).toBe(false);
    });

    it("should reject a key shorter than 10 characters", async () => {
      const { validateApiKeyFormat } = await import("../api-config");

      expect(validateApiKeyFormat("short")).toBe(false);
    });

    it("should accept keys that are at least 10 characters long", async () => {
      const { validateApiKeyFormat } = await import("../api-config");

      expect(validateApiKeyFormat("1234567890")).toBe(true);
    });
  });
});
