import { beforeEach, describe, expect, it, vi } from "vitest";

import { TURNSTILE_VERIFY_URL, verifyTurnstileToken } from "../verification";

// ──────────────────────────────────────────────
// Tests for server-side Turnstile token verification
// ──────────────────────────────────────────────

// Mock global fetch
const mockFetch = vi.fn() as ReturnType<typeof vi.fn>;

describe("verifyTurnstileToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", mockFetch);
  });

  describe("successful verification", () => {
    it("returns success when Turnstile API validates the token", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            "error-codes": [],
          }),
      });

      const result = await verifyTurnstileToken("valid-token", "test-secret");

      expect(result.success).toBe(true);
      expect(result.errorCodes).toEqual([]);
    });

    it("sends correct payload to Turnstile API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            "error-codes": [],
          }),
      });

      await verifyTurnstileToken("my-token", "my-secret", "1.2.3.4");

      expect(mockFetch).toHaveBeenCalledWith(
        TURNSTILE_VERIFY_URL,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );

      // Verify the body contains correct form data
      const call = mockFetch.mock.calls[0];
      const body = call[1].body as string;
      expect(body).toContain("secret=my-secret");
      expect(body).toContain("response=my-token");
      expect(body).toContain("remoteip=1.2.3.4");
    });

    it("omits remoteip when not provided", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            "error-codes": [],
          }),
      });

      await verifyTurnstileToken("token", "secret");

      const call = mockFetch.mock.calls[0];
      const body = call[1].body as string;
      expect(body).not.toContain("remoteip");
    });
  });

  describe("failed verification", () => {
    it("returns failure when token is invalid", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            "error-codes": ["invalid-input-response"],
          }),
      });

      const result = await verifyTurnstileToken("bad-token", "secret");

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain("invalid-input-response");
    });

    it("returns failure when secret is invalid", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            "error-codes": ["invalid-input-secret"],
          }),
      });

      const result = await verifyTurnstileToken("token", "bad-secret");

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain("invalid-input-secret");
    });

    it("returns failure when token has already been used", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            "error-codes": ["timeout-or-duplicate"],
          }),
      });

      const result = await verifyTurnstileToken("used-token", "secret");

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain("timeout-or-duplicate");
    });
  });

  describe("error handling", () => {
    it("returns failure when fetch throws a network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await verifyTurnstileToken("token", "secret");

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain("network-error");
    });

    it("returns failure when API returns non-ok HTTP status", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("fail")),
      });

      const result = await verifyTurnstileToken("token", "secret");

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain("api-error");
    });

    it("returns failure when API returns unparseable JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new SyntaxError("Unexpected token")),
      });

      const result = await verifyTurnstileToken("token", "secret");

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain("parse-error");
    });
  });

  describe("input validation", () => {
    it("returns failure for empty token", async () => {
      const result = await verifyTurnstileToken("", "secret");

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain("missing-input-response");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns failure for empty secret", async () => {
      const result = await verifyTurnstileToken("token", "");

      expect(result.success).toBe(false);
      expect(result.errorCodes).toContain("missing-input-secret");
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
