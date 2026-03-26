import type { Context } from "@netlify/functions";
import { verifyTurnstileToken } from "../../src/lib/chat/verification";
import { RateLimiter } from "../../src/lib/chat/rate-limiter";

// ──────────────────────────────────────────────
// Chat API Proxy — Netlify Function
// Proxies chat requests to OpenRouter API.
// API key stays server-side — never reaches client.
// ──────────────────────────────────────────────

/** Maximum message content length */
const MAX_MESSAGE_LENGTH = 5000;

/** Maximum number of messages in a request */
const MAX_MESSAGES = 50;

/** Allowed message roles */
const VALID_ROLES = new Set(["system", "user", "assistant"]);

/** Allowed HTTP methods */
const ALLOWED_METHODS = new Set(["POST", "OPTIONS"]);

/** Default model */
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct";

/** OpenRouter API URL */
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Singleton rate limiter — resets on cold start */
const rateLimiter = new RateLimiter();

/** Site info for OpenRouter tracking */
const SITE_URL = "https://juanelojgac-tech.com";
const SITE_TITLE = "JuaneloJGAC Tech AI Consultant";

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
    if (m.content.length === 0 || m.content.length > MAX_MESSAGE_LENGTH) return false;
  }

  if (b.language !== undefined && b.language !== "en" && b.language !== "es") return false;

  return true;
}

function createErrorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": SITE_URL,
    },
  });
}

function createCORSResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": SITE_URL,
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
    return createCORSResponse();
  }

  // Only allow POST
  if (!ALLOWED_METHODS.has(request.method)) {
    return createErrorResponse(405, "Method not allowed");
  }

  // Load API key from environment
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return createErrorResponse(500, "Chat service is not configured");
  }

  // Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return createErrorResponse(400, "Invalid JSON in request body");
  }

  if (!validateRequestBody(body)) {
    return createErrorResponse(400, "Invalid request format");
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
          "Access-Control-Allow-Origin": SITE_URL,
          "Retry-After": String(Math.ceil(rateResult.retryAfterMs / 1000)),
        },
      }
    );
  }

  // ── Turnstile verification (if secret key is configured) ──
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = body.turnstileToken;
    if (!token) {
      return createErrorResponse(403, "Human verification required");
    }

    const verification = await verifyTurnstileToken(token, turnstileSecret, clientIp);
    if (!verification.success) {
      return createErrorResponse(403, "Human verification failed");
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
        return createErrorResponse(429, "Rate limit exceeded. Please try again shortly.");
      }
      if (status === 401 || status === 403) {
        return createErrorResponse(500, "Chat service authentication error");
      }

      return createErrorResponse(502, "Chat service temporarily unavailable");
    }

    const data = await openRouterResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": SITE_URL,
      },
    });
  } catch {
    return createErrorResponse(502, "Failed to connect to chat service");
  }
}
