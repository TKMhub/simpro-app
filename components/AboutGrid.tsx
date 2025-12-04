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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:-translate-y-1">
            <div className="relative w-full aspect-[2/1] bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden border-b border-slate-100/50 dark:border-slate-800/50">
                {item.image?.src && (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt ?? item.title}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    priority={false}
                    unoptimized={item.image.src.toLowerCase().endsWith('.svg')}
                  />
                )}
            </div>
            <div className="flex flex-col flex-1 p-5">
              <div className="flex-1 space-y-3">
                <h3 className="font-bold text-lg leading-tight text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-end">
                {item.cta?.href && (
                  <Link 
                    href={item.cta.href} 
                    className="inline-flex items-center text-sm font-semibold text-blue-600/90 dark:text-blue-400/90 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
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
