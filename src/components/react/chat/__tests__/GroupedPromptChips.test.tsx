// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PromptGroup, StarterPrompt } from "../../../../lib/chat/types";
import GroupedPromptChips from "../GroupedPromptChips";

const mockStarterPrompts: readonly StarterPrompt[] = [
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
  {
    id: "sp-web-platform",
    label: "I need a web platform",
    prompt: "I need a custom web platform for my business",
    intent: "web-platform",
  },
  {
    id: "sp-automation",
    label: "Automate my processes",
    prompt: "I want to automate repetitive tasks in my business",
    intent: "automation",
  },
];

const mockPromptGroups: readonly PromptGroup[] = [
  {
    groupLabel: "Explore Services",
    promptIds: ["sp-services", "sp-pricing", "sp-ai"],
  },
  {
    groupLabel: "Get Started",
    promptIds: ["sp-web-platform", "sp-automation"],
  },
];

describe("GroupedPromptChips", () => {
  const defaultProps = {
    promptGroups: mockPromptGroups,
    starterPrompts: mockStarterPrompts,
    onChipClick: vi.fn(),
    sectionLabel: "Quick questions to get started",
    visible: true,
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the section label", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      expect(screen.getByText("Quick questions to get started")).toBeInTheDocument();
    });

    it("renders all group labels", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      expect(screen.getByText("Explore Services")).toBeInTheDocument();
      expect(screen.getByText("Get Started")).toBeInTheDocument();
    });

    it("renders prompt chips within each group", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      expect(screen.getByText("What services do you offer?")).toBeInTheDocument();
      expect(screen.getByText("Tell me about pricing")).toBeInTheDocument();
      expect(screen.getByText("AI integration options")).toBeInTheDocument();
      expect(screen.getByText("I need a web platform")).toBeInTheDocument();
      expect(screen.getByText("Automate my processes")).toBeInTheDocument();
    });

    it("renders chips as buttons", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(5);
    });

    it("renders group labels as headings", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      const headings = screen.getAllByRole("heading", { level: 4 });
      expect(headings).toHaveLength(2);
    });
  });

  describe("click behavior", () => {
    it("calls onChipClick with the correct prompt when clicked", () => {
      const onChipClick = vi.fn();
      render(<GroupedPromptChips {...defaultProps} onChipClick={onChipClick} />);
      fireEvent.click(screen.getByText("What services do you offer?"));
      expect(onChipClick).toHaveBeenCalledWith("What services does JuaneloJGAC Tech offer?");
    });

    it("calls onChipClick with correct prompt for different chips", () => {
      const onChipClick = vi.fn();
      render(<GroupedPromptChips {...defaultProps} onChipClick={onChipClick} />);
      fireEvent.click(screen.getByText("I need a web platform"));
      expect(onChipClick).toHaveBeenCalledWith(
        "I need a custom web platform for my business"
      );
    });
  });

  describe("visibility", () => {
    it("hides all chips when visible is false", () => {
      const { container } = render(
        <GroupedPromptChips {...defaultProps} visible={false} />
      );
      expect(container.firstChild).toBeNull();
    });

    it("shows chips when visible is true", () => {
      render(<GroupedPromptChips {...defaultProps} visible />);
      expect(screen.getByText("What services do you offer?")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders nothing when promptGroups array is empty", () => {
      const { container } = render(
        <GroupedPromptChips {...defaultProps} promptGroups={[]} />
      );
      expect(container.firstChild).toBeNull();
    });

    it("skips groups with no matching prompts", () => {
      const emptyGroup: PromptGroup[] = [
        { groupLabel: "Empty Group", promptIds: ["non-existent-id"] },
      ];
      const { container } = render(
        <GroupedPromptChips {...defaultProps} promptGroups={emptyGroup} />
      );
      // Group with no resolvable prompts renders nothing
      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when starterPrompts array is empty", () => {
      const { container } = render(
        <GroupedPromptChips {...defaultProps} starterPrompts={[]} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("has an aria-label on the main section", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      const section = screen.getByTestId("grouped-prompt-chips");
      expect(section).toHaveAttribute("aria-label", "Quick questions to get started");
    });

    it("groups prompts with accessible role group", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      const groups = screen.getAllByRole("group");
      expect(groups).toHaveLength(2);
    });

    it("labels each group with its group label", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      const groups = screen.getAllByRole("group");
      expect(groups[0]).toHaveAttribute("aria-label", "Explore Services");
      expect(groups[1]).toHaveAttribute("aria-label", "Get Started");
    });
  });

  describe("i18n", () => {
    it("renders Spanish group labels and chip labels", () => {
      const esGroups: PromptGroup[] = [
        { groupLabel: "Explorar Servicios", promptIds: ["sp-services"] },
      ];
      const esPrompts: StarterPrompt[] = [
        {
          id: "sp-services",
          label: "¿Qué servicios ofrecen?",
          prompt: "¿Qué servicios ofrece JuaneloJGAC Tech?",
          intent: "general",
        },
      ];
      render(
        <GroupedPromptChips
          {...defaultProps}
          promptGroups={esGroups}
          starterPrompts={esPrompts}
          sectionLabel="Preguntas rápidas para comenzar"
        />
      );
      expect(screen.getByText("Explorar Servicios")).toBeInTheDocument();
      expect(screen.getByText("¿Qué servicios ofrecen?")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies chip design token classes", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].className).toContain("bg-chat-chip-bg");
      expect(buttons[0].className).toContain("text-chat-chip-text");
    });

    it("ensures minimum touch target size on chips", () => {
      render(<GroupedPromptChips {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].className).toContain("min-h-[44px]");
    });
  });
});
