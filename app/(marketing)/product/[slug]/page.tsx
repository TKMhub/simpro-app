import Link from "next/link";
import { notFound } from "next/navigation";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocalProductBySlug } from "@/lib/product/local-content";
import { RenderBlock } from "@/util/common/notion-render";
import { fetchNotionBlocks } from "@/lib/blog/notion-client";
import { normalizeNotionDocument } from "@/lib/blog/notion-normalize";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await getLocalProductBySlug(slug);
  if (!p) return { title: "Not Found" };
  return { title: `${p.title} | Product`, description: p.description };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getLocalProductBySlug(slug);
  if (!product) return notFound();

  let notion = { blocks: [], unavailable: true };
  
  // Fetch Notion content if ID is valid
  // We use a simple check to skip placeholders
  if (product.notionPageId && 
      !product.notionPageId.includes("dummy") && 
      !product.notionPageId.includes("NOTION_PAGE_ID")) {
    try {
      const rawBlocks = await fetchNotionBlocks(product.notionPageId);
      notion = await normalizeNotionDocument(rawBlocks);
    } catch (e) {
      console.error(`Failed to fetch notion content for ${slug}:`, e);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
      <nav className="mt-6 sm:mt-10 text-sm">
        <Link href="/product" className="text-blue-600 hover:underline">
          ← 一覧へ戻る
        </Link>
      </nav>

      <article className="mt-4 sm:mt-6">
        {slug === 'juice' ? (
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Juice<span className="text-cyan-500">.</span>
          </h1>
        ) : (
          <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{product.title}</h1>
        )}
        {/* Type and category */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="rounded-full">
            {product.type === 'Tool' ? 'ツール' : product.type === 'Template' ? 'テンプレート' : 'アプリケーション'}
          </Badge>
          {product.category && (
            <p className="text-sm text-muted-foreground">{product.category}</p>
          )}
        </div>

        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {product.tags.map((t) => (
              <Badge key={t} variant="default" className="rounded-full">{t}</Badge>
            ))}
          </div>
        )}

        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg border">
          <ImageWithFallback
            src={product.headerImageUrl || "/Simplo_gray_main_sub.jpg"}
            alt="cover"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
            fallbackSrc="/Simplo_gray_main_sub.jpg"
          />
        </div>

        {notion.unavailable || notion.blocks.length === 0 ? (
          <div className="mt-10 p-8 border rounded-lg bg-muted/20 text-center">
             <p className="text-muted-foreground">詳細情報は準備中です。</p>
             <p className="text-sm text-muted-foreground mt-2">（Notion Page ID: {product.notionPageId}）</p>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none mt-6">
            {notion.blocks.map((b, idx) => (
              <RenderBlock key={idx} b={b} />
            ))}
          </div>
        )}

        {product.contentLink && (
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link 
                href={product.contentLink}
                target={product.actionType === 'transition' ? "_self" : "_blank"}
                rel={product.actionType === 'download' ? "noopener noreferrer" : undefined}
                download={product.actionType === 'download' ? true : undefined}
              >
                {product.actionType === 'download' ? 'ダウンロード' : 'コンテンツへ移動'}
              </Link>
            </Button>
          </div>
        )}
      </article>
    </main>
  );
}
