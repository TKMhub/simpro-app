import type { NotionBlockNormalized } from "@/lib/blog/types";
import Image from "next/image";

export function RenderBlock({ b }: { b: NotionBlockNormalized }) {
  switch (b.type) {
    case "heading":
      if (b.level === 1) return <h1>{b.text}</h1>;
      if (b.level === 2) return <h2>{b.text}</h2>;
      return <h3>{b.text}</h3>;
    case "paragraph":
      return <p>{b.richText}</p>;
    case "bulleted_list_item":
      return (
        <ul className="list-disc pl-6">
          <li>{b.richText}</li>
        </ul>
      );
    case "numbered_list_item":
      return (
        <ol className="list-decimal pl-6">
          <li>{b.richText}</li>
        </ol>
      );
    case "image":
      return (
        <figure className="my-4">
          <Image src={b.url} alt={b.caption ?? "image"} className="rounded-md border" fill />
          {b.caption && (
            <figcaption className="text-xs text-muted-foreground mt-1">{b.caption}</figcaption>
          )}
        </figure>
      );
    case "code":
      return (
        <pre className="p-3 rounded border overflow-auto">
          <code>{b.code}</code>
        </pre>
      );
    case "quote":
      return <blockquote className="border-l-2 pl-3 italic">{b.richText}</blockquote>;
    case "divider":
      return <hr className="my-6" />;
    case "callout":
      return <div className="p-3 rounded-md border bg-muted/30">{b.richText}</div>;
    default:
      return null;
  }
}

export function RenderBlocks({ blocks }: { blocks: NotionBlockNormalized[] }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {blocks.map((b, i) => (
        <RenderBlock key={i} b={b} />
      ))}
    </div>
  );
}
