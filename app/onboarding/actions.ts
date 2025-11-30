"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function submitOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = formData.get("displayName") as string;
  const bio = formData.get("bio") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const returnUrl = formData.get("returnUrl") as string;

  if (!displayName) {
    throw new Error("表示名は必須です");
  }

  // 1. プロフィールの更新
  await prisma.profile.update({
    where: { id: user.id },
    data: {
      displayName,
      bio,
      avatarUrl, // クライアント側でアップロードして取得したURLを保存
    },
  });

  // 2. Supabase Authのメタデータ更新 (整合性確保)
  // クライアント側で即座に反映されるように、auth.usersのmetadataも更新しておくのがベストプラクティス
  await supabase.auth.updateUser({
    data: {
      full_name: displayName,
      avatar_url: avatarUrl,
      // bioはauth.usersの標準フィールドではないのでmetadataに入れても良いが必須ではない
    }
  });

  // 3. ログアウト処理 (セッションをクリアして再ログインを促す)
  await supabase.auth.signOut();

  // 4. リダイレクト先決定
  let targetUrl = "/login";
  if (returnUrl) {
      if (returnUrl.includes("/zaiko")) {
          targetUrl = "/zaiko/login";
      } else {
          targetUrl = "/login";
      }
  }

  redirect(`${targetUrl}?message=registration_complete`);
}
