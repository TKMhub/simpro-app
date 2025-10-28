export type Section = {
  id: "about" | "blog" | "product" | "link";
  label: string;
};

export type SummaryItem = {
  id: string;
  section: Section["id"];
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  image?: { src: string; alt?: string };
  tags?: string[];
};

export type SummaryData = {
  sections: Section[];
  items: SummaryItem[];
};

// Prefer live data from Supabase (via Prisma). Fallback to minimal static items when unavailable.
export async function fetchSummaryData(): Promise<SummaryData> {
  const sections: Section[] = [
    { id: "about", label: "about" },
    { id: "blog", label: "blog" },
    { id: "product", label: "product" },
    { id: "link", label: "link" },
  ];

  const items: SummaryItem[] = [];

  // 1) Blog (from Supabase via Prisma)
  try {
    const { getBlogList } = await import("@/lib/blog/actions");
    const blog = await getBlogList({ page: 1, pageSize: 6, sort: "updated", order: "desc", status: "published" });
    for (const b of blog.items) {
      items.push({
        id: `blog-${b.id}`,
        section: "blog",
        title: b.title,
        description: b.category || undefined,
        cta: { label: "読む", href: `/blog/${b.slug}` },
        image: b.headerImageUrl ? { src: b.headerImageUrl, alt: b.title } : undefined,
        tags: b.tags || [],
      });
    }
  } catch (e) {
    // swallow and continue; we will still show other sections
  }

  // 2) Product (from Supabase via Prisma)
  try {
    const { getProductList } = await import("@/lib/product/actions");
    const prods = await getProductList({ page: 1, pageSize: 6, sort: "updated", order: "desc", status: "published" });
    for (const p of prods.items) {
      items.push({
        id: `product-${p.id}`,
        section: "product",
        title: p.title,
        description: p.description || undefined,
        cta: { label: p.actionType === "download" ? "ダウンロード" : "詳しく", href: p.contentLink ?? `/product/${p.slug}` },
        image: p.headerImageUrl ? { src: p.headerImageUrl, alt: p.title } : undefined,
        tags: p.tags || [],
      });
    }
  } catch (e) {
    // ignore and proceed
  }

  // 3) Static About + Link as fallback/auxiliary
  items.push(
    {
      id: "about-1",
      section: "about",
      title: "自己紹介",
      description: "フロントエンド中心に学習・開発しています。",
      cta: { label: "詳細を見る", href: "/about" },
      image: { src: "/avatar.svg", alt: "プロフィール" },
      tags: ["Profile", "Frontend"],
    },
    {
      id: "about-2",
      section: "about",
      title: "スキルスタック",
      description: "React / Next.js / TypeScript / Tailwind CSS など。",
      cta: { label: "スキル", href: "/about#skills" },
      tags: ["React", "Next.js", "TypeScript"],
    },
    {
      id: "link-1",
      section: "link",
      title: "X (Twitter)",
      description: "学習ログをポストしています。",
      cta: { label: "フォロー", href: "https://x.com/" },
      tags: ["Social"],
    },
    {
      id: "link-2",
      section: "link",
      title: "YouTube",
      description: "開発ログや技術メモを更新中。",
      cta: { label: "見る", href: "https://youtube.com/" },
      tags: ["Video"],
    }
  );

  return { sections, items };
}
