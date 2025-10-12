"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastY.current;
          const threshold = 6;
          if (Math.abs(delta) > threshold) {
            if (delta > 0 && currentY > 64) {
              setHidden(true);
            } else {
              setHidden(false);
            }
          }
          lastY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-2">
        <div
          className={[
            "flex items-center gap-4 py-2 px-8 rounded-xl transition-all duration-500",
            "backdrop-blur-lg border-white/60 dark:border-white/50",
            // --- 背景色：スクロール状況とテーマで変化（青を強調） ---
            scrolled
            //スクロール時
            ? "bg-gradient-to-r bg-blue-700/20 to-gray-700/20"
            //スクロールなしの場合
            : "bg-gradient-to-r bg-blue-700/20 to-gray-700/20"  ].join(" ")}
        >
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 px-4 py-2 shrink-0">
            <Image
              src="/Simplo_gray_main_sub.svg"
              alt="Logo"
              width={50}
              height={70}
              priority
            />
          </Link>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl">
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <Input
              id="global-search"
              type="search"
              placeholder="Search..."
              className="h-9"
            />
          </div>

          {/* Right: Nav */}
          <nav className="ml-auto pr-2 flex items-center gap-2">
            <ul className="flex items-center gap-2 sm:gap-4 text-sm">
              <li>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                >
                  about
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="px-3 py-2 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                >
                  product
                </Link>
              </li>
              <li>
                <Link
                  href="/link"
                  className="px-3 py-2 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                >
                  link
                </Link>
              </li>
              <ThemeToggle />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
