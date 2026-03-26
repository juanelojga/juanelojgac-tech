// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { OutcomePrompt } from "../../../lib/chat/types";
import OutcomePrompts from "../OutcomePrompts";

const mockOutcomes: OutcomePrompt[] = [
  {
    id: "outcome-grow-revenue",
    label: "Grow revenue with AI",
    prompt: "How can AI help me grow revenue and reach more customers?",
    icon: "chart-up",
  },
  {
    id: "outcome-automate-ops",
    label: "Automate operations",
    prompt: "I want to automate repetitive tasks and streamline my operations. What can you do?",
    icon: "cog",
  },
  {
    id: "outcome-build-platform",
    label: "Build a digital platform",
    prompt: "I need a modern web platform for my business. Can you help me build one?",
    icon: "globe",
  },
  {
    id: "outcome-transform-marketing",
    label: "Transform your marketing",
    prompt: "How can AI improve my marketing strategy and content creation?",
    icon: "megaphone",
  },
  {
    id: "outcome-get-strategy",
    label: "Get an AI strategy",
    prompt: "I want expert guidance on where to start with AI in my business. Can you help?",
    icon: "lightbulb",
  },
];

describe("OutcomePrompts", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the section label", () => {
      render(
        <OutcomePrompts outcomes={mockOutcomes} label="How can we help?" onPromptInject={vi.fn()} />
      );
      expect(screen.getByText("How can we help?")).toBeInTheDocument();
    });

    it("renders all outcome items", () => {
      render(
        <OutcomePrompts outcomes={mockOutcomes} label="How can we help?" onPromptInject={vi.fn()} />
      );
      expect(screen.getByText("Grow revenue with AI")).toBeInTheDocument();
      expect(screen.getByText("Automate operations")).toBeInTheDocument();
      expect(screen.getByText("Build a digital platform")).toBeInTheDocument();
      expect(screen.getByText("Transform your marketing")).toBeInTheDocument();
      expect(screen.getByText("Get an AI strategy")).toBeInTheDocument();
    });

    it("renders each outcome with a unique test id", () => {
      render(
        <OutcomePrompts outcomes={mockOutcomes} label="How can we help?" onPromptInject={vi.fn()} />
      );
      expect(screen.getByTestId("outcome-prompt-outcome-grow-revenue")).toBeInTheDocument();
      expect(screen.getByTestId("outcome-prompt-outcome-automate-ops")).toBeInTheDocument();
      expect(screen.getByTestId("outcome-prompt-outcome-build-platform")).toBeInTheDocument();
    });

    it("renders nothing when outcomes array is empty", () => {
      const { container } = render(
        <OutcomePrompts outcomes={[]} label="How can we help?" onPromptInject={vi.fn()} />
      );
      expect(container.querySelectorAll('[data-testid^="outcome-prompt-"]')).toHaveLength(0);
    });

    it("renders an icon element for each outcome", () => {
      render(
        <OutcomePrompts outcomes={mockOutcomes} label="How can we help?" onPromptInject={vi.fn()} />
      );
      const firstOutcome = screen.getByTestId("outcome-prompt-outcome-grow-revenue");
      const icon = within(firstOutcome).getByTestId("outcome-icon-outcome-grow-revenue");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("click behavior", () => {
    it("calls onPromptInject with the outcome prompt when clicked", () => {
      const onPromptInject = vi.fn();
      render(
        <OutcomePrompts
          outcomes={mockOutcomes}
          label="How can we help?"
          onPromptInject={onPromptInject}
        />
      );

      fireEvent.click(screen.getByTestId("outcome-prompt-outcome-grow-revenue"));
      expect(onPromptInject).toHaveBeenCalledOnce();
      expect(onPromptInject).toHaveBeenCalledWith(
        "How can AI help me grow revenue and reach more customers?"
      );
    });

    it("calls onPromptInject with correct prompt for each outcome", () => {
      const onPromptInject = vi.fn();
      render(
        <OutcomePrompts
          outcomes={mockOutcomes}
          label="How can we help?"
          onPromptInject={onPromptInject}
        />
      );

      fireEvent.click(screen.getByTestId("outcome-prompt-outcome-automate-ops"));
      expect(onPromptInject).toHaveBeenCalledWith(
        "I want to automate repetitive tasks and streamline my operations. What can you do?"
      );
    });

    it("calls onPromptInject on Enter key press", () => {
      const onPromptInject = vi.fn();
      render(
        <OutcomePrompts
          outcomes={mockOutcomes}
          label="How can we help?"
          onPromptInject={onPromptInject}
        />
      );

      fireEvent.keyDown(screen.getByTestId("outcome-prompt-outcome-grow-revenue"), {
        key: "Enter",
      });
      expect(onPromptInject).toHaveBeenCalledOnce();
    });

    it("calls onPromptInject on Space key press", () => {
      const onPromptInject = vi.fn();
      render(
        <OutcomePrompts
          outcomes={mockOutcomes}
          label="How can we help?"
          onPromptInject={onPromptInject}
        />
      );

      fireEvent.keyDown(screen.getByTestId("outcome-prompt-outcome-grow-revenue"), { key: " " });
      expect(onPromptInject).toHaveBeenCalledOnce();
    });

    it("does not call onPromptInject on other key presses", () => {
      const onPromptInject = vi.fn();
      render(
        <OutcomePrompts
          outcomes={mockOutcomes}
          label="How can we help?"
          onPromptInject={onPromptInject}
        />
      );

      fireEvent.keyDown(screen.getByTestId("outcome-prompt-outcome-grow-revenue"), {
        key: "Tab",
      });
      expect(onPromptInject).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("renders an accessible heading for the section", () => {
      render(
        <OutcomePrompts outcomes={mockOutcomes} label="How can we help?" onPromptInject={vi.fn()} />
      );
      expect(screen.getByRole("heading", { name: /How can we help?/i })).toBeInTheDocument();
    });

    it("renders outcomes as interactive buttons", () => {
      render(
        <OutcomePrompts outcomes={mockOutcomes} label="How can we help?" onPromptInject={vi.fn()} />
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(5);
    });

    it("each outcome button is focusable", () => {
      render(
        <OutcomePrompts outcomes={mockOutcomes} label="How can we help?" onPromptInject={vi.fn()} />
      );
      const button = screen.getByTestId("outcome-prompt-outcome-grow-revenue");
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("bilingual support", () => {
    it("renders Spanish labels correctly", () => {
      const spanishOutcomes: OutcomePrompt[] = [
        {
          id: "outcome-grow-revenue",
          label: "Aumentar ingresos con IA",
          prompt: "¿Cómo puede la IA ayudarme a crecer mis ingresos?",
          icon: "chart-up",
        },
      ];
      render(
        <OutcomePrompts
          outcomes={spanishOutcomes}
          label="¿Cómo podemos ayudarte?"
          onPromptInject={vi.fn()}
        />
      );
      expect(screen.getByText("¿Cómo podemos ayudarte?")).toBeInTheDocument();
      expect(screen.getByText("Aumentar ingresos con IA")).toBeInTheDocument();
    });
  });
});
