import Link from "next/link";
import { products } from "@/lib/productData";

function ProductCard({ slug, title, description, stack }: { slug: string; title: string; description: string; stack: string[] }) {
  return (
    <Link href={`/product/${slug}`} className="block group">
      <div className="rounded-xl border border-[var(--color-border)] p-6 transition-all duration-300 group-hover:shadow-md">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold group-hover:underline underline-offset-2">{title}</h3>
          <p className="text-[var(--muted-foreground)]">{description}</p>
          <p className="text-sm text-[var(--muted-foreground)]">技術スタック：{stack.join(" / ")}</p>
        </div>
        <div className="mt-4 text-sm text-blue-600">詳しく見る →</div>
      </div>
    </Link>
  );
}

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Product</h1>
        <p className="text-[var(--muted-foreground)]">
          個人開発しているプロダクトの紹介とリンク集を掲載。
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.slug}
            slug={p.slug}
            title={p.title}
            description={p.description}
            stack={p.stack}
          />
        ))}
      </div>
    </main>
  );
}
