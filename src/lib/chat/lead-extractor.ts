import type {
  BudgetRange,
  ChatMessage,
  LeadAttributes,
  ProjectType,
  TimelineUrgency,
} from "./types";

// ──────────────────────────────────────────────
// LeadExtractorImpl — SRP: only attribute extraction
// Extracts lead attributes from conversation history
// ──────────────────────────────────────────────

/** Project type detection patterns (EN + ES) */
const PROJECT_TYPE_PATTERNS: ReadonlyArray<{ type: ProjectType; patterns: RegExp[] }> = [
  {
    type: "ai-integration",
    patterns: [
      /\b(ai|artificial intelligence|machine learning|ml|inteligencia artificial|ia)\b/i,
      /\b(chatbot|natural language|nlp|gpt|llm)\b/i,
    ],
  },
  {
    type: "web-platform",
    patterns: [
      /\b(web\s*(platform|app|application|site|page|portal)|plataforma web|aplicación web|sitio web|página web)\b/i,
      /\b(e-?commerce|tienda|online store|dashboard|saas)\b/i,
      /\b(website|frontend|landing page)\b/i,
    ],
  },
  {
    type: "automation",
    patterns: [
      /\b(automat\w+|automatiz\w+)\b/i,
      /\b(workflow|flujo de trabajo)\b/i,
      /\b(repetitive tasks?|tareas repetitivas)\b/i,
      /\b(integration|pipeline|sync)\b/i,
    ],
  },
  {
    type: "consulting",
    patterns: [
      /\b(consult\w+|asesor\w+|consultoría)\b/i,
      /\b(strategy|estrategia|roadmap|hoja de ruta)\b/i,
      /\b(advice|guidance|assessment)\b/i,
    ],
  },
];

/** Timeline detection patterns — order matters: more specific first */
const TIMELINE_PATTERNS: ReadonlyArray<{ urgency: TimelineUrgency; patterns: RegExp[] }> = [
  {
    urgency: "exploring",
    patterns: [
      /\b(explor\w+|research\w*|investigando|explorando)\b/i,
      /\b(just looking|solo mirando|wondering|curious)\b/i,
      /\b(no rush|sin urgencia|not sure when)\b/i,
    ],
  },
  {
    urgency: "flexible",
    patterns: [
      /\b(flexible|sin prisa|cuando sea|take (our|your) time)\b/i,
      /\b(6\s*months|year|año|medio año|no rush|no hurry)\b/i,
    ],
  },
  {
    urgency: "immediate",
    patterns: [
      /\b(asap|urgent|immediately|right away|lo antes posible|urgente|inmediato)\b/i,
      /\b(this week|esta semana)\b/i,
    ],
  },
  {
    urgency: "short-term",
    patterns: [
      /\b(\d+)\s*(weeks?|months?|semanas?|meses?)\b/i,
      /\b(soon|pronto|next quarter|próximo trimestre)\b/i,
      /\b(within|en)\s*\d+\s*(weeks?|months?|semanas?|meses?)\b/i,
    ],
  },
];

/** Patterns for extracting target users */
const TARGET_USER_PATTERNS: readonly RegExp[] = [
  /\b(?:target(?:ing)?|serve|for|aimed at)\s+(.{5,60}?)(?:\.|,|$)/i,
  /\b(?:users?|customers?|clients?|audience|usuarios?|clientes?)\s+(?:are|is|son|es)\s+(.{5,60}?)(?:\.|,|$)/i,
  /\bour\s+(?:target|main)?\s*(?:users?|customers?|clients?|audience)\s+(?:are|is|include)\s+(.{5,60}?)(?:\.|,|$)/i,
  /\bnuestros?\s+(?:usuarios?|clientes?)\s+son\s+(.{5,60}?)(?:\.|,|$)/i,
  /\b(?:small business|enterprise|startup|consumers?|businesses?|companies|empresas?|negocios?|consumidores?)\s*(?:owners?|operators?)?\b/i,
];

/** Patterns for extracting goals */
const GOAL_PATTERNS: readonly RegExp[] = [
  /\b(?:goal|objective|aim)\s+(?:is|are)\s+(?:to\s+)?(.{5,80}?)(?:\.|,|$)/i,
  /\b(?:objetivo|meta)\s+(?:es|son)\s+(.{5,80}?)(?:\.|,|$)/i,
  /\b(?:i|we)\s+(?:want|need|would like)\s+to\s+(.{5,80}?)(?:\.|,|$)/i,
  /\b(?:quiero|queremos|necesito|necesitamos)\s+(.{5,80}?)(?:\.|,|$)/i,
  /\b(?:increase|decrease|reduce|improve|grow|boost|enhance|save|cut|minimize)\s+(.{5,60}?)(?:\.|,|$)/i,
  /\b(?:aumentar|reducir|mejorar|crecer|ahorrar)\s+(.{5,60}?)(?:\.|,|$)/i,
];

export class LeadExtractorImpl {
  extractLeadAttributes(messages: readonly ChatMessage[]): Partial<LeadAttributes> {
    // Only extract from user messages
    const userMessages = messages.filter((m) => m.role === "user");

    if (userMessages.length === 0) {
      return {};
    }

    const attributes: Record<string, unknown> = {};

    // Extract each attribute type
    const projectType = this.extractProjectType(userMessages);
    if (projectType) attributes.projectType = projectType;

    const targetUsers = this.extractTargetUsers(userMessages);
    if (targetUsers) attributes.targetUsers = targetUsers;

    const goals = this.extractGoals(userMessages);
    if (goals) attributes.goals = goals;

    const timeline = this.extractTimeline(userMessages);
    if (timeline) attributes.timeline = timeline;

    const budgetRange = this.extractBudgetRange(userMessages);
    if (budgetRange) attributes.budgetRange = budgetRange;

    return attributes as Partial<LeadAttributes>;
  }

  private extractProjectType(messages: readonly ChatMessage[]): ProjectType | undefined {
    // Process messages in reverse to get the most recent type
    for (let i = messages.length - 1; i >= 0; i--) {
      const content = messages[i].content;
      for (const { type, patterns } of PROJECT_TYPE_PATTERNS) {
        if (patterns.some((p) => p.test(content))) {
          return type;
        }
      }
    }

    // Check if any message mentions "project" generically
    const hasProjectMention = messages.some((m) =>
      /\b(project|proyecto|idea|unique)\b/i.test(m.content)
    );
    return hasProjectMention ? "custom" : undefined;
  }

  private extractTargetUsers(messages: readonly ChatMessage[]): string | undefined {
    for (const msg of messages) {
      for (const pattern of TARGET_USER_PATTERNS) {
        const match = msg.content.match(pattern);
        if (match) {
          // Return the captured group if available, otherwise the full match
          return (match[1] ?? match[0]).trim();
        }
      }
    }
    return undefined;
  }

  private extractGoals(messages: readonly ChatMessage[]): string | undefined {
    for (const msg of messages) {
      for (const pattern of GOAL_PATTERNS) {
        const match = msg.content.match(pattern);
        if (match) {
          return (match[1] ?? match[0]).trim();
        }
      }
    }
    return undefined;
  }

  private extractTimeline(messages: readonly ChatMessage[]): TimelineUrgency | undefined {
    for (const msg of messages) {
      for (const { urgency, patterns } of TIMELINE_PATTERNS) {
        if (patterns.some((p) => p.test(msg.content))) {
          return urgency;
        }
      }
    }
    return undefined;
  }

  private extractBudgetRange(messages: readonly ChatMessage[]): BudgetRange | undefined {
    for (const msg of messages) {
      // Look for dollar amounts in the message
      const amountMatches = msg.content.match(/\$\s*([\d,]+)/g);
      if (amountMatches) {
        // Get the highest amount mentioned
        const amounts = amountMatches.map((m) => parseInt(m.replace(/[$,\s]/g, ""), 10));
        const maxAmount = Math.max(...amounts);

        if (maxAmount <= 5000) return "starter";
        if (maxAmount <= 15000) return "growth";
        return "enterprise";
      }
    }
    return undefined;
  }
}
