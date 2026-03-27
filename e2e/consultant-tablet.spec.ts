import { expect } from "@playwright/test";

import { chatSelectors, sendChatMessage } from "./helpers/chat";
import { test } from "./helpers/fixtures";

/**
 * Tablet E2E tests for the redesigned homepage.
 * Viewport: 768×1024 (iPad gen 7).
 */
test.describe("Consultant Tablet (768×1024)", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  const goToPage = async (page: import("@playwright/test").Page, lang: "en" | "es" = "en") => {
    await page.goto(lang === "es" ? "/es" : "/");
    await page.waitForLoadState("networkidle");
  };

  // ── Page Shell on Tablet ──

  test("renders the header on tablet", async ({ page }) => {
    await goToPage(page);

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const logo = header.locator('img[alt="JuaneloJGAC Tech logo"]');
    await expect(logo).toBeVisible();

    await expect(header.locator("text=EN")).toBeVisible();
    await expect(header.locator("text=ES")).toBeVisible();
  });

  test("renders the hero section on tablet", async ({ page }) => {
    await goToPage(page);

    await expect(
      page.getByRole("heading", {
        name: "Build Smarter Products, Automations, and AI Experiences",
      })
    ).toBeVisible();
  });

  test("renders the footer on tablet", async ({ page }) => {
    await goToPage(page);

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("© 2026 JuaneloJGAC Tech. All rights reserved.");
  });

  // ── Consultant Layout ──

  test("renders the consultant layout on tablet", async ({ page }) => {
    await goToPage(page);

    const chatContainer = page.locator(chatSelectors.container);
    await expect(chatContainer).toBeVisible();
  });

  test("trust panel toggle is visible on tablet (below lg breakpoint)", async ({ page }) => {
    await goToPage(page);

    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await expect(toggleBtn).toBeVisible();
  });

  test("shows welcome message on tablet", async ({ page }) => {
    await goToPage(page);

    await expect(
      page
        .locator(chatSelectors.messageList)
        .locator("text=Hello! I'm the JuaneloJGAC Tech assistant")
    ).toBeVisible();
  });

  test("chat input works on tablet", async ({ page }) => {
    await goToPage(page);

    await sendChatMessage(page, "Hello from tablet");

    const userMessage = page.locator(chatSelectors.userMessage);
    await expect(userMessage.first()).toContainText("Hello from tablet");
  });

  test("prompt chips are visible on tablet", async ({ page }) => {
    await goToPage(page);

    const chipsContainer = page.locator(chatSelectors.promptChips);
    await expect(chipsContainer).toBeVisible();
  });

  test("panel CTA is visible on tablet", async ({ page }) => {
    await goToPage(page);

    const panelCta = page.locator(chatSelectors.panelCTA);
    await expect(panelCta).toBeVisible();
  });

  // ── Tablet i18n ──

  test("tablet ES layout loads Spanish content", async ({ page }) => {
    await goToPage(page, "es");

    await expect(page.getByRole("heading", { name: "Consultor de IA" })).toBeVisible();
    await expect(
      page
        .locator(chatSelectors.messageList)
        .locator("text=¡Hola! Soy el asistente de JuaneloJGAC Tech")
    ).toBeVisible();
  });

  test("tablet ES renders Spanish hero and footer", async ({ page }) => {
    await goToPage(page, "es");

    await expect(
      page.getByRole("heading", {
        name: "Construya Productos, Automatizaciones y Experiencias de IA Más Inteligentes",
      })
    ).toBeVisible();

    const footer = page.locator("footer");
    await expect(footer).toContainText("© 2026 JuaneloJGAC Tech. Todos los derechos reservados.");
  });

  // ── Layout integrity ──

  test("no horizontal overflow on tablet", async ({ page }) => {
    await goToPage(page);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("expanding trust panel on tablet shows services", async ({ page }) => {
    await goToPage(page);

    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await toggleBtn.click();

    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel.locator("text=Our Services")).toBeVisible();

    const serviceItems = trustPanel.locator('[data-testid^="service-item-"]');
    await expect(serviceItems).toHaveCount(5);
  });

  test("expanding trust panel on tablet shows outcome prompts", async ({ page }) => {
    await goToPage(page);

    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await toggleBtn.click();

    const trustPanel = page.locator(chatSelectors.trustPanel);
    const outcomes = trustPanel.locator(chatSelectors.outcomePrompt);
    await expect(outcomes.first()).toBeVisible();
  });
});
