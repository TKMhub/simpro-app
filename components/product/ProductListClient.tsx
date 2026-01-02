"use client";

import { useState, useMemo } from "react";
import { ProductHeader } from "@/lib/product/types";
import { ProductCard } from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type Props = {
  items: ProductHeader[];
};

export function ProductListClient({ items }: Props) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Derive unique categories
  const categories = useMemo(() => {
    const s = new Set(items.map((i) => i.category).filter(Boolean));
    return Array.from(s).sort();
  }, [items]);

  // Derive types (fixed set usually)
  const types = ["Application", "Template", "Tool"];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

      const matchCategory = !selectedCategory || item.category === selectedCategory;
      const matchType = !selectedType || item.type === selectedType;

      return matchQuery && matchCategory && matchType;
    });
  }, [items, query, selectedCategory, selectedType]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory(null);
    setSelectedType(null);
  };

  return (
    <div className="space-y-8">
      {/* Filters & Search - Matching Blog layout somewhat but with Button/Badge for quick access as requested */}
      <div className="space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="キーワード検索 (タイトル/タグ)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 bg-[var(--card)]"
                />
            </div>
             {(selectedCategory || selectedType || query) && (
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline self-start sm:self-auto">
                  クリア
                </button>
              )}
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground mr-1">種別:</span>
            <Button
                variant={selectedType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
                className={`rounded-full ${selectedType === null ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
                すべて
            </Button>
            {types.map(t => (
                <Button
                    key={t}
                    variant={selectedType === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(t)}
                    className={`rounded-full ${selectedType === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                >
                    {t === 'Application' ? 'アプリケーション' : t === 'Template' ? 'テンプレート' : 'ツール'}
                </Button>
            ))}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground mr-1">カテゴリ:</span>
                 <Badge
                    variant={selectedCategory === null ? "default" : "secondary"}
                    className="cursor-pointer hover:opacity-80 transition-opacity rounded-full px-3 py-1"
                    onClick={() => setSelectedCategory(null)}
                >
                    すべて
                </Badge>
                {categories.map(c => (
                    <Badge
                        key={c}
                        variant={selectedCategory === c ? "default" : "secondary"}
                        className="cursor-pointer hover:opacity-80 transition-opacity rounded-full px-3 py-1"
                        onClick={() => setSelectedCategory(c)}
                    >
                        {c}
                    </Badge>
                ))}
            </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-[var(--card)] rounded-xl border border-dashed">
              該当するプロダクトが見つかりませんでした。
          </div>
      ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr items-stretch">
            {filtered.map((p) => (
              <ProductCard
                key={p.slug}
                slug={p.slug}
                title={p.title}
                description={p.description || p.category}
                stack={p.tags}
                coverUrl={p.headerImageUrl || "/Simplo_gray_main_sub.jpg"}
              />
            ))}
          </div>
      )}
    </div>
  );
}
