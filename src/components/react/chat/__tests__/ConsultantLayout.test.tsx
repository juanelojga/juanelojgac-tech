// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { OutcomePrompt, PromptGroup, StarterPrompt } from "../../../../lib/chat/types";
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

const mockOutcomePrompts: OutcomePrompt[] = [
  {
    id: "outcome-grow-revenue",
    label: "Grow revenue with AI",
    prompt: "How can AI help me grow revenue?",
    icon: "chart-up",
  },
];

const mockStarterPrompts: StarterPrompt[] = [
  {
    id: "sp-1",
    label: "Tell me about AI",
    prompt: "Tell me about AI integration",
    intent: "ai-integration",
  },
  { id: "sp-2", label: "Web platform", prompt: "I need a web platform", intent: "web-platform" },
];

const mockPromptGroups: PromptGroup[] = [
  { groupLabel: "Explore", promptIds: ["sp-1"] },
  { groupLabel: "Get Started", promptIds: ["sp-2"] },
];

const mockPanelTranslations = {
  servicesLabel: "Our Services",
  collapseLabel: "Show details",
  expandLabel: "Hide details",
  outcomesLabel: "How can we help?",
  panelLabel: "Service information panel",
};

const mockChatTranslations = {
  headerTitle: "AI Consultant",
  headerSubtitle: "Ask about our services",
  headerScopeDescription: "Specializes in AI consulting",
  inputPlaceholder: "Type your message...",
  inputSend: "Send",
  inputCharacterLimit: "{count}/{max} characters",
  inputHelperText: "Ask about services, pricing, and timelines.",
  welcomeMessage: "Welcome! How can I help?",
  typingText: "Thinking...",
  chipsLabel: "Suggested prompts",
  followUpsLabel: "Suggested follow-ups",
  errorRetry: "Try again",
  chatRegionLabel: "Chat assistant",
  messageListLabel: "Chat messages",
  contactChipLabel: "Contact Now",
};

const mockErrorTranslations = {
  errorGeneric: "Something went wrong. Please try again.",
  errorNetwork: "Connection lost.",
  errorRateLimit: "Too many messages.",
  errorTimeout: "Response timed out.",
  errorUnavailable: "Service unavailable.",
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
  services: mockServices,
  outcomePrompts: mockOutcomePrompts,
  starterPrompts: mockStarterPrompts,
  promptGroups: mockPromptGroups,
  panelTranslations: mockPanelTranslations,
  chatTranslations: mockChatTranslations,
  layoutTranslations: mockLayoutTranslations,
  verificationTranslations: mockVerificationTranslations,
  errorBoundaryTranslations: mockErrorBoundaryTranslations,
  errorTranslations: mockErrorTranslations,
  contactFormTranslations: {
    chipLabel: "Contact Now",
    modalTitle: "Get in Touch",
    modalSubtitle: "Fill in your details.",
    nameLabel: "Name",
    namePlaceholder: "Your full name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    companyLabel: "Company",
    companyPlaceholder: "Your company name",
    summaryLabel: "Conversation Summary",
    submitLabel: "Send",
    successMessage: "Thanks!",
    errorMessage: "Something went wrong.",
    closeLabel: "Close",
  },
  actionPrompts: {
    services: "Tell me about your services",
    about: "Tell me about your company and experience",
    contact: "How can I get in touch with you?",
  },
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
      expect(screen.getByTestId("trust-panel")).toBeInTheDocument();
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

    it("renders panel with accessible label", () => {
      render(<ConsultantLayout {...defaultProps} turnstileSiteKey="" />);
      const aside = screen.getByRole("complementary", { name: "Service information panel" });
      expect(aside).toBeInTheDocument();
    });
  });
});
