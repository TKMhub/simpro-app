"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, Globe, Instagram, Twitter, Youtube } from "lucide-react";
import { SiTiktok } from "react-icons/si";

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

// SNS アイコンを種類に応じて返す（lucide-react + fallback for TikTok）
function SocialIcon({ type, className }: { type: SocialLink["type"]; className?: string }) {
  switch (type) {
    case "instagram":
      return <Instagram aria-hidden className={className} />;
    case "blog":
      return <Globe aria-hidden className={className} />;
    case "x":
      return <Twitter aria-hidden className={className} />;
    case "github":
      return <Github aria-hidden className={className} />;
    case "youtube":
      return <Youtube aria-hidden className={className} />;
    case "tiktok":
      // lucide-react に TikTok のブランドアイコンは無いため react-icons を使用
      return <SiTiktok aria-hidden className={className} />;
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
    <section className="relative w-full py-4 sm:py-5 md:py-6">
      {/* 統一左右余白 */}
      <div className="mx-3 sm:mx-4 md:mx-6">
        {/* 1) カバー（すりガラス＋ダーク/ライト切替） */}
        <div
          className={cn(
            "relative rounded-3xl",
            // 縦長に調整
            "h-[220px] sm:h-[260px] md:h-[320px]",
            // すりガラス
            "backdrop-blur-xl backdrop-saturate-150",
            // カバー色はテーマに依存（light=黒ガラス / dark=白ガラス）
            "bg-[var(--cover-glass-bg)] ring-1 ring-[var(--glass-border)] shadow-xl shadow-black/10",
          )}
        >
          {/* 流星群（PCのみ・右側領域） 自然で中央へ向かう動き */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            <div className="absolute right-0 top-0 bottom-0 w-[72%] overflow-hidden">
              {/* 上層: 画面上半分 → 中央へ（下向き成分） */}
              <span className="meteor" style={{ top: '6%',  left: '98%', ...( { ['--dur']: '2.0s', ['--delay']: '-0.8s', ['--trail']: '340px', ['--size']: '3.5px', ['--dx']: '-900px', ['--dy']: '240px', ['--angle']: '-18deg', ['--color']: '#1d4ed8' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '12%', left: '99%', ...( { ['--dur']: '2.1s', ['--delay']: '-0.3s', ['--trail']: '320px', ['--size']: '2.0px', ['--dx']: '-1000px', ['--dy']: '220px', ['--angle']: '-15deg', ['--color']: '#374151' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '18%', left: '94%', ...( { ['--dur']: '2.2s', ['--delay']: '0.2s',  ['--trail']: '300px', ['--size']: '2.5px', ['--dx']: '-980px', ['--dy']: '200px', ['--angle']: '-16deg', ['--color']: '#ffffff' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '24%', left: '95%', ...( { ['--dur']: '2.5s', ['--delay']: '0.9s',  ['--trail']: '280px', ['--size']: '1.8px', ['--dx']: '-950px', ['--dy']: '180px', ['--angle']: '-12deg', ['--color']: '#1d4ed8' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '30%', left: '96%', ...( { ['--dur']: '2.4s', ['--delay']: '-1.1s', ['--trail']: '320px', ['--size']: '3.0px', ['--dx']: '-990px', ['--dy']: '160px', ['--angle']: '-14deg', ['--color']: '#374151' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '40%', left: '92%', ...( { ['--dur']: '2.6s', ['--delay']: '0.8s',  ['--trail']: '260px', ['--size']: '2.2px', ['--dx']: '-920px', ['--dy']: '110px', ['--angle']: '-12deg', ['--color']: '#ffffff' } as React.CSSProperties ) }} />

              {/* 中央層: 中央帯を横断（ほぼ水平） */}
              <span className="meteor" style={{ top: '48%', left: '97%', ...( { ['--dur']: '1.9s', ['--delay']: '-0.6s', ['--trail']: '360px', ['--size']: '4px',   ['--dx']: '-1000px', ['--dy']: '0px',   ['--angle']: '-8deg', ['--color']: '#ffffff' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '50%', left: '99%', ...( { ['--dur']: '2.0s', ['--delay']: '0.1s',  ['--trail']: '340px', ['--size']: '2.5px', ['--dx']: '-1100px', ['--dy']: '0px',   ['--angle']: '-8deg', ['--color']: '#1d4ed8' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '52%', left: '93%', ...( { ['--dur']: '2.1s', ['--delay']: '0.5s',  ['--trail']: '300px', ['--size']: '2px',   ['--dx']: '-920px',  ['--dy']: '0px',   ['--angle']: '-8deg', ['--color']: '#374151' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '55%', left: '95%', ...( { ['--dur']: '2.3s', ['--delay']: '-1.2s', ['--trail']: '300px', ['--size']: '1.6px', ['--dx']: '-980px',  ['--dy']: '0px',   ['--angle']: '-6deg', ['--color']: '#1d4ed8' } as React.CSSProperties ) }} />

              {/* 下層: 画面下半分 → 中央へ（上向き成分） */}
              <span className="meteor" style={{ top: '62%', left: '96%', ...( { ['--dur']: '2.3s', ['--delay']: '-1.0s', ['--trail']: '320px', ['--size']: '3px',   ['--dx']: '-980px',  ['--dy']: '-160px', ['--angle']: '-6deg',  ['--color']: '#ffffff' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '68%', left: '99%', ...( { ['--dur']: '2.4s', ['--delay']: '1.1s',  ['--trail']: '320px', ['--size']: '2.4px', ['--dx']: '-1040px', ['--dy']: '-180px', ['--angle']: '-8deg',  ['--color']: '#1d4ed8' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '74%', left: '94%', ...( { ['--dur']: '2.5s', ['--delay']: '0.4s',  ['--trail']: '280px', ['--size']: '2px',   ['--dx']: '-900px',  ['--dy']: '-220px', ['--angle']: '-10deg', ['--color']: '#374151' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '80%', left: '96%', ...( { ['--dur']: '2.6s', ['--delay']: '0.9s',  ['--trail']: '300px', ['--size']: '1.7px', ['--dx']: '-960px',  ['--dy']: '-200px', ['--angle']: '-12deg', ['--color']: '#ffffff' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '86%', left: '98%', ...( { ['--dur']: '2.7s', ['--delay']: '-1.4s', ['--trail']: '320px', ['--size']: '3.2px', ['--dx']: '-1020px', ['--dy']: '-260px', ['--angle']: '-12deg', ['--color']: '#1d4ed8' } as React.CSSProperties ) }} />

              {/* アクセント: ごく薄いブルー */}
              <span className="meteor" style={{ top: '36%', left: '99%', ...( { ['--dur']: '2.2s', ['--delay']: '-0.9s', ['--trail']: '320px', ['--size']: '3.5px', ['--dx']: '-980px',  ['--dy']: '140px',  ['--angle']: '-14deg', ['--color']: '#1d4ed8', ['--opacity']: '0.95' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '40%', left: '98%', ...( { ['--dur']: '2.2s', ['--delay']: '0.7s',  ['--trail']: '320px', ['--size']: '2.8px', ['--dx']: '-1040px', ['--dy']: '120px',  ['--angle']: '-12deg', ['--color']: '#1d4ed8', ['--opacity']: '0.95' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '68%', left: '97%', ...( { ['--dur']: '2.4s', ['--delay']: '0.6s',  ['--trail']: '320px', ['--size']: '3.0px', ['--dx']: '-980px',  ['--dy']: '-140px', ['--angle']: '-10deg', ['--color']: '#1d4ed8', ['--opacity']: '0.92' } as React.CSSProperties ) }} />

              {/* ヒーロー流星（大きめの個体） */}
              <span className="meteor" style={{ top: '22%', left: '100%', ...( { ['--dur']: '1.8s', ['--delay']: '-0.5s', ['--trail']: '420px', ['--size']: '5.5px', ['--dx']: '-1200px', ['--dy']: '180px', ['--angle']: '-12deg', ['--opacity']: '0.9',  ['--color']: '#1d4ed8' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '48%', left: '100%', ...( { ['--dur']: '2.0s', ['--delay']: '-1.0s', ['--trail']: '460px', ['--size']: '6px',   ['--dx']: '-1400px', ['--dy']: '0px',   ['--angle']: '-8deg',  ['--opacity']: '0.88', ['--color']: '#ffffff' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '76%', left: '99%',  ...( { ['--dur']: '1.9s', ['--delay']: '0.3s',  ['--trail']: '400px', ['--size']: '4.5px', ['--dx']: '-1250px', ['--dy']: '-200px', ['--angle']: '-10deg', ['--opacity']: '0.9',  ['--color']: '#374151' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '30%', left: '100%', ...( { ['--dur']: '1.8s', ['--delay']: '-0.5s', ['--trail']: '420px', ['--size']: '5.5px', ['--dx']: '-1200px', ['--dy']: '180px', ['--angle']: '-12deg', ['--opacity']: '0.9',  ['--color']: '#1d4ed8' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '50%', left: '100%', ...( { ['--dur']: '2.0s', ['--delay']: '-1.0s', ['--trail']: '460px', ['--size']: '6px',   ['--dx']: '-1400px', ['--dy']: '0px',   ['--angle']: '-8deg',  ['--opacity']: '0.88', ['--color']: '#ffffff' } as React.CSSProperties ) }} />
              <span className="meteor" style={{ top: '90%', left: '99%',  ...( { ['--dur']: '1.9s', ['--delay']: '0.3s',  ['--trail']: '400px', ['--size']: '4.5px', ['--dx']: '-1250px', ['--dy']: '-200px', ['--angle']: '-10deg', ['--opacity']: '0.9',  ['--color']: '#374151' } as React.CSSProperties ) }} />
            </div>
          </div>
          <div className="absolute left-5 top-8 sm:left-16 sm:top-10 md:left-20 md:top-10">
            {/* ブランドロゴ（サイズアップ） */}
            <Image
              src={brandLogoSrc}
              alt={brandLogoAlt}
              width={1000}
              height={1000}
              className="h-12 sm:h-20 md:h-30 w-auto"
              priority={false}
            />
            {/* バナー説明文（背景に応じた文字色） */}
            {bannerText && (
              <p className="mt-4 text-base sm:text-lg md:text-xl font-medium text-[var(--cover-foreground)]">
                {bannerText}
              </p>
            )}
          </div>
        </div>

        {/* 2) アバター + テキスト（横並びで横幅いっぱい） */}
        <div className="mt-6 sm:mt-10 md:mt-10 flex items-start gap-5 sm:gap-6 md:gap-8 w-full">
          {/* アバター（画像置換想定） */}
          <div
            className={cn(
              "sm:mx-10 md:mx-20 size-20 sm:size-32 md:size-40 lg:size-40 rounded-full overflow-hidden",
              "ring-4 ring-[var(--glass-border)] shadow-2xl"
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
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--foreground)]">
              {name}
            </h1>
            {/* ハンドル + タグライン */}
            <div className="my-3 flex flex-col sm:flex-row sm:items-center sm:gap-3">
              {handle && (
                <span className="text-base sm:text-lg md:text-xl font-semibold text-[var(--foreground)]">
                  {handle}
                </span>
              )}
              <span className="text-sm sm:text-base md:text-lg text-[var(--muted-foreground)]">{tagline}</span>
            </div>

            {/* SNS 行（X/Instagram/YouTube/TikTok） */}
            {socials.length > 0 && (
              <ul className="flex items-center gap-4 sm:gap-5">
                {socials.map((s, i) => (
                  <li key={`${s.type}-${i}`}>
                    <Link
                      href={s.href}
                      aria-label={s.label ?? s.type}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* 背景にブランド風グラデ、アイコンは白（lucide） */}
                      <span
                        className={cn(
                          "inline-flex items-center justify-center rounded-full p-2",
                          s.type === 'instagram' && 'bg-[radial-gradient(30%_130%_at_30%_107%,#feda75_0%,#fa7e1e_25%,#d62976_50%,#962fbf_75%,#4f5bd5_100%)]',
                          s.type === 'x'         && 'bg-gradient-to-br from-slate-700 to-black',
                          s.type === 'youtube'   && 'bg-gradient-to-br from-red-500 to-red-700',
                          s.type === 'tiktok'    && 'bg-gradient-to-br from-cyan-400 to-fuchsia-500',
                          s.type === 'blog'      && 'bg-gradient-to-br from-emerald-400 to-sky-500'
                        )}
                      >
                        <SocialIcon type={s.type} className="size-5 sm:size-6 text-white" />
                      </span>
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
