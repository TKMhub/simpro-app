import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getBlogDetailBySlug } from "@/lib/blog/actions";
import { RenderBlock } from "@/util/common/notion-render";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const { slug } = params;
  const data = await getBlogDetailBySlug(slug);
  if (!data) return { title: "Not Found" };
  return { title: `${data.header.title} | Blog`, description: undefined };
}

// RenderBlock extracted to util/common/notion-render

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = params;
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
            <Badge key={t} variant="default" className="rounded-full">{t}</Badge>
          ))}
        </div>

        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg border">
          <ImageWithFallback
            src={header.headerImageUrl}
            alt="cover"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
            fallbackSrc="/Simplo_gray_main_sub.jpg"
          />
        </div>

        {notion.unavailable || notion.blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-6">表示できるコンテンツがありません。</p>
        ) : (
          <div className="prose dark:prose-invert max-w-none mt-6">
            {notion.blocks.map((b, idx) => (
              <RenderBlock key={idx} b={b} />
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
