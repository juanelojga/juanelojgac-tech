// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { TrustSignal } from "../../../lib/chat/types";
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

const mockTrustSignals: TrustSignal[] = [
  { id: "ts-projects", type: "stat", label: "Projects delivered", value: "50+" },
  { id: "ts-satisfaction", type: "stat", label: "Client satisfaction", value: "98%" },
  { id: "ts-bilingual", type: "badge", label: "Fully bilingual", value: "EN / ES" },
];

const mockTranslations: TrustPanelTranslations = {
  servicesLabel: "Our Services",
  trustLabel: "Why Work With Us",
  ctaBooking: "Book a Free Consultation",
  ctaContact: "Contact Us",
  collapseLabel: "Show details",
  expandLabel: "Hide details",
};

const defaultProps = {
  companyName: "JuaneloJGAC Tech",
  tagline: "Practical AI solutions delivered with clarity, speed, and human-centered design",
  services: mockServices,
  trustSignals: mockTrustSignals,
  onPromptInject: vi.fn(),
  translations: mockTranslations,
  bookingUrl: "https://calendly.com/juanelojgac",
  contactEmail: "hello@juanelojgac.tech",
};

describe("TrustPanel", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("identity section", () => {
    it("renders the company name", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("JuaneloJGAC Tech")).toBeInTheDocument();
    });

    it("renders the company tagline", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(
        screen.getByText(
          "Practical AI solutions delivered with clarity, speed, and human-centered design"
        )
      ).toBeInTheDocument();
    });
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

  describe("trust signals section", () => {
    it("renders the trust signals section label", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("Why Work With Us")).toBeInTheDocument();
    });

    it("renders stat trust signals", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("50+")).toBeInTheDocument();
      expect(screen.getByText("98%")).toBeInTheDocument();
    });

    it("renders badge trust signals", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("Fully bilingual")).toBeInTheDocument();
    });
  });

  describe("CTA section", () => {
    it("renders the booking CTA", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("Book a Free Consultation")).toBeInTheDocument();
    });

    it("renders the contact CTA", () => {
      render(<TrustPanel {...defaultProps} />);
      expect(screen.getByText("Contact Us")).toBeInTheDocument();
    });

    it("booking CTA links to Calendly", () => {
      render(<TrustPanel {...defaultProps} />);
      const link = screen.getByRole("link", { name: /Book a Free Consultation/i });
      expect(link).toHaveAttribute("href", "https://calendly.com/juanelojgac");
    });

    it("contact CTA links to email", () => {
      render(<TrustPanel {...defaultProps} />);
      const link = screen.getByRole("link", { name: /Contact Us/i });
      expect(link).toHaveAttribute("href", "mailto:hello@juanelojgac.tech");
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
      expect(aside).toHaveAttribute("aria-label");
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
