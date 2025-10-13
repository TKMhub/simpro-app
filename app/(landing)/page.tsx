import HeroSection from "./components/HeroSection";

export default function LandingPage() {
  return (
    <main>
      <HeroSection
        // 画像は public/ に配置してください。無い場合は下記「ダミー代替案」を参照
        brandLogoSrc="/Simplo_gray_main_sub.svg"
        brandLogoAlt="Simplo"
        bannerText="プログラミング / エンジニア / 日常 / 転職"
        avatarSrc="/avatar.svg"
        avatarAlt="taku"
        name="taku"
        handle="@taku"
        tagline="Webの修行中 / 個人開発奮闘中 / ベンチプレス110kg / Reactの 先生"
        socials={[
          { type: "x", href: "https://x.com/", label: "X", iconSrc: "/icons/x.svg" },
          { type: "instagram", href: "https://instagram.com/", label: "Instagram", iconSrc: "/icons/instagram.svg" },
          { type: "youtube", href: "https://youtube.com/", label: "YouTube", iconSrc: "/icons/youtube.svg" },
          { type: "tiktok", href: "https://tiktok.com/", label: "TikTok", iconSrc: "/icons/tiktok.svg" },
        ]}
        // gradient を差し替えたい場合は以下のように指定
        // gradient={{ from: "from-pink-200", via: "via-slate-300", to: "to-sky-600" }}
      />
    </main>
  );
}
