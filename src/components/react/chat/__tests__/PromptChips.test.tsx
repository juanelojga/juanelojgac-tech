// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { StarterPrompt } from "../../../../lib/chat/types";
import PromptChips from "../PromptChips";

const defaultChips: readonly StarterPrompt[] = [
  {
    id: "sp-services",
    label: "What services do you offer?",
    prompt: "What services does JuaneloJGAC Tech offer?",
    intent: "general",
  },
  {
    id: "sp-pricing",
    label: "Tell me about pricing",
    prompt: "What are your pricing ranges?",
    intent: "general",
  },
  {
    id: "sp-ai",
    label: "AI integration options",
    prompt: "Tell me about your AI integration services",
    intent: "ai-integration",
  },
];

describe("PromptChips", () => {
  const defaultProps = {
    chips: defaultChips,
    onChipClick: vi.fn(),
    label: "Quick questions to get started",
    visible: true,
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders all prompt chips", () => {
      render(<PromptChips {...defaultProps} />);
      expect(screen.getByText("What services do you offer?")).toBeInTheDocument();
      expect(screen.getByText("Tell me about pricing")).toBeInTheDocument();
      expect(screen.getByText("AI integration options")).toBeInTheDocument();
    });

    it("renders the section label", () => {
      render(<PromptChips {...defaultProps} />);
      expect(screen.getByText("Quick questions to get started")).toBeInTheDocument();
    });

    it("renders chips as buttons", () => {
      render(<PromptChips {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });
  });

  describe("click behavior", () => {
    it("calls onChipClick with the chip prompt when clicked", () => {
      const onChipClick = vi.fn();
      render(<PromptChips {...defaultProps} onChipClick={onChipClick} />);
      fireEvent.click(screen.getByText("What services do you offer?"));
      expect(onChipClick).toHaveBeenCalledWith("What services does JuaneloJGAC Tech offer?");
    });

    it("calls onChipClick with correct prompt for each chip", () => {
      const onChipClick = vi.fn();
      render(<PromptChips {...defaultProps} onChipClick={onChipClick} />);
      fireEvent.click(screen.getByText("AI integration options"));
      expect(onChipClick).toHaveBeenCalledWith("Tell me about your AI integration services");
    });
  });

  describe("visibility", () => {
    it("hides chips when visible is false", () => {
      render(<PromptChips {...defaultProps} visible={false} />);
      expect(screen.queryByText("What services do you offer?")).not.toBeInTheDocument();
    });

    it("shows chips when visible is true", () => {
      render(<PromptChips {...defaultProps} visible />);
      expect(screen.getByText("What services do you offer?")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders nothing when chips array is empty", () => {
      const { container } = render(<PromptChips {...defaultProps} chips={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("has an aria-label on the chip group", () => {
      render(<PromptChips {...defaultProps} />);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-label", "Quick questions to get started");
    });
  });

  describe("styling", () => {
    it("applies chip design tokens", () => {
      render(<PromptChips {...defaultProps} />);
      const chip = screen.getByText("What services do you offer?");
      expect(chip.className).toContain("bg-chat-chip-bg");
      expect(chip.className).toContain("text-chat-chip-text");
    });
  });
});
