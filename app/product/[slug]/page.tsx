import Link from "next/link";
import { notFound } from "next/navigation";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/productData";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return { title: "Not Found" };
  return { title: `${p.title} | Product`, description: p.description };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
      <nav className="mt-6 sm:mt-10 text-sm">
        <Link href="/product" className="text-blue-600 hover:underline">
          ← 一覧へ戻る
        </Link>
      </nav>

      <article className="mt-4 sm:mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{product.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">{product.description}</p>

        {product.stack?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {product.stack.map((t) => (
              <Badge key={t} variant="default" className="rounded-full">{t}</Badge>
            ))}
          </div>
        )}

        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg border">
          <ImageWithFallback
            src={product.headerImageUrl}
            alt="cover"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
            fallbackSrc="/Simplo_gray_main_sub.jpg"
          />
        </div>

        <section className="prose dark:prose-invert max-w-none mt-6">
          <h2>概要</h2>
          <p>{product.description}</p>

          {product.features?.length ? (
            <>
              <h3>特徴</h3>
              <ul>
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        {product.siteUrl && (
          <div className="mt-6">
            <Button asChild>
              <Link href={product.siteUrl} target="_blank" rel="noopener noreferrer">
                公式サイトを見る
              </Link>
            </Button>
          </div>
        )}
      </article>
    </main>
  );
}
