"use client";

import Image from "next/image";
import Link from "next/link";
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
      image: { src: "/Simplo_white_blue.svg", alt: "Simpro ロゴ" },
      imageFit: "contain" as const,
      cta: { label: "趣味", href: "/about#hobby" },
      imageClassName: "p-14",
    },
  ];

  return (
    <div className="mx-3 sm:mx-4 md:mx-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-[var(--cover-glass-bg)] backdrop-blur-xl backdrop-saturate-150 ring-1 ring-[var(--glass-border)] shadow-lg shadow-black/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative w-full aspect-[2/1] bg-white/5 dark:bg-black/5 overflow-hidden border-b border-[var(--glass-border)]">
            {item.image?.src && (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt ?? item.title}
                        fill
                    className={`object-contain transition-transform duration-500 group-hover:scale-105 ${item.imageClassName || "p-8"}`}
                        priority={false}
                        unoptimized={item.image.src.toLowerCase().endsWith('.svg')}
                      />
                )}
                    </div>
            <div className="flex flex-col flex-1 p-5">
              <div className="flex-1 space-y-3">
                <h3 className="font-bold text-lg leading-tight text-[var(--cover-foreground)] transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-[var(--cover-foreground)]/80 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-[var(--glass-border)] flex items-center justify-end">
              {item.cta?.href && (
                  <Link 
                    href={item.cta.href} 
                    className="inline-flex items-center text-sm font-semibold text-[var(--cover-foreground)]/90 hover:text-[var(--cover-foreground)] transition-colors"
                  >
                    {item.cta.label ?? "詳しく"}
                    <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
              )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
