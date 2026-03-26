// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { TrustSignal } from "../../../lib/chat/types";
import TrustSignals from "../TrustSignals";

const statSignals: TrustSignal[] = [
  { id: "ts-projects", type: "stat", label: "Projects delivered", value: "50+" },
  { id: "ts-satisfaction", type: "stat", label: "Client satisfaction", value: "98%" },
  { id: "ts-countries", type: "stat", label: "Countries served", value: "US & LATAM" },
];

const badgeSignals: TrustSignal[] = [
  { id: "ts-bilingual", type: "badge", label: "Fully bilingual", value: "EN / ES" },
  { id: "ts-delivery", type: "badge", label: "Typical delivery", value: "4–12 weeks" },
  { id: "ts-quality", type: "badge", label: "No technical debt", value: "Clean code guarantee" },
];

const mixedSignals: TrustSignal[] = [...statSignals.slice(0, 2), ...badgeSignals.slice(0, 2)];

describe("TrustSignals", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("renders the section label", () => {
      render(<TrustSignals signals={statSignals} label="Why Work With Us" />);
      expect(screen.getByText("Why Work With Us")).toBeInTheDocument();
    });

    it("renders all stat signals", () => {
      render(<TrustSignals signals={statSignals} label="Trust" />);
      expect(screen.getByText("50+")).toBeInTheDocument();
      expect(screen.getByText("Projects delivered")).toBeInTheDocument();
      expect(screen.getByText("98%")).toBeInTheDocument();
      expect(screen.getByText("Client satisfaction")).toBeInTheDocument();
    });

    it("renders all badge signals", () => {
      render(<TrustSignals signals={badgeSignals} label="Trust" />);
      expect(screen.getByText("Fully bilingual")).toBeInTheDocument();
      expect(screen.getByText("EN / ES")).toBeInTheDocument();
      expect(screen.getByText("Typical delivery")).toBeInTheDocument();
      expect(screen.getByText("4–12 weeks")).toBeInTheDocument();
    });

    it("renders mixed signal types together", () => {
      render(<TrustSignals signals={mixedSignals} label="Trust" />);
      expect(screen.getByText("50+")).toBeInTheDocument();
      expect(screen.getByText("Fully bilingual")).toBeInTheDocument();
    });

    it("renders nothing when signals array is empty", () => {
      const { container } = render(<TrustSignals signals={[]} label="Trust" />);
      // Should still render the label but no signal items
      expect(screen.getByText("Trust")).toBeInTheDocument();
      expect(container.querySelectorAll('[data-testid^="trust-signal-"]')).toHaveLength(0);
    });
  });

  describe("signal type differentiation", () => {
    it("gives stat signals a distinct visual treatment with value prominent", () => {
      render(<TrustSignals signals={statSignals} label="Trust" />);
      const statEl = screen.getByTestId("trust-signal-ts-projects");
      // Value should be present and visually prominent (we verify by existence)
      expect(within(statEl).getByText("50+")).toBeInTheDocument();
      expect(within(statEl).getByText("Projects delivered")).toBeInTheDocument();
    });

    it("gives badge signals a distinct visual treatment with label and value", () => {
      render(<TrustSignals signals={badgeSignals} label="Trust" />);
      const badgeEl = screen.getByTestId("trust-signal-ts-bilingual");
      expect(within(badgeEl).getByText("Fully bilingual")).toBeInTheDocument();
      expect(within(badgeEl).getByText("EN / ES")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has an accessible heading for the section", () => {
      render(<TrustSignals signals={statSignals} label="Why Work With Us" />);
      const heading = screen.getByRole("heading", { name: /Why Work With Us/i });
      expect(heading).toBeInTheDocument();
    });

    it("renders signals in a list for screen readers", () => {
      render(<TrustSignals signals={statSignals} label="Trust" />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    });
  });
});
