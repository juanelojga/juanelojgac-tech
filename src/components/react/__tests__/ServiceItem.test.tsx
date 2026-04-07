// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ServiceItem from "../ServiceItem";

describe("ServiceItem", () => {
  const defaultProps = {
    id: "svc-web-development",
    title: "Web Development",
    shortDescription: "Custom platforms, e-commerce, dashboards, and web apps",
    relatedPrompt: "I need a web platform built for my business",
    onPromptInject: vi.fn(),
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the service title", () => {
      render(<ServiceItem {...defaultProps} />);
      expect(screen.getByText("Web Development")).toBeInTheDocument();
    });

    it("renders the short description", () => {
      render(<ServiceItem {...defaultProps} />);
      expect(
        screen.getByText("Custom platforms, e-commerce, dashboards, and web apps")
      ).toBeInTheDocument();
    });

    it("renders as a button for accessibility", () => {
      render(<ServiceItem {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Web Development/i });
      expect(button).toBeInTheDocument();
    });

    it("renders with unique test id based on service id", () => {
      render(<ServiceItem {...defaultProps} />);
      expect(screen.getByTestId("service-item-svc-web-development")).toBeInTheDocument();
    });
  });

  describe("click behavior", () => {
    it("calls onPromptInject with the relatedPrompt when clicked", () => {
      const onPromptInject = vi.fn();
      render(<ServiceItem {...defaultProps} onPromptInject={onPromptInject} />);

      fireEvent.click(screen.getByRole("button"));
      expect(onPromptInject).toHaveBeenCalledOnce();
      expect(onPromptInject).toHaveBeenCalledWith("I need a web platform built for my business");
    });

    it("calls onPromptInject on Enter key press", () => {
      const onPromptInject = vi.fn();
      render(<ServiceItem {...defaultProps} onPromptInject={onPromptInject} />);

      fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
      expect(onPromptInject).toHaveBeenCalledOnce();
    });

    it("calls onPromptInject on Space key press", () => {
      const onPromptInject = vi.fn();
      render(<ServiceItem {...defaultProps} onPromptInject={onPromptInject} />);

      fireEvent.keyDown(screen.getByRole("button"), { key: " " });
      expect(onPromptInject).toHaveBeenCalledOnce();
    });

    it("does not call onPromptInject on other key presses", () => {
      const onPromptInject = vi.fn();
      render(<ServiceItem {...defaultProps} onPromptInject={onPromptInject} />);

      fireEvent.keyDown(screen.getByRole("button"), { key: "Tab" });
      expect(onPromptInject).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("is focusable", () => {
      render(<ServiceItem {...defaultProps} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("has an accessible label that includes the service title", () => {
      render(<ServiceItem {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Web Development/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("different service data", () => {
    it("renders different service content correctly", () => {
      render(
        <ServiceItem
          id="svc-automation"
          title="Workflow Automation"
          shortDescription="Eliminate manual tasks"
          relatedPrompt="I want to automate"
          onPromptInject={vi.fn()}
        />
      );
      expect(screen.getByText("Workflow Automation")).toBeInTheDocument();
      expect(screen.getByText("Eliminate manual tasks")).toBeInTheDocument();
    });

    it("fires correct prompt for different services", () => {
      const onPromptInject = vi.fn();
      render(
        <ServiceItem
          id="svc-automation"
          title="Workflow Automation"
          shortDescription="Eliminate manual tasks"
          relatedPrompt="I want to automate tasks"
          onPromptInject={onPromptInject}
        />
      );

      fireEvent.click(screen.getByRole("button"));
      expect(onPromptInject).toHaveBeenCalledWith("I want to automate tasks");
    });
  });
});
