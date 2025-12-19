export function normalizeTitleForSearch(title: string): string {
  return title.trim().toLowerCase();
}

export function buildTitleTokens(title: string): string[] {
  const normalized = normalizeTitleForSearch(title);
  if (!normalized) {
    return [];
  }

  const tokens = normalized
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  return Array.from(new Set(tokens));
}
