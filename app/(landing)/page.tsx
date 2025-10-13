import HeroSection from "./components/HeroSection";

export default function LandingPage() {
  return (
    <main>
      <HeroSection
        // 画像は public/ に配置してください。無い場合は下記「ダミー代替案」を参照
        brandLogoSrc="/Simplo_gray_main_sub.svg"
        brandLogoAlt="Simplo"
        avatarSrc="/avatar.svg"
        avatarAlt="taku"
        name="taku"
        tagline="Webの修行中 / 個人開発奮闘中 / ベンチプレス110kg / Reactの 先生"
        socials={[
          { type: "instagram", href: "https://instagram.com/", label: "Instagram" },
          { type: "blog", href: "https://example.com/blog", label: "Blog" },
          { type: "x", href: "https://x.com/", label: "X" },
          { type: "github", href: "https://github.com/", label: "GitHub" },
        ]}
        // gradient を差し替えたい場合は以下のように指定
        // gradient={{ from: "from-pink-200", via: "via-slate-300", to: "to-sky-600" }}
      />
    </main>
  );
}
