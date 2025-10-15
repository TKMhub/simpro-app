import HeroSection from "./components/HeroSection";
import LandingSummary from "@/components/LandingSummary";
import { fetchSummaryData } from "@/lib/summaryData";

export default async function LandingPage() {
  const { sections, items } = await fetchSummaryData();
  return (
    <main>
      <HeroSection
        // 画像は public/ に配置してください。無い場合は下記「ダミー代替案」を参照
        brandLogoSrc="/Simplo_gray_main_sub.svg"
        brandLogoAlt="Simplo"
        bannerText="複雑な仕組みを“シンプルに使える形”に変換する。"
        avatarSrc="/avatar.svg"
        avatarAlt="taku"
        name="taku"
        handle="@taku"
        tagline="エンジニア / プログラミング / 個人開発 / コンサル / 読書 / 日常"
        socials={[
          { type: "x", href: "https://x.com/", label: "X" },
          { type: "instagram", href: "https://instagram.com/", label: "Instagram" },
          { type: "youtube", href: "https://youtube.com/", label: "YouTube" },
          { type: "tiktok", href: "https://tiktok.com/", label: "TikTok" },
        ]}
      />

      {/* Title area below: Channel Tabs + Summary Slider */}
      <LandingSummary sections={sections} items={items} />
    </main>
  );
}
