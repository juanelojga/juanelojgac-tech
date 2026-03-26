const MAX_INPUT_LENGTH = 5000;

// ──────────────────────────────────────────────
// Sanitization result
// ──────────────────────────────────────────────

export interface SanitizationResult {
  readonly sanitizedText: string;
  readonly wasTruncated: boolean;
  readonly containsInjectionPatterns: boolean;
}

// ──────────────────────────────────────────────
// Injection patterns (EN + ES)
// ──────────────────────────────────────────────

const INJECTION_PATTERNS: readonly RegExp[] = [
  // System prompt override / bypass
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignora\s+(todas\s+las\s+)?instrucciones\s+anteriores/i,
  /disregard\s+(all\s+)?(prior|previous|above)/i,
  /forget\s+(everything|all)\s+(you\s+)?(know|were|have)/i,

  // Role-playing injection
  /you\s+are\s+now\s+(?:DAN|a\s+different|an?\s+(?:unrestricted|unfiltered))/i,
  /act\s+as\s+(?:if|though)\s+you\s+(?:have\s+no|don'?t\s+have)\s+(?:restrictions|rules)/i,
  /pretend\s+(?:you\s+are|to\s+be)\s+(?:a\s+different|another)\s+(?:AI|assistant|model)/i,

  // Prompt leaking
  /(?:show|tell|reveal|display|output|print|repeat)\s+(?:me\s+)?(?:your\s+)?(?:system\s+)?(?:prompt|instructions)/i,
  /what\s+(?:are|is)\s+your\s+(?:system\s+)?(?:prompt|instructions|rules)/i,

  // Delimiter injection
  /```\s*system\b/i,
  /\[SYSTEM\]/i,
  /<<\s*SYS\s*>>/i,

  // Base64 disguise
  /(?:decode|interpret|run|execute)\s+(?:this\s+)?base64/i,
];

// ──────────────────────────────────────────────
// HTML entity decoding (for encoded XSS)
// ──────────────────────────────────────────────

const HTML_ENTITY_MAP: Record<string, string> = {
  "&#60;": "<",
  "&#62;": ">",
  "&#34;": '"',
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#x3c;": "<",
  "&#x3e;": ">",
};

function decodeHtmlEntities(text: string): string {
  return text.replace(
    /&#(?:x[0-9a-f]+|\d+);|&(?:lt|gt|amp|quot);/gi,
    (match) => HTML_ENTITY_MAP[match.toLowerCase()] ?? match
  );
}

// ──────────────────────────────────────────────
// InputSanitizerImpl
// ──────────────────────────────────────────────

export class InputSanitizerImpl {
  sanitize(input: string): SanitizationResult {
    const containsInjectionPatterns = this.detectInjection(input);

    let text = input;

    // Strip null bytes
    text = text.replace(/\0/g, "");

    // Strip control characters (keep \n, \r, \t)
    // eslint-disable-next-line no-control-regex
    text = text.replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    // Decode HTML entities before stripping tags (catches encoded XSS)
    text = decodeHtmlEntities(text);

    // Strip script/style tags and their content
    text = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");

    // Recursive pass to handle nested/broken script tags
    let previous = "";
    while (previous !== text) {
      previous = text;
      text = text.replace(/<\/?script\b[^>]*>/gi, "");
      text = text.replace(/alert\s*\([^)]*\)/gi, "");
    }

    // Strip remaining HTML tags
    text = text.replace(/<[^>]*>/g, "");

    // Collapse excessive spaces (preserve single spaces)
    text = text.replace(/ {2,}/g, " ");

    // Collapse excessive newlines (allow max 2)
    text = text.replace(/\n{3,}/g, "\n\n");

    // Trim
    text = text.trim();

    // Truncate
    const wasTruncated = text.length > MAX_INPUT_LENGTH;
    if (wasTruncated) {
      text = text.slice(0, MAX_INPUT_LENGTH);
    }

    return {
      sanitizedText: text,
      wasTruncated,
      containsInjectionPatterns,
    };
  }

  private detectInjection(input: string): boolean {
    return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
  }
}
