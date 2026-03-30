import type { Context } from "@netlify/functions";

import { StaticContentProvider } from "../../src/lib/chat/content/static-content-provider";
import { RateLimiter } from "../../src/lib/chat/rate-limiter";
import { ScopeEnforcerImpl } from "../../src/lib/chat/scope-enforcer";
import { SystemPromptBuilder } from "../../src/lib/chat/system-prompt-builder";
import type { ConversationPhase } from "../../src/lib/chat/types";
import { verifyTurnstileToken } from "../../src/lib/chat/verification";

// ──────────────────────────────────────────────
// Chat API Proxy — Netlify Function
// Proxies chat requests to OpenRouter API.
// API key stays server-side — never reaches client.
// System prompt is constructed server-side to prevent
// prompt injection via direct API calls.
// ──────────────────────────────────────────────

/** Maximum message content length for user/assistant messages */
const MAX_MESSAGE_LENGTH = 5000;

/** Maximum number of messages in a request */
const MAX_MESSAGES = 50;

/** Only user and assistant messages are accepted from clients.
 *  System messages are constructed server-side exclusively. */
const VALID_ROLES = new Set(["user", "assistant"]);

/** Valid conversation phases */
const VALID_PHASES = new Set<string>([
  "greeting",
  "discovery",
  "qualification",
  "summary",
  "completed",
]);

/** Allowed HTTP methods */
const ALLOWED_METHODS = new Set(["POST", "OPTIONS"]);

/** Default model */
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct";

/** OpenRouter API URL */
const OPENROUTER_API_URL =
  process.env.OPENROUTER_API_URL ?? "https://openrouter.ai/api/v1/chat/completions";

/** Singleton instances — reused across warm invocations */
const rateLimiter = new RateLimiter();
const contentProvider = new StaticContentProvider();
const systemPromptBuilder = new SystemPromptBuilder(contentProvider);
const scopeEnforcer = new ScopeEnforcerImpl(contentProvider);

/** Site info for OpenRouter tracking */
const SITE_URL = process.env.SITE_URL ?? "https://juanelojgac-tech.com";
const SITE_TITLE = process.env.SITE_TITLE ?? "JuaneloJGAC Tech AI Consultant";

/** Allowed CORS origins — validated against an allowlist */
const ALLOWED_ORIGINS = buildAllowedOrigins();

function buildAllowedOrigins(): Set<string> {
  const origins = new Set<string>();
  // Always allow the production site
  origins.add(SITE_URL);
  // Add www variant
  const url = SITE_URL.replace("://", "://www.");
  if (url !== SITE_URL) origins.add(url);
  // Dev origins
  origins.add("http://localhost:4321");
  origins.add("http://localhost:8888");
  // Custom origins from env (comma-separated)
  const custom = process.env.ALLOWED_ORIGINS;
  if (custom) {
    for (const o of custom.split(",")) {
      const trimmed = o.trim();
      if (trimmed) origins.add(trimmed);
    }
  }
  return origins;
}

/** Only return an origin if it's in the allowlist */
function getAllowedOrigin(request?: Request): string {
  const origin = request?.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) return origin;
  return SITE_URL;
}

// ── Types ──

interface ChatRequestMessage {
  role: string;
  content: string;
}

interface ChatRequestBody {
  messages: ChatRequestMessage[];
  language?: string;
  phase?: string;
  turnstileToken?: string;
}

// ── Input sanitization ──

/** Strip HTML tags, null bytes, and zero-width characters from user input */
function sanitizeMessageContent(input: string): string {
  let s = input;
  s = s.replace(/\0/g, "");
  // Strip zero-width characters used for regex bypass
  s = s.replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, "");
  s = s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<[^>]*>/g, "");
  return s.trim();
}

// ── Validation ──

function validateRequestBody(body: unknown): body is ChatRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.messages)) return false;
  if (b.messages.length === 0 || b.messages.length > MAX_MESSAGES) return false;

  for (const msg of b.messages) {
    if (typeof msg !== "object" || msg === null) return false;
    const m = msg as Record<string, unknown>;
    if (typeof m.role !== "string" || !VALID_ROLES.has(m.role)) return false;
    if (typeof m.content !== "string") return false;
    if (m.content.length === 0 || m.content.length > MAX_MESSAGE_LENGTH) return false;
  }

  if (b.language !== undefined && b.language !== "en" && b.language !== "es") return false;
  if (b.phase !== undefined && !VALID_PHASES.has(b.phase)) return false;

  return true;
}

function createErrorResponse(status: number, message: string, request?: Request): Response {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": getAllowedOrigin(request),
    },
  });
}

function createCORSResponse(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": getAllowedOrigin(request),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

// ── Handler ──

export default async function handler(request: Request, _context: Context): Promise<Response> {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return createCORSResponse(request);
  }

  // Only allow POST
  if (!ALLOWED_METHODS.has(request.method)) {
    return createErrorResponse(405, "Method not allowed", request);
  }

  // Load API key from environment
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return createErrorResponse(500, "Chat service is not configured", request);
  }

  // Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse(400, "Invalid JSON in request body", request);
  }

  if (!validateRequestBody(body)) {
    return createErrorResponse(400, "Invalid request format", request);
  }

  // ── Rate limiting (per client IP) ──
  // Prefer Netlify-set header (cannot be spoofed) over x-forwarded-for
  const clientIp =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const rateResult = rateLimiter.checkLimit(clientIp);
  if (!rateResult.allowed) {
    return new Response(
      JSON.stringify({ error: { message: "Rate limit exceeded. Please try again shortly." } }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": getAllowedOrigin(request),
          "Retry-After": String(Math.ceil(rateResult.retryAfterMs / 1000)),
        },
      }
    );
  }

  // ── Turnstile verification (skipped in local dev — NETLIFY_DEV is auto-set by netlify dev) ──
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && process.env.NETLIFY_DEV !== "true") {
    const token = body.turnstileToken;
    if (!token) {
      // Require a valid token when Turnstile is configured
      return createErrorResponse(403, "Verification token required", request);
    }
    const verification = await verifyTurnstileToken(token, turnstileSecret, clientIp);
    if (!verification.success) {
      return createErrorResponse(403, "Human verification failed", request);
    }
  }

  // ── Server-side input sanitization ──
  const sanitizedMessages = body.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: sanitizeMessageContent(m.content),
  }));

  const language = (body.language ?? "en") as "en" | "es";
  const phase = (body.phase ?? "greeting") as ConversationPhase;

  // ── Server-side scope enforcement ──
  // Check the last user message for out-of-scope or injection attempts
  const lastUserMsg = [...sanitizedMessages].reverse().find((m) => m.role === "user");
  if (lastUserMsg) {
    const scopeResult = scopeEnforcer.evaluateScope(lastUserMsg.content, {
      messages: [],
      phase,
      language,
      leadAttributes: {},
      isAssistantTyping: false,
      error: null,
    });

    if (!scopeResult.isInScope && scopeResult.redirect) {
      // Return redirect response without calling OpenRouter — saves cost
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                role: "assistant",
                content: scopeResult.redirect.message,
              },
              finish_reason: "stop",
            },
          ],
          usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getAllowedOrigin(request),
          },
        }
      );
    }
  }

  // ── Build messages with server-side system prompt ──
  const systemPrompt = systemPromptBuilder.buildSystemPrompt(language, phase);
  const apiMessages = [{ role: "system" as const, content: systemPrompt }, ...sanitizedMessages];

  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  // Proxy to OpenRouter
  try {
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_TITLE,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!openRouterResponse.ok) {
      const status = openRouterResponse.status;

      if (status === 429) {
        return createErrorResponse(429, "Rate limit exceeded. Please try again shortly.", request);
      }
      if (status === 401 || status === 403) {
        return createErrorResponse(500, "Chat service authentication error", request);
      }

      return createErrorResponse(502, "Chat service temporarily unavailable", request);
    }

    const data = await openRouterResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": getAllowedOrigin(request),
      },
    });
  } catch {
    return createErrorResponse(502, "Failed to connect to chat service", request);
  }
}
