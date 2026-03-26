// ──────────────────────────────────────────────
// Isolation delimiters
// ──────────────────────────────────────────────

const USER_INPUT_BEGIN = "---BEGIN USER INPUT---";
const USER_INPUT_END = "---END USER INPUT---";
const SYSTEM_CONTEXT_BEGIN = "---BEGIN SYSTEM CONTEXT---";
const SYSTEM_CONTEXT_END = "---END SYSTEM CONTEXT---";

// Patterns to neutralize inside user input (prevents delimiter spoofing)
const DELIMITER_PATTERNS: readonly RegExp[] = [
  /---BEGIN USER INPUT---/g,
  /---END USER INPUT---/g,
  /---BEGIN SYSTEM CONTEXT---/g,
  /---END SYSTEM CONTEXT---/g,
];

// ──────────────────────────────────────────────
// InstructionIsolationImpl
// ──────────────────────────────────────────────

export class InstructionIsolationImpl {
  /**
   * Wraps user input with isolation delimiters.
   * Neutralizes any delimiter-like text inside the input to prevent spoofing.
   */
  wrapUserInput(input: string): string {
    const neutralized = this.neutralizeDelimiters(input);
    return `${USER_INPUT_BEGIN}\n${neutralized}\n${USER_INPUT_END}`;
  }

  /**
   * Wraps system context with distinct isolation delimiters.
   */
  wrapSystemContext(context: string): string {
    return `${SYSTEM_CONTEXT_BEGIN}\n${context}\n${SYSTEM_CONTEXT_END}`;
  }

  /**
   * Extracts the original user input from a wrapped message.
   * Returns null if the message is not wrapped.
   */
  extractUserInput(wrapped: string): string | null {
    const beginIdx = wrapped.indexOf(USER_INPUT_BEGIN);
    const endIdx = wrapped.indexOf(USER_INPUT_END);

    if (beginIdx === -1 || endIdx === -1 || endIdx <= beginIdx) {
      return null;
    }

    const start = beginIdx + USER_INPUT_BEGIN.length + 1; // +1 for \n
    const content = wrapped.slice(start, endIdx - 1); // -1 for \n before END
    return this.restoreDelimiters(content);
  }

  // ──────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────

  /**
   * Replaces delimiter sequences in user input with safe alternatives.
   * This prevents users from spoofing delimiters to break out of isolation.
   */
  private neutralizeDelimiters(text: string): string {
    let result = text;
    for (const pattern of DELIMITER_PATTERNS) {
      result = result.replace(pattern, (match) =>
        // Replace the leading "---" with "– –" to break the delimiter pattern
        match.replace(/^---/, "– –")
      );
    }
    return result;
  }

  /**
   * Restores neutralized delimiters back to their readable form
   * (minus the triple-dash prefix, so they can't be re-used as real delimiters).
   */
  private restoreDelimiters(text: string): string {
    // Restore the human-readable text but NOT the original delimiter format
    return text
      .replace(/– –BEGIN USER INPUT---/g, "– –BEGIN USER INPUT---")
      .replace(/– –END USER INPUT---/g, "– –END USER INPUT---")
      .replace(/– –BEGIN SYSTEM CONTEXT---/g, "– –BEGIN SYSTEM CONTEXT---")
      .replace(/– –END SYSTEM CONTEXT---/g, "– –END SYSTEM CONTEXT---");
  }
}
