import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");

  // ログイン失敗時のリダイレクト先決定ロジック
  const getErrorRedirectUrl = () => {
    if (next.startsWith('/zaiko')) {
      return `${origin}/zaiko/login?error=auth`;
    }
    return `${origin}/login?error=auth`;
  };

  // エラーパラメータがある場合もリダイレクト
  if (error) {
    return NextResponse.redirect(getErrorRedirectUrl());
  }

  if (code) {
    const supabase = await createClient();
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!sessionError) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        try {
          // 既存プロフィールの確認
          const existingProfile = await prisma.profile.findUnique({
            where: { id: user.id },
          });

          // Zaikoコンテキストかどうか
          // nextパラメータ自体に returnTo が含まれているか、またはパス自体が /zaiko から始まっているか
          const isZaikoContext = next.startsWith('/zaiko') || next.includes('returnTo=/zaiko');
          const appTag = 'zaiko';

          if (!existingProfile) {
            // =========================================================
            // 新規ユーザー登録 (OAuth, Email 共通)
            // =========================================================
            const newProfile = await prisma.profile.create({
              data: {
                id: user.id,
                email: user.email!,
                // 表示名はOnboardingで設定してもらうため、ここでは一旦メールアドレスのローカルパートなどを仮置き
                // あるいは空でも良いが、スキーマ上String?なのでnull可
                displayName: user.user_metadata?.full_name || user.email?.split('@')[0],
                avatarUrl: user.user_metadata?.avatar_url,
                joinedApps: isZaikoContext ? [appTag] : [],
              },
            });
            
            // Zaiko用の初期データ作成
            if (isZaikoContext) {
               await createZaikoInitialData(newProfile.id);
            }

            // 新規ユーザーの場合、必ずOnboardingへリダイレクトして表示名などを確認させる
            // もし既に next が onboarding ならそのまま、そうでなければ強制的に onboarding へ
            if (!next.includes('/onboarding')) {
                // 元の行き先を returnTo に退避
                const returnTo = next === '/' ? '/login' : next; // loginに戻すのが一般的か、dashboardに行くか。Onboarding後は再ログインフローなので /login が適切
                next = `/onboarding?returnTo=${encodeURIComponent(returnTo)}`;
            }

          } else {
            // =========================================================
            // 既存ユーザー
            // =========================================================
            
            // Zaikoからのログインで、未登録ならタグ追加
            if (isZaikoContext && !existingProfile.joinedApps.includes(appTag)) {
              await prisma.profile.update({
                where: { id: user.id },
                data: {
                  joinedApps: {
                    push: appTag
                  }
                }
              });
              await createZaikoInitialData(existingProfile.id);
            }
          }

        } catch (e) {
          console.error("Failed to sync profile:", e);
        }
      }

      // 最終的なリダイレクト
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = origin.includes("localhost");
      
      let redirectUrl = `${origin}${next}`;
      if (!isLocal && forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      }

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(getErrorRedirectUrl());
}

async function createZaikoInitialData(userId: string) {
    const existingMember = await prisma.zaikoFamilyMember.findFirst({
        where: { userId }
    });

    if (!existingMember) {
        await prisma.zaikoFamily.create({
            data: {
                name: 'マイ在庫',
                inviteCode: Math.random().toString(36).substring(2, 10),
                createdBy: userId,
                members: {
                    create: {
                        userId: userId,
                        role: 'ADMIN',
                    }
                }
            }
        });
    }
}
