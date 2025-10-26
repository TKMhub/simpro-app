import type { NotionDocument, NotionBlockNormalized } from "./types";

type NotionRichTextLike = { plain_text?: string };

type NotionBlockLike = {
  id?: string;
  type?: string;
  paragraph?: { rich_text?: NotionRichTextLike[] };
  to_do?: { rich_text?: NotionRichTextLike[]; checked?: boolean };
  toggle?: { rich_text?: NotionRichTextLike[] };
  heading_1?: { rich_text?: NotionRichTextLike[] };
  heading_2?: { rich_text?: NotionRichTextLike[] };
  heading_3?: { rich_text?: NotionRichTextLike[] };
  bulleted_list_item?: { rich_text?: NotionRichTextLike[] };
  numbered_list_item?: { rich_text?: NotionRichTextLike[] };
  image?:
    | { type?: "external"; external?: { url?: string }; caption?: NotionRichTextLike[] }
    | { type?: "file"; file?: { url?: string }; caption?: NotionRichTextLike[] };
  code?: { language?: string; rich_text?: NotionRichTextLike[] };
  bookmark?: { url?: string };
  quote?: { rich_text?: NotionRichTextLike[] };
  callout?: { rich_text?: NotionRichTextLike[]; icon?: { emoji?: string } };
};

export async function normalizeNotionDocument(blocks: unknown[]): Promise<NotionDocument> {
  const out: NotionBlockNormalized[] = [];
  for (const b of blocks as NotionBlockLike[]) {
    switch (b.type) {
      case "paragraph":
        out.push({ type: "paragraph", richText: concatRichText(b.paragraph?.rich_text) });
        break;
      case "to_do": {
        const text = concatRichText(b.to_do?.rich_text);
        const checked = !!b.to_do?.checked;
        out.push({ type: "paragraph", richText: `${checked ? "[x]" : "[ ]"} ${text}`.trim() });
        break;
      }
      case "toggle": {
        const text = concatRichText(b.toggle?.rich_text);
        out.push({ type: "paragraph", richText: text });
        break;
      }
      case "heading_1":
        out.push({ type: "heading", level: 1, text: concatRichText(b.heading_1?.rich_text) });
        break;
      case "heading_2":
        out.push({ type: "heading", level: 2, text: concatRichText(b.heading_2?.rich_text) });
        break;
      case "heading_3":
        out.push({ type: "heading", level: 3, text: concatRichText(b.heading_3?.rich_text) });
        break;
      case "bulleted_list_item":
        out.push({ type: "bulleted_list_item", richText: concatRichText(b.bulleted_list_item?.rich_text) });
        break;
      case "numbered_list_item":
        out.push({ type: "numbered_list_item", richText: concatRichText(b.numbered_list_item?.rich_text) });
        break;
      case "image": {
        const img = b.image as
          | { type?: string; external?: { url?: string }; file?: { url?: string }; caption?: NotionRichTextLike[] }
          | undefined;
        const url = img?.type === "external" ? img?.external?.url : img?.file?.url;
        const caption = concatRichText(img?.caption);
        if (url) out.push({ type: "image", url, caption });
        break;
      }
      case "code":
        out.push({ type: "code", language: b.code?.language, code: concatRichText(b.code?.rich_text) });
        break;
      case "bookmark": {
        const url = b.bookmark?.url as string | undefined;
        if (url) out.push({ type: "paragraph", richText: url });
        break;
      }
      case "quote":
        out.push({ type: "quote", richText: concatRichText(b.quote?.rich_text) });
        break;
      case "divider":
        out.push({ type: "divider" });
        break;
      case "callout":
        out.push({ type: "callout", richText: concatRichText(b.callout?.rich_text), icon: b.callout?.icon?.emoji });
        break;
      default:
        // Skip unsupported types for now
        break;
    }
  }
  return { blocks: out };
}

function concatRichText(rich?: NotionRichTextLike[]): string {
  return (rich ?? []).map((r) => r?.plain_text ?? "").join("");
}
