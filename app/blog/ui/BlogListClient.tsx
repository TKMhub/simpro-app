"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { normalizeCategories } from "@/lib/blogCategories";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { getBlogList } from "@/lib/blog/actions";
import type { BlogHeader } from "@/lib/blog/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  initialItems: BlogHeader[];
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
};

export default function BlogListClient({ initialItems, initialTotal }: Props) {
  const searchParams = useSearchParams();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<BlogHeader[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of items) p.tags.forEach((t) => set.add(t));
    return Array.from(set).sort();
  }, [items]);

  // Initialize active tags from URL query (?tag=React&tag=Next.js)
  useEffect(() => {
    const urlTags = searchParams ? searchParams.getAll("tag") : [];
    if (urlTags.length > 0) {
      const valid = urlTags.filter((t) => allTags.includes(t));
      if (valid.length > 0) setActiveTags(Array.from(new Set(valid)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allTags.join("|")]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setActiveTags([]);
    setQuery("");
    startTransition(async () => {
      const res = await getBlogList({});
      setItems(res.items);
    });
  };

  const categories = useMemo(() => normalizeCategories(allTags), [allTags]);

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of items) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)
      .slice(0, 6);
  }, [items]);

  // Fetch on filters change
  useEffect(() => {
    startTransition(async () => {
      const res = await getBlogList({ q: query, tags: activeTags });
      setItems(res.items);
    });
  }, [query, activeTags]);

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
          {(activeTags.length > 0 || query) && (
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline self-start sm:self-auto">
              クリア
            </button>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">おすすめタグ</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => {
              const active = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={["transition-transform", active ? "scale-[1.03]" : "hover:scale-[1.02]"].join(" ")}
                  aria-pressed={active}
                >
                  <Badge variant={active ? "default" : "secondary"}>{tag}</Badge>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Accordion type="multiple" className="w-full">
            {categories.map((cat, idx) => (
              <AccordionItem key={cat.name} value={`${idx}`}>
                <AccordionTrigger className="text-sm">{cat.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 py-2">
                    {cat.items.map((tag) => {
                      const active = activeTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={["transition-transform", active ? "scale-[1.03]" : "hover:scale-[1.02]"].join(" ")}
                          aria-pressed={active}
                        >
                          <Badge variant={active ? "default" : "secondary"}>{tag}</Badge>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
                      {post.headerImageUrl && (
                        <div className="relative w-28 h-20 sm:w-36 sm:h-24 shrink-0 rounded-md overflow-hidden border">
                          <Image
                            src={post.headerImageUrl}
                            alt="cover"
                            fill
                            sizes="(max-width: 640px) 112px, 144px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg font-medium group-hover:underline">{post.title}</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(post.updatedAt || post.createdAt).toLocaleDateString("ja-JP")} ・ {post.author}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.map((t) => (
                            <Badge key={t} variant="secondary">
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
