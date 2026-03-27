import { expect } from "@playwright/test";

import { chatSelectors, sendChatMessage } from "./helpers/chat";
import { test } from "./helpers/fixtures";

/**
 * Mobile E2E tests for the redesigned homepage.
 * Viewport: 375×812 (iPhone 14).
 */
test.describe("Consultant Mobile (375×812)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  const goToPage = async (page: import("@playwright/test").Page, lang: "en" | "es" = "en") => {
    await page.goto(lang === "es" ? "/es" : "/");
    await page.waitForLoadState("networkidle");
  };

  // ── Page Shell on Mobile ──

  test("renders the header on mobile with logo and language switch", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const logo = header.locator('img[alt="JuaneloJGAC Tech logo"]');
    await expect(logo).toBeVisible();

    await expect(header.locator("text=EN")).toBeVisible();
    await expect(header.locator("text=ES")).toBeVisible();
  });

  test("header does not consume excessive viewport on mobile", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();
    // Header is h-16 (64px) on mobile
    expect(headerBox!.height).toBeLessThanOrEqual(68);
  });

  test("renders the hero section on mobile", async ({ page }) => {
    await goToPage(page);

    await expect(
      page.getByRole("heading", {
        name: "Build Smarter Products, Automations, and AI Experiences",
      })
    ).toBeVisible();
  });

  test("renders the services section on mobile", async ({ page }) => {
    await goToPage(page);

    const servicesSection = page.locator("#services");
    await expect(servicesSection).toBeVisible();
  });

  test("renders the footer on mobile", async ({ page }) => {
    await goToPage(page);

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("© 2026 JuaneloJGAC Tech. All rights reserved.");
  });

  // ── Chat-First Layout ──

  test("renders the consultant layout on mobile", async ({ page }) => {
    await goToPage(page);

    const chatContainer = page.locator(chatSelectors.container);
    await expect(chatContainer).toBeVisible();
  });

  test("trust panel starts collapsed on mobile", async ({ page }) => {
    await goToPage(page);

    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toContainText("Show details");
  });

  test("expanding the trust panel shows services", async ({ page }) => {
    await goToPage(page);

    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await toggleBtn.click();

    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel.locator("text=Our Services")).toBeVisible();

    await expect(toggleBtn).toContainText("Hide details");
  });

  test("expanding the trust panel shows outcome prompts on mobile", async ({ page }) => {
    await goToPage(page);

    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await toggleBtn.click();

    const trustPanel = page.locator(chatSelectors.trustPanel);
    const outcomes = trustPanel.locator(chatSelectors.outcomePrompt);
    await expect(outcomes.first()).toBeVisible();
  });

  test("shows welcome message and prompt chips on mobile", async ({ page }) => {
    await goToPage(page);

    await expect(
      page
        .locator(chatSelectors.messageList)
        .locator("text=Hello! I'm the JuaneloJGAC Tech assistant")
    ).toBeVisible();

    const chipsContainer = page.locator(chatSelectors.promptChips);
    await expect(chipsContainer).toBeVisible();
  });

  test("chat input is visible and functional on mobile", async ({ page }) => {
    await goToPage(page);

    const input = page.locator(chatSelectors.inputField);
    await expect(input).toBeVisible();

    await sendChatMessage(page, "Hello from mobile");

    const userMessage = page.locator(chatSelectors.userMessage);
    await expect(userMessage.first()).toContainText("Hello from mobile");
  });

  test("prompt chips are tappable on mobile (min touch target)", async ({ page }) => {
    await goToPage(page);

    const chips = page.locator(chatSelectors.promptChip);
    const firstChip = chips.first();

    const chipBox = await firstChip.boundingBox();
    expect(chipBox).not.toBeNull();
    expect(chipBox!.height).toBeGreaterThanOrEqual(44);
  });

  test("send button meets minimum touch target size", async ({ page }) => {
    await goToPage(page);

    const sendBtn = page.locator(chatSelectors.sendButton);
    const btnBox = await sendBtn.boundingBox();
    expect(btnBox).not.toBeNull();
    expect(btnBox!.height).toBeGreaterThanOrEqual(44);
    expect(btnBox!.width).toBeGreaterThanOrEqual(44);
  });

  test("panel CTA is always visible on mobile", async ({ page }) => {
    await goToPage(page);

    const panelCta = page.locator(chatSelectors.panelCTA);
    await expect(panelCta).toBeVisible();
  });

  test("clicking a chip on mobile sends a message", async ({ page }) => {
    await goToPage(page);

    const chip = page.locator(chatSelectors.promptChip).first();
    await chip.click();

    const userMessages = page.locator(chatSelectors.userMessage);
    await expect(userMessages).toHaveCount(1);

    // Chips should disappear
    const chipsContainer = page.locator(chatSelectors.promptChips);
    await expect(chipsContainer).not.toBeVisible();
  });

  // ── Mobile i18n ──

  test("mobile ES layout loads Spanish content", async ({ page }) => {
    await goToPage(page, "es");

    await expect(
      page
        .locator(chatSelectors.messageList)
        .locator("text=¡Hola! Soy el asistente de JuaneloJGAC Tech")
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "Consultor de IA" })).toBeVisible();

    const input = page.locator(chatSelectors.inputField);
    await expect(input).toHaveAttribute("placeholder", "Escribe tu mensaje...");
  });

  test("mobile ES header shows Spanish hero", async ({ page }) => {
    await goToPage(page, "es");

    await expect(
      page.getByRole("heading", {
        name: "Construya Productos, Automatizaciones y Experiencias de IA Más Inteligentes",
      })
    ).toBeVisible();
  });

  test("mobile ES shows Spanish services section", async ({ page }) => {
    await goToPage(page, "es");

    await expect(
      page.getByRole("heading", { name: "Soluciones Diseñadas para el Crecimiento" })
    ).toBeVisible();
  });

  test("mobile ES toggle label is in Spanish", async ({ page }) => {
    await goToPage(page, "es");

    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await expect(toggleBtn).toContainText("Mostrar detalles");
  });

  test("layout has no horizontal overflow on mobile", async ({ page }) => {
    await goToPage(page);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
