"use client";

// 最低限のヘッダー（サインイン / サインアウトを表示）
// - ログイン済みならユーザー情報＋ログアウトボタン
// - 未ログインなら /login へのリンクボタン

import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AuthHeader() {
  const supabase = React.useMemo(() => createClient(), []);
  const [displayName, setDisplayName] = React.useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  // 初期ユーザー取得と auth 状態変更の購読
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        const user = data.user;
        const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
        const email = user?.email ?? null;
        const nameFromMeta =
          (meta["display_name"] as string | undefined) ||
          (meta["full_name"] as string | undefined) ||
          (meta["name"] as string | undefined) ||
          (meta["user_name"] as string | undefined) ||
          null;
        const avatarFromMeta =
          (meta["avatar_url"] as string | undefined) ||
          (meta["picture"] as string | undefined) ||
          null;
        const fallbackName = email ? email.split("@")[0] : null;
        setDisplayName(nameFromMeta ?? fallbackName);
        setAvatarUrl(avatarFromMeta);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const user = session?.user;
      const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
      const email = user?.email ?? null;
      const nameFromMeta =
        (meta["display_name"] as string | undefined) ||
        (meta["full_name"] as string | undefined) ||
        (meta["name"] as string | undefined) ||
        (meta["user_name"] as string | undefined) ||
        null;
      const avatarFromMeta =
        (meta["avatar_url"] as string | undefined) ||
        (meta["picture"] as string | undefined) ||
        null;
      const fallbackName = email ? email.split("@")[0] : null;
      setDisplayName(nameFromMeta ?? fallbackName);
      setAvatarUrl(avatarFromMeta);
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

  const initials = (displayName ?? "").slice(0, 2).toUpperCase() || "US";

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <div className="text-sm text-muted-foreground">…</div>
      ) : displayName ? (
        <div className="flex items-center gap-2">
          <Avatar>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{displayName}</span>
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
