// ──────────────────────────────────────────────
// Verified Session Cache — in-memory TTL map
// SRP: tracks IPs that have passed Turnstile verification
// Designed for Netlify Functions (stateless — resets on cold start)
// Allows multi-turn chat without re-verifying a single-use token
// ──────────────────────────────────────────────

/** TTL for a verified session: 30 minutes */
const VERIFIED_SESSION_TTL_MS = 30 * 60 * 1_000;

interface SessionEntry {
  readonly expiresAt: number;
}

/**
 * Caches IPs that have successfully passed Turnstile verification.
 * After first success, subsequent requests from the same IP bypass
 * re-verification within the TTL window.
 *
 * Turnstile tokens are single-use: siteverify consumes the token on
 * first call, so any subsequent call with the same token returns
 * success=false — causing spurious 403s on every message after the first.
 */
export class VerifiedSessionCache {
  private readonly sessions: Map<string, SessionEntry> = new Map();

  /** Returns true if the given key has an active (non-expired) verified session. */
  isVerified(key: string): boolean {
    const entry = this.sessions.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.sessions.delete(key);
      return false;
    }
    return true;
  }

  /** Records a successful Turnstile verification for the given key. */
  markVerified(key: string): void {
    this.sessions.set(key, { expiresAt: Date.now() + VERIFIED_SESSION_TTL_MS });
  }

  /** Removes expired entries to prevent unbounded memory growth. */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.sessions.entries()) {
      if (now > entry.expiresAt) {
        this.sessions.delete(key);
      }
    }
  }
}
