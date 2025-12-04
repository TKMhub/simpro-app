"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function setHtmlDarkClass(enabled: boolean) {
  const root = document.documentElement;
  if (enabled) root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize from cookie, then localStorage (matches server and no-flash script)
    // System preference is intentionally ignored as per requirements
    let initial = false;
    try {
      if (typeof document !== "undefined") {
        const m = document.cookie.match(/(?:^|; )theme=([^;]+)/);
        const fromCookie = m ? decodeURIComponent(m[1]) : null;
        const fromLocal = localStorage.getItem("theme");
        const v = fromCookie || fromLocal;
        initial = v ? v === "dark" : false;
      }
    } catch {
      initial = false;
    }
    setIsDark(initial);
  }, []);

  useEffect(() => {
    if (isDark === null) return;
    setHtmlDarkClass(isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      // Mirror into cookie so SSR can render matching class
      const value = isDark ? "dark" : "light";
      // 1 year expiry
      document.cookie = `theme=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {
      // ignore write errors
    }
  }, [isDark]);

  if (isDark === null) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="w-9 h-9"
      >
        <span className="sr-only">Loading theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDark((v) => !v)}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light" : "Switch to dark"}
      className="w-9 h-9 transition-colors"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
