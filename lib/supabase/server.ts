// サーバーコンポーネント / ルートハンドラ / サーバーアクション等で利用する Supabase クライアント
// - @supabase/ssr の createServerClient を利用し、Cookie ベースでセッションを扱う。
// - next/headers の cookies() を介して読み書きする公式推奨パターン。

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// サーバー用クライアントを返すユーティリティ関数
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    // 開発時に早期に気づけるように例外を投げる
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const cookieStore = cookies();

  // Cookie 経由でセッションを維持するためのハンドラを渡す
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // 読み取り
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // 付与/更新
      set(name: string, value: string, options: CookieOptions) {
        // App Router では Server Component 内での set/remove は no-op の場合があるが、
        // 公式の推奨通り実装しておく（Route Handler や Middleware では有効）。
        cookieStore.set({ name, value, ...options });
      },
      // 削除
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });

  return supabase;
}

