import type { OpenRouterConfig } from "./open-router-client";

// ──────────────────────────────────────────────
// API Configuration — server-side only
// ──────────────────────────────────────────────

/**
 * Default model — lowest cost on OpenRouter that meets quality requirements.
 * Can be overridden via OPENROUTER_MODEL environment variable.
 */
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct";

const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_TIMEOUT_MS = 30000;
const MIN_API_KEY_LENGTH = 10;

/**
 * Loads OpenRouter configuration from environment variables.
 * This must only be called server-side (Netlify Functions / build time).
 * The API key must never be exposed in the client bundle.
 */
export function getOpenRouterConfig(): OpenRouterConfig {
  const apiKey = process.env.OPENROUTER_API_KEY ?? "";

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      "OPENROUTER_API_KEY environment variable is required but not set. " +
        "Set it in your Netlify environment variables."
    );
  }

  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  return {
    apiKey,
    model,
    maxTokens: DEFAULT_MAX_TOKENS,
    temperature: DEFAULT_TEMPERATURE,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };
}

/**
 * Validates the format of an API key.
 * Does not verify the key is valid with OpenRouter — only checks basic format.
 */
export function validateApiKeyFormat(key: string): boolean {
  if (!key || key.trim().length < MIN_API_KEY_LENGTH) {
    return false;
  }
  return true;
}
