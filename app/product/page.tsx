import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { products } from "@/lib/productData";
import { getProductCoverPublicUrl } from "@/lib/product/image";

function ProductCard({
  slug,
  title,
  description,
  stack,
  coverUrl,
}: {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  coverUrl: string;
}) {
  const visibleTags = stack.slice(0, 3);
  const extraCount = Math.max(0, stack.length - visibleTags.length);
  return (
    <Link href={`/product/${slug}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--card)] shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.01] h-full flex flex-col">
        <div className="relative aspect-[16/9] w-full">
          <ImageWithFallback
            src={coverUrl}
            alt={`${title} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            fallbackSrc="/Simplo_gray_main_sub.jpg"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
            <h3 className="text-lg font-semibold tracking-tight drop-shadow">{title}</h3>
            <p className="mt-1 text-xs sm:text-sm opacity-90 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-5 flex flex-col grow">
          <div className="flex items-start gap-2 overflow-hidden h-8">
            {visibleTags.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2.5 h-8 inline-flex items-center text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/20"
              >
                {t}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="rounded-full border px-2.5 h-8 inline-flex items-center text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/20">
                +{extraCount}
              </span>
            )}
          </div>
          <div className="mt-auto pt-4 text-sm text-blue-600">詳しく見る →</div>
        </div>
      </div>
    </Link>
  );
}

export default function ProductPage() {
  const items = products.map((p) => ({
    ...p,
    coverUrl: getProductCoverPublicUrl({ imgPath: p.coverPath, slug: p.slug }),
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Product</h1>
        <p className="text-[var(--muted-foreground)]">
          個人開発しているプロダクトの紹介とリンク集を掲載。
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr items-stretch">
        {items.map((p) => (
          <ProductCard
            key={p.slug}
            slug={p.slug}
            title={p.title}
            description={p.description}
            stack={p.stack}
            coverUrl={p.coverUrl}
          />
        ))}
      </div>
    </main>
  );
}
