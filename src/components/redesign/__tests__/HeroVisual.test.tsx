// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import HeroVisual from "../react/HeroVisual";

describe("HeroVisual", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<HeroVisual />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders the visual container with aria-hidden", () => {
      render(<HeroVisual />);
      const visual = screen.getByRole("presentation", { hidden: true });
      expect(visual).toBeInTheDocument();
    });

    it("accepts optional className prop", () => {
      const { container } = render(<HeroVisual className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders glass panel elements", () => {
      const { container } = render(<HeroVisual />);
      // Should contain glassmorphism-styled elements
      const glassElements = container.querySelectorAll("[class*='backdrop-blur']");
      expect(glassElements.length).toBeGreaterThan(0);
    });

    it("renders glow accent shapes", () => {
      const { container } = render(<HeroVisual />);
      // Should contain glow gradient shapes
      const glowElements = container.querySelectorAll("[class*='blur-']");
      expect(glowElements.length).toBeGreaterThan(0);
    });
  });

  describe("animations", () => {
    it("applies float animation classes", () => {
      const { container } = render(<HeroVisual />);
      const html = container.innerHTML;
      expect(html).toContain("float");
    });

    it("uses motion-safe for animations", () => {
      const { container } = render(<HeroVisual />);
      const html = container.innerHTML;
      // Animations should be wrapped in motion-safe or use the class
      expect(html).toMatch(/motion-safe|prefers-reduced-motion/);
    });

    it("uses will-change for GPU acceleration", () => {
      const { container } = render(<HeroVisual />);
      const html = container.innerHTML;
      expect(html).toContain("will-change");
    });
  });

  describe("accessibility", () => {
    it("is hidden from screen readers as decorative content", () => {
      const { container } = render(<HeroVisual />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    });
  });
});
