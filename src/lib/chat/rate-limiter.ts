// ──────────────────────────────────────────────
// Rate Limiter — in-memory sliding window
// SRP: tracks request counts per IP within a time window
// Designed for Netlify Functions (stateless — resets on cold start)
// ──────────────────────────────────────────────

/** Configuration for the rate limiter */
export interface RateLimitConfig {
  /** Maximum requests allowed per window */
  readonly maxRequests: number;
  /** Window duration in milliseconds */
  readonly windowMs: number;
}

/** Result of a rate limit check */
export interface RateLimitResult {
  /** Whether the request is allowed */
  readonly allowed: boolean;
  /** Number of remaining requests in the current window */
  readonly remaining: number;
  /** If blocked, milliseconds until the client can retry */
  readonly retryAfterMs: number;
}

/** Default rate limit: 20 requests per minute */
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 20,
  windowMs: 60_000,
};

/**
 * In-memory sliding window rate limiter.
 * Tracks timestamps of requests per key (typically IP address).
 * Old timestamps outside the window are pruned on each check.
 */
export class RateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly requests: Map<string, number[]> = new Map();

  constructor(config: RateLimitConfig = DEFAULT_RATE_LIMIT_CONFIG) {
    this.maxRequests = config.maxRequests;
    this.windowMs = config.windowMs;
  }

  /**
   * Checks if a request from the given key is within the rate limit.
   * If allowed, records the request timestamp.
   *
   * @param key - Identifier for the client (typically IP address)
   * @returns Rate limit result with allowed status and remaining quota
   */
  checkLimit(key: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing timestamps and prune expired ones
    const timestamps = this.requests.get(key) ?? [];
    const activeTimestamps = timestamps.filter((t) => t > windowStart);

    if (activeTimestamps.length >= this.maxRequests) {
      // Blocked — calculate retry time based on oldest active timestamp
      const oldestTimestamp = activeTimestamps[0];
      const retryAfterMs = oldestTimestamp + this.windowMs - now;

      // Update stored timestamps (pruned)
      this.requests.set(key, activeTimestamps);

      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(0, retryAfterMs),
      };
    }

    // Allowed — record this request
    activeTimestamps.push(now);
    this.requests.set(key, activeTimestamps);

    return {
      allowed: true,
      remaining: this.maxRequests - activeTimestamps.length,
      retryAfterMs: 0,
    };
  }

  /**
   * Cleans up expired entries to prevent memory leaks.
   * Call periodically in long-running processes.
   */
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, timestamps] of this.requests.entries()) {
      const active = timestamps.filter((t) => t > windowStart);
      if (active.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, active);
      }
    }
  }
}
