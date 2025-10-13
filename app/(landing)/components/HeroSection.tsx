"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, Globe, Instagram, Twitter, Youtube } from "lucide-react";

export type SocialLink = {
  type: "instagram" | "blog" | "x" | "github" | "youtube" | "tiktok";
  href: string;
  label?: string;
  iconSrc?: string; // 画像ロゴ（優先表示）
};

export type HeroSectionProps = {
  brandLogoSrc?: string;
  brandLogoAlt?: string;
  bannerText?: string;
  avatarSrc: string;
  avatarAlt: string;
  name: string;
  handle?: string;
  tagline: string;
  socials?: SocialLink[];
};

// 互換用（未使用だが型の互換を保つ）
const defaultGradient = { from: "", via: "", to: "" };

// SNS アイコンを種類に応じて返す
function SocialIcon({ type, className }: { type: SocialLink["type"]; className?: string }) {
  switch (type) {
    case "instagram":
      return <Instagram aria-hidden className={className} />;
    case "blog":
      return <Globe aria-hidden className={className} />;
    case "x":
      // lucide-react の Twitter アイコンを X として使用
      return <Twitter aria-hidden className={className} />;
    case "github":
      return <Github aria-hidden className={className} />;
    case "youtube":
      return <Youtube aria-hidden className={className} />;
    case "tiktok":
      return <Globe aria-hidden className={className} />; // 代替
  }
}

export default function HeroSection(props: HeroSectionProps) {
  const {
    brandLogoSrc = "/brand.svg",
    brandLogoAlt = "Brand",
    bannerText,
    avatarSrc,
    avatarAlt,
    name,
    handle,
    tagline,
    socials = [],
  } = props;
  return (
    <section className="relative w-full py-8 sm:py-10 md:py-12">
      {/* 統一左右余白 */}
      <div className="mx-3 sm:mx-4 md:mx-6">
        {/* 1) カバー（すりガラス＋ダーク/ライト切替） */}
        <div
          className={cn(
            "relative rounded-3xl",
            // 縦長に調整
            "h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px]",
            // すりガラス
            "backdrop-blur-xl backdrop-saturate-150",
            // カバー色はテーマに依存（light=黒ガラス / dark=白ガラス）
            "bg-[var(--cover-glass-bg)] ring-1 ring-[color:var(--glass-border)] shadow-xl shadow-black/10",
          )}
        >
          <div className="absolute left-4 top-4 sm:left-5 sm:top-5 md:left-6 md:top-6">
            {/* ブランドロゴ（サイズアップ） */}
            <Image
              src={brandLogoSrc}
              alt={brandLogoAlt}
              width={240}
              height={64}
              className="h-10 sm:h-12 md:h-14 w-auto"
              priority={false}
            />
            {/* バナー説明文（背景に応じた文字色） */}
            {bannerText && (
              <p className="mt-3 text-sm sm:text-base md:text-lg text-[var(--cover-foreground)]">
                {bannerText}
              </p>
            )}
          </div>
        </div>

        {/* 2) アバター + テキスト（横並びで横幅いっぱい） */}
        <div className="mt-6 sm:mt-7 md:mt-8 flex items-start gap-5 sm:gap-6 md:gap-8 w-full">
          {/* アバター（画像置換想定） */}
          <div
            className={cn(
              "size-28 sm:size-32 md:size-36 lg:size-40 rounded-full overflow-hidden",
              "ring-4 ring-[color:var(--glass-border)] shadow-2xl"
            )}
          >
            <Image
              src={avatarSrc}
              alt={avatarAlt}
              width={400}
              height={400}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          {/* テキストブロック */}
          <div className="flex-1 min-w-0">
            {/* タイトル */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--foreground)]">
              {name}
            </h1>
            {/* ハンドル + タグライン */}
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-3">
              {handle && (
                <span className="text-base sm:text-lg md:text-xl font-semibold text-[var(--foreground)]">
                  {handle}
                </span>
              )}
              <span className="text-sm sm:text-base md:text-lg text-[var(--muted-foreground)]">{tagline}</span>
            </div>

            {/* SNS 行（X/Instagram/YouTube/TikTok） */}
            {socials.length > 0 && (
              <ul className="mt-5 flex items-center gap-4 sm:gap-5">
                {socials.map((s, i) => (
                  <li key={`${s.type}-${i}`}>
                    <Link
                      href={s.href}
                      aria-label={s.label ?? s.type}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full p-2 hover:bg-[var(--hover-surface)] transition focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:outline-none"
                    >
                      {s.iconSrc ? (
                        <Image
                          src={s.iconSrc}
                          alt={s.label ?? s.type}
                          width={32}
                          height={32}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        />
                      ) : (
                        <SocialIcon
                          type={s.type}
                          className="size-7 sm:size-8 text-[var(--foreground)]"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
