export interface Category {
  id: string;
  label: string;
  description?: string;
}

export const CATEGORIES: Category[] = [
  { id: "general", label: "General", description: "General discussions" },
  { id: "tech", label: "Technology", description: "Tech news, programming, and gadgets" },
  { id: "creative", label: "Creative", description: "Art, design, and writing" },
  { id: "support", label: "Support", description: "Help and support for the platform" },
];

export function getCategoryLabel(id: string): string {
  const category = CATEGORIES.find((c) => c.id === id);
  return category ? category.label : id;
}
