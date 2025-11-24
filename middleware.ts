import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// セッション維持・トークン更新のためのミドルウェア
// - アクセストークンの期限切れ時にリフレッシュ
// - Cookie に最新セッションを反映
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // ここでユーザー取得を呼ぶことで、期限切れのトークンがある場合は更新され、
  // set/remove が実行されて Cookie が最新化される。
  await supabase.auth.getUser();

  return res;
}

// 静的アセットや Next.js の内部パスを除外
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)",
  ],
};

