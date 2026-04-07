// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { OutcomePrompt } from "../../../lib/chat/types";
import TrustPanel, { type TrustPanelTranslations } from "../TrustPanel";

const mockServices = [
  {
    id: "svc-web-development",
    title: "Web Development",
    shortDescription: "Custom platforms, e-commerce, dashboards, and web apps",
    relatedPrompt: "I need a web platform built for my business",
  },
  {
    id: "svc-automation",
    title: "Workflow Automation",
    shortDescription: "Eliminate manual tasks and reclaim your time",
    relatedPrompt: "I want to automate repetitive tasks in my business",
  },
  {
    id: "svc-ai",
    title: "AI Integration",
    shortDescription: "Integrate AI into your workflows",
    relatedPrompt: "I want to integrate AI into my business",
  },
];

const mockOutcomePrompts: OutcomePrompt[] = [
  {
    id: "outcome-grow-revenue",
    label: "Grow revenue with AI",
    prompt: "How can AI help me grow revenue?",
    icon: "chart-up",
  },
  {
    id: "outcome-automate-ops",
    label: "Automate operations",
    prompt: "I want to automate my operations",
    icon: "cog",
  },
];

const mockTranslations: TrustPanelTranslations = {
  servicesLabel: "Our Services",
  collapseLabel: "Show details",
  expandLabel: "Hide details",
  outcomesLabel: "How can we help?",
  panelLabel: "Service information panel",
};

const defaultProps = {
  services: mockServices,
  outcomePrompts: mockOutcomePrompts,
  onPromptInject: vi.fn(),
  translations: mockTranslations,
};

describe("TrustPanel", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("services section", () => {
    it("renders the services section label", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("Our Services")).toBeInTheDocument();
    });

    it("renders all service items", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("Web Development")).toBeInTheDocument();
      expect(screen.getByText("Workflow Automation")).toBeInTheDocument();
      expect(screen.getByText("AI Integration")).toBeInTheDocument();
    });

    it("renders service short descriptions", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(
        screen.getByText("Custom platforms, e-commerce, dashboards, and web apps")
      ).toBeInTheDocument();
    });
  });

  describe("outcome prompts section", () => {
    it("renders the outcomes section label", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("How can we help?")).toBeInTheDocument();
    });

    it("renders all outcome prompts", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("Grow revenue with AI")).toBeInTheDocument();
      expect(screen.getByText("Automate operations")).toBeInTheDocument();
    });

    it("does not render outcomes section when array is empty", () => {
      render(<TrustPanel {...defaultProps} outcomePrompts={[]} />);
      expect(screen.queryByText("How can we help?")).not.toBeInTheDocument();
    });

    it("calls onPromptInject when an outcome is clicked", () => {
      const onPromptInject = vi.fn();
      render(<TrustPanel {...defaultProps} onPromptInject={onPromptInject} />);

      fireEvent.click(screen.getByTestId("outcome-prompt-outcome-grow-revenue"));
      expect(onPromptInject).toHaveBeenCalledWith("How can AI help me grow revenue?");
    });
  });

  describe("section ordering", () => {
    it("renders outcomes before services", () => {
      const { container } = render(<TrustPanel {...defaultProps} />);
      const html = container.innerHTML;
      const outcomesPos = html.indexOf("How can we help?");
      const servicesPos = html.indexOf("Our Services");
      expect(outcomesPos).toBeLessThan(servicesPos);
    });
  });

  describe("service click interaction", () => {
    it("calls onPromptInject when a service item is clicked", () => {
      const onPromptInject = vi.fn();
      render(<TrustPanel {...defaultProps} onPromptInject={onPromptInject} />);

      fireEvent.click(screen.getByTestId("service-item-svc-web-development"));
      expect(onPromptInject).toHaveBeenCalledWith("I need a web platform built for my business");
    });

    it("calls onPromptInject with correct prompt for each service", () => {
      const onPromptInject = vi.fn();
      render(<TrustPanel {...defaultProps} onPromptInject={onPromptInject} />);

      fireEvent.click(screen.getByTestId("service-item-svc-automation"));
      expect(onPromptInject).toHaveBeenCalledWith(
        "I want to automate repetitive tasks in my business"
      );
    });
  });

  describe("accessibility", () => {
    it("has a navigation landmark for the panel", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("has an accessible label for the panel", () => {
      render(<TrustPanel {...defaultProps} />);
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveAttribute("aria-label", "Service information panel");
    });

    it("service items are all interactive buttons", () => {
      render(<TrustPanel {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("responsive toggle", () => {
    it("renders a toggle button for mobile", () => {
      render(<TrustPanel {...defaultProps} />);
      const toggleBtn = screen.getByTestId("panel-toggle");
      expect(toggleBtn).toBeInTheDocument();
    });

    it("toggle button shows expand label by default on mobile", () => {
      render(<TrustPanel {...defaultProps} />);
      const toggleBtn = screen.getByTestId("panel-toggle");
      expect(toggleBtn).toHaveTextContent("Show details");
    });
  });
});
