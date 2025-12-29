import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// セッション維持・トークン更新のためのミドルウェア
// - アクセストークンの期限切れ時にリフレッシュ
// - Cookie に最新セッションを反映
export async function middleware(req: NextRequest) {
  // 静的ファイルへのリクエストは処理しない（matcherのバックアップ）
  if (req.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|txt)$/)) {
    return NextResponse.next();
  }

  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // レスポンスオブジェクトのcookiesを変更するために必要
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // ユーザー認証の確認
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  // ---------------------------------------------------------------------------
  // Protected Routes Redirect (Unauthorized Access)
  // ---------------------------------------------------------------------------
  
  // Zaiko App: /zaiko/dashboard や /zaiko/settings などへのアクセスを保護
  // /zaiko/login, /zaiko/signup, /zaiko (LP), /onboarding は除外
  if (path.startsWith("/zaiko") && 
      !path.startsWith("/zaiko/login") && 
      !path.startsWith("/zaiko/signup") &&
      path !== "/zaiko"
  ) {
    if (!user) {
      // 未認証ユーザーはZaikoのLPへリダイレクト
      const url = req.nextUrl.clone();
      url.pathname = "/zaiko";
      return NextResponse.redirect(url);
    }
  }

  // Onboarding Page: 認証必須
  if (path.startsWith("/onboarding")) {
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // ---------------------------------------------------------------------------
  // Simpro App Root: 必要に応じて保護を追加 (例: /dashboard)
  // ---------------------------------------------------------------------------

  return res;
}

// 静的アセットや Next.js の内部パスを除外
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)",
  ],
};
