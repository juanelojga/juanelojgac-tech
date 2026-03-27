// @vitest-environment jsdom
/**
 * Phase 7 — Animation Polish & Responsive Verification Tests
 *
 * Tests for:
 * - prefers-reduced-motion handling across all components
 * - Mobile-responsive layout changes (trust metrics, touch targets)
 * - Animation timing and stagger adjustments
 */
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ServiceCard from "../react/ServiceCard";
import TrustMetrics from "../react/TrustMetrics";

// ─── Mocks ───

const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor(_callback: IntersectionObserverCallback) {
    // callback stored but not used by these tests
  }

  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
  root = null;
  rootMargin = "";
  thresholds = [0];
  takeRecords = () => [] as IntersectionObserverEntry[];
}

// ─── Tests ───

describe("Phase 7: Animation Polish", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
  });

  describe("ServiceCard — reduced motion", () => {
    const mockProps = {
      icon: "code" as const,
      title: "Web Development",
      description: "Modern platforms built for speed and scale.",
      index: 2,
    };

    it("shows cards immediately when prefers-reduced-motion is enabled", () => {
      // Simulate prefers-reduced-motion: reduce
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn() })
      );

      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;

      // With reduced motion, card should be visible immediately
      expect(card.style.opacity).toBe("1");
    });

    it("does not set up IntersectionObserver when reduced motion is preferred", () => {
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn() })
      );

      render(<ServiceCard {...mockProps} />);

      // Observer should not be called because card is immediately visible
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it("uses 0ms stagger delay when reduced motion is preferred", () => {
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn() })
      );

      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;

      expect(card.style.transitionDelay).toBe("0ms");
    });

    it("disables transitions when reduced motion is preferred", () => {
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn() })
      );

      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;

      expect(card.style.transition).toBe("none");
    });

    it("uses 120ms stagger intervals when motion is allowed", () => {
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() })
      );

      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;

      // Index 2 × 120ms = 240ms
      expect(card.style.transitionDelay).toBe("240ms");
    });

    it("has motion-reduce CSS classes for hover transforms", () => {
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() })
      );

      const { container } = render(<ServiceCard {...mockProps} />);
      const card = container.firstChild as HTMLElement;

      expect(card.className).toContain("motion-reduce:transition-none");
      expect(card.className).toContain("motion-reduce:hover:translate-y-0");
    });

    it("has motion-reduce classes on icon scale animation", () => {
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() })
      );

      const { container } = render(<ServiceCard {...mockProps} />);
      const iconContainer = container.querySelector(".text-accent-cyan") as HTMLElement;

      expect(iconContainer.className).toContain("motion-reduce:transition-none");
      expect(iconContainer.className).toContain("motion-reduce:group-hover:scale-100");
    });

    it("has motion-reduce classes on arrow translate", () => {
      vi.stubGlobal(
        "matchMedia",
        vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() })
      );

      render(<ServiceCard {...mockProps} />);
      const arrow = screen.getByText("→");

      expect(arrow.className).toContain("motion-reduce:transition-none");
      expect(arrow.className).toContain("motion-reduce:group-hover:translate-x-0");
    });
  });

  describe("TrustMetrics — responsive layout", () => {
    const mockMetrics = [
      { value: "50+", label: "Projects Delivered", numericValue: 50 },
      { value: "98%", label: "Client Satisfaction", numericValue: 98 },
      { value: "US & LATAM", label: "Clients Served" },
    ];

    it("uses single-column grid on mobile", () => {
      const { container } = render(<TrustMetrics metrics={mockMetrics} />);
      const grid = container.firstChild as HTMLElement;

      expect(grid.className).toContain("grid-cols-1");
    });

    it("uses 3-column grid on sm: breakpoint", () => {
      const { container } = render(<TrustMetrics metrics={mockMetrics} />);
      const grid = container.firstChild as HTMLElement;

      expect(grid.className).toContain("sm:grid-cols-3");
    });

    it("uses tighter gap on mobile", () => {
      const { container } = render(<TrustMetrics metrics={mockMetrics} />);
      const grid = container.firstChild as HTMLElement;

      expect(grid.className).toContain("gap-4");
      expect(grid.className).toContain("sm:gap-6");
    });
  });
});
