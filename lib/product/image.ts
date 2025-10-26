import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import nodePath from "path";
import { DEFAULT_HEADER_IMAGE } from "@/lib/blog/constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

/**
 * Resolve public URL for a product cover image.
 * - If `imgPath` is an absolute http(s) URL, return as is.
 * - If it starts with `/`, treat as a local public asset path.
 * - Otherwise, treat as a key in Supabase Storage bucket `product`.
 * - If not provided, fall back to `covers/{slug}.jpg` on the `product` bucket.
 */
export function getProductCoverPublicUrl({
  imgPath,
  slug,
}: {
  imgPath?: string | null;
  slug?: string;
}) {
  // Fallback: local default image
  const fallback = DEFAULT_HEADER_IMAGE;

  function normalizeUnsplashUrl(urlStr: string): string | null {
    try {
      const u = new URL(urlStr);
      if (u.hostname === "images.unsplash.com") return urlStr;
      if (u.hostname !== "unsplash.com") return null;
      const parts = u.pathname.split("/").filter(Boolean);
      let id = "";
      const photosIdx = parts.findIndex((p) => p === "photos");
      if (photosIdx >= 0 && parts[photosIdx + 1]) {
        id = parts[photosIdx + 1];
      } else {
        const last = parts[parts.length - 1] || "";
        const m = last.match(/-([A-Za-z0-9_-]{11})$/);
        if (m) id = m[1];
      }
      if (!id || id.length < 5) return null;
      const params = new URLSearchParams({ auto: "format", fit: "crop", w: "1600", q: "80" });
      return `https://images.unsplash.com/photo-${id}?${params.toString()}`;
    } catch {
      return null;
    }
  }

  // 1) no path -> try slug based default in storage
  if (!imgPath && slug) {
    const { data } = supabase.storage
      .from("product")
      .getPublicUrl(`covers/${slug}.jpg`);
    return data.publicUrl || fallback;
  }

  if (!imgPath) return fallback;

  // 2) absolute URL
  if (/^https?:\/\//i.test(imgPath)) {
    const normalized = normalizeUnsplashUrl(imgPath);
    if (normalized) return normalized;
    try {
      const u = new URL(imgPath);
      if (u.hostname === "unsplash.com") return fallback;
    } catch {}
    return imgPath;
  }

  // 3) local public path
  if (imgPath.startsWith("/")) {
    // Prefer .svg if exists alongside .png/.jpg
    const ext = nodePath.extname(imgPath).toLowerCase();
    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      const svgCandidate = imgPath.replace(/\.(png|jpg|jpeg)$/i, ".svg");
      const abs = nodePath.join(process.cwd(), "public", svgCandidate.replace(/^\//, ""));
      if (fs.existsSync(abs)) return svgCandidate;
    }
    return imgPath;
  }

  // 4) storage key in `product` bucket
  const { data } = supabase.storage.from("product").getPublicUrl(imgPath);
  return data.publicUrl || fallback;
}
