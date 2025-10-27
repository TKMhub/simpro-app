import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import nodePath from "path";
import { DEFAULT_HEADER_IMAGE } from "./constants";

// Lazily initialize Supabase to avoid build-time crashes when env is absent
let _sb: any | null = null;
function getSupabase() {
  if (_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _sb = createClient(url, key);
  return _sb;
}

function normalizeUnsplashUrl(urlStr: string): string | null {
  try {
    const u = new URL(urlStr);
    if (!/\.unsplash\.com$/.test(u.hostname) && u.hostname !== "unsplash.com") return null;

    // Already the images CDN
    if (u.hostname === "images.unsplash.com") return urlStr;

    // Page URL -> extract id
    // Examples:
    // - https://unsplash.com/photos/Lks7vei-eAg
    // - https://unsplash.com/ja/%E5%86%99%E7%9C%9F/man-using-macbook-Lks7vei-eAg
    // - https://unsplash.com/photos/Lks7vei-eAg/download
    const parts = u.pathname.split("/").filter(Boolean);
    let id = "";
    const photosIdx = parts.findIndex((p) => p === "photos");
    if (photosIdx >= 0 && parts[photosIdx + 1]) {
      id = parts[photosIdx + 1];
    } else {
      const last = parts[parts.length - 1] || "";
      // Match ...-<11chars> at end where 11 chars may include '-'
      const m = last.match(/-([A-Za-z0-9_-]{11})$/);
      if (m) id = m[1];
    }
    // Basic sanity
    if (!id || id.length < 5) return null;

    const params = new URLSearchParams({ auto: "format", fit: "crop", w: "1600", q: "80" });
    return `https://images.unsplash.com/photo-${id}?${params.toString()}`;
  } catch {
    return null;
  }
}

export async function resolveHeaderImageUrl(imgPath?: string | null) {
  // 未設定ならデフォルト
  if (!imgPath) return DEFAULT_HEADER_IMAGE;

  // すでに絶対URLなら、UnsplashページURLは画像CDNへ変換
  if (/^https?:\/\//i.test(imgPath)) {
    const unsplash = normalizeUnsplashUrl(imgPath);
    // 変換できない Unsplash ページURLは最終的にエラーになるためデフォルトへフォールバック
    if (unsplash) return unsplash;
    try {
      const u = new URL(imgPath);
      if (u.hostname === 'unsplash.com') return DEFAULT_HEADER_IMAGE;
    } catch {}
    return imgPath;
  }

  // ローカルのpublic配下パスが与えられた場合
  if (imgPath.startsWith("/")) {
    // .png/.jpg指定でも同名の.svgが存在すれば優先して返す
    const ext = nodePath.extname(imgPath).toLowerCase();
    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      const svgCandidate = imgPath.replace(/\.(png|jpg|jpeg)$/i, ".svg");
      const abs = nodePath.join(process.cwd(), "public", svgCandidate.replace(/^\//, ""));
      if (fs.existsSync(abs)) return svgCandidate;
    }
    return imgPath;
  }
  // それ以外はSupabase Storageの公開URLに解決（環境変数未設定時はフォールバック）
  const sb = getSupabase();
  if (!sb) return DEFAULT_HEADER_IMAGE;
  const { data } = sb.storage.from("blog").getPublicUrl(imgPath);
  return data.publicUrl || DEFAULT_HEADER_IMAGE;
  // For signed URL:
  // const { data, error } = await supabase.storage.from('blog').createSignedUrl(path, 60 * 60);
  // if (error) throw error;
  // return data.signedUrl;
}
