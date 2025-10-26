import Link from "next/link";
import { notFound } from "next/navigation";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProductDetailBySlug } from "@/lib/product/actions";
import { RenderBlock } from "@/util/common/notion-render";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await getProductDetailBySlug(slug);
  if (!p) return { title: "Not Found" };
  return { title: `${p.header.title} | Product`, description: undefined };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProductDetailBySlug(slug);
  if (!data) return notFound();
  const { header: product, notion } = data;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
      <nav className="mt-6 sm:mt-10 text-sm">
        <Link href="/product" className="text-blue-600 hover:underline">
          ← 一覧へ戻る
        </Link>
      </nav>

      <article className="mt-4 sm:mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{product.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">{product.category}</p>

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
          <p className="text-sm text-muted-foreground mt-6">表示できるコンテンツがありません。</p>
        ) : (
          <div className="prose dark:prose-invert max-w-none mt-6">
            {notion.blocks.map((b, idx) => (
              <RenderBlock key={idx} b={b} />
            ))}
          </div>
        )}

        {product.contentLink && (
          <div className="mt-6">
            <Button asChild>
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
