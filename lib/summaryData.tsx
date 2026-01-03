import React from "react";

export type Section = {
  id: "about" | "product" | "blog" | "contact";
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
    { id: "about", label: "About" },
    { id: "product", label: "Product" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
  ];

  const items: SummaryItem[] = [];

  // --- About Section (Static) ---
  items.push(
    {
      id: "about-me",
      section: "about",
      title: "About Me",
      description: "エンジニアとしての経歴やスキルセット、個人の価値観について。",
      cta: { label: "詳しく見る", href: "/about" },
      image: { src: "/taku.jpg", alt: "Profile" },
      imageFit: "cover",
    },
    {
      id: "about-link",
      section: "about",
      title: "Links",
      description: "各種SNSや活動リンクをまとめています。",
      cta: { label: "リンク集へ", href: "/link" },
      tags: ["SNS", "GitHub", "Zenn"],
    }
  );

  // --- Output Section (Product & Blog) ---
  
  // 1) Products
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
      titleComponent: <>Zaiko<span className="text-green-500">.</span></>,
      hoverColorClass: "group-hover:text-green-500 dark:group-hover:text-green-400",
      ctaColorClass: "text-green-600/90 dark:text-green-400/90 hover:text-green-700 dark:hover:text-green-300",
      description: "在庫管理のストレスをゼロに。家の在庫状況が一目瞭然、家族で共有できる在庫管理アプリ。",
      cta: { label: "アプリを開く", href: "/zaiko" },
      image: { src: "/zaiko-logo.svg", alt: "Zaiko Logo" },
      imageFit: "contain",
      tags: ["App", "Lifestyle"],
    }
  );

  // 2) Blog Posts (Latest 3)
  try {
    const { getBlogList } = await import("@/lib/blog/actions");
    const blog = await getBlogList({ page: 1, pageSize: 3, sort: "updated", order: "desc", status: "published" });
    for (const b of blog.items) {
      items.push({
        id: `blog-${b.id}`,
        section: "blog",
        title: b.title,
        description: `Blog: ${b.category || "General"}`,
        cta: { label: "読む", href: `/blog/${b.slug}` },
        image: b.headerImageUrl ? { src: b.headerImageUrl, alt: b.title } : undefined,
        tags: b.tags || [],
      });
    }
  } catch (e) {
    console.error(e);
  }

  // --- Contact Section (Static) ---
  items.push(
    {
      id: "contact-request",
      section: "contact",
      title: "Development Request",
      description: "Webアプリ開発、業務改善ツール作成など、技術的なご相談はこちら。",
      cta: { label: "依頼する", href: "/request" },
      tags: ["Development", "Consulting"],
    },
    {
      id: "contact-inquiry",
      section: "contact",
      title: "General Inquiry",
      description: "その他のお問い合わせ、ご質問、雑談などはこちらから。",
      cta: { label: "問い合わせる", href: "/contact" },
      tags: ["Support", "Question"],
    }
  );

  return { sections, items };
}
