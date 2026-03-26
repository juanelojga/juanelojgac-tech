import type { Language } from "../i18n";
import type {
  ContentProvider,
  LeadAttributes,
  PriceRange,
  ProjectSummary,
  ProjectType,
  RecommendedSolution,
  ServiceContent,
  TimelineEstimate,
} from "./types";

// ──────────────────────────────────────────────
// Project Type → Service ID mapping
// ──────────────────────────────────────────────

const PROJECT_TYPE_SERVICE_MAP: Record<ProjectType, string> = {
  "web-platform": "svc-web-development",
  "ai-integration": "svc-ai-integration",
  automation: "svc-workflow-automation",
  consulting: "svc-ai-integration",
  custom: "svc-web-development",
};

// ──────────────────────────────────────────────
// Solution type labels (bilingual)
// ──────────────────────────────────────────────

const SOLUTION_TYPE_LABELS: Record<ProjectType, Record<Language, string>> = {
  "web-platform": {
    en: "Web Platform Development",
    es: "Desarrollo de Plataforma Web",
  },
  "ai-integration": {
    en: "AI Integration & Consulting",
    es: "Integración y Consultoría de IA",
  },
  automation: {
    en: "Workflow Automation",
    es: "Automatización de Flujos de Trabajo",
  },
  consulting: {
    en: "AI Consulting & Strategy",
    es: "Consultoría y Estrategia de IA",
  },
  custom: {
    en: "Custom Development Solution",
    es: "Solución de Desarrollo a Medida",
  },
};

// ──────────────────────────────────────────────
// Next steps templates (bilingual)
// ──────────────────────────────────────────────

const NEXT_STEPS: Record<Language, readonly string[]> = {
  en: [
    "Book a free consultation to discuss your project in detail",
    "We'll prepare a tailored proposal based on your requirements",
    "Review the proposal and timeline together",
  ],
  es: [
    "Reserva una consulta gratuita para discutir tu proyecto en detalle",
    "Prepararemos una propuesta personalizada según tus requisitos",
    "Revisaremos la propuesta y el cronograma juntos",
  ],
};

// ──────────────────────────────────────────────
// SummaryGeneratorImpl
// ──────────────────────────────────────────────

export class SummaryGeneratorImpl {
  private readonly contentProvider: ContentProvider;

  constructor(contentProvider: ContentProvider) {
    this.contentProvider = contentProvider;
  }

  generateSummary(leadAttributes: LeadAttributes, language: Language): ProjectSummary {
    const projectType = leadAttributes.projectType ?? "custom";
    const service = this.findMatchingService(projectType, language);

    return {
      id: crypto.randomUUID(),
      leadAttributes,
      recommendedSolution: this.buildSolution(projectType, service, language),
      timeline: service?.deliveryTimeline ?? this.defaultTimeline(language),
      priceRange: service?.pricingRange ?? this.defaultPriceRange(language),
      nextSteps: [...NEXT_STEPS[language]],
      generatedAt: Date.now(),
      language,
    };
  }

  canGenerateSummary(attrs: Partial<LeadAttributes>): boolean {
    return !!(attrs.projectType && attrs.goals && attrs.timeline);
  }

  // ──────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────

  private findMatchingService(
    projectType: ProjectType,
    language: Language
  ): ServiceContent | undefined {
    const serviceId = PROJECT_TYPE_SERVICE_MAP[projectType];
    const services = this.contentProvider.getServices(language);
    return services.find((s: ServiceContent) => s.id === serviceId);
  }

  private buildSolution(
    projectType: ProjectType,
    service: ServiceContent | undefined,
    language: Language
  ): RecommendedSolution {
    const type =
      SOLUTION_TYPE_LABELS[projectType]?.[language] ?? SOLUTION_TYPE_LABELS.custom[language];
    const description = service?.description ?? service?.shortDescription ?? type;
    return { type, description };
  }

  private defaultTimeline(language: Language): TimelineEstimate {
    return {
      minWeeks: 4,
      maxWeeks: 12,
      description: language === "en" ? "4–12 weeks" : "4–12 semanas",
    };
  }

  private defaultPriceRange(language: Language): PriceRange {
    return {
      minUSD: 3000,
      maxUSD: 15000,
      description: language === "en" ? "Starting from $3,000" : "Desde $3,000",
    };
  }
}
