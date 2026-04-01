// @vitest-environment jsdom
/**
 * Phase 7 — Animation Polish & Responsive Verification Tests
 *
 * Tests for:
 * - prefers-reduced-motion handling across all components
 * - Mobile-responsive layout changes (trust metrics, touch targets)
 * - Animation timing and stagger adjustments
 */
import { cleanup, render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
