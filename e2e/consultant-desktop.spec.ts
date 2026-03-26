import { expect } from "@playwright/test";

import { chatSelectors, sendChatMessage } from "./helpers/chat";
import { test } from "./helpers/fixtures";

/**
 * Desktop E2E tests for the AI Consultant experience.
 * Covers EN and ES conversation flows on desktop viewport (1280×720).
 */
test.describe("Consultant Desktop — EN", () => {
  test.use({ viewport: { width: 1280, height: 720 }, locale: "en-US" });

  const goToPage = async (page: import("@playwright/test").Page) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  };

  test("renders the consultant layout with trust panel and chat", async ({ page }) => {
    await goToPage(page);

    // Trust panel is visible on desktop
    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel).toBeVisible();

    // Chat container is visible
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

    // Header title
    await expect(page.getByRole("heading", { name: "AI Consultant" })).toBeVisible();

    // Welcome message in chat
    await expect(
      page
        .locator(chatSelectors.messageList)
        .locator("text=Hello! I'm the JuaneloJGAC Tech assistant")
    ).toBeVisible();
  });

  test("displays starter prompt chips in English", async ({ page }) => {
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

    // Click a prompt chip
    const chip = page
      .locator(`${chatSelectors.promptChip}`)
      .filter({ hasText: "What services do you offer?" });
    await chip.click();

    // User message should appear
    const userMessages = page.locator(chatSelectors.userMessage);
    await expect(userMessages).toHaveCount(1);

    // Prompt chips should disappear after sending
    const chipsContainer = page.locator(chatSelectors.promptChips);
    await expect(chipsContainer).not.toBeVisible();
  });

  test("typing a message and sending it creates a user message", async ({ page }) => {
    await goToPage(page);

    await sendChatMessage(page, "Tell me about your web development services");

    // User message should appear
    const userMessage = page.locator(chatSelectors.userMessage);
    await expect(userMessage.first()).toContainText("Tell me about your web development services");
  });

  test("trust panel shows services with clickable items", async ({ page }) => {
    await goToPage(page);

    // Services section should be visible on desktop
    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel.locator("text=Our Services")).toBeVisible();

    // Should have service items
    const serviceItems = trustPanel.locator('[data-testid^="service-item-"]');
    await expect(serviceItems).toHaveCount(5);
  });

  test("clicking a service item injects a prompt into chat", async ({ page }) => {
    await goToPage(page);

    // Click a service item
    const serviceItem = page.locator('[data-testid="service-item-svc-web-development"]');
    await serviceItem.click();

    // Should create a user message with the service's related prompt
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

  test("renders Spanish header and welcome message", async ({ page }) => {
    await goToPage(page);

    // Header title in Spanish
    await expect(page.getByRole("heading", { name: "Consultor de IA" })).toBeVisible();

    // Welcome message in Spanish
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
});
