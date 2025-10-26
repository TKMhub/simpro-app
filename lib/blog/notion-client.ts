import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_SECRET });

function extractRawNotionId(input?: string | null): string | null {
  if (!input) return null;
  const str = String(input).trim();
  const mHyphen = str.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (mHyphen) return mHyphen[0].toLowerCase();
  const m32 = str.match(/[0-9a-f]{32}/i);
  if (m32) return m32[0].toLowerCase();
  return null;
}

function toHyphenatedUuid(id32OrHyphenated: string): string {
  const compact = id32OrHyphenated.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/i.test(compact)) return "";
  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join("-");
}

export async function fetchNotionBlocks(pageId: string) {
  const raw = extractRawNotionId(pageId);
  if (!raw) {
    throw new Error("Invalid Notion page id: expected UUID or URL containing it");
  }
  const normalizedId = toHyphenatedUuid(raw);

  async function getAll(blockId: string, acc: unknown[] = []) {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    });
    for (const b of res.results) {
      acc.push(b);
      const node = b as { has_children?: boolean; id?: string };
      if (node.has_children && node.id) {
        await getAll(node.id, acc);
      }
    }
    // NOTE: SDK requires manual pagination; simplified here.
    // Implement full next_cursor loop in production if needed.
    return acc;
  }
  return getAll(normalizedId);
}
