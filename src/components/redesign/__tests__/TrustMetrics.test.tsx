// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import TrustMetrics from "../react/TrustMetrics";

const mockMetrics = [
  { value: "50+", label: "Projects Delivered", numericValue: 50 },
  { value: "98%", label: "Client Satisfaction", numericValue: 98 },
  { value: "US & LATAM", label: "Clients Served" },
];

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
  root = null;
  rootMargin = "";
  thresholds = [0];
  takeRecords = () => [] as IntersectionObserverEntry[];
}

describe("TrustMetrics", () => {
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
      const { container } = render(<TrustMetrics metrics={mockMetrics} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders all metric labels", () => {
      render(<TrustMetrics metrics={mockMetrics} />);
      expect(screen.getByText("Projects Delivered")).toBeInTheDocument();
      expect(screen.getByText("Client Satisfaction")).toBeInTheDocument();
      expect(screen.getByText("Clients Served")).toBeInTheDocument();
    });

    it("renders initial values (0 or text) before intersection", () => {
      render(<TrustMetrics metrics={mockMetrics} />);
      // Numeric metrics should start at 0 before intersection
      const values = screen.getAllByTestId("metric-value");
      expect(values[0].textContent).toContain("0");
      expect(values[1].textContent).toContain("0");
      // Text-only metric shows text directly
      expect(values[2].textContent).toContain("US & LATAM");
    });

    it("renders correct number of metrics", () => {
      render(<TrustMetrics metrics={mockMetrics} />);
      const labels = screen.getAllByTestId("metric-label");
      expect(labels).toHaveLength(3);
    });
  });

  describe("accessibility", () => {
    it("provides screen reader text with final values", () => {
      render(<TrustMetrics metrics={mockMetrics} />);
      // Should have sr-only text with the final static values
      const srTexts = document.querySelectorAll(".sr-only");
      expect(srTexts.length).toBeGreaterThan(0);
    });

    it("uses tabular-nums for stable number widths", () => {
      const { container } = render(<TrustMetrics metrics={mockMetrics} />);
      const html = container.innerHTML;
      expect(html).toContain("tabular-nums");
    });
  });

  describe("IntersectionObserver", () => {
    it("sets up IntersectionObserver on mount", () => {
      render(<TrustMetrics metrics={mockMetrics} />);
      expect(mockObserve).toHaveBeenCalledTimes(1);
    });
  });

  describe("text-only metrics", () => {
    it("renders text-only metrics without count-up", () => {
      const textOnlyMetrics = [
        { value: "US & LATAM", label: "Markets" },
      ];
      render(<TrustMetrics metrics={textOnlyMetrics} />);
      expect(screen.getByText("US & LATAM")).toBeInTheDocument();
    });
  });
});
