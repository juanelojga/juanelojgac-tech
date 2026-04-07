// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import TypingIndicator from "../TypingIndicator";

describe("TypingIndicator", () => {
  const defaultProps = {
    typingText: "Thinking...",
  };

  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("renders the typing indicator", () => {
      render(<TypingIndicator {...defaultProps} />);
      expect(screen.getByTestId("typing-indicator")).toBeInTheDocument();
    });

    it("renders three animated dots", () => {
      render(<TypingIndicator {...defaultProps} />);
      const dots = screen.getAllByTestId("typing-dot");
      expect(dots).toHaveLength(3);
    });

    it("renders the typing text for screen readers", () => {
      render(<TypingIndicator {...defaultProps} />);
      expect(screen.getByText("Thinking...")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has aria-live='polite' for screen reader announcements", () => {
      render(<TypingIndicator {...defaultProps} />);
      const liveRegion = screen.getByRole("status");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
    });

    it("has an accessible label", () => {
      render(<TypingIndicator {...defaultProps} />);
      const status = screen.getByRole("status");
      expect(status).toBeInTheDocument();
    });
  });

  describe("i18n", () => {
    it("renders Spanish typing text", () => {
      render(<TypingIndicator typingText="Pensando..." />);
      expect(screen.getByText("Pensando...")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies assistant bubble background design token", () => {
      render(<TypingIndicator {...defaultProps} />);
      const indicator = screen.getByTestId("typing-indicator");
      expect(indicator.className).toContain("bg-chat-bubble-assistant");
    });
  });
});
