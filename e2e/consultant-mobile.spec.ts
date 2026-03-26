import { expect } from "@playwright/test";

import { chatSelectors, sendChatMessage } from "./helpers/chat";
import { test } from "./helpers/fixtures";

/**
 * Mobile E2E tests for the AI Consultant experience.
 * Viewport: 375×812 (iPhone 14).
 */
test.describe("Consultant Mobile (375×812)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  const goToPage = async (page: import("@playwright/test").Page, lang: "en" | "es" = "en") => {
    await page.goto(lang === "es" ? "/es" : "/");
    await page.waitForLoadState("networkidle");
  };

  test("renders the consultant layout on mobile", async ({ page }) => {
    await goToPage(page);

    const chatContainer = page.locator(chatSelectors.container);
    await expect(chatContainer).toBeVisible();
  });

  test("trust panel starts collapsed on mobile", async ({ page }) => {
    await goToPage(page);

    // Panel toggle should be visible on mobile
    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await expect(toggleBtn).toBeVisible();

    // Toggle should show "Show details" (collapsed by default)
    await expect(toggleBtn).toContainText("Show details");
  });

  test("expanding the trust panel shows services", async ({ page }) => {
    await goToPage(page);

    // Click toggle to expand
    const toggleBtn = page.locator('[data-testid="panel-toggle"]');
    await toggleBtn.click();

    // Should now show services
    const trustPanel = page.locator(chatSelectors.trustPanel);
    await expect(trustPanel.locator("text=Our Services")).toBeVisible();

    // Toggle label should change
    await expect(toggleBtn).toContainText("Hide details");
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

    // Type and send a message
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
    // Verify minimum touch target height of 44px
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

  test("mobile ES layout loads Spanish content", async ({ page }) => {
    await goToPage(page, "es");

    // Spanish welcome
    await expect(
      page
        .locator(chatSelectors.messageList)
        .locator("text=¡Hola! Soy el asistente de JuaneloJGAC Tech")
    ).toBeVisible();

    // Spanish header
    await expect(page.getByRole("heading", { name: "Consultor de IA" })).toBeVisible();

    // Spanish input placeholder
    const input = page.locator(chatSelectors.inputField);
    await expect(input).toHaveAttribute("placeholder", "Escribe tu mensaje...");
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

    // scrollWidth should not exceed clientWidth by more than 1px (rounding)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
