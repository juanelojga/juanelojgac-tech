// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import MobileMenu from "../react/MobileMenu";

describe("MobileMenu", () => {
  const defaultProps = {
    lang: "en" as const,
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Process", href: "#process" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    ctaLabel: "Book a Consultation",
    menuLabel: "Menu",
    closeMenuLabel: "Close menu",
    socialGithubLabel: "GitHub",
    socialLinkedinLabel: "LinkedIn",
    socialInstagramLabel: "Instagram",
    languageSwitchLabel: "Language",
    homeUrl: "/",
    altLangUrl: "/es",
    currentLang: "en" as const,
  };

  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  describe("closed state", () => {
    it("renders the hamburger button", () => {
      render(<MobileMenu {...defaultProps} />);
      expect(screen.getByLabelText("Menu")).toBeInTheDocument();
    });

    it("hamburger has aria-expanded false initially", () => {
      render(<MobileMenu {...defaultProps} />);
      expect(screen.getByLabelText("Menu")).toHaveAttribute("aria-expanded", "false");
    });

    it("does not render the menu overlay initially", () => {
      render(<MobileMenu {...defaultProps} />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("open state", () => {
    it("opens the menu when hamburger is clicked", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders all nav links in the menu", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Process")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("renders the CTA button", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      expect(screen.getByText("Book a Consultation")).toBeInTheDocument();
    });

    it("renders the close button", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
    });

    it("closes the menu when close button clicked", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText("Close menu"));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes the menu on Escape key", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("prevents body scroll when open", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body scroll when closed", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      fireEvent.click(screen.getByLabelText("Close menu"));
      expect(document.body.style.overflow).toBe("");
    });

    it("renders the language switcher", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      const enLinks = screen.getAllByText("EN");
      const esLinks = screen.getAllByText("ES");
      expect(enLinks.length).toBeGreaterThanOrEqual(1);
      expect(esLinks.length).toBeGreaterThanOrEqual(1);
    });

    it("renders social links with security attributes", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      const githubLink = screen.getByLabelText("GitHub");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("dialog has aria-modal attribute", () => {
      render(<MobileMenu {...defaultProps} />);
      fireEvent.click(screen.getByLabelText("Menu"));
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });
  });

  describe("Spanish (ES)", () => {
    const esProps = {
      ...defaultProps,
      lang: "es" as const,
      navLinks: [
        { label: "Servicios", href: "#services" },
        { label: "Proceso", href: "#process" },
        { label: "Nosotros", href: "#about" },
        { label: "Contacto", href: "#contact" },
      ],
      ctaLabel: "Agendar Consulta",
      menuLabel: "Menú",
      closeMenuLabel: "Cerrar menú",
      homeUrl: "/es",
      altLangUrl: "/",
      currentLang: "es" as const,
    };

    it("renders Spanish hamburger label", () => {
      render(<MobileMenu {...esProps} />);
      expect(screen.getByLabelText("Menú")).toBeInTheDocument();
    });

    it("renders Spanish nav links", () => {
      render(<MobileMenu {...esProps} />);
      fireEvent.click(screen.getByLabelText("Menú"));
      expect(screen.getByText("Servicios")).toBeInTheDocument();
      expect(screen.getByText("Proceso")).toBeInTheDocument();
    });

    it("renders Spanish CTA", () => {
      render(<MobileMenu {...esProps} />);
      fireEvent.click(screen.getByLabelText("Menú"));
      expect(screen.getByText("Agendar Consulta")).toBeInTheDocument();
    });
  });
});
