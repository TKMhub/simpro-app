"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu as MenuIcon } from "lucide-react";

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
      <div className="mx-auto max-w-6xl px-3 sm:px-6 mt-3 sm:mt-5">
        <div
          className={[
            "flex items-center gap-3 sm:gap-4 py-1.5 sm:py-2 px-4 sm:px-6 md:px-8 rounded-xl transition-all duration-500",
            "backdrop-blur-lg border-[var(--glass-border)]",
            // --- 背景色：スクロール状況とテーマで変化（青を強調） ---
            scrolled
            //スクロール時
            ? "bg-gradient-to-r bg-blue-700/20 to-gray-700/20"
            //スクロールなしの場合
            : "bg-gradient-to-r bg-blue-700/20 to-gray-700/20"  ].join(" ")}
        >
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 px-2 sm:px-4 py-2 shrink-0">
            <Image
              src="/Simplo_gray_main_sub.svg"
              alt="Logo"
              width={50}
              height={70}
              priority
            />
          </Link>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="sm:hidden ml-auto flex items-center gap-1.5">
            {/* Sun/Moon toggle (always visible on header) */}
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="メニューを開く">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] sm:max-w-sm">
                <SheetHeader className="p-0">
                  <SheetTitle className="sr-only">メニュー</SheetTitle>
                </SheetHeader>
                <div className="pt-2">
                  <nav>
                    <ul className="flex flex-col gap-1.5">
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/about"
                            className="block rounded-md px-3 py-2 text-base transition-colors hover:bg-white/50 hover:text-neutral-950"
                          >
                            about
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/blog"
                            className="block rounded-md px-3 py-2 text-base transition-colors hover:bg-white/50 hover:text-neutral-950"
                          >
                            blog
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/product"
                            className="block rounded-md px-3 py-2 text-base transition-colors hover:bg-white/50 hover:text-neutral-950"
                          >
                            product
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/link"
                            className="block rounded-md px-3 py-2 text-base transition-colors hover:bg-white/50 hover:text-neutral-950"
                          >
                            link
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                  </nav>
                  <div className="mt-3 hidden">
                    {/* Toggle remains in header; keep this hidden to avoid duplication */}
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center: Search */}
          <div className="hidden md:block flex-1 max-w-xl">
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
          <nav className="ml-auto pr-1 sm:pr-2 hidden sm:flex items-center gap-2">
            <ul className="flex items-center gap-2 sm:gap-3 md:gap-4 text-sm">
              <li>
                <Link
                  href="/about"
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                >
                  about
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                >
                  blog
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
                >
                  product
                </Link>
              </li>
              <li>
                <Link
                  href="/link"
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-[var(--hover-surface)] transition-colors"
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
