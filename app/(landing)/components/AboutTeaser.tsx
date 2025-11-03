import Image from "next/image";
import Link from "next/link";
import { aboutData } from "@/lib/about/data";

export default function AboutTeaser() {
  return (
    <section className="mt-10 sm:mt-12 md:mt-14">
      <div className="mx-3 sm:mx-4 md:mx-6">
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-[var(--glass-border)] backdrop-blur-xl backdrop-saturate-150 bg-[var(--glass-bg)]">
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[auto,1fr] items-center">
            <div className="rounded-full overflow-hidden ring-2 ring-[var(--glass-border)] size-20 sm:size-24">
              <Image src="/taku.jpg" alt="プロフィール画像" width={192} height={192} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                {aboutData.name} / {aboutData.role}
              </h3>
              <p className="mt-2 text-[var(--muted-foreground)] text-sm sm:text-base">
                {aboutData.intro}
              </p>

              <div className="mt-3 text-xs sm:text-sm text-[var(--muted-foreground)]">
                <span className="font-medium text-[var(--foreground)]">Skills: </span>
                {[...aboutData.skills.frameworks.slice(0, 3), ...aboutData.skills.languages.slice(0, 2)].join(" / ")}
              </div>

              <div className="mt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors"
                  aria-label="aboutページへ"
                >
                  もっと見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

