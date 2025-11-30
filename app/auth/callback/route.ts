import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");

  // ログイン失敗時のリダイレクト先決定ロジック
  const getErrorRedirectUrl = () => {
    // nextが /zaiko で始まる場合は Zaikoのログイン画面へ
    if (next.startsWith('/zaiko')) {
      return `${origin}/zaiko/login?error=auth`;
    }
    // それ以外はメインのログイン画面へ
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
      // セッション取得成功後、Profileテーブルの同期を行う
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        try {
          // 既存プロフィールの確認
          const existingProfile = await prisma.profile.findUnique({
            where: { id: user.id },
          });

          // ログイン元がZaikoかどうかを判定 (URLが /zaiko で始まる場合)
          const isZaikoLogin = next.startsWith('/zaiko');
          const appTag = 'zaiko';

          if (!existingProfile) {
            // 新規作成
            const newProfile = await prisma.profile.create({
              data: {
                id: user.id,
                email: user.email!,
                displayName: user.user_metadata?.full_name || user.email?.split('@')[0],
                avatarUrl: user.user_metadata?.avatar_url,
                joinedApps: isZaikoLogin ? [appTag] : [],
              },
            });
            
            // Zaikoログインなら初期データも作成
            if (isZaikoLogin) {
               await createZaikoInitialData(newProfile.id);
            }

          } else {
            // 既存ユーザー: Zaikoからのログインで、未登録ならタグ追加
            if (isZaikoLogin && !existingProfile.joinedApps.includes(appTag)) {
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
          // プロフィール作成に失敗してもログイン自体は成功させる（後でリトライ等の考慮が必要だが一旦通す）
        }
      }

      // ログイン成功時は指定されたURLへリダイレクト
      const forwardedHost = request.headers.get("x-forwarded-host"); // load balancer support
      const isLocal = origin.includes("localhost");
      
      let redirectUrl = `${origin}${next}`;
      if (!isLocal && forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      }

      return NextResponse.redirect(redirectUrl);
    }
  }

  // エラー時やコードがない場合
  return NextResponse.redirect(getErrorRedirectUrl());
}

// Zaiko用の初期データ作成ヘルパー
async function createZaikoInitialData(userId: string) {
    // 既に作成済みか確認
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
