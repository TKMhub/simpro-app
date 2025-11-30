"use client";

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

export default function SignupPage() {
  const supabase = React.useMemo(() => createClient(), []);

  return (
    <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>アカウント作成</CardTitle>
          <CardDescription>
            Simproアカウントを作成して、すべてのサービスを利用しましょう。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            view="magic_link"
            providers={[]} // 新規登録ページではOAuthを強調しなくても良いかもしれないが、統一感のため消すか残すか。ここではEmail中心にする
            showLinks={false} // デフォルトのリンクを隠して自前で制御
            localization={{
              variables: {
                magic_link: {
                  email_input_label: "メールアドレス",
                  email_input_placeholder: "you@example.com",
                  button_label: "アカウント作成メールを送信",
                  link_text: "アカウント作成",
                },
              },
            }}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'black',
                    brandAccent: '#333',
                  },
                },
              },
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
                <Link href="/login">すでにアカウントをお持ちの方はログイン</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

