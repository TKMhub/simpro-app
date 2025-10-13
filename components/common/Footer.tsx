import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 sm:mt-16">
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 rounded-xl backdrop-blur-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-sm shadow-black/5"
        >
          <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">Simplo</span>
            <span aria-hidden>•</span>
            <span>© {year}</span>
          </div>

          <nav aria-label="フッターナビゲーション" className="order-last sm:order-none">
            <ul className="flex items-center gap-3 text-sm">
              <li>
                <Link href="/about" className="px-2 py-1.5 rounded-md hover:bg-[var(--hover-surface)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/link" className="px-2 py-1.5 rounded-md hover:bg-[var(--hover-surface)] transition-colors">
                  Links
                </Link>
              </li>
              <li>
                <Link href="/product" className="px-2 py-1.5 rounded-md hover:bg-[var(--hover-surface)] transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}

