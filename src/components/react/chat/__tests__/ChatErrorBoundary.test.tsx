// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ChatErrorBoundary, { type ErrorBoundaryTranslations } from "../ChatErrorBoundary";

const mockTranslations: ErrorBoundaryTranslations = {
  title: "Something went wrong",
  description: "The chat encountered an error. Please try refreshing the page.",
  retry: "Try Again",
};

// Component that throws an error on demand
function BrokenComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test render error");
  }
  return <div>Content renders successfully</div>;
}

describe("ChatErrorBoundary", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("normal rendering", () => {
    it("renders children when no error occurs", () => {
      render(
        <ChatErrorBoundary translations={mockTranslations}>
          <div>Child content</div>
        </ChatErrorBoundary>
      );
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("does not show error UI when rendering normally", () => {
      render(
        <ChatErrorBoundary translations={mockTranslations}>
          <div>Healthy child</div>
        </ChatErrorBoundary>
      );
      expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("shows error UI when a child throws", () => {
      // Suppress console.error from React and the error boundary
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <ChatErrorBoundary translations={mockTranslations}>
          <BrokenComponent shouldThrow={true} />
        </ChatErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByText("The chat encountered an error. Please try refreshing the page.")
      ).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("renders a retry button on error", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <ChatErrorBoundary translations={mockTranslations}>
          <BrokenComponent shouldThrow={true} />
        </ChatErrorBoundary>
      );

      expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("renders an alert role for accessibility", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <ChatErrorBoundary translations={mockTranslations}>
          <BrokenComponent shouldThrow={true} />
        </ChatErrorBoundary>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("logs error to console", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <ChatErrorBoundary translations={mockTranslations}>
          <BrokenComponent shouldThrow={true} />
        </ChatErrorBoundary>
      );

      // React logs errors + our boundary logs
      expect(consoleSpy).toHaveBeenCalled();
      const boundaryLog = consoleSpy.mock.calls.find((call) => call[0] === "[ChatErrorBoundary]");
      expect(boundaryLog).toBeDefined();

      consoleSpy.mockRestore();
    });
  });

  describe("retry behavior", () => {
    it("re-renders children after clicking retry", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // First render will throw, but after retry with shouldThrow=false it should work
      // We need to control the throw state externally
      let shouldThrow = true;

      function ConditionalBroken() {
        if (shouldThrow) {
          throw new Error("Test error");
        }
        return <div>Recovered content</div>;
      }

      render(
        <ChatErrorBoundary translations={mockTranslations}>
          <ConditionalBroken />
        </ChatErrorBoundary>
      );

      // Should be in error state
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Fix the component
      shouldThrow = false;

      // Click retry
      fireEvent.click(screen.getByRole("button", { name: "Try Again" }));

      // Should recover
      expect(screen.getByText("Recovered content")).toBeInTheDocument();
      expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
