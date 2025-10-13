export type BlogBigCategory = {
  name: string;
  items: string[]; // small items map to existing tag names
};

// Group existing tags into "big" categories for discoverability.
// Adjust freely as your content grows.
export const blogBigCategories: BlogBigCategory[] = [
  {
    name: "開発",
    items: ["React", "Next.js", "TypeScript"],
  },
  {
    name: "デザイン",
    items: ["Design", "UI", "UX", "Writing", "System"],
  },
  {
    name: "パフォーマンス",
    items: ["Performance", "Images"],
  },
  {
    name: "チェックリスト",
    items: ["Checklist"],
  },
];

// Helper to flatten and keep only items that exist in current tags
export function normalizeCategories(allTags: string[]) {
  const tagSet = new Set(allTags);
  return blogBigCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((t) => tagSet.has(t)),
    }))
    .filter((cat) => cat.items.length > 0);
}

