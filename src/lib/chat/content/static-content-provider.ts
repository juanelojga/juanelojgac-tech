import type { Language } from "../../i18n";
import type {
  CompanyFacts,
  ContentProvider,
  ConversationPhase,
  GuidedFollowUp,
  OutOfScopeRedirect,
  ServiceContent,
  StarterPrompt,
  TrustSignal,
} from "../types";
import companyData from "./company.json";
import promptsData from "./prompts.json";
import servicesData from "./services.json";

// ──────────────────────────────────────────────
// JSON shape types (internal — not exported)
// ──────────────────────────────────────────────

interface ServicesJSON {
  en: ServiceContent[];
  es: ServiceContent[];
}

interface CompanyJSON {
  en: { companyFacts: CompanyFacts; trustSignals: TrustSignal[] };
  es: { companyFacts: CompanyFacts; trustSignals: TrustSignal[] };
}

interface PromptsJSON {
  en: {
    starterPrompts: StarterPrompt[];
    guidedFollowUps: GuidedFollowUp[];
    outOfScopeRedirect: OutOfScopeRedirect;
  };
  es: {
    starterPrompts: StarterPrompt[];
    guidedFollowUps: GuidedFollowUp[];
    outOfScopeRedirect: OutOfScopeRedirect;
  };
}

// ──────────────────────────────────────────────
// StaticContentProvider
// ──────────────────────────────────────────────

/**
 * Reads bilingual content from static JSON files.
 * Implements ContentProvider (OCP — open for extension via new categories).
 * Follows LSP — substitutable for any ContentProvider implementation.
 */
export class StaticContentProvider implements ContentProvider {
  private readonly services: Record<Language, readonly ServiceContent[]>;
  private readonly companyFacts: Record<Language, CompanyFacts>;
  private readonly trustSignals: Record<Language, readonly TrustSignal[]>;
  private readonly starterPrompts: Record<Language, readonly StarterPrompt[]>;
  private readonly guidedFollowUps: Record<Language, readonly GuidedFollowUp[]>;
  private readonly filteredFollowUps: Map<string, readonly GuidedFollowUp[]> = new Map();
  private readonly outOfScopeRedirect: Record<Language, OutOfScopeRedirect>;

  constructor() {
    const svc = servicesData as ServicesJSON;
    const company = companyData as CompanyJSON;
    const prompts = promptsData as PromptsJSON;

    this.services = {
      en: Object.freeze(svc.en),
      es: Object.freeze(svc.es),
    };

    this.companyFacts = {
      en: company.en.companyFacts,
      es: company.es.companyFacts,
    };

    this.trustSignals = {
      en: Object.freeze(company.en.trustSignals),
      es: Object.freeze(company.es.trustSignals),
    };

    this.starterPrompts = {
      en: Object.freeze(prompts.en.starterPrompts),
      es: Object.freeze(prompts.es.starterPrompts),
    };

    this.guidedFollowUps = {
      en: Object.freeze(prompts.en.guidedFollowUps),
      es: Object.freeze(prompts.es.guidedFollowUps),
    };

    this.outOfScopeRedirect = {
      en: prompts.en.outOfScopeRedirect,
      es: prompts.es.outOfScopeRedirect,
    };
  }

  getServices(language: Language): readonly ServiceContent[] {
    return this.services[language];
  }

  getCompanyFacts(language: Language): CompanyFacts {
    return this.companyFacts[language];
  }

  getTrustSignals(language: Language): readonly TrustSignal[] {
    return this.trustSignals[language];
  }

  getStarterPrompts(language: Language): readonly StarterPrompt[] {
    return this.starterPrompts[language];
  }

  getGuidedFollowUps(language: Language, phase: ConversationPhase): readonly GuidedFollowUp[] {
    const cacheKey = `${language}:${phase}`;
    const cached = this.filteredFollowUps.get(cacheKey);
    if (cached) return cached;

    const filtered = Object.freeze(
      this.guidedFollowUps[language].filter((f) => f.applicablePhases.includes(phase))
    );
    this.filteredFollowUps.set(cacheKey, filtered);
    return filtered;
  }

  getOutOfScopeRedirect(language: Language): OutOfScopeRedirect {
    return this.outOfScopeRedirect[language];
  }
}
