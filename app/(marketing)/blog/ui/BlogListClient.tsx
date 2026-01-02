"use client";

import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { getBlogList } from "@/lib/blog/actions";
import type { BlogHeader } from "@/lib/blog/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

type Props = {
  initialItems: BlogHeader[];
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
  facets: { categories: string[]; categoryTags: Record<string, string[]> };
};

export default function BlogListClient({ initialItems, initialTotal, initialPage, initialPageSize, facets }: Props) {
  const searchParams = useSearchParams();
  // 絞り込み状態
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<BlogHeader[]>(initialItems);
  const [total, setTotal] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(initialPage || 1);
  const [pageSize] = useState<number>(initialPageSize || 15);
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
      const res = await getBlogList({ page: 1, pageSize, sort: "updated", order: "desc", status: "all" });
      setItems(res.items);
      setTotal(res.total);
      setPage(1);
    });
  };

  // Fetch on filters change
  useEffect(() => {
    startTransition(async () => {
      const showAll = !query && !selectedCategory && !selectedTag;
      const res = await getBlogList({
        q: query,
        category: selectedCategory || undefined,
        tags: selectedTag ? [selectedTag] : [],
        page: 1,
        pageSize,
        sort: "updated",
        order: "desc",
        status: showAll ? "all" : "published",
      });
      setItems(res.items);
      setTotal(res.total);
      setPage(1);
    });
  }, [query, selectedCategory, selectedTag, pageSize]);

  // Fetch on page change
  const goToPage = (p: number) => {
    setPage(p);
    startTransition(async () => {
      const showAll = !query && !selectedCategory && !selectedTag;
      const res = await getBlogList({
        q: query,
        category: selectedCategory || undefined,
        tags: selectedTag ? [selectedTag] : [],
        page: p,
        pageSize,
        sort: "updated",
        order: "desc",
        status: showAll ? "all" : "published",
      });
      setItems(res.items);
      setTotal(res.total);
    });
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
      <section className="mt-8 sm:mt-12 mb-6 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="text-[var(--muted-foreground)]">
            記事のタグとキーワードで絞り込みできます。
        </p>
      </section>

      {/* Filters: Matching Product List UI Style */}
      <section className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="キーワード検索 (タイトル/タグ)"
                    className="pl-10 h-10 bg-[var(--card)]"
                />
            </div>
          {(selectedCategory || selectedTag || query) && (
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline self-start sm:self-auto">
              クリア
            </button>
          )}
        </div>

        {/* Categories as Badges/Buttons for Desktop to match Product? 
           The user said "Match Product functionality/UI for PC".
           Product uses Buttons/Badges. Blog has many categories so maybe buttons wrapping is okay.
           But Blog also has Sub-tags dependent on Category.
           If we switch to buttons for Category, we need a way to show Tags.
           Let's keep Select for Tags but maybe try Buttons for Category if not too many?
           Actually, the user said "Match Product". Product has: Search, Type (Buttons), Category (Badges).
           Blog has: Search, Category, Tag.
           Let's try to align the look.
        */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
             {/* Category Selection - Using Select on Mobile, maybe Badges on Desktop? 
                 To be safe and consistent with "Match Product", let's use the layout style.
                 But for functionality, Blog's "Select" is robust for many items. 
                 Product uses Badges.
                 Let's stick to Selects but style them to look integrated or just ensure the layout (Search bar width, spacing) matches.
                 Wait, the user said "Product機能に合わせる" (Match Product Functionality/UI) for PC.
                 This likely means visual style. 
                 I'll update the layout to look like Product's filter section.
             */}
            
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground mr-1">カテゴリ:</span>
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
                    <SelectTrigger className="h-9 min-w-[140px] rounded-full bg-background">
                        <SelectValue placeholder="すべて" />
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

            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground mr-1">タグ:</span>
                <Select
                    value={selectedTag}
                    onValueChange={(v) => setSelectedTag(v === "__ALL__" ? "" : v)}
                    disabled={!selectedCategory}
                >
                    <SelectTrigger className="h-9 min-w-[140px] rounded-full bg-background">
                         <SelectValue placeholder={selectedCategory ? "すべて" : "カテゴリを選択"} />
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
        {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-12 border border-dashed rounded-xl">該当する記事がありません。</p>}

        {/* Blog items layout - Keeping list style or grid? 
            Product uses Grid. Blog uses List (Cards).
            User said "Match Product for PC".
            Does that mean Blog should be Grid?
            "Blog layout matches Product (wider width)" was done.
            If I change to Grid, it's a big change.
            "Product機能に合わせる" -> likely filter UI.
            I will keep List for Blog content as it's standard for blogs, but match the filter UI better.
        */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr items-stretch">
             {items.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group h-full">
                  <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--card)] shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.01] h-full flex flex-col">
                     <div className="relative aspect-[16/9] w-full">
                        <ImageWithFallback
                            src={post.headerImageUrl}
                            alt="cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                            fallbackSrc="/Simplo_gray_main_sub.jpg"
                        />
                     </div>
                     <div className="p-4 sm:p-5 flex flex-col grow">
                        <div className="mb-2">
                             <h2 className="text-lg font-semibold tracking-tight line-clamp-2 group-hover:underline">{post.title}</h2>
                             <p className="text-xs text-muted-foreground mt-1">
                                {new Date(post.updatedAt || post.createdAt).toLocaleDateString("ja-JP")}
                             </p>
                        </div>
                        <div className="mt-auto flex flex-wrap gap-1.5">
                             {post.tags.slice(0, 3).map((t) => (
                                <Badge key={t} variant="secondary" className="rounded-full text-[10px] px-2 h-5">
                                    {t}
                                </Badge>
                             ))}
                        </div>
                     </div>
                  </div>
                </Link>
             ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page <= 1 || isPending}
            >
              前へ
            </Button>
            <div className="flex gap-1 items-center px-2 text-sm">
                {page} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || isPending}
            >
              次へ
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
