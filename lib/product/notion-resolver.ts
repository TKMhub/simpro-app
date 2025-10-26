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
  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join("-");
}

function extractTitleFromPage(obj: any): string | null {
  const props = obj?.properties ?? {};
  for (const key of Object.keys(props)) {
    const p = props[key];
    if (p?.type === "title") {
      const arr = p.title ?? [];
      const text = arr.map((t: any) => t?.plain_text ?? "").join("").trim();
      if (text) return text;
    }
  }
  const childTitle = obj?.child_page?.title;
  return childTitle ? String(childTitle) : null;
}

export async function resolveProductNotionPageId(opts: {
  rootPageId?: string;
  hintIdOrTitle?: string | null | undefined;
  titleCandidates?: string[];
}): Promise<string | null> {
  const { rootPageId = process.env.NOTION_PRODUCT_ROOT_PAGE_ID, hintIdOrTitle, titleCandidates = [] } = opts;

  const rawId = extractRawNotionId(hintIdOrTitle ?? undefined);
  if (rawId) return toHyphenatedUuid(rawId);

  const searchKeys: string[] = [];
  for (const t of [hintIdOrTitle, ...titleCandidates]) {
    if (t && typeof t === "string" && t.trim()) searchKeys.push(t.trim());
  }
  if (searchKeys.length === 0) return null;

  if (rootPageId) {
    const res = await notion.blocks.children.list({ block_id: rootPageId, page_size: 100 });
    for (const b of res.results) {
      const bb: any = b as any;
      if (bb?.type === "child_page" && bb?.child_page?.title) {
        const title = String(bb.child_page.title);
        if (searchKeys.includes(title)) {
          return String(bb.id);
        }
      }
    }
  }

  for (const query of searchKeys) {
    const res: any = await (notion as any).search({
      query,
      filter: { value: "page", property: "object" },
      page_size: 25,
    });
    let firstCandidate: string | null = null;
    for (const r of res.results ?? []) {
      if (r.object === "page" && r.id) {
        const title = extractTitleFromPage(r) ?? "";
        const idHyphen = toHyphenatedUuid(String(r.id));
        if (!firstCandidate) firstCandidate = idHyphen;
        if (title === query) return idHyphen;
      }
    }
    if (firstCandidate) return firstCandidate;
  }

  return null;
}
