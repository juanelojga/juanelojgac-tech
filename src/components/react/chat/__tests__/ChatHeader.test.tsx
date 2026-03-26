// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import ChatHeader from "../ChatHeader";

describe("ChatHeader", () => {
  const defaultProps = {
    title: "AI Consultant",
    subtitle: "Ask about our services, pricing, process, and more",
  };

  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("renders the title text", () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByText("AI Consultant")).toBeInTheDocument();
    });

    it("renders the subtitle text", () => {
      render(<ChatHeader {...defaultProps} />);
      expect(
        screen.getByText("Ask about our services, pricing, process, and more")
      ).toBeInTheDocument();
    });

    it("uses a banner role for the header region", () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders title as a heading element", () => {
      render(<ChatHeader {...defaultProps} />);
      const heading = screen.getByRole("heading", { name: /AI Consultant/i });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("i18n", () => {
    it("renders Spanish title and subtitle", () => {
      render(
        <ChatHeader
          title="Consultor de IA"
          subtitle="Pregunta sobre nuestros servicios, precios, proceso y más"
        />
      );
      expect(screen.getByText("Consultor de IA")).toBeInTheDocument();
      expect(
        screen.getByText("Pregunta sobre nuestros servicios, precios, proceso y más")
      ).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies header background design token class", () => {
      render(<ChatHeader {...defaultProps} />);
      const banner = screen.getByRole("banner");
      expect(banner.className).toContain("bg-chat-panel-header-bg");
    });

    it("applies header text color design token class", () => {
      render(<ChatHeader {...defaultProps} />);
      const banner = screen.getByRole("banner");
      expect(banner.className).toContain("text-chat-panel-header-text");
    });
  });
});
