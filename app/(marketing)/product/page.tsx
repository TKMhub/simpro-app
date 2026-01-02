import { getLocalProductList } from "@/lib/product/local-content";
import { ProductListClient } from "@/components/product/ProductListClient";

export const metadata = {
  title: "Product | Simpro",
  description: "個人開発しているプロダクトの紹介とリンク集",
};

export default async function ProductPage() {
  const items = await getLocalProductList();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Product</h1>
        <p className="text-[var(--muted-foreground)]">
          個人開発しているプロダクトの紹介とリンク集を掲載。
        </p>
      </header>

      <ProductListClient items={items} />
    </main>
  );
}
