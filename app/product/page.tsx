import Link from "next/link";
import { Button } from "@/components/ui/button";

function ProductCard({
  title,
  description,
  stack,
  href,
}: {
  title: string;
  description: string;
  stack: string;
  href: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] p-6 transition-all duration-300 hover:scale-105 hover:shadow-md">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-[var(--muted-foreground)]">{description}</p>
        <p className="text-sm text-[var(--muted-foreground)]">技術スタック：{stack}</p>
      </div>
      <div className="mt-5">
        <Button asChild>
          <Link href={href}>サイトを見る</Link>
        </Button>
      </div>
    </div>
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
        <ProductCard
          title="Simpro"
          description="VBA・GAS・Webツール・テンプレートを配布するWebサービス"
          stack="Next.js / TailwindCSS / Supabase / Shadcn"
          href="/simpro"
        />
        <ProductCard
          title="CodeParts"
          description="ソースコードテンプレート配布＋ブログ＋Tipsの統合サイト"
          stack="Next.js / Prisma / Supabase / Vercel"
          href="/codeparts"
        />
      </div>
    </main>
  );
}

