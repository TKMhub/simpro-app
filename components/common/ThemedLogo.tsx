"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemedLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  forceTheme?: "light" | "dark";
}

/**
 * Automatically switches between light/dark mode logos based on current theme.
 * Light mode (and light backgrounds) -> Simplo_gray_main_sub.svg
 * Dark mode (and dark backgrounds) -> Simplo_white_blue.svg
 * 
 * @param forceTheme - If set, forces the logo to display as if in that theme (e.g. "dark" for dark backgrounds in light mode)
 */
export default function ThemedLogo({ 
  className,
  width = 50,
  height = 70,
  priority = false,
  forceTheme
}: ThemedLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // If forcing theme, we can render the correct one immediately server-side if needed (but theme provider handles it)
    // For hydration mismatch prevention with next-themes, we usually wait for mount.
    // But if forceTheme is set, we technically know which one to show.
    if (forceTheme === "dark") {
        return (
            <Image
                src="/Simplo_white_blue.svg"
                alt="Simplo Logo"
                width={width}
                height={height}
                className={className}
                priority={priority}
            />
        );
    }
    if (forceTheme === "light") {
        return (
            <Image
                src="/Simplo_gray_main_sub.svg"
                alt="Simplo Logo"
                width={width}
                height={height}
                className={className}
                priority={priority}
            />
        );
    }

    // Default to invisible placeholder to avoid flash
    return (
      <Image
        src="/Simplo_gray_main_sub.svg"
        alt="Simplo Logo"
        width={width}
        height={height}
        className={cn("opacity-0", className)} 
        priority={priority}
      />
    );
  }

  const currentTheme = forceTheme || resolvedTheme;
  const isDark = currentTheme === "dark";

  return (
    <>
      <Image
        src="/Simplo_gray_main_sub.svg"
        alt="Simplo Logo"
        width={width}
        height={height}
        className={cn(isDark ? "hidden" : "block", className)}
        priority={priority}
      />
      <Image
        src="/Simplo_white_blue.svg"
        alt="Simplo Logo"
        width={width}
        height={height}
        className={cn(isDark ? "block" : "hidden", className)}
        priority={priority}
      />
    </>
  );
}
