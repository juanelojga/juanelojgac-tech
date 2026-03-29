// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ChatMessage as ChatMessageType, InlineCTA } from "../../../../lib/chat/types";
import ChatMessage from "../ChatMessage";

function createMessage(overrides?: Partial<ChatMessageType>): ChatMessageType {
  return {
    id: "msg-1",
    role: "user",
    content: "I need help with my project",
    timestamp: Date.now(),
    language: "en",
    ...overrides,
  };
}

describe("ChatMessage", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("user messages", () => {
    it("renders user message content", () => {
      render(<ChatMessage message={createMessage()} />);
      expect(screen.getByText("I need help with my project")).toBeInTheDocument();
    });

    it("applies user bubble styling", () => {
      render(<ChatMessage message={createMessage()} />);
      const bubble = screen.getByTestId("message-bubble-msg-1");
      expect(bubble.className).toContain("bg-chat-bubble-user");
      expect(bubble.className).toContain("text-chat-bubble-user-text");
    });

    it("aligns user messages to the right", () => {
      render(<ChatMessage message={createMessage()} />);
      const wrapper = screen.getByTestId("chat-message-user");
      expect(wrapper.className).toContain("justify-end");
    });
  });

  describe("assistant messages", () => {
    const assistantMessage = createMessage({
      id: "msg-2",
      role: "assistant",
      content: "Hello! I can help you explore our services.",
    });

    it("renders assistant message content", () => {
      render(<ChatMessage message={assistantMessage} />);
      expect(screen.getByText("Hello! I can help you explore our services.")).toBeInTheDocument();
    });

    it("applies assistant bubble styling", () => {
      render(<ChatMessage message={assistantMessage} />);
      const bubble = screen.getByTestId("message-bubble-msg-2");
      expect(bubble.className).toContain("bg-chat-bubble-assistant");
      expect(bubble.className).toContain("text-chat-bubble-assistant-text");
    });

    it("aligns assistant messages to the left", () => {
      render(<ChatMessage message={assistantMessage} />);
      const wrapper = screen.getByTestId("chat-message-assistant");
      expect(wrapper.className).toContain("justify-start");
    });
  });

  describe("inline CTAs", () => {
    const ctas: readonly InlineCTA[] = [
      {
        label: "Book a Consultation",
        url: "https://calendly.com/juanelojga/one-on-one-meeting",
        type: "booking",
      },
      { label: "Contact Us", url: "mailto:hello@juanelojgac.tech", type: "contact" },
    ];

    const messageWithCTAs = createMessage({
      id: "msg-3",
      role: "assistant",
      content: "Based on your needs, I recommend our AI Integration service.",
      ctas,
    });

    it("renders CTA buttons within assistant messages", () => {
      render(<ChatMessage message={messageWithCTAs} />);
      expect(screen.getByText("Book a Consultation")).toBeInTheDocument();
      expect(screen.getByText("Contact Us")).toBeInTheDocument();
    });

    it("renders CTAs as links with correct href", () => {
      render(<ChatMessage message={messageWithCTAs} />);
      const bookingLink = screen.getByRole("link", { name: /Book a Consultation/i });
      expect(bookingLink).toHaveAttribute(
        "href",
        "https://calendly.com/juanelojga/one-on-one-meeting"
      );
    });

    it("opens CTA links in new tab with security attributes", () => {
      render(<ChatMessage message={messageWithCTAs} />);
      const bookingLink = screen.getByRole("link", { name: /Book a Consultation/i });
      expect(bookingLink).toHaveAttribute("target", "_blank");
      expect(bookingLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not render CTA section when no CTAs provided", () => {
      render(<ChatMessage message={createMessage({ id: "msg-no-cta", role: "assistant" })} />);
      expect(screen.queryByTestId("message-ctas-msg-no-cta")).not.toBeInTheDocument();
    });

    it("applies booking CTA primary styling", () => {
      render(<ChatMessage message={messageWithCTAs} />);
      const bookingLink = screen.getByRole("link", { name: /Book a Consultation/i });
      expect(bookingLink.className).toContain("bg-chat-cta-primary");
    });

    it("applies contact CTA secondary styling", () => {
      render(<ChatMessage message={messageWithCTAs} />);
      const contactLink = screen.getByRole("link", { name: /Contact Us/i });
      expect(contactLink.className).toContain("bg-chat-cta-secondary");
    });
  });

  describe("accessibility", () => {
    it("marks each message with an appropriate role", () => {
      render(<ChatMessage message={createMessage()} />);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });
  });
});
