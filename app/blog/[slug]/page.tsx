import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getBlogDetailBySlug } from "@/lib/blog/actions";
import type { NotionBlockNormalized } from "@/lib/blog/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getBlogDetailBySlug(slug);
  if (!data) return { title: "Not Found" };
  return { title: `${data.header.title} | Blog`, description: undefined };
}

function RenderBlock({ b }: { b: NotionBlockNormalized }) {
  switch (b.type) {
    case "heading":
      if (b.level === 1) return <h1>{b.text}</h1>;
      if (b.level === 2) return <h2>{b.text}</h2>;
      return <h3>{b.text}</h3>;
    case "paragraph":
      return <p>{b.richText}</p>;
    case "bulleted_list_item":
      return <ul className="list-disc pl-6"><li>{b.richText}</li></ul>;
    case "numbered_list_item":
      return <ol className="list-decimal pl-6"><li>{b.richText}</li></ol>;
    case "image":
      return (
        <figure className="my-4">
          {/* External or file URL from Notion */}
          <img src={b.url} alt={b.caption ?? "image"} className="rounded-md border" />
          {b.caption && <figcaption className="text-xs text-muted-foreground mt-1">{b.caption}</figcaption>}
        </figure>
      );
    case "code":
      return (
        <pre className="p-3 rounded border overflow-auto"><code>{b.code}</code></pre>
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

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getBlogDetailBySlug(slug);
  if (!data) return notFound();
  const { header, notion } = data;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
      <nav className="mt-6 sm:mt-10 text-sm">
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← 記事一覧へ戻る
        </Link>
      </nav>

      <article className="mt-4 sm:mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{header.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {new Date(header.updatedAt || header.createdAt).toLocaleDateString("ja-JP")} ・ {header.author}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {header.tags.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
        </div>

        {header.headerImageUrl && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg border">
            <Image
              src={header.headerImageUrl}
              alt="cover"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none mt-6">
          {notion.blocks.map((b, idx) => (
            <RenderBlock key={idx} b={b} />
          ))}
        </div>
      </article>
    </main>
  );
}
