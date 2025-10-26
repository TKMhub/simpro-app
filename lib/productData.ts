export type Product = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  // Optional: custom cover path. If omitted, uses `covers/{slug}.jpg` in Supabase Storage `product` bucket.
  coverPath?: string;
  headerImageUrl?: string;
  features?: string[];
  siteUrl?: string;
};

export const products: Product[] = [
  {
    slug: "simpro",
    title: "Simpro",
    description: "VBA・GAS・Webツール・テンプレートを配布するWebサービス",
    stack: ["Next.js", "TailwindCSS", "Supabase", "shadcn/ui"],
    headerImageUrl: "/Simplo_gray_main_sub.jpg",
    features: [
      "業務効率化ツールのテンプレートを配布",
      "Webツールやスクリプトのサンプル提供",
      "学習用コンテンツの公開",
    ],
    // siteUrl: "https://example.com/simpro",
  },
  {
    slug: "codeparts",
    title: "CodeParts",
    description: "ソースコードテンプレート配布＋ブログ＋Tipsの統合サイト",
    stack: ["Next.js", "Prisma", "Supabase", "Vercel"],
    headerImageUrl: "/Simplo_gray_main_sub.jpg",
    features: [
      "実用的なコードスニペットを提供",
      "ブログ・Tipsで使い方を解説",
      "検索・タグで素早く発見",
    ],
    // siteUrl: "https://example.com/codeparts",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
