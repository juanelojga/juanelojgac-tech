import type { Language } from "../i18n";
import { ChatAPIClient } from "./chat-api-client";
import { getErrorMessageKey, isOpenRouterError } from "./http-utils";
import { SystemPromptBuilder } from "./system-prompt-builder";
import type {
  ChatAssistantService,
  ChatMessage,
  ContentProvider,
  ConversationPhase,
  ConversationState,
  LeadAttributes,
  ProjectSummary,
} from "./types";

// ──────────────────────────────────────────────
// ChatAssistantServiceImpl — SRP: mediates UI ↔ API
// DIP: depends on abstractions (ContentProvider)
// ──────────────────────────────────────────────

/** Minimum required lead attributes to generate a summary */
const SUMMARY_REQUIRED_FIELDS: ReadonlyArray<keyof LeadAttributes> = [
  "projectType",
  "goals",
  "timeline",
];

/** Counter for unique message IDs */
let messageIdCounter = 0;

function generateMessageId(): string {
  messageIdCounter += 1;
  return `msg-${Date.now()}-${messageIdCounter}`;
}

export class ChatAssistantServiceImpl implements ChatAssistantService {
  private readonly apiClient: ChatAPIClient;
  private readonly promptBuilder: SystemPromptBuilder;
  private readonly contentProvider: ContentProvider;

  private messages: ChatMessage[] = [];
  private phase: ConversationPhase = "greeting";
  private language: Language;
  private leadAttributes: Partial<LeadAttributes> = {};
  private isAssistantTyping = false;
  private error: string | null = null;

  constructor(contentProvider: ContentProvider, initialLanguage: Language = "en") {
    this.contentProvider = contentProvider;
    this.language = initialLanguage;
    this.apiClient = new ChatAPIClient();
    this.promptBuilder = new SystemPromptBuilder(contentProvider);
  }

  // ── ChatStateManager ──

  getState(): ConversationState {
    return {
      messages: [...this.messages],
      phase: this.phase,
      language: this.language,
      leadAttributes: { ...this.leadAttributes },
      isAssistantTyping: this.isAssistantTyping,
      error: this.error,
    };
  }

  resetConversation(language: Language): void {
    this.messages = [];
    this.phase = "greeting";
    this.language = language;
    this.leadAttributes = {};
    this.isAssistantTyping = false;
    this.error = null;
  }

  updateLanguage(language: Language): void {
    this.language = language;
  }

  // ── ChatMessageSender ──

  async sendMessage(message: string, _conversationState: ConversationState): Promise<ChatMessage> {
    // Create user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: message,
      timestamp: Date.now(),
      language: this.language,
    };

    this.messages.push(userMessage);
    this.isAssistantTyping = true;
    this.error = null;

    try {
      // Format messages for API
      const apiMessages = this.promptBuilder.formatMessagesForAPI(
        this.messages,
        this.language,
        this.phase
      );

      // Call API
      const result = await this.apiClient.sendMessage(apiMessages, this.language);

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: result.content,
        timestamp: Date.now(),
        language: this.language,
      };

      this.messages.push(assistantMessage);
      this.isAssistantTyping = false;

      // Transition phase after first exchange
      if (this.phase === "greeting" && this.messages.length >= 2) {
        this.phase = "discovery";
      }

      return assistantMessage;
    } catch (err: unknown) {
      this.isAssistantTyping = false;
      if (isOpenRouterError(err)) {
        this.error = getErrorMessageKey(err.code);
      } else {
        this.error = "chat.messages.errorGeneric";
      }
      throw err;
    }
  }

  // ── ChatSummaryGenerator ──

  canGenerateSummary(leadAttributes: Partial<LeadAttributes>): boolean {
    return SUMMARY_REQUIRED_FIELDS.every(
      (field) => leadAttributes[field] !== undefined && leadAttributes[field] !== ""
    );
  }

  async generateSummary(conversationState: ConversationState): Promise<ProjectSummary> {
    const fullLeadAttributes = this.fillLeadAttributes(conversationState.leadAttributes);

    // Ask the API to generate a structured summary
    const summaryPrompt = this.buildSummaryPrompt(fullLeadAttributes);
    const apiMessages = [
      ...this.promptBuilder.formatMessagesForAPI(
        conversationState.messages,
        conversationState.language,
        "summary"
      ),
      { role: "user" as const, content: summaryPrompt },
    ];

    const result = await this.apiClient.sendMessage(apiMessages, conversationState.language);

    return this.parseSummaryResponse(
      result.content,
      fullLeadAttributes,
      conversationState.language
    );
  }

  // ── Private helpers ──

  private fillLeadAttributes(partial: Partial<LeadAttributes>): LeadAttributes {
    return {
      projectType: partial.projectType ?? "custom",
      targetUsers: partial.targetUsers ?? "Not specified",
      goals: partial.goals ?? "Not specified",
      timeline: partial.timeline ?? "flexible",
      budgetRange: partial.budgetRange ?? "unknown",
      companySize: partial.companySize ?? "Not specified",
      industry: partial.industry ?? "Not specified",
    };
  }

  private buildSummaryPrompt(leadAttributes: LeadAttributes): string {
    return [
      "Based on our conversation, please generate a project summary in the following JSON format:",
      "{",
      '  "recommendedSolution": { "type": "...", "description": "..." },',
      '  "timeline": { "minWeeks": N, "maxWeeks": N, "description": "..." },',
      '  "priceRange": { "minUSD": N, "maxUSD": N, "description": "..." },',
      '  "nextSteps": ["step1", "step2"]',
      "}",
      "",
      "Client information:",
      `- Project type: ${leadAttributes.projectType}`,
      `- Target users: ${leadAttributes.targetUsers}`,
      `- Goals: ${leadAttributes.goals}`,
      `- Timeline: ${leadAttributes.timeline}`,
      `- Budget range: ${leadAttributes.budgetRange}`,
      `- Company size: ${leadAttributes.companySize}`,
      `- Industry: ${leadAttributes.industry}`,
      "",
      "IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanation.",
    ].join("\n");
  }

  private parseSummaryResponse(
    content: string,
    leadAttributes: LeadAttributes,
    language: Language
  ): ProjectSummary {
    // Try to extract JSON from the response
    let parsed: {
      recommendedSolution?: { type?: string; description?: string };
      timeline?: { minWeeks?: number; maxWeeks?: number; description?: string };
      priceRange?: { minUSD?: number; maxUSD?: number; description?: string };
      nextSteps?: string[];
    };

    try {
      // Strip potential markdown code block wrapping
      const jsonContent = content
        .replace(/```json\s*\n?/g, "")
        .replace(/```\s*$/g, "")
        .trim();
      parsed = JSON.parse(jsonContent);
    } catch {
      // Provide fallback summary if JSON parsing fails
      parsed = {
        recommendedSolution: {
          type: "Custom Solution",
          description: "A tailored solution based on your requirements",
        },
        timeline: { minWeeks: 4, maxWeeks: 12, description: "4-12 weeks" },
        priceRange: { minUSD: 3000, maxUSD: 15000, description: "$3,000 - $15,000" },
        nextSteps: ["Book a free consultation to discuss details"],
      };
    }

    return {
      id: `ps-${Date.now()}`,
      leadAttributes,
      recommendedSolution: {
        type: parsed.recommendedSolution?.type ?? "Custom Solution",
        description:
          parsed.recommendedSolution?.description ??
          "A tailored solution based on your requirements",
      },
      timeline: {
        minWeeks: parsed.timeline?.minWeeks ?? 4,
        maxWeeks: parsed.timeline?.maxWeeks ?? 12,
        description: parsed.timeline?.description ?? "4-12 weeks",
      },
      priceRange: {
        minUSD: parsed.priceRange?.minUSD ?? 3000,
        maxUSD: parsed.priceRange?.maxUSD ?? 15000,
        description: parsed.priceRange?.description ?? "$3,000 - $15,000",
      },
      nextSteps: parsed.nextSteps ?? ["Book a free consultation to discuss details"],
      generatedAt: Date.now(),
      language,
    };
  }
}
