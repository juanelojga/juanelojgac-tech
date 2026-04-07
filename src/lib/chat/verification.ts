// ──────────────────────────────────────────────
// Turnstile Token Verification — server-side
// SRP: validates Cloudflare Turnstile tokens
// Only runs in Netlify Functions (server context)
// ──────────────────────────────────────────────

/** Cloudflare Turnstile verification endpoint */
export const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Result of server-side token verification */
export interface TurnstileVerificationResult {
  readonly success: boolean;
  readonly errorCodes: readonly string[];
}

/**
 * Verifies a Turnstile token with the Cloudflare API.
 *
 * @param token - The response token from the client widget
 * @param secretKey - The Turnstile secret key (server-side only)
 * @param remoteIp - Optional: the client's IP address
 * @returns Verification result indicating success or failure with error codes
 */
export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  remoteIp?: string
): Promise<TurnstileVerificationResult> {
  // Input validation — fail fast without network call
  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }
  if (!secretKey) {
    return { success: false, errorCodes: ["missing-input-secret"] };
  }

  // Build form-urlencoded body
  const params = new URLSearchParams();
  params.set("secret", secretKey);
  params.set("response", token);
  if (remoteIp) {
    params.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      return { success: false, errorCodes: ["api-error"] };
    }

    const data = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    return {
      success: data.success,
      errorCodes: data["error-codes"] ?? [],
    };
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return { success: false, errorCodes: ["parse-error"] };
    }
    return { success: false, errorCodes: ["network-error"] };
  }
}
