"use client";

import { useEffect, useState } from "react";

function setHtmlDarkClass(enabled: boolean) {
  const root = document.documentElement;
  if (enabled) root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize from localStorage or system preference
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ? stored === "dark" : prefersDark;
    setIsDark(initial);
  }, []);

  useEffect(() => {
    if (isDark === null) return;
    setHtmlDarkClass(isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {}
  }, [isDark]);

  if (isDark === null) {
    return (
      <button
        aria-label="Toggle theme"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-transparent text-[var(--foreground)]/70"
        disabled
      />
    );
  }

  return (
    <button
      onClick={() => setIsDark((v) => !v)}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light" : "Switch to dark"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-transparent text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--hover-surface)] transition-colors"
    >
      {isDark ? (
        // Sun icon
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        // Moon icon
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
        </svg>
      )}
    </button>
  );
}

