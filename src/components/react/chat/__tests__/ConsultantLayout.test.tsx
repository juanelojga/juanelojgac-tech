// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { StarterPrompt, TrustSignal } from "../../../../lib/chat/types";
import ConsultantLayout, { type ConsultantLayoutProps } from "../ConsultantLayout";

// ── Test Fixtures ──

const mockServices = [
  {
    id: "svc-web",
    title: "Web Development",
    shortDescription: "Custom web platforms",
    relatedPrompt: "I need a web platform",
  },
  {
    id: "svc-ai",
    title: "AI Integration",
    shortDescription: "Integrate AI into workflows",
    relatedPrompt: "I want to integrate AI",
  },
];

const mockTrustSignals: TrustSignal[] = [
  { id: "ts-projects", type: "stat", label: "Projects delivered", value: "50+" },
  { id: "ts-satisfaction", type: "stat", label: "Client satisfaction", value: "98%" },
];

const mockStarterPrompts: StarterPrompt[] = [
  { id: "sp-1", label: "Tell me about AI", prompt: "Tell me about AI integration", intent: "ai-integration" },
  { id: "sp-2", label: "Web platform", prompt: "I need a web platform", intent: "web-platform" },
];

const mockPanelTranslations = {
  servicesLabel: "Our Services",
  trustLabel: "Why Work With Us",
  ctaBooking: "Book a Free Consultation",
  ctaContact: "Contact Us",
  collapseLabel: "Show details",
  expandLabel: "Hide details",
};

const mockChatTranslations = {
  headerTitle: "AI Consultant",
  headerSubtitle: "Ask about our services",
  inputPlaceholder: "Type your message...",
  inputSend: "Send",
  inputCharacterLimit: "{count}/{max} characters",
  welcomeMessage: "Welcome! How can I help?",
  typingText: "Thinking...",
  chipsLabel: "Suggested prompts",
  chatRegionLabel: "Chat assistant",
  messageListLabel: "Chat messages",
};

const mockLayoutTranslations = {
  consultantSection: "AI Consultant",
  panelLabel: "Service information panel",
  chatLabel: "Chat with our AI consultant",
};

const mockVerificationTranslations = {
  title: "Verify you're human",
  description: "Please complete the verification below to start chatting.",
  verifying: "Verifying...",
  success: "Verified! You can now start chatting.",
  error: "Verification failed. Please try again.",
  expired: "Verification expired. Please verify again.",
  networkError: "Could not reach verification service.",
  ariaLabel: "Human verification challenge",
};

const mockErrorBoundaryTranslations = {
  title: "Something went wrong",
  description: "The chat encountered an error. Please try refreshing the page.",
  retry: "Try Again",
};

const defaultProps: ConsultantLayoutProps = {
  companyName: "JuaneloJGAC Tech",
  tagline: "Practical AI solutions",
  services: mockServices,
  trustSignals: mockTrustSignals,
  starterPrompts: mockStarterPrompts,
  bookingUrl: "https://calendly.com/juanelojgac",
  contactEmail: "hello@juanelojgac.tech",
  panelTranslations: mockPanelTranslations,
  chatTranslations: mockChatTranslations,
  layoutTranslations: mockLayoutTranslations,
  verificationTranslations: mockVerificationTranslations,
  errorBoundaryTranslations: mockErrorBoundaryTranslations,
  turnstileSiteKey: "test-site-key",
  language: "en",
};

describe("ConsultantLayout", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("layout structure", () => {
    it("renders a section with the consultant label", () => {
      render(<ConsultantLayout {...defaultProps} />);
      const section = screen.getByRole("region", { name: "AI Consultant" });
      expect(section).toBeInTheDocument();
    });

    it("contains the trust panel", () => {
      render(<ConsultantLayout {...defaultProps} />);
      expect(screen.getByText("JuaneloJGAC Tech")).toBeInTheDocument();
      expect(screen.getByText("Practical AI solutions")).toBeInTheDocument();
    });

    it("contains the chat panel when verification is skipped", () => {
      render(<ConsultantLayout {...defaultProps} turnstileSiteKey="" />);
      expect(screen.getByRole("region", { name: "Chat assistant" })).toBeInTheDocument();
    });

    it("renders services in the panel", () => {
      render(<ConsultantLayout {...defaultProps} />);
      expect(screen.getByText("Web Development")).toBeInTheDocument();
      expect(screen.getByText("AI Integration")).toBeInTheDocument();
    });

    it("renders trust signals in the panel", () => {
      render(<ConsultantLayout {...defaultProps} />);
      expect(screen.getByText("50+")).toBeInTheDocument();
      expect(screen.getByText("98%")).toBeInTheDocument();
    });
  });

  describe("verification gate", () => {
    it("shows verification before chat when turnstile site key is provided", () => {
      render(<ConsultantLayout {...defaultProps} />);
      expect(screen.getByText("Verify you're human")).toBeInTheDocument();
    });

    it("does not show chat input before verification", () => {
      render(<ConsultantLayout {...defaultProps} />);
      expect(screen.queryByPlaceholderText("Type your message...")).not.toBeInTheDocument();
    });

    it("skips verification when no turnstile site key is provided", () => {
      render(<ConsultantLayout {...defaultProps} turnstileSiteKey="" />);
      // Chat should be directly accessible
      expect(screen.queryByText("Verify you're human")).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
    });
  });

  describe("service click → chat injection", () => {
    it("sends service prompt to chat when a service is clicked after verification", () => {
      // Render without verification gate to test injection
      render(<ConsultantLayout {...defaultProps} turnstileSiteKey="" />);

      // Click on first service
      const serviceButton = screen.getByTestId("service-item-svc-web");
      fireEvent.click(serviceButton);

      // The service's related prompt should appear as a user message
      expect(screen.getByText("I need a web platform")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("renders with proper ARIA landmarks", () => {
      render(<ConsultantLayout {...defaultProps} turnstileSiteKey="" />);
      // Main section
      expect(screen.getByRole("region", { name: "AI Consultant" })).toBeInTheDocument();
      // Chat region nested
      expect(screen.getByRole("region", { name: "Chat assistant" })).toBeInTheDocument();
    });

    it("renders panel with company name as label", () => {
      render(<ConsultantLayout {...defaultProps} turnstileSiteKey="" />);
      const aside = screen.getByRole("complementary", { name: "JuaneloJGAC Tech" });
      expect(aside).toBeInTheDocument();
    });
  });
});
