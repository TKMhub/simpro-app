"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Mail, Github, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

// -----------------------------------------------------------------------------
// Meteor Effect Component (Internal)
// -----------------------------------------------------------------------------
function Meteors() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute right-0 top-0 bottom-0 w-full h-full">
        <span
          className="meteor"
          style={{
            top: "10%",
            left: "80%",
            ...({
              "--dur": "2.5s",
              "--delay": "0s",
              "--trail": "200px",
              "--size": "2px",
              "--dx": "-600px",
              "--dy": "120px",
              "--angle": "-15deg",
              "--color": "#1d4ed8",
            } as React.CSSProperties),
          }}
        />
        <span
          className="meteor"
          style={{
            top: "5%",
            left: "90%",
            ...({
              "--dur": "3s",
              "--delay": "-1s",
              "--trail": "150px",
              "--size": "3px",
              "--dx": "-500px",
              "--dy": "100px",
              "--angle": "-15deg",
              "--color": "#374151",
            } as React.CSSProperties),
          }}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Signup Form Component
// -----------------------------------------------------------------------------
function SignupForm() {
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/onboarding";

  const handleOAuthLogin = async (provider: "github" | "google") => {
    setIsGithubLoading(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      setIsGithubLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsEmailLoading(true);
    const supabase = createClient();
    try {
      // Signup with OTP (Magic Link)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      alert("登録用のリンクをメールで送信しました。確認してください。");
    } catch (e) {
      console.error(e);
      alert("登録処理に失敗しました");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const isLoading = isGithubLoading || isEmailLoading;

  return (
    <div className="relative z-10 p-8 sm:p-10 flex flex-col items-center">
      
      {/* Logo & Title */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative w-40 h-10 sm:w-48 sm:h-12">
           <Image 
             src="/Simplo_white_blue.svg" 
             alt="Simplo" 
             fill 
             className="object-contain"
             priority
           />
        </div>
        <p className="text-sm text-center text-zinc-500 dark:text-[var(--cover-foreground)]/80">
          まずは無料でアカウント作成
        </p>
      </div>

      <div className="w-full space-y-4">

        {/* Email Form (Swapped Order) */}
        <form onSubmit={handleEmailSignup} className="space-y-3">
          <Input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
                "h-12 rounded-xl border-zinc-200/50 bg-white/50 backdrop-blur-sm",
                "focus:bg-white focus:ring-2 focus:ring-blue-500/20",
                "dark:border-zinc-700/50 dark:bg-zinc-900/50 dark:focus:bg-zinc-900",
                "transition-all duration-200"
            )}
            disabled={isLoading}
          />
          <Button
            type="submit"
            className={cn(
                "w-full h-12 text-base rounded-xl",
                "bg-blue-600 hover:bg-blue-700 text-white",
                "shadow-lg shadow-blue-500/20",
                "transition-all duration-200"
            )}
            disabled={isLoading || !email}
          >
            {isEmailLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            メールアドレスで登録
          </Button>
        </form>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200/50 dark:border-zinc-700/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-zinc-400">
              Or continue with
            </span>
          </div>
        </div>
        
        {/* OAuth Button */}
        <Button
          className={cn(
            "w-full h-12 text-base relative rounded-xl border-0",
            "bg-zinc-900 text-white hover:bg-zinc-800",
            "dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100",
            "shadow-lg shadow-zinc-500/10"
          )}
          onClick={() => handleOAuthLogin("github")}
          disabled={isLoading}
        >
          {isGithubLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Github className="absolute left-4 w-5 h-5" />
              GitHubで登録
            </>
          )}
        </Button>

      </div>

      {/* Footer */}
      <div className="mt-8 text-center space-y-4">
         <Button variant="link" asChild className="text-zinc-500 dark:text-zinc-400">
            <Link href="/login">すでにアカウントをお持ちの方はこちら</Link>
         </Button>
         
         <p className="text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
           登録することで、
           <Link href="/terms" className="underline hover:text-zinc-600 dark:hover:text-zinc-300 mx-1">利用規約</Link>
           および
           <Link href="/privacy" className="underline hover:text-zinc-600 dark:hover:text-zinc-300 mx-1">プライバシーポリシー</Link>
           に<br />同意したものとみなされます。
         </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Signup Page (Exported)
// -----------------------------------------------------------------------------
export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-black relative overflow-hidden">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button variant="ghost" size="sm" asChild className="hover:bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            <Link href="/" className="flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
            </Link>
        </Button>
      </div>

      {/* Glass Card Container */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-3xl overflow-hidden",
          // Glass Effect
          "backdrop-blur-xl backdrop-saturate-150",
          "bg-[var(--cover-glass-bg)] ring-1 ring-[var(--glass-border)] shadow-2xl shadow-black/10"
        )}
      >
        {/* Animated Background */}
        <Meteors />

        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
          <SignupForm />
        </Suspense>

      </div>
    </div>
  );
}
