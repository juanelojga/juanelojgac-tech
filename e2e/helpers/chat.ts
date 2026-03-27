import type { Page } from "@playwright/test";

/**
 * Chat interaction utilities for Playwright E2E tests.
 * These helpers will be used in later phases when the chat UI is built.
 */

/** Locator aliases for chat UI elements */
export const chatSelectors = {
  container: '[data-testid="chat-container"]',
  messageList: '[data-testid="chat-message-list"]',
  inputField: '[data-testid="chat-input"]',
  sendButton: '[data-testid="chat-send-button"]',
  promptChips: '[data-testid="grouped-prompt-chips"]',
  promptChip: '[data-testid="grouped-prompt-chip"]',
  typingIndicator: '[data-testid="typing-indicator"]',
  userMessage: '[data-testid="chat-message-user"]',
  assistantMessage: '[data-testid="chat-message-assistant"]',
  trustPanel: '[data-testid="trust-panel"]',
  retryButton: '[data-testid="chat-retry-button"]',
  followUps: '[data-testid="chat-follow-ups"]',
  outcomePrompt: '[data-testid^="outcome-prompt-"]',
} as const;

/**
 * Types a message into the chat input and submits it.
 */
export async function sendChatMessage(page: Page, message: string): Promise<void> {
  const input = page.locator(chatSelectors.inputField);
  await input.fill(message);
  await page.locator(chatSelectors.sendButton).click();
}

/**
 * Clicks a starter prompt chip by its text content.
 */
export async function clickPromptChip(page: Page, chipText: string): Promise<void> {
  const chip = page.locator(chatSelectors.promptChip).filter({ hasText: chipText });
  await chip.click();
}

/**
 * Waits for the assistant to finish typing and show a response.
 */
export async function waitForAssistantResponse(page: Page): Promise<void> {
  // Wait for typing indicator to appear and then disappear
  const indicator = page.locator(chatSelectors.typingIndicator);
  if (await indicator.isVisible()) {
    await indicator.waitFor({ state: "hidden", timeout: 30000 });
  }
  // Then wait for at least one assistant message
  await page.locator(chatSelectors.assistantMessage).last().waitFor({ state: "visible" });
}

/**
 * Gets all visible chat messages as an array of { role, content } objects.
 */
export async function getChatMessages(
  page: Page
): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  const userMessages = await page.locator(chatSelectors.userMessage).all();
  const assistantMessages = await page.locator(chatSelectors.assistantMessage).all();

  for (const msg of userMessages) {
    const content = await msg.textContent();
    messages.push({ role: "user", content: content?.trim() ?? "" });
  }

  for (const msg of assistantMessages) {
    const content = await msg.textContent();
    messages.push({ role: "assistant", content: content?.trim() ?? "" });
  }

  return messages;
}
