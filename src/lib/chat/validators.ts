import type {
  BudgetRange,
  ChatMessage,
  CompanyFacts,
  ConversationPhase,
  ConversationState,
  CTAInjectionResult,
  FollowUpSuggestion,
  GuidedFollowUp,
  InlineCTA,
  LeadAttributes,
  MessageRole,
  OutOfScopeRedirect,
  PriceRange,
  ProjectSummary,
  ProjectType,
  RecommendedSolution,
  ScopeEvaluationResult,
  ServiceContent,
  StarterPrompt,
  TimelineEstimate,
  TimelineUrgency,
  TrustSignal,
} from "./types";

const MAX_INPUT_LENGTH = 5000;

// ──────────────────────────────────────────────
// Primitive helpers
// ──────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isValidLanguage(value: unknown): value is "en" | "es" {
  return value === "en" || value === "es";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ──────────────────────────────────────────────
// Enum-like validators
// ──────────────────────────────────────────────

const MESSAGE_ROLES: ReadonlySet<string> = new Set(["user", "assistant", "system"]);

export function isValidMessageRole(value: unknown): value is MessageRole {
  return typeof value === "string" && MESSAGE_ROLES.has(value);
}

const CONVERSATION_PHASES: ReadonlySet<string> = new Set([
  "greeting",
  "discovery",
  "qualification",
  "summary",
  "completed",
]);

export function isValidConversationPhase(value: unknown): value is ConversationPhase {
  return typeof value === "string" && CONVERSATION_PHASES.has(value);
}

const PROJECT_TYPES: ReadonlySet<string> = new Set([
  "ai-integration",
  "web-platform",
  "automation",
  "consulting",
  "custom",
]);

export function isValidProjectType(value: unknown): value is ProjectType {
  return typeof value === "string" && PROJECT_TYPES.has(value);
}

const TIMELINE_URGENCIES: ReadonlySet<string> = new Set([
  "immediate",
  "short-term",
  "flexible",
  "exploring",
]);

export function isValidTimelineUrgency(value: unknown): value is TimelineUrgency {
  return typeof value === "string" && TIMELINE_URGENCIES.has(value);
}

const BUDGET_RANGES: ReadonlySet<string> = new Set(["starter", "growth", "enterprise", "unknown"]);

export function isValidBudgetRange(value: unknown): value is BudgetRange {
  return typeof value === "string" && BUDGET_RANGES.has(value);
}

const CTA_TYPES: ReadonlySet<string> = new Set(["booking", "contact", "service"]);

const TRUST_SIGNAL_TYPES: ReadonlySet<string> = new Set(["stat", "badge", "testimonial", "logo"]);

// ──────────────────────────────────────────────
// Struct validators
// ──────────────────────────────────────────────

export function isValidInlineCTA(value: unknown): value is InlineCTA {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.label) &&
    isNonEmptyString(v.url) &&
    typeof v.type === "string" &&
    CTA_TYPES.has(v.type)
  );
}

export function isValidChatMessage(value: unknown): value is ChatMessage {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  if (!isNonEmptyString(v.id)) return false;
  if (!isValidMessageRole(v.role)) return false;
  if (!isNonEmptyString(v.content)) return false;
  if (typeof v.timestamp !== "number" || v.timestamp < 0) return false;
  if (!isValidLanguage(v.language)) return false;
  if (v.ctas !== undefined) {
    if (!Array.isArray(v.ctas)) return false;
    if (!v.ctas.every(isValidInlineCTA)) return false;
  }
  return true;
}

export function isValidLeadAttributes(value: unknown): value is LeadAttributes {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isValidProjectType(v.projectType) &&
    isNonEmptyString(v.targetUsers) &&
    isNonEmptyString(v.goals) &&
    isValidTimelineUrgency(v.timeline) &&
    isValidBudgetRange(v.budgetRange) &&
    isNonEmptyString(v.companySize) &&
    isNonEmptyString(v.industry)
  );
}

export function isValidTimelineEstimate(value: unknown): value is TimelineEstimate {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.minWeeks === "number" &&
    v.minWeeks >= 0 &&
    typeof v.maxWeeks === "number" &&
    v.maxWeeks >= v.minWeeks &&
    isNonEmptyString(v.description)
  );
}

export function isValidPriceRange(value: unknown): value is PriceRange {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.minUSD === "number" &&
    v.minUSD >= 0 &&
    typeof v.maxUSD === "number" &&
    v.maxUSD >= v.minUSD &&
    isNonEmptyString(v.description)
  );
}

export function isValidRecommendedSolution(value: unknown): value is RecommendedSolution {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return isNonEmptyString(v.type) && isNonEmptyString(v.description);
}

export function isValidServiceContent(value: unknown): value is ServiceContent {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.id) &&
    isNonEmptyString(v.title) &&
    isNonEmptyString(v.description) &&
    isNonEmptyString(v.shortDescription) &&
    isValidPriceRange(v.pricingRange) &&
    isValidTimelineEstimate(v.deliveryTimeline) &&
    Array.isArray(v.examples) &&
    isNonEmptyString(v.relatedPrompt)
  );
}

export function isValidTrustSignal(value: unknown): value is TrustSignal {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.id) &&
    typeof v.type === "string" &&
    TRUST_SIGNAL_TYPES.has(v.type) &&
    isNonEmptyString(v.label) &&
    isNonEmptyString(v.value)
  );
}

export function isValidCompanyFacts(value: unknown): value is CompanyFacts {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.name) &&
    isNonEmptyString(v.tagline) &&
    isNonEmptyString(v.description) &&
    Array.isArray(v.processSteps) &&
    v.processSteps.length > 0 &&
    isNonEmptyString(v.teamDescription)
  );
}

export function isValidStarterPrompt(value: unknown): value is StarterPrompt {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.id) &&
    isNonEmptyString(v.label) &&
    isNonEmptyString(v.prompt) &&
    (v.intent === "general" || isValidProjectType(v.intent))
  );
}

export function isValidGuidedFollowUp(value: unknown): value is GuidedFollowUp {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.id) &&
    isNonEmptyString(v.label) &&
    isNonEmptyString(v.prompt) &&
    Array.isArray(v.applicablePhases) &&
    v.applicablePhases.length > 0 &&
    v.applicablePhases.every(isValidConversationPhase)
  );
}

export function isValidOutOfScopeRedirect(value: unknown): value is OutOfScopeRedirect {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.message) &&
    Array.isArray(v.suggestedPrompts) &&
    v.suggestedPrompts.length > 0 &&
    v.suggestedPrompts.every(isValidStarterPrompt)
  );
}

export function isValidConversationState(value: unknown): value is ConversationState {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.messages) &&
    v.messages.every(isValidChatMessage) &&
    isValidConversationPhase(v.phase) &&
    isValidLanguage(v.language) &&
    isObject(v.leadAttributes) &&
    typeof v.isAssistantTyping === "boolean" &&
    (v.error === null || typeof v.error === "string")
  );
}

export function isValidProjectSummary(value: unknown): value is ProjectSummary {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.id) &&
    isValidLeadAttributes(v.leadAttributes) &&
    isValidRecommendedSolution(v.recommendedSolution) &&
    isValidTimelineEstimate(v.timeline) &&
    isValidPriceRange(v.priceRange) &&
    Array.isArray(v.nextSteps) &&
    v.nextSteps.length > 0 &&
    typeof v.generatedAt === "number" &&
    v.generatedAt >= 0 &&
    isValidLanguage(v.language)
  );
}

export function isValidScopeEvaluationResult(value: unknown): value is ScopeEvaluationResult {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.isInScope !== "boolean") return false;
  if (typeof v.confidence !== "number" || v.confidence < 0 || v.confidence > 1) return false;
  if (v.redirect !== undefined && !isValidOutOfScopeRedirect(v.redirect)) return false;
  return true;
}

export function isValidCTAInjectionResult(value: unknown): value is CTAInjectionResult {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.shouldInject === "boolean" && Array.isArray(v.ctas) && v.ctas.every(isValidInlineCTA)
  );
}

export function isValidFollowUpSuggestion(value: unknown): value is FollowUpSuggestion {
  if (!isObject(value)) return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.followUps) || !v.followUps.every(isValidGuidedFollowUp)) return false;
  if (typeof v.shouldTransitionPhase !== "boolean") return false;
  if (v.shouldTransitionPhase && !isValidConversationPhase(v.nextPhase)) return false;
  return true;
}

// ──────────────────────────────────────────────
// Input sanitization
// ──────────────────────────────────────────────

export function sanitizeUserInput(input: string): string {
  let sanitized = input;
  // Strip null bytes
  sanitized = sanitized.replace(/\0/g, "");
  // Strip script/style tags and their content
  sanitized = sanitized.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  // Strip remaining HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");
  // Trim whitespace
  sanitized = sanitized.trim();
  // Truncate to max length
  if (sanitized.length > MAX_INPUT_LENGTH) {
    sanitized = sanitized.slice(0, MAX_INPUT_LENGTH);
  }
  return sanitized;
}
