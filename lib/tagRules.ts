/**
 * Tag validation utilities - framework-agnostic.
 */

export const TAG_RULES = {
  maxTags: 5,
  minLen: 1,
  maxLen: 20,
  // Letters, numbers, Korean, space, hyphen, underscore
  pattern: /^[a-zA-Z0-9가-힣\s_-]+$/,
} as const;

/**
 * Normalize a tag: trim and collapse multiple spaces.
 */
export function normalizeTag(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

interface ValidationResult {
  ok: boolean;
  reason?: string;
}

interface TagRules {
  minLen: number;
  maxLen: number;
  pattern: RegExp;
}

/**
 * Validate a single tag against rules and existing tags.
 * Case-insensitive duplicate check.
 */
export function validateTag(
  tag: string,
  existing: string[],
  rules: TagRules = TAG_RULES
): ValidationResult {
  const normalized = normalizeTag(tag);

  if (normalized.length < rules.minLen) {
    return { ok: false, reason: "Tag is too short" };
  }

  if (normalized.length > rules.maxLen) {
    return { ok: false, reason: `Tag must be ${rules.maxLen} characters or less` };
  }

  if (!rules.pattern.test(normalized)) {
    return { ok: false, reason: "Invalid characters (letters, numbers, Korean, space, -, _ only)" };
  }

  // Case-insensitive duplicate check
  const lowerNormalized = normalized.toLowerCase();
  const isDuplicate = existing.some((t) => normalizeTag(t).toLowerCase() === lowerNormalized);
  if (isDuplicate) {
    return { ok: false, reason: "Tag already exists" };
  }

  return { ok: true };
}

/**
 * Check if adding a tag would exceed max tags.
 */
export function canAddTag(existing: string[], maxTags: number = TAG_RULES.maxTags): boolean {
  return existing.length < maxTags;
}
