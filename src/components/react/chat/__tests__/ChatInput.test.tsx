// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ChatInput from "../ChatInput";

describe("ChatInput", () => {
  const defaultProps = {
    placeholder: "Type your message...",
    sendLabel: "Send",
    characterLimitLabel: "{{count}} characters remaining",
    onSubmit: vi.fn(),
    disabled: false,
    maxLength: 500,
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the text input with placeholder", () => {
      render(<ChatInput {...defaultProps} />);
      expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
    });

    it("renders the send button", () => {
      render(<ChatInput {...defaultProps} />);
      expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
    });

    it("renders character count display", () => {
      render(<ChatInput {...defaultProps} />);
      expect(screen.getByTestId("character-count")).toBeInTheDocument();
    });
  });

  describe("typing behavior", () => {
    it("updates input value when the user types", () => {
      render(<ChatInput {...defaultProps} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Hello" } });
      expect(input).toHaveValue("Hello");
    });

    it("updates remaining character count when typing", () => {
      render(<ChatInput {...defaultProps} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Hello" } });
      const count = screen.getByTestId("character-count");
      expect(count.textContent).toContain("495");
    });

    it("prevents input beyond maxLength", () => {
      render(<ChatInput {...defaultProps} maxLength={10} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "12345678901" } });
      expect(input).toHaveValue("1234567890");
    });
  });

  describe("submit behavior", () => {
    it("calls onSubmit with trimmed message when send button is clicked", () => {
      const onSubmit = vi.fn();
      render(<ChatInput {...defaultProps} onSubmit={onSubmit} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "  Hello there  " } });
      fireEvent.click(screen.getByRole("button", { name: /Send/i }));
      expect(onSubmit).toHaveBeenCalledWith("Hello there");
    });

    it("calls onSubmit when Enter key is pressed", () => {
      const onSubmit = vi.fn();
      render(<ChatInput {...defaultProps} onSubmit={onSubmit} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Hello" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(onSubmit).toHaveBeenCalledWith("Hello");
    });

    it("does not submit on Shift+Enter (allows multiline)", () => {
      const onSubmit = vi.fn();
      render(<ChatInput {...defaultProps} onSubmit={onSubmit} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Hello" } });
      fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("clears input after successful submit", () => {
      render(<ChatInput {...defaultProps} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Hello" } });
      fireEvent.click(screen.getByRole("button", { name: /Send/i }));
      expect(input).toHaveValue("");
    });
  });

  describe("empty validation", () => {
    it("disables send button when input is empty", () => {
      render(<ChatInput {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Send/i });
      expect(button).toBeDisabled();
    });

    it("disables send button when input is only whitespace", () => {
      render(<ChatInput {...defaultProps} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "   " } });
      const button = screen.getByRole("button", { name: /Send/i });
      expect(button).toBeDisabled();
    });

    it("does not call onSubmit when input is empty", () => {
      const onSubmit = vi.fn();
      render(<ChatInput {...defaultProps} onSubmit={onSubmit} />);
      fireEvent.click(screen.getByRole("button", { name: /Send/i }));
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("enables send button when input has content", () => {
      render(<ChatInput {...defaultProps} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: "Hello" } });
      const button = screen.getByRole("button", { name: /Send/i });
      expect(button).toBeEnabled();
    });
  });

  describe("disabled state", () => {
    it("disables input when disabled prop is true", () => {
      render(<ChatInput {...defaultProps} disabled />);
      expect(screen.getByPlaceholderText("Type your message...")).toBeDisabled();
    });

    it("disables send button when disabled prop is true", () => {
      render(<ChatInput {...defaultProps} disabled />);
      expect(screen.getByRole("button", { name: /Send/i })).toBeDisabled();
    });
  });

  describe("accessibility", () => {
    it("has an accessible label on the send button", () => {
      render(<ChatInput {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Send/i });
      expect(button).toBeInTheDocument();
    });

    it("has a label attribute on the textarea", () => {
      render(<ChatInput {...defaultProps} />);
      const input = screen.getByPlaceholderText("Type your message...");
      expect(input).toHaveAttribute("aria-label");
    });
  });

  describe("XSS protection", () => {
    it("strips HTML tags from submitted input", () => {
      const onSubmit = vi.fn();
      render(<ChatInput {...defaultProps} onSubmit={onSubmit} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, {
        target: { value: '<b>hello</b><img src="x" onerror="alert(1)">' },
      });
      fireEvent.click(screen.getByRole("button", { name: /Send/i }));
      // sanitizeUserInput strips all HTML tags
      expect(onSubmit).toHaveBeenCalledWith("hello");
    });

    it("does not submit when script tags result in empty content", () => {
      const onSubmit = vi.fn();
      render(<ChatInput {...defaultProps} onSubmit={onSubmit} />);
      const input = screen.getByPlaceholderText("Type your message...");
      fireEvent.change(input, { target: { value: '<script>alert("xss")</script>' } });
      fireEvent.click(screen.getByRole("button", { name: /Send/i }));
      // sanitizeUserInput strips script tags and content, result is empty
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("helper text", () => {
    it("renders helper text when provided", () => {
      render(
        <ChatInput
          {...defaultProps}
          helperText="Ask about our services, pricing, and timelines."
        />
      );
      expect(
        screen.getByText("Ask about our services, pricing, and timelines.")
      ).toBeInTheDocument();
    });

    it("does not render helper text when not provided", () => {
      render(<ChatInput {...defaultProps} />);
      expect(screen.queryByTestId("chat-helper-text")).not.toBeInTheDocument();
    });

    it("renders helper text with correct test id", () => {
      render(<ChatInput {...defaultProps} helperText="Helper info" />);
      expect(screen.getByTestId("chat-helper-text")).toBeInTheDocument();
    });

    it("renders Spanish helper text", () => {
      render(
        <ChatInput
          {...defaultProps}
          helperText="Pregunta sobre nuestros servicios, precios y plazos."
        />
      );
      expect(
        screen.getByText("Pregunta sobre nuestros servicios, precios y plazos.")
      ).toBeInTheDocument();
    });
  });
});
