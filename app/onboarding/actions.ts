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

  // 1. プロフィールの更新 (存在しない場合は作成)
  // returnUrlからZaikoコンテキストか判定
  const isZaiko = returnUrl && returnUrl.includes("zaiko");
  const defaultJoinedApps = isZaiko ? ["zaiko"] : [];

  await prisma.profile.upsert({
    where: { id: user.id },
    update: {
      displayName,
      bio,
      avatarUrl,
      isActive: true,
    },
    create: {
      id: user.id,
      email: user.email!,
      displayName,
      bio,
      avatarUrl,
      isActive: true,
      joinedApps: defaultJoinedApps,
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

  // 3. 仕様変更: 登録完了後はログアウトしてログイン画面へ
  await supabase.auth.signOut();

  // 4. リダイレクト先決定 (基本はログイン画面へ)
  // returnUrl が /zaiko/... なら /zaiko/login へ、それ以外なら /login へ
  let targetUrl = "/login?registered=true";
  
  if (returnUrl && returnUrl.startsWith("/zaiko")) {
      targetUrl = "/zaiko/login?registered=true";
  } else if (returnUrl && returnUrl.includes("zaiko")) { // クエリパラメータ等に含まれる場合も考慮
      targetUrl = "/zaiko/login?registered=true";
  }

  redirect(targetUrl);
}
