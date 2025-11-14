"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { aboutData } from "@/lib/about/data";

export default function AboutGrid() {
  const items = [
    {
      id: "career",
      title: "経歴",
      description: "職務経歴や実績の概要を掲載しています。",
      image: { src: "/career.svg", alt: "経歴のアイコン" },
      imageFit: "contain" as const,
      cta: { label: "経歴を見る", href: "/about#career" },
    },
    {
      id: "skills",
      title: "スキル",
      description: [
        aboutData.skills.languages.join(" / "),
        aboutData.skills.frameworks.join(" / "),
        aboutData.skills.cloud.join(" / "),
      ]
        .filter(Boolean)
        .join(" | "),
      image: { src: "/skills.svg", alt: "スキルのアイコン" },
      imageFit: "contain" as const,
      cta: { label: "スキル", href: "/about#skills" },
    },
    {
      id: "hobby",
      title: "趣味",
      description:
        "個人開発（Simpro）や犬、NARUTOフィギュア、ロゴ・イラスト制作など。",
      image: { src: "/Simplo_gray_main_sub.jpg", alt: "Simpro ロゴ" },
      imageFit: "contain" as const,
      cta: { label: "趣味", href: "/about#hobby" },
    },
  ];

  return (
    <div className="mx-3 sm:mx-4 md:mx-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="py-3">
              <CardTitle className="text-base sm:text-lg line-clamp-1">{item.title}</CardTitle>
              {item.description && (
                <CardDescription
                  className="text-sm"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}
                >
                  {item.description}
                </CardDescription>
              )}
            </CardHeader>
            {item.image?.src && (
              <div className="px-5">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <div className="flex items-center justify-center w-full h-full">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt ?? item.title}
                        fill
                        className={item.imageFit === "contain" ? "object-contain" : "object-cover"}
                        priority={false}
                        unoptimized={item.image.src.toLowerCase().endsWith('.svg')}
                      />
                    </div>
                  </div>
              </div>
            )}
            <CardContent className="mt-2 py-3 flex justify-end">
              {item.cta?.href && (
                <Button asChild size="sm">
                  <Link href={item.cta.href} aria-label={item.cta.label ?? item.title}>
                    {item.cta.label ?? "詳しく"}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
