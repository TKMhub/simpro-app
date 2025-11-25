"use client";

// Magic Link / OAuth のコールバック用ページ。
// Supabase の JS SDK はハッシュのトークンを自動処理するため、
// ここでは完了メッセージを出し、処理完了後にトップへ遷移するだけ。

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    // ハッシュに access_token が含まれていると自動でセッション化される。
    // 反映タイミングを少し待ってからトップへ移動。
    const t = setTimeout(() => {
      router.replace("/");
    }, 600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="space-y-2">
        <p className="text-base">サインイン処理を完了しています…</p>
        <p className="text-sm text-muted-foreground">自動的にトップへ移動します。</p>
      </div>
    </div>
  );
}

