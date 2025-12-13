import React from "react";

export type Section = {
  id: "about" | "blog" | "product" | "link";
  label: string;
};

export type ProductCategory = "app" | "template" | "tool" | "other";

export type SummaryItem = {
  id: string;
  section: Section["id"];
  category?: ProductCategory; // For product section
  title: string;
  titleComponent?: React.ReactNode;
  hoverColorClass?: string;
  ctaColorClass?: string;
  description?: string;
  cta?: { label: string; href: string };
  image?: { src: string; alt?: string };
  imageFit?: "contain" | "cover";
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
    { id: "product", label: "product" },
    { id: "blog", label: "blog" },
    { id: "link", label: "link" },
  ];

  const items: SummaryItem[] = [];

  // 0) Product - Apps
  items.push(
    {
      id: "app-juice",
      section: "product",
      category: "app",
      title: "Juice",
      titleComponent: <>Juice<span className="text-cyan-500">.</span></>,
      hoverColorClass: "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
      ctaColorClass: "text-cyan-600/90 dark:text-cyan-400/90 hover:text-cyan-700 dark:hover:text-cyan-300",
      description: "勝負の行方は、ジュースが決める。ライバルとの勝負を記録して、勝ち越し状況を可視化するアプリ。",
      cta: { label: "アプリを開く", href: "/juice" },
      image: { src: "/juice-logo.svg", alt: "Juice Logo" },
      imageFit: "contain",
      tags: ["App", "Utility"],
    },
    {
      id: "app-zaiko",
      section: "product",
      category: "app",
      title: "Zaiko",
      description: "在庫管理のストレスをゼロに。家の在庫状況が一目瞭然、家族で共有できる在庫管理アプリ。",
      cta: { label: "アプリを開く", href: "/zaiko" },
      image: { src: "/zaiko-logo.svg", alt: "Zaiko Logo" },
      imageFit: "contain",
      tags: ["App", "Lifestyle"],
    }
  );

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
    console.error(e);
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
        category: "template", // Default to template for now, logic can be refined
        title: p.title,
        description: p.description || undefined,
        cta: { label: p.actionType === "download" ? "ダウンロード" : "詳しく", href: p.contentLink ?? `/product/${p.slug}` },
        image: p.headerImageUrl ? { src: p.headerImageUrl, alt: p.title } : undefined,
        tags: p.tags || [],
      });
    }
  } catch (e) {
    console.error(e);
    // ignore and proceed
  }

  // 3) Static About + Link as fallback/auxiliary
  try {
    const { aboutData } = await import("@/lib/about/data");
    items.push(
      {
        id: "about-1",
        section: "about",
        title: "自己紹介",
        description: aboutData.intro,
        cta: { label: "詳細を見る", href: "/about" },
        image: { src: "/avatar.svg", alt: "プロフィール" },
        tags: ["Profile"],
      },
      {
        id: "about-2",
        section: "about",
        title: "スキルスタック",
        description: `${aboutData.skills.frameworks.slice(0, 3).join(" / ")} / ${aboutData.skills.languages.slice(0, 3).join(" / ")}`,
        cta: { label: "スキル", href: "/about#skills" },
        tags: ["Skills"],
      },
    );
  } catch {}
  
  items.push(
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
