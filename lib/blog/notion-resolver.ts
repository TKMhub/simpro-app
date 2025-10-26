import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_SECRET });

function isUuidLike(id?: string | null) {
  return !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function resolveBlogNotionPageId(opts: {
  rootPageId?: string;
  hintIdOrTitle?: string | null | undefined;
  titleCandidates?: string[];
}): Promise<string | null> {
  const { rootPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID, hintIdOrTitle, titleCandidates = [] } = opts;

  // 1) If hint looks like a UUID, trust and return it
  if (isUuidLike(hintIdOrTitle ?? undefined)) return hintIdOrTitle!;

  // 2) If we don't have a root page to search under, bail
  if (!rootPageId) return null;

  // Build search keys (exact match on child_page.title)
  const titles = new Set<string>();
  for (const t of [hintIdOrTitle, ...titleCandidates]) {
    if (t && typeof t === "string") titles.add(t.trim());
  }
  if (titles.size === 0) return null;

  // 3) List children (first 100) and find a child_page whose title matches
  const res = await notion.blocks.children.list({ block_id: rootPageId, page_size: 100 });
  for (const b of res.results) {
    // Only consider child pages
    if (b.type === "child_page" && (b as any).child_page?.title) {
      const title = (b as any).child_page.title as string;
      if (titles.has(title)) {
        return b.id; // Notion uses block id as page id
      }
    }
  }

  return null;
}

