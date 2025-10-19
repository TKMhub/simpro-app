"use client";

import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { getBlogList } from "@/lib/blog/actions";
import type { BlogHeader } from "@/lib/blog/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  initialItems: BlogHeader[];
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
  facets: { categories: string[]; categoryTags: Record<string, string[]> };
};

export default function BlogListClient({ initialItems, initialTotal, facets }: Props) {
  const searchParams = useSearchParams();
  // 絞り込み状態
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<BlogHeader[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  // URLから初期状態を受け取る（将来的な拡張用）。現状は未使用。
  useEffect(() => {
    void searchParams; // no-op
  }, [searchParams]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedTag("");
    setQuery("");
    startTransition(async () => {
      const res = await getBlogList({});
      setItems(res.items);
    });
  };

  // Fetch on filters change
  useEffect(() => {
    startTransition(async () => {
      const res = await getBlogList({
        q: query,
        category: selectedCategory || undefined,
        tags: selectedTag ? [selectedTag] : [],
      });
      setItems(res.items);
    });
  }, [query, selectedCategory, selectedTag]);

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-16">
      <section className="mt-8 sm:mt-12 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="text-sm text-muted-foreground mt-1">記事のタグとキーワードで絞り込みできます。</p>
      </section>

      <section className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="キーワード検索 (タイトル/タグ)"
              className="h-10"
            />
          </div>
          {(selectedCategory || selectedTag || query) && (
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline self-start sm:self-auto">
              クリア
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">カテゴリ</span>
            <Select
              value={selectedCategory}
              onValueChange={(v) => {
                if (v === "__ALL__") {
                  setSelectedCategory("");
                  setSelectedTag("");
                } else {
                  setSelectedCategory(v);
                  setSelectedTag("");
                }
              }}
            >
              <SelectTrigger className="h-9 min-w-40">
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="__ALL__">すべて</SelectItem>
                {facets.categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">タグ</span>
            <Select
              value={selectedTag}
              onValueChange={(v) => setSelectedTag(v === "__ALL__" ? "" : v)}
              disabled={!selectedCategory}
            >
              <SelectTrigger className="h-9 min-w-40">
                <SelectValue placeholder={selectedCategory ? "タグを選択" : "カテゴリを先に選択"} />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="__ALL__">すべて</SelectItem>
                {(facets.categoryTags[selectedCategory] || []).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {items.length === 0 && <p className="text-sm text-muted-foreground">該当する記事がありません。</p>}

        <ul className="space-y-4">
          {items.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="block group">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4 sm:p-5">
                      <div className="relative w-28 h-20 sm:w-36 sm:h-24 shrink-0 rounded-md overflow-hidden border">
                        <ImageWithFallback
                          src={post.headerImageUrl}
                          alt="cover"
                          fill
                          sizes="(max-width: 640px) 112px, 144px"
                          className="object-cover"
                          // Local default image
                          fallbackSrc="/Simplo_gray_main_sub.jpg"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg font-medium group-hover:underline">{post.title}</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(post.updatedAt || post.createdAt).toLocaleDateString("ja-JP")} ・ {post.author}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.map((t) => (
                            <Badge key={t} variant="default" className="rounded-full">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
