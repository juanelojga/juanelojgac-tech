import type {
  ContentProvider,
  ConversationState,
  FollowUpGuide,
  FollowUpSuggestion,
  GuidedFollowUp,
  LeadAttributes,
} from "./types";

// ──────────────────────────────────────────────
// GuidedFlowManagerImpl — SRP: only flow progression
// Tracks conversation stage and suggests follow-ups
// ──────────────────────────────────────────────

/** Maximum number of follow-ups to show at once */
const MAX_FOLLOW_UPS = 3;

/** Minimum messages needed to consider phase transition */
const MIN_MESSAGES_FOR_TRANSITION = 2;

/** Mapping from follow-up IDs to the lead attribute they represent */
const FOLLOW_UP_ATTRIBUTE_MAP: Record<string, keyof LeadAttributes> = {
  "gf-project-type": "projectType",
  "gf-target-users": "targetUsers",
  "gf-goals": "goals",
  "gf-timeline": "timeline",
  "gf-budget": "budgetRange",
};

/** Priority order for discovery follow-ups */
const DISCOVERY_PRIORITY = ["gf-project-type", "gf-target-users", "gf-goals"];

/** Priority order for qualification follow-ups */
const QUALIFICATION_PRIORITY = ["gf-timeline", "gf-budget", "gf-goals", "gf-summary"];

export class GuidedFlowManagerImpl implements FollowUpGuide {
  private readonly contentProvider: ContentProvider;

  constructor(contentProvider: ContentProvider) {
    this.contentProvider = contentProvider;
  }

  suggestFollowUps(conversationState: ConversationState): FollowUpSuggestion {
    const { phase, language, leadAttributes, messages } = conversationState;

    // Get all follow-ups applicable to the current phase
    const allFollowUps = this.contentProvider.getGuidedFollowUps(language, phase);

    // Filter out follow-ups for already-known attributes
    const filtered = this.filterByKnownAttributes(allFollowUps, leadAttributes);

    // Prioritize and limit
    const prioritized = this.prioritizeFollowUps(filtered, phase);
    const limited = prioritized.slice(0, MAX_FOLLOW_UPS);

    // Determine if we should suggest a phase transition
    const transition = this.evaluateTransition(phase, messages.length, leadAttributes);

    return {
      followUps: limited,
      shouldTransitionPhase: transition.shouldTransition,
      ...(transition.shouldTransition && { nextPhase: transition.nextPhase }),
    };
  }

  private filterByKnownAttributes(
    followUps: readonly GuidedFollowUp[],
    leadAttributes: Partial<LeadAttributes>
  ): GuidedFollowUp[] {
    return followUps.filter((followUp) => {
      const attributeKey = FOLLOW_UP_ATTRIBUTE_MAP[followUp.id];
      if (!attributeKey) return true;
      // Only keep if the attribute is not yet known
      return leadAttributes[attributeKey] === undefined;
    });
  }

  private prioritizeFollowUps(
    followUps: GuidedFollowUp[],
    phase: ConversationState["phase"]
  ): GuidedFollowUp[] {
    const priorityOrder = phase === "qualification" ? QUALIFICATION_PRIORITY : DISCOVERY_PRIORITY;

    return followUps.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.id);
      const bIndex = priorityOrder.indexOf(b.id);
      const aPriority = aIndex === -1 ? priorityOrder.length : aIndex;
      const bPriority = bIndex === -1 ? priorityOrder.length : bIndex;
      return aPriority - bPriority;
    });
  }

  private evaluateTransition(
    currentPhase: ConversationState["phase"],
    messageCount: number,
    leadAttributes: Partial<LeadAttributes>
  ): { shouldTransition: boolean; nextPhase?: ConversationState["phase"] } {
    // Never transition from completed
    if (currentPhase === "completed") {
      return { shouldTransition: false };
    }

    // Greeting → Discovery: after first exchange
    if (currentPhase === "greeting" && messageCount >= MIN_MESSAGES_FOR_TRANSITION) {
      return { shouldTransition: true, nextPhase: "discovery" };
    }

    // Discovery → Qualification: when project type, target users, and goals are known
    if (currentPhase === "discovery") {
      const hasBasics =
        leadAttributes.projectType !== undefined &&
        leadAttributes.targetUsers !== undefined &&
        leadAttributes.goals !== undefined;
      if (hasBasics) {
        return { shouldTransition: true, nextPhase: "qualification" };
      }
    }

    // Qualification → Summary: when timeline and either budget or sufficient turns
    if (currentPhase === "qualification") {
      const hasQualification =
        leadAttributes.projectType !== undefined &&
        leadAttributes.goals !== undefined &&
        leadAttributes.timeline !== undefined;
      if (hasQualification) {
        return { shouldTransition: true, nextPhase: "summary" };
      }
    }

    // Summary → Completed: after summary has been delivered (indicated by 4+ messages in summary phase)
    if (currentPhase === "summary" && messageCount >= 4) {
      const hasFullLead =
        leadAttributes.projectType !== undefined &&
        leadAttributes.goals !== undefined &&
        leadAttributes.timeline !== undefined;
      if (hasFullLead) {
        return { shouldTransition: true, nextPhase: "completed" };
      }
    }

    return { shouldTransition: false };
  }
}
