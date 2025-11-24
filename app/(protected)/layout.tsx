// 保護ルート用のレイアウト
// - サーバーコンポーネント内で Supabase のセッションを確認
// - 未ログインの場合は /login へリダイレクト

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  // 現在のユーザー情報を取得（Cookie セッションに基づく）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログインならログインページへ
  if (!user) {
    redirect("/login");
  }

  // ログイン済みの場合のみ子コンテンツを表示
  return <>{children}</>;
}

