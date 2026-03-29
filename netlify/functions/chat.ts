import type { Context } from "@netlify/functions";

import { RateLimiter } from "../../src/lib/chat/rate-limiter";
import { verifyTurnstileToken } from "../../src/lib/chat/verification";

// ──────────────────────────────────────────────
// Chat API Proxy — Netlify Function
// Proxies chat requests to OpenRouter API.
// API key stays server-side — never reaches client.
// ──────────────────────────────────────────────

/** Maximum message content length for user/assistant messages */
const MAX_MESSAGE_LENGTH = 5000;

/** Maximum system prompt length (includes full service catalog + guidelines) */
const MAX_SYSTEM_MESSAGE_LENGTH = 15000;

/** Maximum number of messages in a request */
const MAX_MESSAGES = 50;

/** Allowed message roles */
const VALID_ROLES = new Set(["system", "user", "assistant"]);

/** Allowed HTTP methods */
const ALLOWED_METHODS = new Set(["POST", "OPTIONS"]);

/** Default model */
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct";

/** OpenRouter API URL */
const OPENROUTER_API_URL =
  process.env.OPENROUTER_API_URL ?? "https://openrouter.ai/api/v1/chat/completions";

/** Singleton rate limiter — resets on cold start */
const rateLimiter = new RateLimiter();

/** Site info for OpenRouter tracking */
const SITE_URL = process.env.SITE_URL ?? "https://juanelojgac-tech.com";
const SITE_TITLE = process.env.SITE_TITLE ?? "JuaneloJGAC Tech AI Consultant";

/** Derive the CORS origin from the request or fall back to SITE_URL */
function getAllowedOrigin(request?: Request): string {
  const origin = request?.headers.get("origin");
  if (origin) return origin;
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
  turnstileToken?: string;
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
    const maxLen = m.role === "system" ? MAX_SYSTEM_MESSAGE_LENGTH : MAX_MESSAGE_LENGTH;
    if (m.content.length === 0 || m.content.length > maxLen) return false;
  }

  if (b.language !== undefined && b.language !== "en" && b.language !== "es") return false;

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

  // ── Turnstile verification (if secret key is configured) ──
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = body.turnstileToken;
    // Empty token = client-side verification was bypassed (timeout / script error).
    // Still allow the request — rate limiting provides baseline protection.
    if (token) {
      const verification = await verifyTurnstileToken(token, turnstileSecret, clientIp);
      if (!verification.success) {
        return createErrorResponse(403, "Human verification failed", request);
      }
    }
  }

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
        messages: body.messages,
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
