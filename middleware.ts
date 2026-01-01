import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// セッション維持・トークン更新のためのミドルウェア
// - アクセストークンの期限切れ時にリフレッシュ
// - Cookie に最新セッションを反映
export async function middleware(req: NextRequest) {
  // 静的ファイルへのリクエストは処理しない（matcherのバックアップ）
  // 大文字小文字を無視して拡張子をチェック
  if (req.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|txt)$/i)) {
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
  // /zaiko/login, /zaiko/signup, /zaiko (LP), /zaiko/onboarding は除外 (onboardingは別途チェック)
  if (path.startsWith("/zaiko") && 
      !path.startsWith("/zaiko/login") && 
      !path.startsWith("/zaiko/signup") &&
      !path.startsWith("/zaiko/onboarding") &&
      path !== "/zaiko"
  ) {
    if (!user) {
      // 未認証ユーザーはZaikoのログイン画面へリダイレクト
      const url = req.nextUrl.clone();
      url.pathname = "/zaiko/login";
      // ログイン後のリダイレクト先を保持
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  // Onboarding Page: 認証必須
  // ★認証直後のリダイレクト不具合を防ぐためコメントアウト
  /*
  if (path.startsWith("/onboarding") || path.startsWith("/zaiko/onboarding")) {
    if (!user) {
      const url = req.nextUrl.clone();
      // Zaikoの場合はZaikoのログイン画面へ
      if (path.startsWith("/zaiko")) {
          url.pathname = "/zaiko/login";
      } else {
      url.pathname = "/login";
      }
      return NextResponse.redirect(url);
    }
  }
  */

  // ---------------------------------------------------------------------------
  // Simpro App Root: 必要に応じて保護を追加 (例: /dashboard)
  // ---------------------------------------------------------------------------

  return res;
}

// 静的アセットや Next.js の内部パスを除外
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     * - images with extensions: svg, png, jpg, jpeg, gif, webp, ico
     * - text files: txt
     * Note: The regex inside matcher string does not support flags like 'i',
     * so we rely on the middleware function logic for case-insensitive exclusion as well.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)",
  ],
};
