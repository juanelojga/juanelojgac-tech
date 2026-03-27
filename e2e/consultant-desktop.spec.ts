import { expect } from "@playwright/test";

import { chatSelectors, sendChatMessage } from "./helpers/chat";
import { test } from "./helpers/fixtures";

/**
 * Desktop E2E tests for the redesigned homepage.
 * Covers EN and ES flows on desktop viewport (1280×720).
 */
test.describe("Consultant Desktop — EN", () => {
  test.use({ viewport: { width: 1280, height: 720 }, locale: "en-US" });

  const goToPage = async (page: import("@playwright/test").Page) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  };

  // ── Redesigned Header Tests ──

  test("renders the fixed header with logo and language switch", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS("position", "fixed");

    // Logo
    const logo = header.locator('img[alt="JuaneloJGAC Tech logo"]');
    await expect(logo).toBeVisible();

    // Language switch (pill style)
    await expect(header.locator("text=EN")).toBeVisible();
    await expect(header.locator("text=ES")).toBeVisible();
  });

  test("header shows desktop nav links", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    await expect(header.locator('a[href="#services"]')).toBeVisible();
    await expect(header.locator('a[href="#process"]')).toBeVisible();
    await expect(header.locator('a[href="#about"]')).toBeVisible();
    await expect(header.locator('a[href="#contact"]')).toBeVisible();
  });

  test("header shows CTA button on desktop", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    const cta = header.locator('a[href="#contact"]').filter({ hasText: "Book a Consultation" });
    await expect(cta).toBeVisible();
  });

  test("header shows social icons on desktop", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    await expect(header.locator('a[aria-label="GitHub"]')).toBeVisible();
    await expect(header.locator('a[aria-label="LinkedIn"]')).toBeVisible();
    await expect(header.locator('a[aria-label="Instagram"]')).toBeVisible();
  });

  // ── Redesigned Hero Tests ──

  test("renders the hero section with headline and CTAs", async ({ page }) => {
    await goToPage(page);

    await expect(
      page.getByRole("heading", {
        name: "Build Smarter Products, Automations, and AI Experiences",
      })
    ).toBeVisible();

    // Micro-label
    await expect(page.locator("text=AI Consulting for Modern Businesses")).toBeVisible();

    // Primary CTA
    await expect(
      page.locator('a[href="#contact"]').filter({ hasText: "Book a Free Consultation" })
    ).toBeVisible();

    // Secondary CTA
    await expect(
      page.locator('a[href="#services"]').filter({ hasText: "Explore Services" })
    ).toBeVisible();
  });

  test("hero displays trust metrics", async ({ page }) => {
    await goToPage(page);

    await expect(page.locator("text=Projects Delivered")).toBeVisible();
    await expect(page.locator("text=Client Satisfaction")).toBeVisible();
  });

  // ── Redesigned Footer Tests ──

  test("renders the footer with 4-column layout", async ({ page }) => {
    await goToPage(page);

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("© 2026 JuaneloJGAC Tech. All rights reserved.");
    await expect(footer).toContainText("AI-powered solutions for modern businesses");
    await expect(footer).toContainText("Navigation");
    await expect(footer).toContainText("Why Work With Us");
  });

  test("footer shows navigation and social links", async ({ page }) => {
    await goToPage(page);

    const footer = page.locator("footer");
    await expect(footer.locator('a[href="#services"]')).toBeVisible();
    await expect(footer.locator('a[href="/privacy"]')).toBeVisible();

    const githubLink = footer.locator('a[aria-label="GitHub"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("footer shows trust notes", async ({ page }) => {
    await goToPage(page);

    const footer = page.locator("footer");
    await expect(footer).toContainText("Fully bilingual — EN/ES");
    await expect(footer).toContainText("Clean code approach");
    await expect(footer).toContainText("US & LATAM clients");
  });

  // ── Consultant Layout Tests ──

  test("renders the consultant layout with trust panel and chat", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel).toBeVisible();

    const chatContainer = page.locator(chatSelectors.container);
    await expect(chatContainer).toBeVisible();
  });

  test("displays the company name and tagline in trust panel", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel).toContainText("JuaneloJGAC Tech");
    await expect(trustPanel).toContainText("Practical AI solutions");
  });

  test("shows English header and welcome message", async ({ page }) => {
    await goToPage(page);

    await expect(page.getByRole("heading", { name: "AI Consultant" })).toBeVisible();

    await expect(
      page
        .locator(chatSelectors.messageList)
        .locator("text=Hello! I'm the JuaneloJGAC Tech assistant")
    ).toBeVisible();
  });

  // ── Outcome Prompts in Left Rail ──

  test("displays outcome prompts in the trust panel", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    const outcomes = trustPanel.locator(chatSelectors.outcomePrompt);
    await expect(outcomes.first()).toBeVisible();
  });

  test("clicking an outcome prompt injects it into chat", async ({ page }) => {
    await goToPage(page);

    const outcome = page.locator(chatSelectors.outcomePrompt).first();
    await outcome.click();

    const userMessages = page.locator(chatSelectors.userMessage);
    await expect(userMessages).toHaveCount(1);
  });

  // ── Grouped Prompt Chips ──

  test("displays grouped starter prompt chips in English", async ({ page }) => {
    await goToPage(page);

    const chipsContainer = page.locator(chatSelectors.promptChips);
    await expect(chipsContainer).toBeVisible();

    // Verify some chip labels
    await expect(
      page.locator(`${chatSelectors.promptChip} >> text=What services do you offer?`)
    ).toBeVisible();
    await expect(
      page.locator(`${chatSelectors.promptChip} >> text=I need a web platform`)
    ).toBeVisible();
  });

  test("prompt chips are organized in labeled groups", async ({ page }) => {
    await goToPage(page);

    const chipsSection = page.locator(chatSelectors.promptChips);
    // Groups should be present as role=group elements
    const groups = chipsSection.locator('[role="group"]');
    await expect(groups).toHaveCount(2);
  });

  test("chat input is visible with English placeholder", async ({ page }) => {
    await goToPage(page);

    const input = page.locator(chatSelectors.inputField);
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("placeholder", "Type your message...");
  });

  test("send button is visible with English label", async ({ page }) => {
    await goToPage(page);

    const sendBtn = page.locator(chatSelectors.sendButton);
    await expect(sendBtn).toBeVisible();
    await expect(sendBtn).toHaveText("Send");
  });

  test("clicking a prompt chip sends it as a user message", async ({ page }) => {
    await goToPage(page);

    const chip = page
      .locator(`${chatSelectors.promptChip}`)
      .filter({ hasText: "What services do you offer?" });
    await chip.click();

    const userMessages = page.locator(chatSelectors.userMessage);
    await expect(userMessages).toHaveCount(1);

    // Prompt chips should disappear after sending
    const chipsContainer = page.locator(chatSelectors.promptChips);
    await expect(chipsContainer).not.toBeVisible();
  });

  test("typing a message and sending it creates a user message", async ({ page }) => {
    await goToPage(page);

    await sendChatMessage(page, "Tell me about your web development services");

    const userMessage = page.locator(chatSelectors.userMessage);
    await expect(userMessage.first()).toContainText("Tell me about your web development services");
  });

  // ── Trust Panel ──

  test("trust panel shows services with clickable items", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel.locator("text=Our Services")).toBeVisible();

    const serviceItems = trustPanel.locator('[data-testid^="service-item-"]');
    await expect(serviceItems).toHaveCount(5);
  });

  test("clicking a service item injects a prompt into chat", async ({ page }) => {
    await goToPage(page);

    const serviceItem = page.locator('[data-testid="service-item-svc-web-development"]');
    await serviceItem.click();

    const userMessage = page.locator(chatSelectors.userMessage);
    await expect(userMessage.first()).toContainText("web platform");
  });

  test("trust panel shows trust signals", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel.locator("text=Why Work With Us")).toBeVisible();
    await expect(trustPanel.locator("text=50+")).toBeVisible();
    await expect(trustPanel.locator("text=98%")).toBeVisible();
  });

  test("trust panel shows CTAs", async ({ page }) => {
    await goToPage(page);

    const panelCta = page.locator(chatSelectors.panelCTA);
    await expect(panelCta).toBeVisible();
    await expect(panelCta).toContainText("Book a Free Consultation");
    await expect(panelCta).toContainText("Contact Us");
  });

  test("character count updates as user types", async ({ page }) => {
    await goToPage(page);

    const input = page.locator(chatSelectors.inputField);
    await input.fill("Hello");

    const charCount = page.locator('[data-testid="character-count"]');
    await expect(charCount).toContainText("495 characters remaining");
  });

  test("two-panel layout is side by side on desktop", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    const chatContainer = page.locator(chatSelectors.container);

    const trustBox = await trustPanel.boundingBox();
    const chatBox = await chatContainer.boundingBox();

    expect(trustBox).not.toBeNull();
    expect(chatBox).not.toBeNull();

    // Trust panel should be to the left of chat container
    expect(trustBox!.x).toBeLessThan(chatBox!.x);
    // Both should be on the same row (similar y position)
    expect(Math.abs(trustBox!.y - chatBox!.y)).toBeLessThan(20);
  });

  // ── Language Switch Flow ──

  test("clicking ES language link navigates to Spanish page", async ({ page }) => {
    await goToPage(page);

    // Click ES link in header
    const header = page.locator("header");
    const esLink = header.locator('a:has-text("ES")').first();
    await esLink.click();
    await page.waitForLoadState("networkidle");

    // Should be on /es page
    expect(page.url()).toContain("/es");

    // Spanish hero content should render
    await expect(
      page.getByRole("heading", {
        name: "Construya Productos, Automatizaciones y Experiencias de IA Más Inteligentes",
      })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Consultor de IA" })).toBeVisible();
  });
});

test.describe("Consultant Desktop — ES", () => {
  test.use({
    viewport: { width: 1280, height: 720 },
    locale: "es-ES",
  });

  const goToPage = async (page: import("@playwright/test").Page) => {
    await page.goto("/es");
    await page.waitForLoadState("networkidle");
  };

  // ── Page Shell (Spanish) ──

  test("renders the Spanish header with logo and language switch", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const logo = header.locator('img[alt="Logo de JuaneloJGAC Tech"]');
    await expect(logo).toBeVisible();

    // EN link should take user back to English page
    await expect(header.locator('a[href="/"]')).toBeVisible();
  });

  test("renders the Spanish hero section", async ({ page }) => {
    await goToPage(page);

    await expect(
      page.getByRole("heading", {
        name: "Construya Productos, Automatizaciones y Experiencias de IA Más Inteligentes",
      })
    ).toBeVisible();
    await expect(page.locator("text=Agendar Consulta Gratis")).toBeVisible();
  });

  test("renders the Spanish services section", async ({ page }) => {
    await goToPage(page);

    await expect(
      page.getByRole("heading", { name: "Soluciones Diseñadas para el Crecimiento" })
    ).toBeVisible();
    await expect(page.locator("text=Desarrollo Web")).toBeVisible();
    await expect(page.locator("text=Automatización de Flujos")).toBeVisible();
  });

  test("renders the Spanish footer", async ({ page }) => {
    await goToPage(page);

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("© 2026 JuaneloJGAC Tech. Todos los derechos reservados.");
    await expect(footer).toContainText("Contacto");
    await expect(footer).toContainText("Política de Privacidad");
  });

  test("renders Spanish header and welcome message", async ({ page }) => {
    await goToPage(page);

    await expect(page.getByRole("heading", { name: "Consultor de IA" })).toBeVisible();

    await expect(
      page
        .locator(chatSelectors.messageList)
        .locator("text=¡Hola! Soy el asistente de JuaneloJGAC Tech")
    ).toBeVisible();
  });

  test("displays starter prompt chips in Spanish", async ({ page }) => {
    await goToPage(page);

    const chipsContainer = page.locator(chatSelectors.promptChips);
    await expect(chipsContainer).toBeVisible();

    await expect(
      page.locator(`${chatSelectors.promptChip} >> text=¿Qué servicios ofrecen?`)
    ).toBeVisible();
    await expect(
      page.locator(`${chatSelectors.promptChip} >> text=Necesito una plataforma web`)
    ).toBeVisible();
  });

  test("chat input has Spanish placeholder", async ({ page }) => {
    await goToPage(page);

    const input = page.locator(chatSelectors.inputField);
    await expect(input).toHaveAttribute("placeholder", "Escribe tu mensaje...");
  });

  test("send button shows Spanish label", async ({ page }) => {
    await goToPage(page);

    const sendBtn = page.locator(chatSelectors.sendButton);
    await expect(sendBtn).toHaveText("Enviar");
  });

  test("trust panel shows Spanish service labels", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel).toContainText("Nuestros Servicios");
    await expect(trustPanel).toContainText("Por Qué Trabajar Con Nosotros");
  });

  test("trust panel shows Spanish CTA labels", async ({ page }) => {
    await goToPage(page);

    const panelCta = page.locator(chatSelectors.panelCTA);
    await expect(panelCta).toContainText("Reserva una Consulta Gratuita");
    await expect(panelCta).toContainText("Contáctanos");
  });

  test("clicking a Spanish prompt chip sends it as a user message", async ({ page }) => {
    await goToPage(page);

    const chip = page
      .locator(`${chatSelectors.promptChip}`)
      .filter({ hasText: "¿Qué servicios ofrecen?" });
    await chip.click();

    const userMessages = page.locator(chatSelectors.userMessage);
    await expect(userMessages).toHaveCount(1);
  });

  test("Spanish character count label works", async ({ page }) => {
    await goToPage(page);

    const input = page.locator(chatSelectors.inputField);
    await input.fill("Hola");

    const charCount = page.locator('[data-testid="character-count"]');
    await expect(charCount).toContainText("496 caracteres restantes");
  });

  test("company tagline is in Spanish", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel).toContainText("Soluciones de IA prácticas");
  });

  test("two-panel desktop layout works in Spanish", async ({ page }) => {
    await goToPage(page);

    const trustPanel = page.locator(chatSelectors.trustPanel);
    const chatContainer = page.locator(chatSelectors.container);

    await expect(trustPanel).toBeVisible();
    await expect(chatContainer).toBeVisible();

    const trustBox = await trustPanel.boundingBox();
    const chatBox = await chatContainer.boundingBox();

    expect(trustBox).not.toBeNull();
    expect(chatBox).not.toBeNull();
    expect(trustBox!.x).toBeLessThan(chatBox!.x);
  });

  // ── Language Switch Flow (ES → EN) ──

  test("clicking EN language link navigates back to English page", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    const enLink = header.locator('a:has-text("EN")').first();
    await enLink.click();
    await page.waitForLoadState("networkidle");

    // Should be on root page
    expect(page.url()).not.toContain("/es");

    // English content should render
    await expect(
      page.getByRole("heading", {
        name: "Build Smarter Products, Automations, and AI Experiences",
      })
    ).toBeVisible();
  });
});
