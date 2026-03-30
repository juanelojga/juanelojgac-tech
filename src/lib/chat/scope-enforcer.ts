import type {
  ContentProvider,
  ConversationState,
  ScopeEnforcer,
  ScopeEvaluationResult,
} from "./types";

// ──────────────────────────────────────────────
// ScopeEnforcerImpl — SRP: only scope classification
// Classifies user intents as allowed, vague, or blocked
// ──────────────────────────────────────────────

/** Keywords and patterns indicating in-scope service queries (EN + ES) */
const SERVICE_KEYWORDS: readonly RegExp[] = [
  // Services
  /\b(service|servicio)s?\b/i,
  /\b(web|platform|plataforma|dashboard|app|application|aplicación)\b/i,
  /\b(automat|automatiz)/i,
  /\b(ai|artificial intelligence|inteligencia artificial|ia)\b/i,
  /\b(marketing|content|contenido)\b/i,
  /\b(consulting|consultoría|consultant|consultor)\b/i,
  /\b(e-?commerce|tienda|store)\b/i,
  /\b(saas|software)\b/i,
  /\b(chatbot|bot)\b/i,
  /\b(integration|integración)\b/i,
  /\b(workflow|flujo de trabajo)\b/i,
  /\b(tool|herramienta)\b/i,
  /\b(solution|solución)\b/i,
  /\b(development|desarrollo)\b/i,
  /\b(build|construir|crear)\b/i,
  /\b(toefl|spatial|espacial)\b/i,
];

/** Keywords indicating company/process queries */
const COMPANY_KEYWORDS: readonly RegExp[] = [
  /\b(company|empresa|team|equipo)\b/i,
  /\b(process|proceso)\b/i,
  /\b(background|antecedentes|experience|experiencia)\b/i,
  /\b(case stud\w*|caso de estudio|portfolio|portafolio)\b/i,
  /\b(example|ejemplo)s?\b/i,
  /juanelo/i,
  /jgac/i,
  /\b(locat|ubicac|where are you|dónde están)\b/i,
  /\b(different|diferent|unique|único)\b/i,
  /\b(consult\w*|asesor\w*)\b/i,
  /\b(industr|industr)\b/i,
  /\b(work with|trabajar con)\b/i,
  /\byour (work|projects|team|company)\b/i,
  /\b(su|sus|tu|tus)\s+(trabajo|proyectos|equipo|empresa)\b/i,
];

/** Keywords indicating pricing/budget queries */
const PRICING_KEYWORDS: readonly RegExp[] = [
  /\b(pric|preci|cost|cost)\w*\b/i,
  /\b(budget|presupuesto)\b/i,
  /\b(estimat|estimac)\w*\b/i,
  /\b(how much|cuánto)\b/i,
  /\b(payment|pago)\b/i,
  /\b(minimum|mínimo)\b/i,
  /\b(range|rango)\b/i,
  /\b(invest|invers)\w*\b/i,
];

/** Keywords indicating project discussion */
const PROJECT_KEYWORDS: readonly RegExp[] = [
  /\b(project|proyecto)\b/i,
  /\b(startup|start-up)\b/i,
  /\b(idea|planteamiento)\b/i,
  /\b(need|necesit)\w*\b/i,
  /\b(want|quier)\w*\b/i,
  /\b(help|ayud)\w*\b/i,
  /\b(look(?:ing)? for|busc)\w*\b/i,
  /\b(moderniz|transform)\w*\b/i,
  /\b(improv|mejor)\w*\b/i,
  /\b(partner|socio)\b/i,
  /\b(roadmap|hoja de ruta)\b/i,
  /\b(customer|client|usuario|client)\b/i,
  /\b(internal|intern)\b/i,
  /\b(digital)\b/i,
  /\b(capabilit|capacidad)\w*\b/i,
];

/** Keywords indicating timeline/delivery queries */
const TIMELINE_KEYWORDS: readonly RegExp[] = [
  /\b(timeline|cronograma|tiempo)\b/i,
  /\b(deliver|entreg)\w*\b/i,
  /\b(how long|cuánto tiempo)\b/i,
  /\b(weeks?|semanas?)\b/i,
  /\b(months?|meses?)\b/i,
  /\b(deadline|fecha límite)\b/i,
  /\b(when|cuándo)\b/i,
  /\b(schedule|agenda)\b/i,
];

/** Vague/greeting patterns */
const VAGUE_PATTERNS: readonly RegExp[] = [
  /^(hi|hello|hey|hola|buenos días|buenas tardes|buenas noches)\b/i,
  /^(what can you do|qué puedes hacer)\??\s*$/i,
  /^(help|ayuda)\s*$/i,
  /^(i'?m not sure|no estoy segur)\b/i,
  /^(can you help|puedes ayudar)\s*(me|nos)?\??\s*$/i,
  /^(i need help|necesito ayuda)\s*$/i,
];

/** Patterns indicating out-of-scope general knowledge */
const GENERAL_KNOWLEDGE_PATTERNS: readonly RegExp[] = [
  /\b(capital of|capital de)\b/i,
  /\b(write|escrib)\w*\s+(me\s+)?(a\s+)?(poem|essay|story|poema|ensayo|historia)\b/i,
  /\b(explain|explica)\w*\s+(quantum|relativity|cuántic|relatividad)\b/i,
  /\b(weather|clima|pronóstico)\b/i,
  /\b(tell me a joke|cuéntame un chiste)\b/i,
  /\b(who won|quién ganó)\b/i,
  /\b(meaning of life|sentido de la vida)\b/i,
  /\b(homework|tarea escolar)\b/i,
  /\b(latest news|últimas noticias)\b/i,
  /\b(recipe|receta)\b/i,
  /\b(translate|traduce)\b/i,
  /\b(movie|película|song|canción|music|música)\b/i,
  /\b(history of|historia de)\s+(?!our|the company|nuestra|la empresa)/i,
];

/** Patterns indicating out-of-scope coding/technical help */
const CODING_PATTERNS: readonly RegExp[] = [
  /\b(fix|debug|depurar)\s+(my|this|mi|este|esta)\s+(code|script|function|component|error|bug|programa)\b/i,
  /\b(write|escrib)\w*\s+(a\s+)?(python|javascript|java|css|html|react|node)\s+(function|script|code|program|class)\b/i,
  /\b(help\s+(me\s+)?with\s+(my\s+)?(code|coding|script|programa))\b/i,
  /\b(help\s+(me\s+)?with\s+(my\s+)?(sql|css|html|javascript|python)\s+(query|code|script|error))\b/i,
  /\bmy\s+(sql|javascript|python|java|css|html|react)\s+(query|code|script|error|bug)\b/i,
  /\b(programming language|lenguaje de programación)\s+(to learn|para aprender)\b/i,
  /\b(how (do|does|to)|cómo)\s+(i\s+)?(deploy|install|configure|set up)\s+(to|on|en)\s+(aws|azure|gcp|heroku)\b/i,
  /\b(error|bug|exception)\s+(in|on|en)\s+(my|this|mi)\b/i,
  /\b(best programming|mejor lenguaje)\b/i,
  /\b(debug\w*|depurar)\s+(my|mi)\s+(react|vue|angular|node)\b/i,
  /\bfix\s+my\s+(css|html|javascript|react|node)\b/i,
  /\b(layout issue|css issue|problema de diseño)\b/i,
];

/** Patterns indicating competitor discussion */
const COMPETITOR_PATTERNS: readonly RegExp[] = [
  /\b(compar\w+)\s+(to|with|yourself|con|a)\b/i,
  /\b(better than|mejor que)\s+(you|ustedes)\b/i,
  /\b(competitor|competidor|competencia)\b/i,
  /\b(accenture|deloitte|mckinsey|bain|ibm|cognizant|infosys|wipro)\b/i,
  /\b(other agenc|otra agenc)\b/i,
];

/** Patterns indicating prompt injection attempts */
const INJECTION_PATTERNS: readonly RegExp[] = [
  // Override / ignore instructions
  /\b(ignore|ignora|disregard|dismiss|desestima)\s+(all\s+)?(previous|previas|earlier|anterior|prior|preceding)\s*(instruction|instruccion|directive|guideline|rule|regla)/i,
  /\b(you are now|ahora eres)\b/i,
  /\b(forget|olvida)\s+(everything|todo|all|todas?\s+las?)\b/i,
  // Reveal system prompt
  /\b(print|muestra|reveal|revela|show|display|output|dump)\s+(your|tus|the|el|la)?\s*(instruction|instruccion|system prompt|prompt del sistema|initial prompt|original prompt)/i,
  /\b(override|anula|sobreescribe|bypass)\s+(your|tus|the)?\s*(rules|reglas|restrictions|restricciones|guidelines)\b/i,
  /\b(pretend|finge|simula|roleplay|role-play)\s+(you are|eres|ser|to be|que eres)\b/i,
  /\b(new instructions?|nuevas instrucciones)\s*(override|anulan|sobreescriben|replace|reemplazan)/i,
  /\b(repeat|repite)\s+(everything|todo)\s+(above|arriba|antes|before)/i,
  /^system\s*:/i,
  /\b(without restrictions?|sin restricciones|no limits?|sin límites)\b/i,
  /\b(act as|actúa como)\s+(a different|otro|una?\s+diferente)\b/i,
  /\b(what are your|cuáles son tus)\s*(system)?\s*(instruction|instruccion|prompt|directive)/i,
  // Jailbreak / mode override patterns
  /\b(jailbreak|jail\s*break)\b/i,
  /\b(DAN|developer)\s*(mode|modo)\b/i,
  /\b(enable|activate|habilita|activa)\s+(unrestricted|unfiltered|sin filtro)\b/i,
  /\b(respond|responde)\s+(without|sin)\s+(constraints?|filter|filtro|restricciones)\b/i,
  // Identity override
  /\b(from now on|de ahora en adelante)\s+(you|tú|usted)\s+(are|eres|será)/i,
  /\b(stop being|deja de ser)\s+(the|el|la|an?)?\s*(assistant|consultant|asistente|consultor)/i,
];

export class ScopeEnforcerImpl implements ScopeEnforcer {
  private readonly contentProvider: ContentProvider;

  constructor(contentProvider: ContentProvider) {
    this.contentProvider = contentProvider;
  }

  evaluateScope(userMessage: string, conversationState: ConversationState): ScopeEvaluationResult {
    // Normalize input: strip zero-width chars and other obfuscation before pattern matching
    const cleaned = ScopeEnforcerImpl.normalizeInput(userMessage);
    const normalized = cleaned.trim().toLowerCase();

    // Empty or whitespace-only input
    if (normalized.length === 0) {
      return { isInScope: true, confidence: 0.5 };
    }

    // Check for injection attempts first (highest priority)
    if (this.matchesPatterns(cleaned, INJECTION_PATTERNS)) {
      return this.buildOutOfScopeResult(conversationState.language);
    }

    // Check for explicit out-of-scope patterns
    if (this.matchesPatterns(cleaned, CODING_PATTERNS)) {
      return this.buildOutOfScopeResult(conversationState.language);
    }

    if (this.matchesPatterns(cleaned, COMPETITOR_PATTERNS)) {
      return this.buildOutOfScopeResult(conversationState.language);
    }

    if (this.matchesPatterns(cleaned, GENERAL_KNOWLEDGE_PATTERNS)) {
      return this.buildOutOfScopeResult(conversationState.language);
    }

    // Check for in-scope patterns — compute confidence
    let confidence = 0.5; // Base confidence for any non-blocked message

    // Check vague patterns
    if (this.matchesPatterns(cleaned, VAGUE_PATTERNS)) {
      return { isInScope: true, confidence: 0.6 };
    }

    // Score in-scope keyword matches
    const serviceScore = this.countMatches(cleaned, SERVICE_KEYWORDS);
    const companyScore = this.countMatches(cleaned, COMPANY_KEYWORDS);
    const pricingScore = this.countMatches(cleaned, PRICING_KEYWORDS);
    const projectScore = this.countMatches(cleaned, PROJECT_KEYWORDS);
    const timelineScore = this.countMatches(cleaned, TIMELINE_KEYWORDS);

    const totalScore = serviceScore + companyScore + pricingScore + projectScore + timelineScore;

    if (totalScore > 0) {
      // Scale confidence based on match count
      confidence = Math.min(0.95, 0.7 + totalScore * 0.05);
    }

    // Boost confidence if conversation is already in a relevant phase
    if (
      conversationState.phase === "discovery" ||
      conversationState.phase === "qualification" ||
      conversationState.phase === "summary"
    ) {
      // During engaged phases, be more lenient — the user is already in context
      confidence = Math.min(0.98, confidence + 0.1);
    }

    // If no in-scope signals found and base confidence is low, mark as out-of-scope
    if (totalScore === 0 && confidence <= 0.5) {
      return this.buildOutOfScopeResult(conversationState.language);
    }

    return { isInScope: true, confidence };
  }

  private matchesPatterns(input: string, patterns: readonly RegExp[]): boolean {
    return patterns.some((pattern) => pattern.test(input));
  }

  private countMatches(input: string, patterns: readonly RegExp[]): number {
    return patterns.reduce((count, pattern) => count + (pattern.test(input) ? 1 : 0), 0);
  }

  private buildOutOfScopeResult(language: "en" | "es"): ScopeEvaluationResult {
    const redirect = this.contentProvider.getOutOfScopeRedirect(language);
    return {
      isInScope: false,
      confidence: 0.9,
      redirect,
    };
  }

  /**
   * Normalize user input before pattern matching.
   * Strips zero-width characters, soft hyphens, and other Unicode obfuscation
   * that can be used to bypass regex word-boundary checks.
   */
  static normalizeInput(input: string): string {
    let s = input;
    // Strip zero-width and invisible formatting characters
    s = s.replace(/[\u200B\u200C\u200D\uFEFF\u00AD\u2060\u180E]/g, "");
    // Normalize common homoglyph substitutions (Cyrillic → Latin)
    s = s.replace(/[\u0430]/g, "a"); // Cyrillic а → a
    s = s.replace(/[\u0435]/g, "e"); // Cyrillic е → e
    s = s.replace(/[\u043E]/g, "o"); // Cyrillic о → o
    s = s.replace(/[\u0440]/g, "p"); // Cyrillic р → p
    s = s.replace(/[\u0441]/g, "c"); // Cyrillic с → c
    s = s.replace(/[\u0443]/g, "y"); // Cyrillic у → y
    s = s.replace(/[\u0445]/g, "x"); // Cyrillic х → x
    // Collapse multiple spaces
    s = s.replace(/\s+/g, " ");
    return s;
  }
}
