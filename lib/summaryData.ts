export type Section = {
  id: "about" | "links" | "products";
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
    { id: "about", label: "About" },
    { id: "links", label: "Links" },
    { id: "products", label: "Products" },
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
      id: "links-1",
      section: "links",
      title: "X (Twitter)",
      description: "日々の気づきや学習ログをポストしています。",
      cta: { label: "フォロー", href: "https://x.com/" },
      image: { src: "/x-card.png", alt: "X Profile" },
      tags: ["Social", "Updates"],
    },
    {
      id: "links-2",
      section: "links",
      title: "YouTube",
      description: "開発ログや技術メモなどの動画を更新中。",
      cta: { label: "見る", href: "https://youtube.com/" },
      tags: ["Video", "Devlog"],
    },
    {
      id: "products-1",
      section: "products",
      title: "個人開発プロダクト A",
      description: "日常の習慣化を助けるミニアプリ。",
      cta: { label: "サイトへ", href: "/product/a" },
      image: { src: "/product-a.png", alt: "Product A" },
      tags: ["App", "Habit"],
    },
    {
      id: "products-2",
      section: "products",
      title: "個人開発プロダクト B",
      description: "SNS 連携のアイデアメモ帳。",
      cta: { label: "サイトへ", href: "/product/b" },
      tags: ["Tool", "Notes"],
    },
  ];

  return { sections, items };
}

