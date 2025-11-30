"use client";

// 認証（ログイン）ページ
// - GitHub / Google の OAuth ログイン
// - Email の Magic Link ログイン（view="magic_link"）
// - Supabase Auth UI (@supabase/auth-ui-react) を利用して最小実装
// - TailwindCSS + shadcn/ui のカードで中央寄せ

import * as React from "react";
import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  // クライアント用 Supabase
  const supabase = React.useMemo(() => createClient(), []);

  return (
    <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            GitHub / Google またはメールのマジックリンクでログインできます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            // Email の Magic Link ログインを表示
            view="magic_link"
            // GitHub / Google（整備中） の OAuth ボタンを表示
            providers={["github", "google"]}
            // 日本語に近い表示とするためのラベルの上書き（必要最低限）
            localization={{
              variables: {
                sign_in: {
                  email_label: "メールアドレス",
                  email_input_placeholder: "you@example.com",
                  button_label: "ログイン",
                  link_text: "ログイン",
                },
                magic_link: {
                  email_input_label: "メールアドレス",
                  email_input_placeholder: "you@example.com",
                  button_label: "マジックリンクを送信",
                },
              },
            }}
            // Tailwind と相性の良いテーマ設定
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#2563eb",
                    brandAccent: "#1d4ed8",
                  },
                },
              },
            }}
            showLinks={false}
            // ログイン完了後の遷移先（専用コールバックに統一）
            redirectTo={
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/callback`
                : undefined
            }
          />
        </CardContent>
        <CardFooter className="flex justify-center">
             <Button variant="link" asChild>
                 <Link href="/signup">アカウントをお持ちでない方は新規登録</Link>
             </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
