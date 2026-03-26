// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ChatMessage, StarterPrompt } from "../../../../lib/chat/types";
import ChatContainer, { type ChatContainerTranslations } from "../ChatContainer";

const defaultTranslations: ChatContainerTranslations = {
  headerTitle: "AI Consultant",
  headerSubtitle: "Here to help",
  inputPlaceholder: "Type your message...",
  inputSend: "Send",
  inputCharacterLimit: "{count}/{max} characters",
  welcomeMessage: "Welcome! How can I help you today?",
  typingText: "Thinking...",
  chipsLabel: "Suggested prompts",
  chatRegionLabel: "Chat assistant",
  messageListLabel: "Chat messages",
};

const defaultChips: StarterPrompt[] = [
  {
    id: "1",
    label: "Tell me about AI",
    prompt: "Tell me about AI integration",
    intent: "ai-integration",
  },
  { id: "2", label: "Web platform", prompt: "I need a web platform", intent: "web-platform" },
];

function createMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: "msg-1",
    role: "user",
    content: "Hello",
    timestamp: Date.now(),
    language: "en",
    ...overrides,
  };
}

describe("ChatContainer", () => {
  const defaultProps = {
    messages: [] as ChatMessage[],
    starterPrompts: defaultChips,
    isTyping: false,
    error: null,
    onSendMessage: vi.fn(),
    translations: defaultTranslations,
  };

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("empty state", () => {
    it("renders the chat region with accessible label", () => {
      render(<ChatContainer {...defaultProps} />);
      expect(screen.getByRole("region", { name: "Chat assistant" })).toBeInTheDocument();
    });

    it("renders the welcome message when there are no messages", () => {
      render(<ChatContainer {...defaultProps} />);
      expect(screen.getByText("Welcome! How can I help you today?")).toBeInTheDocument();
    });

    it("renders starter prompt chips when there are no messages", () => {
      render(<ChatContainer {...defaultProps} />);
      expect(screen.getByText("Tell me about AI")).toBeInTheDocument();
      expect(screen.getByText("Web platform")).toBeInTheDocument();
    });

    it("renders the header with title and subtitle", () => {
      render(<ChatContainer {...defaultProps} />);
      expect(screen.getByText("AI Consultant")).toBeInTheDocument();
      expect(screen.getByText("Here to help")).toBeInTheDocument();
    });
  });

  describe("message rendering", () => {
    it("renders conversation messages", () => {
      const messages = [
        createMessage({ id: "1", role: "user", content: "Hi there" }),
        createMessage({ id: "2", role: "assistant", content: "Hello! How can I help?" }),
      ];
      render(<ChatContainer {...defaultProps} messages={messages} />);
      expect(screen.getByText("Hi there")).toBeInTheDocument();
      expect(screen.getByText("Hello! How can I help?")).toBeInTheDocument();
    });

    it("hides the welcome message when messages exist", () => {
      const messages = [createMessage({ id: "1", content: "Hi" })];
      render(<ChatContainer {...defaultProps} messages={messages} />);
      expect(screen.queryByText("Welcome! How can I help you today?")).not.toBeInTheDocument();
    });

    it("hides prompt chips when messages exist", () => {
      const messages = [createMessage({ id: "1", content: "Hi" })];
      render(<ChatContainer {...defaultProps} messages={messages} />);
      expect(screen.queryByText("Tell me about AI")).not.toBeInTheDocument();
    });
  });

  describe("typing indicator", () => {
    it("shows typing indicator when isTyping is true", () => {
      render(<ChatContainer {...defaultProps} isTyping={true} />);
      expect(screen.getByTestId("typing-indicator")).toBeInTheDocument();
    });

    it("hides typing indicator when isTyping is false", () => {
      render(<ChatContainer {...defaultProps} isTyping={false} />);
      expect(screen.queryByTestId("typing-indicator")).not.toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("shows error alert when error is present", () => {
      render(<ChatContainer {...defaultProps} error="Something went wrong" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("hides error alert when error is null", () => {
      render(<ChatContainer {...defaultProps} error={null} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("calls onSendMessage when a prompt chip is clicked", () => {
      const onSendMessage = vi.fn();
      render(<ChatContainer {...defaultProps} onSendMessage={onSendMessage} />);
      fireEvent.click(screen.getByText("Tell me about AI"));
      expect(onSendMessage).toHaveBeenCalledWith("Tell me about AI integration");
    });

    it("disables input when isTyping is true", () => {
      render(<ChatContainer {...defaultProps} isTyping={true} />);
      const input = screen.getByPlaceholderText("Type your message...");
      expect(input).toBeDisabled();
    });

    it("enables input when isTyping is false", () => {
      render(<ChatContainer {...defaultProps} isTyping={false} />);
      const input = screen.getByPlaceholderText("Type your message...");
      expect(input).not.toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("has a message log region with aria-live", () => {
      render(<ChatContainer {...defaultProps} />);
      const log = screen.getByRole("log");
      expect(log).toHaveAttribute("aria-live", "polite");
    });

    it("labels the message list for screen readers", () => {
      render(<ChatContainer {...defaultProps} />);
      const log = screen.getByRole("log");
      expect(log).toHaveAttribute("aria-label", "Chat messages");
    });
  });
});
