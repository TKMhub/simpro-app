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

// In the future, swap this with a Notion/Supabase fetcher.
export async function fetchSummaryData(): Promise<SummaryData> {
  // Dummy data for now.
  const sections: Section[] = [
    { id: "about", label: "about" },
    { id: "blog", label: "blog" },
    { id: "product", label: "product" },
    { id: "link", label: "link" },
  ];

  const items: SummaryItem[] = [
    {
      id: "about-1",
      section: "about",
      title: "自己紹介",
      description:
        "フロントエンド中心に学習・開発しています。Webの修行中 / 個人開発奮闘中。",
      cta: { label: "詳細を見る", href: "/about" },
      image: { src: "/avatar.svg", alt: "プロフィール" },
      tags: ["Profile", "Frontend", "Learning"],
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
      id: "blog-1",
      section: "blog",
      title: "最新記事を読む",
      description: "学びや実践メモを公開中。",
      cta: { label: "ブログへ", href: "/blog" },
      image: { src: "/blog/covers/nextjs.svg", alt: "Blog" },
      tags: ["Blog", "Update"],
    },
    {
      id: "blog-2",
      section: "blog",
      title: "TypeScript 実践Tips 10選",
      description: "日常で役立つ型の使い方。",
      cta: { label: "読む", href: "/blog/typescript-tips" },
      image: { src: "/blog/covers/typescript.svg", alt: "TypeScript" },
      tags: ["TypeScript", "Tips"],
    },
    {
      id: "link-1",
      section: "link",
      title: "X (Twitter)",
      description: "日々の気づきや学習ログをポストしています。",
      cta: { label: "フォロー", href: "https://x.com/" },
      tags: ["Social", "Updates"],
    },
    {
      id: "link-2",
      section: "link",
      title: "YouTube",
      description: "開発ログや技術メモなどの動画を更新中。",
      cta: { label: "見る", href: "https://youtube.com/" },
      tags: ["Video", "Devlog"],
    },
    {
      id: "product-1",
      section: "product",
      title: "個人開発プロダクト A",
      description: "日常の習慣化を助けるミニアプリ。",
      cta: { label: "サイトへ", href: "/product/a" },
      image: { src: "/file.svg", alt: "Product" },
      tags: ["App", "Habit"],
    },
    {
      id: "product-2",
      section: "product",
      title: "個人開発プロダクト B",
      description: "SNS 連携のアイデアメモ帳。",
      cta: { label: "サイトへ", href: "/product/b" },
      tags: ["Tool", "Notes"],
    },
  ];

  return { sections, items };
}
