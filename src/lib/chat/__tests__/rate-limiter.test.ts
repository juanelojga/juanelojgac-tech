import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type RateLimitConfig, RateLimiter, type RateLimitResult } from "../rate-limiter";

// ──────────────────────────────────────────────
// Tests for in-memory sliding window rate limiter
// ──────────────────────────────────────────────

describe("RateLimiter", () => {
  let limiter: RateLimiter;

  const testConfig: RateLimitConfig = {
    maxRequests: 5,
    windowMs: 60_000, // 1 minute
  };

  beforeEach(() => {
    vi.useFakeTimers();
    limiter = new RateLimiter(testConfig);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("basic rate limiting", () => {
    it("allows requests under the limit", () => {
      const result = limiter.checkLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4); // 5 - 1 = 4
    });

    it("allows the exact limit of requests", () => {
      let result: RateLimitResult = { allowed: true, remaining: 0, retryAfterMs: 0 };
      for (let i = 0; i < 5; i++) {
        result = limiter.checkLimit("192.168.1.1");
      }

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it("blocks requests over the limit", () => {
      // Use all 5 requests
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit("192.168.1.1");
      }

      // 6th should be blocked
      const result = limiter.checkLimit("192.168.1.1");

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfterMs).toBeGreaterThan(0);
    });

    it("tracks different IPs independently", () => {
      // Exhaust limit for IP A
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit("192.168.1.1");
      }

      // IP B should still be allowed
      const result = limiter.checkLimit("192.168.1.2");

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("decrements remaining count correctly", () => {
      expect(limiter.checkLimit("10.0.0.1").remaining).toBe(4);
      expect(limiter.checkLimit("10.0.0.1").remaining).toBe(3);
      expect(limiter.checkLimit("10.0.0.1").remaining).toBe(2);
      expect(limiter.checkLimit("10.0.0.1").remaining).toBe(1);
      expect(limiter.checkLimit("10.0.0.1").remaining).toBe(0);
    });
  });

  describe("sliding window behavior", () => {
    it("resets after window period", () => {
      // Use all requests
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit("192.168.1.1");
      }

      // Should be blocked
      expect(limiter.checkLimit("192.168.1.1").allowed).toBe(false);

      // Advance past window
      vi.advanceTimersByTime(60_001);

      // Should be allowed again
      const result = limiter.checkLimit("192.168.1.1");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("slides window correctly — old requests drop off", () => {
      // Make 3 requests at t=0
      limiter.checkLimit("10.0.0.1");
      limiter.checkLimit("10.0.0.1");
      limiter.checkLimit("10.0.0.1");

      // Advance 30s
      vi.advanceTimersByTime(30_000);

      // Make 2 more requests at t=30s
      limiter.checkLimit("10.0.0.1");
      limiter.checkLimit("10.0.0.1");

      // At t=30s: 5 requests in window → should be blocked
      expect(limiter.checkLimit("10.0.0.1").allowed).toBe(false);

      // Advance to t=61s — first 3 requests drop off
      vi.advanceTimersByTime(31_000);

      // Should be allowed (only 2 requests from t=30s still in window)
      const result = limiter.checkLimit("10.0.0.1");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2); // 5 - (2 old + 1 new) = 2
    });

    it("provides correct retryAfterMs when blocked", () => {
      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit("192.168.1.1");
      }

      const result = limiter.checkLimit("192.168.1.1");

      expect(result.allowed).toBe(false);
      expect(result.retryAfterMs).toBeGreaterThan(0);
      expect(result.retryAfterMs).toBeLessThanOrEqual(60_000);
    });
  });

  describe("cleanup", () => {
    it("cleans up expired entries", () => {
      limiter.checkLimit("192.168.1.1");
      limiter.checkLimit("192.168.1.2");

      // Advance past window
      vi.advanceTimersByTime(61_000);

      limiter.cleanup();

      // Both IPs should be allowed with fresh limits
      expect(limiter.checkLimit("192.168.1.1").remaining).toBe(4);
      expect(limiter.checkLimit("192.168.1.2").remaining).toBe(4);
    });
  });

  describe("edge cases", () => {
    it("handles empty IP string", () => {
      const result = limiter.checkLimit("");

      // Should still work — treats empty string as key
      expect(result.allowed).toBe(true);
    });

    it("handles very fast sequential requests", () => {
      const results: RateLimitResult[] = [];
      for (let i = 0; i < 10; i++) {
        results.push(limiter.checkLimit("fast-ip"));
      }

      // First 5 allowed, rest blocked
      expect(results.filter((r) => r.allowed).length).toBe(5);
      expect(results.filter((r) => !r.allowed).length).toBe(5);
    });
  });

  describe("custom configuration", () => {
    it("respects custom maxRequests", () => {
      const strictLimiter = new RateLimiter({ maxRequests: 2, windowMs: 60_000 });

      expect(strictLimiter.checkLimit("ip").allowed).toBe(true);
      expect(strictLimiter.checkLimit("ip").allowed).toBe(true);
      expect(strictLimiter.checkLimit("ip").allowed).toBe(false);
    });

    it("respects custom window period", () => {
      const shortWindow = new RateLimiter({ maxRequests: 5, windowMs: 1000 });

      for (let i = 0; i < 5; i++) {
        shortWindow.checkLimit("ip");
      }

      expect(shortWindow.checkLimit("ip").allowed).toBe(false);

      vi.advanceTimersByTime(1001);

      expect(shortWindow.checkLimit("ip").allowed).toBe(true);
    });
  });
});
