export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string; // ISO string
  author: string;
  coverImage?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "nextjs-app-router-basics",
    title: "Next.js App Router 基本ガイド",
    excerpt:
      "App Routerの基本、レイアウト、サーバー/クライアントコンポーネントの使い分けについて解説します。",
    content:
      "Next.js 13+ の App Router は、レイアウトの継承やサーバーコンポーネントの活用によって、パフォーマンスと開発体験を大きく向上させます。この記事では、基本的なディレクトリ構成、ルーティング、データフェッチの考え方を具体例を交えて紹介します。",
    tags: ["Next.js", "React", "Guide"],
    date: "2024-05-12T09:00:00.000Z",
    author: "Takumi",
    coverImage: "/blog/covers/nextjs.svg",
  },
  {
    id: "2",
    slug: "tailwind-ui-patterns",
    title: "Tailwindで作るUIパターン集",
    excerpt:
      "ユーティリティクラスを活用したコンポーネント設計と再利用パターンの実例をまとめました。",
    content:
      "Tailwind CSS は小さなユーティリティの組み合わせで柔軟な UI を構築できます。本記事ではカード、バッジ、ナビゲーションなどのよく使うパターンを実装しながら設計の考え方を説明します。",
    tags: ["Tailwind", "UI", "Design"],
    date: "2024-06-02T09:00:00.000Z",
    author: "Takumi",
    coverImage: "/blog/covers/tailwind.svg",
  },
  {
    id: "3",
    slug: "typescript-tips",
    title: "TypeScript 実践Tips 10選",
    excerpt:
      "型の絞り込み、ユーティリティ型、ジェネリクスなど、日常で役立つTipsを厳選。",
    content:
      "TypeScript の型システムは強力ですが、慣れるまでは少し取っ付きにくいもの。ユーティリティ型やジェネリクス、Discriminated Union の活用など、実務で使えるエッセンスを短く紹介します。",
    tags: ["TypeScript", "Tips"],
    date: "2024-06-18T09:00:00.000Z",
    author: "Takumi",
    coverImage: "/blog/covers/typescript.svg",
  },
  {
    id: "4",
    slug: "react-performance",
    title: "React パフォーマンス最適化入門",
    excerpt:
      "メモ化、分割、サスペンス、並行レンダリングの基本と実装例。",
    content:
      "React のパフォーマンス最適化は計測が第一歩です。React DevTools を使ったボトルネックの特定から、メモ化やコンポーネント分割、サスペンスの活用まで、段階的な最適化を解説します。",
    tags: ["React", "Performance"],
    date: "2024-07-01T09:00:00.000Z",
    author: "Takumi",
    coverImage: "/blog/covers/react.svg",
  },
  {
    id: "5",
    slug: "ux-writing-basics",
    title: "UXライティングの基本",
    excerpt:
      "UIテキストの原則、トーン&ボイス、エラーメッセージの書き方。",
    content:
      "UX ライティングは製品体験の一部です。分かりやすさ、親しみやすさ、アクセシビリティを意識したテキストのガイドラインと、良い/悪い例を紹介します。",
    tags: ["UX", "Writing", "Design"],
    date: "2024-07-21T09:00:00.000Z",
    author: "Takumi",
    coverImage: "/blog/covers/ux.svg",
  },
  {
    id: "6",
    slug: "nextjs-image-optimization",
    title: "Next.js の画像最適化を極める",
    excerpt:
      "<Image>コンポーネントの使い方、レスポンシブ、キャッシュ戦略を解説。",
    content:
      "Next.js の <Image> は自動最適化やレスポンシブ対応が強力です。適切なレイアウトモード、プレースホルダー、優先読み込みなどの設定を理解し、パフォーマンスを引き上げましょう。",
    tags: ["Next.js", "Performance", "Images"],
    date: "2024-08-05T09:00:00.000Z",
    author: "Takumi",
    coverImage: "/blog/covers/image.svg",
  },
  {
    id: "7",
    slug: "design-tokens",
    title: "Design Tokens でデザインをコード化",
    excerpt:
      "色、間隔、タイポグラフィをトークン化して一貫性を高める。",
    content:
      "Design Tokens はデザインの共通言語です。スケール可能な配色、余白、タイポグラフィの定義方法と、実装の落とし穴を解説します。",
    tags: ["Design", "System"],
    date: "2024-08-24T09:00:00.000Z",
    author: "Takumi",
    coverImage: "/blog/covers/tokens.svg",
  },
  {
    id: "8",
    slug: "a11y-checklist",
    title: "アクセシビリティ チェックリスト",
    excerpt:
      "キーボード操作、コントラスト、代替テキストなど実務チェック項目。",
    content:
      "アクセシビリティ向上はユーザー体験の向上にも直結します。チェックリスト形式で、まず取り組みたい項目をまとめました。",
    tags: ["A11y", "UX", "Checklist"],
    date: "2024-09-02T09:00:00.000Z",
    author: "Takumi",
    coverImage: "/blog/covers/a11y.svg",
  },
];

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const p of blogPosts) {
    p.tags.forEach((t) => set.add(t));
  }
  return Array.from(set).sort();
}

export function findPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
