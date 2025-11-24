// ブラウザ（クライアント）側で利用する Supabase クライアント
// - @supabase/ssr の createBrowserClient を利用し、
//   NEXT_PUBLIC_* の環境変数から初期化する。

import { createBrowserClient } from "@supabase/ssr";

// ブラウザ用クライアントを返すユーティリティ関数
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    // 開発時に早期に気づけるように例外を投げる
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

