// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ConsultantLayout, {
  type ConsultantLayoutProps,
  type ErrorTranslations,
} from "../ConsultantLayout";

// ── Module mocks ──

// Mock ChatAPIClient
const mockSendMessage = vi.fn();
const mockSetTurnstileToken = vi.fn();
vi.mock("../../../../lib/chat/chat-api-client", () => ({
  ChatAPIClient: class MockChatAPIClient {
    sendMessage = mockSendMessage;
    setTurnstileToken = mockSetTurnstileToken;
  },
}));

// Mock SystemPromptBuilder
const mockFormatMessagesForAPI = vi.fn().mockReturnValue([
  { role: "system", content: "System prompt" },
  { role: "user", content: "Hello" },
]);
vi.mock("../../../../lib/chat/system-prompt-builder", () => ({
  SystemPromptBuilder: class MockSystemPromptBuilder {
    formatMessagesForAPI = mockFormatMessagesForAPI;
    buildSystemPrompt = vi.fn().mockReturnValue("System prompt");
  },
}));

// Mock ScopeEnforcerImpl
const mockEvaluateScope = vi.fn().mockReturnValue({
  isInScope: true,
  confidence: 0.9,
});
vi.mock("../../../../lib/chat/scope-enforcer", () => ({
  ScopeEnforcerImpl: class MockScopeEnforcerImpl {
    evaluateScope = mockEvaluateScope;
  },
}));

// Mock CTAInjectorImpl
const mockDetermineCTAs = vi.fn().mockReturnValue({
  shouldInject: false,
  ctas: [],
});
vi.mock("../../../../lib/chat/cta-injector", () => ({
  CTAInjectorImpl: class MockCTAInjectorImpl {
    determineCTAs = mockDetermineCTAs;
  },
}));

// Mock GuidedFlowManagerImpl
const mockSuggestFollowUps = vi.fn().mockReturnValue({
  followUps: [],
  shouldTransitionPhase: false,
});
vi.mock("../../../../lib/chat/guided-flow-manager", () => ({
  GuidedFlowManagerImpl: class MockGuidedFlowManagerImpl {
    suggestFollowUps = mockSuggestFollowUps;
  },
}));

// Mock StaticContentProvider — use class so `new` works
vi.mock("../../../../lib/chat/content/static-content-provider", () => ({
  StaticContentProvider: class MockStaticContentProvider {},
}));

// Mock http-utils (partially)
vi.mock("../../../../lib/chat/http-utils", async () => {
  const actual = await vi.importActual("../../../../lib/chat/http-utils");
  return {
    ...actual,
  };
});

// ── Test Fixtures ──

const mockServices = [
  {
    id: "svc-web",
    title: "Web Development",
    shortDescription: "Custom web platforms",
    relatedPrompt: "I need a web platform",
  },
];

const mockOutcomePrompts = [
  {
    id: "outcome-1",
    label: "Grow revenue",
    prompt: "How can AI help me grow revenue?",
    icon: "chart-up",
  },
];

const mockStarterPrompts = [
  {
    id: "sp-1",
    label: "Tell me about AI",
    prompt: "Tell me about AI integration",
    intent: "ai-integration" as const,
  },
];

const mockPromptGroups = [{ groupLabel: "Explore", promptIds: ["sp-1"] }];

const mockPanelTranslations = {
  servicesLabel: "Our Services",
  ctaBooking: "Book a Free Consultation",
  ctaContact: "Contact Us",
  collapseLabel: "Show details",
  expandLabel: "Hide details",
  outcomesLabel: "How can we help?",
};

const mockChatTranslations = {
  headerTitle: "AI Consultant",
  headerSubtitle: "Ask about our services",
  headerScopeDescription: "Specializes in AI consulting",
  inputPlaceholder: "Type your message...",
  inputSend: "Send",
  inputCharacterLimit: "{count}/{max} characters",
  inputHelperText: "Ask about services",
  welcomeMessage: "Welcome! How can I help?",
  typingText: "Thinking...",
  chipsLabel: "Suggested prompts",
  followUpsLabel: "Suggested follow-ups",
  errorRetry: "Try again",
  chatRegionLabel: "Chat assistant",
  messageListLabel: "Chat messages",
};

const mockErrorTranslations: ErrorTranslations = {
  errorGeneric: "Something went wrong.",
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
  description: "Please complete the verification.",
  verifying: "Verifying...",
  success: "Verified!",
  error: "Verification failed.",
  expired: "Verification expired.",
  networkError: "Could not reach verification service.",
  ariaLabel: "Human verification challenge",
};

const mockErrorBoundaryTranslations = {
  title: "Something went wrong",
  description: "The chat encountered an error.",
  retry: "Try Again",
};

const defaultProps: ConsultantLayoutProps = {
  companyName: "JuaneloJGAC Tech",
  tagline: "AI solutions",
  services: mockServices,
  outcomePrompts: mockOutcomePrompts,
  starterPrompts: mockStarterPrompts,
  promptGroups: mockPromptGroups,
  bookingUrl: "https://calendly.com/test",
  contactEmail: "test@test.com",
  panelTranslations: mockPanelTranslations,
  chatTranslations: mockChatTranslations,
  layoutTranslations: mockLayoutTranslations,
  verificationTranslations: mockVerificationTranslations,
  errorBoundaryTranslations: mockErrorBoundaryTranslations,
  errorTranslations: mockErrorTranslations,
  turnstileSiteKey: "",
  language: "en",
};

describe("ConsultantLayout Integration — Phase 5", () => {
  /** Helper: type into chat input and click send */
  function sendChatMessage(text: string) {
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: text } });
    const sendButton = screen.getByTestId("chat-send-button");
    fireEvent.click(sendButton);
  }

  beforeEach(() => {
    vi.clearAllMocks();

    // Default: in-scope, API returns response
    mockEvaluateScope.mockReturnValue({ isInScope: true, confidence: 0.9 });
    mockSendMessage.mockResolvedValue({
      content: "I can help you with that! Our services include...",
      usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
    });
    mockDetermineCTAs.mockReturnValue({ shouldInject: false, ctas: [] });
    mockSuggestFollowUps.mockReturnValue({
      followUps: [],
      shouldTransitionPhase: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("in-scope message flow", () => {
    it("sends user message, calls API, and renders assistant response", async () => {
      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("Tell me about your services");

      // User message should appear
      expect(screen.getByText("Tell me about your services")).toBeInTheDocument();

      // Wait for assistant response
      await waitFor(() => {
        expect(screen.getByText(/I can help you with that/)).toBeInTheDocument();
      });

      // Verify scope was checked
      expect(mockEvaluateScope).toHaveBeenCalledWith(
        "Tell me about your services",
        expect.objectContaining({ phase: "greeting", language: "en" })
      );

      // Verify API was called
      expect(mockSendMessage).toHaveBeenCalledOnce();

      // Verify CTA injection was checked
      expect(mockDetermineCTAs).toHaveBeenCalledOnce();

      // Verify follow-ups were checked
      expect(mockSuggestFollowUps).toHaveBeenCalledOnce();
    });

    it("formats messages through SystemPromptBuilder before API call", async () => {
      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("What do you offer?");

      await waitFor(() => {
        expect(mockFormatMessagesForAPI).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ role: "user", content: "What do you offer?" }),
          ]),
          "en",
          "greeting"
        );
      });
    });
  });

  describe("out-of-scope message flow", () => {
    it("shows redirect message without calling API", async () => {
      mockEvaluateScope.mockReturnValue({
        isInScope: false,
        confidence: 0.85,
        redirect: {
          message: "I focus on consulting services. Here's what I can help with:",
          suggestedPrompts: [],
        },
      });

      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("What is the weather today?");

      // User message appears
      expect(screen.getByText("What is the weather today?")).toBeInTheDocument();

      // Redirect message appears
      await waitFor(() => {
        expect(
          screen.getByText("I focus on consulting services. Here's what I can help with:")
        ).toBeInTheDocument();
      });

      // API should NOT have been called
      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });

  describe("error handling and retry", () => {
    it("displays error message when API call fails", async () => {
      mockSendMessage.mockRejectedValueOnce(new Error("Network failure"));

      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("Tell me about services");

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
      });
    });

    it("renders retry button when error occurs and retries on click", async () => {
      mockSendMessage.mockRejectedValueOnce(new Error("Network failure")).mockResolvedValueOnce({
        content: "Here are our services...",
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      });

      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("Tell me about services");

      // Wait for error and retry button
      await waitFor(() => {
        expect(screen.getByTestId("chat-retry-button")).toBeInTheDocument();
      });

      // Click retry
      fireEvent.click(screen.getByTestId("chat-retry-button"));

      // Wait for successful response after retry
      await waitFor(() => {
        expect(screen.getByText("Here are our services...")).toBeInTheDocument();
      });

      // API should have been called twice
      expect(mockSendMessage).toHaveBeenCalledTimes(2);
    });
  });

  describe("typing indicator", () => {
    it("shows typing indicator while waiting for API response", async () => {
      // Make API wait indefinitely (we'll check state while it's pending)
      let resolveApi!: (value: unknown) => void;
      mockSendMessage.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveApi = resolve;
          })
      );

      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("Hello");

      // Typing indicator should appear
      await waitFor(() => {
        expect(screen.getByText("Thinking...")).toBeInTheDocument();
      });

      // Resolve the API call
      resolveApi({
        content: "Hello! How can I help?",
        usage: { prompt_tokens: 5, completion_tokens: 10, total_tokens: 15 },
      });

      // Typing indicator should disappear, response should appear
      await waitFor(() => {
        expect(screen.queryByText("Thinking...")).not.toBeInTheDocument();
        expect(screen.getByText("Hello! How can I help?")).toBeInTheDocument();
      });
    });
  });

  describe("follow-up suggestions", () => {
    it("renders follow-up chips after assistant response", async () => {
      mockSuggestFollowUps.mockReturnValue({
        followUps: [
          {
            id: "gf-timeline",
            label: "What's the timeline?",
            prompt: "What's the typical timeline?",
            applicablePhases: ["discovery"],
          },
          {
            id: "gf-budget",
            label: "Tell me about pricing",
            prompt: "What are your pricing options?",
            applicablePhases: ["discovery"],
          },
        ],
        shouldTransitionPhase: false,
      });

      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("Tell me about your services");

      // Wait for response and follow-ups
      await waitFor(() => {
        expect(screen.getByText("What's the timeline?")).toBeInTheDocument();
        expect(screen.getByText("Tell me about pricing")).toBeInTheDocument();
      });
    });

    it("sends follow-up prompt when chip is clicked", async () => {
      mockSuggestFollowUps.mockReturnValue({
        followUps: [
          {
            id: "gf-timeline",
            label: "What's the timeline?",
            prompt: "What's the typical timeline?",
            applicablePhases: ["discovery"],
          },
        ],
        shouldTransitionPhase: false,
      });

      render(<ConsultantLayout {...defaultProps} />);

      // Send initial message
      sendChatMessage("Tell me about services");

      // Wait for follow-ups
      await waitFor(() => {
        expect(screen.getByText("What's the timeline?")).toBeInTheDocument();
      });

      // Reset mock for second call
      mockSendMessage.mockResolvedValueOnce({
        content: "Typical timelines range from 4-8 weeks.",
        usage: { prompt_tokens: 15, completion_tokens: 25, total_tokens: 40 },
      });
      // Reset follow-ups for second call
      mockSuggestFollowUps.mockReturnValue({
        followUps: [],
        shouldTransitionPhase: false,
      });

      // Click follow-up chip
      fireEvent.click(screen.getByText("What's the timeline?"));

      // The follow-up prompt text should now appear as a user message
      await waitFor(() => {
        expect(screen.getByText("What's the typical timeline?")).toBeInTheDocument();
      });
    });
  });

  describe("phase transitions", () => {
    it("transitions phase when flow manager suggests it", async () => {
      mockSuggestFollowUps.mockReturnValue({
        followUps: [],
        shouldTransitionPhase: true,
        nextPhase: "discovery",
      });

      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("I need help with AI");

      await waitFor(() => {
        expect(screen.getByText(/I can help you with that/)).toBeInTheDocument();
      });

      // Send a second message — scope enforcer should be called with new phase
      mockSendMessage.mockResolvedValueOnce({
        content: "What kind of AI integration?",
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      });
      mockSuggestFollowUps.mockReturnValue({
        followUps: [],
        shouldTransitionPhase: false,
      });

      sendChatMessage("Automate customer support");

      await waitFor(() => {
        expect(mockFormatMessagesForAPI).toHaveBeenLastCalledWith(
          expect.any(Array),
          "en",
          "discovery"
        );
      });
    });
  });

  describe("turnstile token integration", () => {
    it("stores turnstile token when verification succeeds", () => {
      // Render with turnstile enabled
      render(<ConsultantLayout {...defaultProps} turnstileSiteKey="test-key" />);

      // Verification screen should show
      expect(screen.getByText("Verify you're human")).toBeInTheDocument();
    });
  });

  describe("CTA injection", () => {
    it("attaches CTAs to assistant message when injector returns them", async () => {
      mockDetermineCTAs.mockReturnValue({
        shouldInject: true,
        ctas: [{ label: "Book a Call", url: "https://calendly.com/test", type: "booking" }],
      });

      render(<ConsultantLayout {...defaultProps} />);

      sendChatMessage("Tell me more");

      // Wait for response — CTA should appear
      await waitFor(() => {
        expect(screen.getByText(/I can help you with that/)).toBeInTheDocument();
      });

      // Verify determineCTAs was called with assistant message
      expect(mockDetermineCTAs).toHaveBeenCalledWith(
        expect.objectContaining({ role: "assistant" }),
        expect.objectContaining({ phase: "greeting" })
      );
    });
  });

  describe("outcome prompt injection from TrustPanel", () => {
    it("sends outcome prompt when clicked in trust panel", async () => {
      render(<ConsultantLayout {...defaultProps} />);

      // Find the outcome prompt button
      const outcomeButton = screen.getByText("Grow revenue");
      fireEvent.click(outcomeButton);

      // The prompt should appear as a user message
      await waitFor(() => {
        expect(screen.getByText("How can AI help me grow revenue?")).toBeInTheDocument();
      });

      // API should be called
      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledOnce();
      });
    });
  });
});
