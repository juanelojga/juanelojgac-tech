import type { Context } from "@netlify/functions";

import { RateLimiter } from "../../src/lib/chat/rate-limiter";

// ──────────────────────────────────────────────
// Summarize API — Netlify Function
// Generates a concise ≤500-char summary of a
// conversation via the same OpenRouter API used
// by the chat function. API key stays server-side.
// ──────────────────────────────────────────────

/** Maximum number of messages to summarize */
const MAX_MESSAGES = 50;

/** Maximum content length per message */
const MAX_MESSAGE_LENGTH = 5000;

/** Maximum summary length in characters */
const MAX_SUMMARY_LENGTH = 500;

/** Allowed message roles (no system messages needed for summarization) */
const VALID_ROLES = new Set(["user", "assistant"]);

/** Allowed HTTP methods */
const ALLOWED_METHODS = new Set(["POST", "OPTIONS"]);

/** Default model — same as chat function */
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct";

/** OpenRouter API URL */
const OPENROUTER_API_URL =
  process.env.OPENROUTER_API_URL ?? "https://openrouter.ai/api/v1/chat/completions";

/** Singleton rate limiter — separate from chat */
const rateLimiter = new RateLimiter();

/** Site info for OpenRouter tracking */
const SITE_URL = process.env.SITE_URL ?? "https://juanelojgac-tech.com";
const SITE_TITLE = process.env.SITE_TITLE ?? "JuaneloJGAC Tech AI Consultant";

/** Allowed CORS origins — validated against an allowlist */
const ALLOWED_ORIGINS = buildAllowedOrigins();

function buildAllowedOrigins(): Set<string> {
  const origins = new Set<string>();
  origins.add(SITE_URL);
  const url = SITE_URL.replace("://", "://www.");
  if (url !== SITE_URL) origins.add(url);
  origins.add("http://localhost:4321");
  origins.add("http://localhost:8888");
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

interface SummarizeRequestMessage {
  role: string;
  content: string;
}

interface SummarizeRequestBody {
  messages: SummarizeRequestMessage[];
  language?: string;
}

// ── Validation ──

function validateRequestBody(body: unknown): body is SummarizeRequestBody {
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

// ── Summarization prompt ──

function buildSummarizationPrompt(language: string): string {
  if (language === "es") {
    return `Eres un asistente que resume conversaciones. Genera un resumen conciso de la siguiente conversación entre un usuario y un consultor de IA de JuaneloJGAC Tech. El resumen debe:
- Estar en español
- Estar escrito en primera persona desde la perspectiva del usuario (ej., "Necesito...", "Estoy buscando...", "Quiero..."), NO en tercera persona (ej., "El usuario necesita...", "El usuario busca...")
- Tener un máximo de ${MAX_SUMMARY_LENGTH} caracteres
- Enfocarse en las necesidades del usuario, los temas discutidos y los puntos clave
- Ser claro y profesional
- No incluir saludos ni texto de relleno
Responde SOLO con el resumen, sin explicaciones adicionales.`;
  }

  return `You are a conversation summarizer. Generate a concise summary of the following conversation between a user and a JuaneloJGAC Tech AI consultant. The summary must:
- Be in English
- Be written in first person from the user's perspective (e.g., "I need...", "I'm looking for...", "I want..."), NOT in third person (e.g., "The user needs...", "The user is looking for...")
- Be at most ${MAX_SUMMARY_LENGTH} characters long
- Focus on the user's needs, topics discussed, and key points
- Be clear and professional
- Not include greetings or filler text
Respond ONLY with the summary, no additional explanation.`;
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

  const language = body.language ?? "en";
  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  // Build messages for OpenRouter: system prompt + transcript as a single user message.
  // Passing raw user/assistant turns causes the model to continue the conversation
  // instead of summarizing — so we serialize the transcript into one user message.
  const systemPrompt = buildSummarizationPrompt(language);
  const transcript = body.messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");
  const apiMessages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: transcript },
  ];

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
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    console.log("[summarize] model:", model, "| OpenRouter status:", openRouterResponse.status);

    if (!openRouterResponse.ok) {
      const status = openRouterResponse.status;
      let errorBody: string | undefined;
      try {
        errorBody = await openRouterResponse.text();
      } catch {
        /* ignore */
      }
      console.error("[summarize] OpenRouter error:", status, errorBody);

      if (status === 429) {
        return createErrorResponse(429, "Rate limit exceeded. Please try again shortly.", request);
      }
      if (status === 401 || status === 403) {
        return createErrorResponse(500, "Chat service authentication error", request);
      }

      return createErrorResponse(502, "Chat service temporarily unavailable", request);
    }

    const data = (await openRouterResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string; code?: number };
    };

    console.log("[summarize] OpenRouter response:", JSON.stringify(data));

    // Some models return errors inside a 200 response
    if (data.error) {
      console.error("[summarize] OpenRouter returned error in body:", data.error.message);
      return createErrorResponse(502, "Chat service returned an error", request);
    }

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
      console.error("[summarize] OpenRouter returned empty or malformed choices");
      return createErrorResponse(502, "Chat service returned an empty response", request);
    }

    const rawSummary = data.choices[0].message.content;
    // Enforce max length as a safety net
    const summary = rawSummary.slice(0, MAX_SUMMARY_LENGTH);

    return new Response(JSON.stringify({ summary }), {
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
