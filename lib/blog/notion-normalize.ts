import type { NotionDocument, NotionBlockNormalized } from "./types";

export async function normalizeNotionDocument(blocks: any[]): Promise<NotionDocument> {
  const out: NotionBlockNormalized[] = [];
  for (const b of blocks) {
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
        const url = b.image?.type === "external" ? b.image.external.url : b.image?.file?.url;
        const caption = concatRichText(b.image?.caption);
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

function concatRichText(rich?: any[]): string {
  return (rich ?? []).map((r) => r.plain_text ?? "").join("");
}
