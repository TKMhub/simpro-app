"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, Globe, Instagram, Twitter } from "lucide-react";

export type SocialLink = {
  type: "instagram" | "blog" | "x" | "github";
  href: string;
  label?: string;
};

export type HeroSectionProps = {
  brandLogoSrc?: string; // 例: "/brand.svg"
  brandLogoAlt?: string; // 例: "ShiftB"
  gradient?: { from: string; via?: string; to: string }; // Tailwind の任意色クラス
  avatarSrc: string; // 例: "/avatar.png"
  avatarAlt: string; // 例: "ぶべ"
  name: string; // 例: "ぶべ"
  tagline: string; // 例: "Webの修行中 ..."
  socials?: SocialLink[]; // 表示順は配列順
};

// デフォルトの斜めグラデーション（ピンク → パープルグレー → ブルー）
const defaultGradient = {
  from: "from-[#e6b3c2]",
  via: "via-[#9aa6b2]",
  to: "to-[#1e80b6]",
};

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
  }
}

export default function HeroSection(props: HeroSectionProps) {
  const {
    brandLogoSrc = "/brand.svg",
    brandLogoAlt = "Brand",
    gradient = defaultGradient,
    avatarSrc,
    avatarAlt,
    name,
    tagline,
    socials = [],
  } = props;

  const bannerHeights = "h-[320px] sm:h-[360px] md:h-[400px]"; // 指定どおり
  const avatarSizes = "size-[144px] sm:size-[160px] md:size-[176px]"; // 直径
  const avatarHalfSpacer = "h-[72px] sm:h-[80px] md:h-[88px]"; // アバター半分の高さ

  return (
    <section className="relative w-full">
      {/* トップ・バナー（斜めグラデーション） */}
      <div
        className={cn(
          "relative w-full overflow-hidden",
          "rounded-none", // 画面幅いっぱい
          bannerHeights,
          // 斜め方向のグラデーション（右上方向）
          "bg-gradient-to-tr",
          gradient.from,
          gradient.via,
          gradient.to,
          // ダーク時は彩度を少し落とすオーバーレイ（ブルー系トーン）
          "after:content-[''] after:absolute after:inset-0 after:pointer-events-none",
          "dark:after:bg-blue-950/20 dark:after:mix-blend-multiply"
        )}
      >
        {/* 左上のブランドロゴ */}
        <div className="absolute left-4 top-4">
          <Image
            src={brandLogoSrc}
            alt={brandLogoAlt}
            width={120}
            height={32}
            className="h-7 sm:h-8 w-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]"
            priority={false}
          />
        </div>

        {/* バナー下端中央にアバターを半分重ねる */}
        <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-1/2">
          <div
            className={cn(
              "rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-lg shadow-black/5",
              avatarSizes
            )}
          >
            <Image
              src={avatarSrc}
              alt={avatarAlt}
              width={352}
              height={352}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* アバター分のスペーサー（半分） */}
      <div aria-hidden className={cn("w-full", avatarHalfSpacer)} />

      {/* 本文（中央揃え） */}
      <div className="px-6 sm:px-8">
        <div className="mx-auto max-w-screen-md text-center">
          {/* 名前 */}
          <h1 className="font-bold tracking-tight text-3xl sm:text-4xl">{name}</h1>

          {/* 肩書き / タグライン */}
          <p className="mx-auto mt-3 max-w-prose text-balance text-muted-foreground">
            {tagline}
          </p>

          {/* SNS リンク列 */}
          {socials.length > 0 && (
            <ul className="mt-6 flex items-center justify-center gap-5 sm:gap-6">
              {socials.map((s, i) => (
                <li key={`${s.type}-${i}`}>
                  <Link
                    href={s.href}
                    aria-label={s.label ?? s.type}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group inline-flex items-center justify-center rounded-full",
                      "transition-transform duration-150 will-change-transform",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
                      "focus-visible:ring-offset-[var(--background)]",
                      "hover:scale-105"
                    )}
                  >
                    <SocialIcon
                      type={s.type}
                      className={cn(
                        "size-6 sm:size-7 text-foreground/80 transition-opacity",
                        "group-hover:opacity-90"
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* バナー下に白背景領域が続く想定 → セクション全体背景は body 背景に合わせる */}
    </section>
  );
}

