"use client";
import { Github, Twitter, Instagram, BookOpen, FileText, ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image";

// Custom Icon Components for SVG assets
const XIcon = ({ className }: { className?: string }) => (
  <div className={cn("relative w-6 h-6", className)}>
    <Image 
      src="/icons/x.svg" 
      alt="X" 
      fill 
      className="object-contain dark:invert" 
    />
  </div>
);

const links = [
  { 
    title: "GitHub", 
    href: "https://github.com/TKMhub", 
    Icon: Github,
    description: "ソースコード・開発履歴",
    colorClass: "group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-900/20 dark:group-hover:border-white/20",
    bgClass: "group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
  },
  { 
    title: "X", 
    href: "https://x.com/", 
    Icon: XIcon,
    description: "最新情報・つぶやき",
    colorClass: "group-hover:text-black dark:group-hover:text-white group-hover:border-black/20 dark:group-hover:border-white/20",
    bgClass: "group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
  },
  { 
    title: "Instagram", 
    href: "https://instagram.com/", 
    Icon: Instagram,
    description: "写真・ライフスタイル",
    colorClass: "group-hover:text-pink-600 group-hover:border-pink-500/20",
    bgClass: "group-hover:bg-pink-50 dark:group-hover:bg-pink-950/30"
  },
  { 
    title: "Qiita", 
    href: "https://qiita.com/", 
    Icon: BookOpen,
    description: "技術記事・ナレッジ共有",
    colorClass: "group-hover:text-green-600 group-hover:border-green-500/20",
    bgClass: "group-hover:bg-green-50 dark:group-hover:bg-green-950/30"
  },
  { 
    title: "Zenn", 
    href: "https://zenn.dev/", 
    Icon: FileText,
    description: "技術スクラップ・知見",
    colorClass: "group-hover:text-blue-500 group-hover:border-blue-400/20",
    bgClass: "group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30"
  },
];

export default function LinkPage() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 w-full">
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Links
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            SNSや技術系アカウントなど、Simploの活動拠点をまとめています。
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative flex flex-col p-6 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5",
                link.colorClass
              )}
            >
              <div className={cn(
                "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                link.bgClass,
                "group-hover:opacity-100"
              )} />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className={cn(
                  "p-3 rounded-xl bg-muted/50 transition-colors duration-300 flex items-center justify-center w-12 h-12",
                  "group-hover:bg-background/80"
                )}>
                  <link.Icon className="w-6 h-6" />
                </div>
                <ExternalLink className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-50 group-hover:translate-x-0" />
              </div>

              <div className="relative z-10 mt-4 space-y-1">
                <h2 className="font-bold text-lg">{link.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
