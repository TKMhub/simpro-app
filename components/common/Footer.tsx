import Link from "next/link";
import { getAllTags } from "@/lib/blogData";

export default function Footer() {
  const year = new Date().getFullYear();
  const topics = getAllTags();
  return (
    <footer className="my-5 sm:mt-16">
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className=" flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 rounded-xl backdrop-blur-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-sm shadow-black/5">
          <div className="flex justify-between">
            <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <span className="font-medium text-[var(--foreground)]">
                Simplo
              </span>
              <span aria-hidden>-</span>
              <span>@ {year}</span>
            </div>

            <nav
              aria-label="フッターナビゲーション"
              className="order-last sm:order-none"
            >
              <ul className="flex items-center gap-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="px-2 py-1.5 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                  >
                    about
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="px-2 py-1.5 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                  >
                    blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product"
                    className="px-2 py-1.5 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                  >
                    product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/link"
                    className="px-2 py-1.5 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                  >
                    link
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* Topics from existing content (frosted card) */}
          {topics.length > 0 && (
            <div className="mt-3">
              <span className="uppercase tracking-wide">Topics</span>
              <nav aria-label="トピック一覧">
                <ul className="flex flex-wrap gap-1.5">
                  {topics.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={{ pathname: "/blog", query: { tag } }}
                        className="inline-block rounded-md border border-[var(--glass-border)] px-2.5 py-1 text-xs hover:bg-[var(--hover-surface)] transition-colors"
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
