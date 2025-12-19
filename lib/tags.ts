/**
 * Tag validation and sanitization utilities.
 */

// Allows letters, numbers, Korean, space, hyphen, underscore
const TAG_REGEX = /^[a-zA-Z0-9가-힣\s_-]+$/;
const MIN_TAG_LENGTH = 1;
const MAX_TAG_LENGTH = 20;

export function sanitizeTag(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function isValidTag(tag: string): boolean {
  const sanitized = sanitizeTag(tag);
  if (sanitized.length < MIN_TAG_LENGTH || sanitized.length > MAX_TAG_LENGTH) {
    return false;
  }
  return TAG_REGEX.test(sanitized);
}

export function normalizeTagKey(tag: string): string {
  return sanitizeTag(tag).toLowerCase();
}

export function isDuplicateTag(tag: string, existingTags: string[]): boolean {
  const normalizedNew = normalizeTagKey(tag);
  return existingTags.some((t) => normalizeTagKey(t) === normalizedNew);
}

export const TAG_CONSTRAINTS = {
  MIN_LENGTH: MIN_TAG_LENGTH,
  MAX_LENGTH: MAX_TAG_LENGTH,
  PATTERN: TAG_REGEX,
} as const;
