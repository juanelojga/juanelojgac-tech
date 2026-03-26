// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import PanelCTA from "../PanelCTA";

describe("PanelCTA", () => {
  const defaultProps = {
    bookingLabel: "Book a Free Consultation",
    bookingUrl: "https://calendly.com/juanelojgac",
    contactLabel: "Contact Us",
    contactEmail: "hello@juanelojgac.tech",
  };

  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("renders the booking CTA button", () => {
      render(<PanelCTA {...defaultProps} />);
      expect(screen.getByText("Book a Free Consultation")).toBeInTheDocument();
    });

    it("renders the contact CTA button", () => {
      render(<PanelCTA {...defaultProps} />);
      expect(screen.getByText("Contact Us")).toBeInTheDocument();
    });

    it("renders both CTAs", () => {
      render(<PanelCTA {...defaultProps} />);
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });
  });

  describe("booking CTA", () => {
    it("links to the Calendly URL", () => {
      render(<PanelCTA {...defaultProps} />);
      const bookingLink = screen.getByRole("link", { name: /Book a Free Consultation/i });
      expect(bookingLink).toHaveAttribute("href", "https://calendly.com/juanelojgac");
    });

    it("opens in a new tab", () => {
      render(<PanelCTA {...defaultProps} />);
      const bookingLink = screen.getByRole("link", { name: /Book a Free Consultation/i });
      expect(bookingLink).toHaveAttribute("target", "_blank");
      expect(bookingLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("contact CTA", () => {
    it("links to the email address with mailto:", () => {
      render(<PanelCTA {...defaultProps} />);
      const contactLink = screen.getByRole("link", { name: /Contact Us/i });
      expect(contactLink).toHaveAttribute("href", "mailto:hello@juanelojgac.tech");
    });
  });

  describe("accessibility", () => {
    it("booking CTA has a clear accessible name", () => {
      render(<PanelCTA {...defaultProps} />);
      expect(screen.getByRole("link", { name: /Book a Free Consultation/i })).toBeInTheDocument();
    });

    it("contact CTA has a clear accessible name", () => {
      render(<PanelCTA {...defaultProps} />);
      expect(screen.getByRole("link", { name: /Contact Us/i })).toBeInTheDocument();
    });
  });

  describe("different labels", () => {
    it("renders Spanish labels correctly", () => {
      render(
        <PanelCTA
          bookingLabel="Reserva una Consulta Gratuita"
          bookingUrl="https://calendly.com/juanelojgac"
          contactLabel="Contáctanos"
          contactEmail="hello@juanelojgac.tech"
        />
      );
      expect(screen.getByText("Reserva una Consulta Gratuita")).toBeInTheDocument();
      expect(screen.getByText("Contáctanos")).toBeInTheDocument();
    });
  });
});
