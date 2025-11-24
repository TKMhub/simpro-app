"use client";

// 最低限のヘッダー（サインイン / サインアウトを表示）
// - ログイン済みならユーザー情報＋ログアウトボタン
// - 未ログインなら /login へのリンクボタン

import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AuthHeader() {
  const supabase = React.useMemo(() => createClient(), []);
  const [email, setEmail] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  // 初期ユーザー取得と auth 状態変更の購読
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setEmail(data.user?.email ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const onSignOut = async () => {
    // ログアウト：Cookie のセッションも削除される
    await supabase.auth.signOut();
  };

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <div className="text-sm text-muted-foreground">…</div>
      ) : email ? (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{email.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{email}</span>
          <Button size="sm" variant="outline" onClick={onSignOut}>
            ログアウト
          </Button>
        </div>
      ) : (
        <Button asChild size="sm">
          <Link href="/login">ログイン</Link>
        </Button>
      )}
    </div>
  );
}

