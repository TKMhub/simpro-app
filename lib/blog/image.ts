import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import nodePath from "path";
import { DEFAULT_HEADER_IMAGE } from "./constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function resolveHeaderImageUrl(imgPath?: string | null) {
  // 未設定ならデフォルト
  if (!imgPath) return DEFAULT_HEADER_IMAGE;

  // すでに絶対URLならそのまま返す（例: Supabaseの公開URL）
  if (/^https?:\/\//i.test(imgPath)) return imgPath;

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
  // それ以外はSupabase Storageの公開URLに解決
  const { data } = supabase.storage.from("blog").getPublicUrl(imgPath);
  return data.publicUrl || DEFAULT_HEADER_IMAGE;
  // For signed URL:
  // const { data, error } = await supabase.storage.from('blog').createSignedUrl(path, 60 * 60);
  // if (error) throw error;
  // return data.signedUrl;
}
