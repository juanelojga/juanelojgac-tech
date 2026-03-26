// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import HumanVerification, { type HumanVerificationTranslations } from "../HumanVerification";

const mockTranslations: HumanVerificationTranslations = {
  title: "Verify you're human",
  description: "Please complete the verification below to start chatting.",
  verifying: "Verifying...",
  success: "Verified! You can now start chatting.",
  error: "Verification failed. Please try again.",
  expired: "Verification expired. Please verify again.",
  networkError: "Could not reach verification service.",
  ariaLabel: "Human verification challenge",
};

// Mock Turnstile global
interface MockTurnstile {
  render: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
}

function createMockTurnstile(): MockTurnstile {
  return {
    render: vi.fn().mockReturnValue("widget-123"),
    remove: vi.fn(),
  };
}

describe("HumanVerification", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Clean up global
    delete (window as unknown as Record<string, unknown>).turnstile;
  });

  describe("rendering", () => {
    it("renders the verification title", () => {
      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );
      expect(screen.getByText("Verify you're human")).toBeInTheDocument();
    });

    it("renders the verification description", () => {
      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );
      expect(
        screen.getByText("Please complete the verification below to start chatting.")
      ).toBeInTheDocument();
    });

    it("renders the turnstile widget container", () => {
      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );
      expect(screen.getByTestId("turnstile-widget")).toBeInTheDocument();
    });

    it("has proper ARIA region label", () => {
      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );
      expect(
        screen.getByRole("region", { name: "Human verification challenge" })
      ).toBeInTheDocument();
    });
  });

  describe("turnstile integration", () => {
    it("calls turnstile.render when global is available", () => {
      const mockTurnstile = createMockTurnstile();
      (window as unknown as Record<string, unknown>).turnstile = mockTurnstile;

      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );

      expect(mockTurnstile.render).toHaveBeenCalledTimes(1);
      expect(mockTurnstile.render).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          sitekey: "test-key",
          theme: "light",
        })
      );
    });

    it("shows verifying status when turnstile is rendering", () => {
      const mockTurnstile = createMockTurnstile();
      (window as unknown as Record<string, unknown>).turnstile = mockTurnstile;

      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );

      expect(screen.getByText("Verifying...")).toBeInTheDocument();
    });

    it("calls onVerified when turnstile succeeds", () => {
      const onVerified = vi.fn();
      const mockTurnstile = createMockTurnstile();
      mockTurnstile.render.mockImplementation(
        (_el: HTMLElement, opts: { callback: (token: string) => void }) => {
          // Simulate immediate success
          opts.callback("valid-token-123");
          return "widget-123";
        }
      );
      (window as unknown as Record<string, unknown>).turnstile = mockTurnstile;

      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={onVerified}
          translations={mockTranslations}
        />
      );

      expect(onVerified).toHaveBeenCalledWith("valid-token-123");
    });

    it("shows success message after verification", () => {
      const mockTurnstile = createMockTurnstile();
      mockTurnstile.render.mockImplementation(
        (_el: HTMLElement, opts: { callback: (token: string) => void }) => {
          opts.callback("valid-token-123");
          return "widget-123";
        }
      );
      (window as unknown as Record<string, unknown>).turnstile = mockTurnstile;

      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );

      expect(screen.getByText("Verified! You can now start chatting.")).toBeInTheDocument();
    });

    it("shows error message when verification fails", () => {
      const mockTurnstile = createMockTurnstile();
      mockTurnstile.render.mockImplementation(
        (_el: HTMLElement, opts: { "error-callback": () => void }) => {
          opts["error-callback"]();
          return "widget-123";
        }
      );
      (window as unknown as Record<string, unknown>).turnstile = mockTurnstile;

      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );

      expect(screen.getByText("Verification failed. Please try again.")).toBeInTheDocument();
    });

    it("shows expired message when verification expires", () => {
      const mockTurnstile = createMockTurnstile();
      mockTurnstile.render.mockImplementation(
        (_el: HTMLElement, opts: { "expired-callback": () => void }) => {
          opts["expired-callback"]();
          return "widget-123";
        }
      );
      (window as unknown as Record<string, unknown>).turnstile = mockTurnstile;

      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );

      expect(screen.getByText("Verification expired. Please verify again.")).toBeInTheDocument();
    });

    it("cleans up turnstile widget on unmount", () => {
      const mockTurnstile = createMockTurnstile();
      (window as unknown as Record<string, unknown>).turnstile = mockTurnstile;

      const { unmount } = render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );

      unmount();
      expect(mockTurnstile.remove).toHaveBeenCalledWith("widget-123");
    });

    it("does not render turnstile when global is not available", () => {
      render(
        <HumanVerification
          siteKey="test-key"
          onVerified={vi.fn()}
          translations={mockTranslations}
        />
      );

      // No status message when turnstile isn't loaded
      expect(screen.queryByText("Verifying...")).not.toBeInTheDocument();
    });
  });

  describe("without site key", () => {
    it("does not attempt to render turnstile with empty site key", () => {
      const mockTurnstile = createMockTurnstile();
      (window as unknown as Record<string, unknown>).turnstile = mockTurnstile;

      render(<HumanVerification siteKey="" onVerified={vi.fn()} translations={mockTranslations} />);

      expect(mockTurnstile.render).not.toHaveBeenCalled();
    });
  });
});
