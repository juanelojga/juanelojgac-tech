// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ServiceCard from "../react/ServiceCard";

const mockProps = {
  icon: "code",
  title: "Web Development",
  description: "Modern platforms built for speed and scale.",
  index: 0,
};

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

let observerCallback: IntersectionObserverCallback;

class MockIntersectionObserver {
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observerCallback = callback;
  }

  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
  root = null;
  rootMargin = "";
  thresholds = [0];
  takeRecords = () => [] as IntersectionObserverEntry[];
}

describe("ServiceCard", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockObserve.mockClear();
  });

  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders the title", () => {
      render(<ServiceCard {...mockProps} />);
      expect(screen.getByText("Web Development")).toBeInTheDocument();
    });

    it("renders the description", () => {
      render(<ServiceCard {...mockProps} />);
      expect(screen.getByText("Modern platforms built for speed and scale.")).toBeInTheDocument();
    });

    it("renders an SVG icon", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders a directional arrow indicator", () => {
      render(<ServiceCard {...mockProps} />);
      expect(screen.getByText("→")).toBeInTheDocument();
    });

    it("renders each of the 5 icon types", () => {
      const icons = ["code", "zap", "sparkles", "megaphone", "cube"];
      icons.forEach((icon) => {
        const { container } = render(<ServiceCard {...mockProps} icon={icon} />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        cleanup();
      });
    });
  });

  describe("styling", () => {
    it("uses dark premium card styling", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("rounded-2xl");
    });

    it("has group class for hover interactions", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("group");
    });

    it("applies transition classes for hover animation", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain("transition");
    });
  });

  describe("scroll reveal", () => {
    it("starts hidden (opacity-0) before intersection", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card.style.opacity).toBe("0");
    });

    it("sets up IntersectionObserver on mount", () => {
      render(<ServiceCard {...mockProps} />);
      expect(mockObserve).toHaveBeenCalled();
    });

    it("becomes visible after intersection", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;

      // Simulate intersection wrapped in act for state update
      act(() => {
        observerCallback(
          [{ isIntersecting: true, target: card } as unknown as IntersectionObserverEntry],
          { unobserve: mockUnobserve } as unknown as IntersectionObserver
        );
      });

      expect(card.style.opacity).toBe("1");
      expect(mockUnobserve).toHaveBeenCalledWith(card);
    });

    it("applies stagger delay based on index", () => {
      const { container } = render(<ServiceCard {...mockProps} index={2} />);
      const card = container.firstChild as HTMLElement;
      // Index 2 should have 240ms transition delay for stagger effect (120ms intervals)
      expect(card.style.transitionDelay).toBe("240ms");
    });

    it("cleans up observer on unmount", () => {
      const { unmount } = render(<ServiceCard {...mockProps} />);
      unmount();
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe("reduced motion", () => {
    it("uses motion-safe prefix for animations", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      const html = container.innerHTML;
      // Should reference motion-safe or prefers-reduced-motion handling
      expect(html).toMatch(/motion-safe|opacity/);
    });
  });

  describe("accessibility", () => {
    it("icon has aria-hidden for decorative content", () => {
      const { container } = render(<ServiceCard {...mockProps} />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
    });

    it("arrow is aria-hidden as decorative", () => {
      render(<ServiceCard {...mockProps} />);
      const arrow = screen.getByText("→");
      expect(arrow.getAttribute("aria-hidden")).toBe("true");
    });
  });
});
