"use client";

// 最低限のヘッダー（サインイン / サインアウトを表示）
// - ログイン済みならユーザー情報＋ログアウトボタン
// - 未ログインなら /login へのリンクボタン

import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SheetClose } from "@/components/ui/sheet";

type AuthHeaderProps = {
  // sheet: show vertical layout and close menu on actions
  context?: "header" | "sheet";
};

export default function AuthHeader({ context = "header" }: AuthHeaderProps) {
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
  const glassBtn =
    "backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15 transition-colors";

  if (loading) {
    return <div className="text-sm text-muted-foreground">…</div>;
  }

  if (context === "sheet") {
    // Mobile sheet layout: show avatar only (no username), glass-style buttons
    return displayName ? (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
        <SheetClose asChild>
          <Button
            size="sm"
            className={`${glassBtn} text-white dark:text-black`}
            onClick={onSignOut}
          >
            ログアウト
          </Button>
        </SheetClose>
      </div>
    ) : (
      <SheetClose asChild>
        <Button asChild size="sm" className={glassBtn}>
          <Link href="/login">ログイン</Link>
        </Button>
      </SheetClose>
    );
  }

  // Header (desktop) inline layout: no username
  return displayName ? (
    <div className="flex items-center gap-2">
      <Avatar>
        {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <Button size="sm" className={glassBtn} onClick={onSignOut}>
        ログアウト
      </Button>
    </div>
  ) : (
    <Button asChild size="sm" className={glassBtn}>
      <Link href="/login">ログイン</Link>
    </Button>
  );
}
