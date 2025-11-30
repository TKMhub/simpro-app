'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { createClient } from '@/lib/supabase/client';

export default function ZaikoSignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  // OAuthはログインと同じ（アカウントがなければ作成される）
  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    const supabase = createClient();
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/zaiko/dashboard`,
            },
        });
        if (error) throw error;
    } catch (e) {
        console.error(e);
        setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    const supabase = createClient();
    try {
        // signInWithOtp はユーザーが存在しなければ作成する＝新規登録と同じ挙動
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/zaiko/dashboard`,
            },
        });
        if (error) throw error;
        alert('登録確認用のリンクをメールで送信しました。メールを確認して登録を完了してください。');
    } catch (e) {
        console.error(e);
        alert('登録処理に失敗しました');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <ZaikoHeader
        title="新規登録"
        showBack
        onBack={() => router.back()}
        rightAction={<div className="w-8" />}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2 flex flex-col items-center">
           <div className="relative w-24 h-24 mb-2">
              <Image 
                src="/zaiko-logo.svg" 
                alt="Zaiko Logo" 
                fill 
                className="object-contain"
              />
           </div>
           <h1 className="text-2xl font-bold">はじめまして</h1>
           <p className="text-zinc-500 text-sm">
             アカウントを作成して<br />
             快適な在庫管理を始めましょう
           </p>
        </div>

        <div className="w-full space-y-3">
          <form onSubmit={handleEmailSignup} className="space-y-3">
            <Input 
                type="email" 
                placeholder="メールアドレス" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
            />
            <Button 
                type="submit"
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white" 
                disabled={isLoading || !email}
            >
                <Mail className="w-4 h-4 mr-2" />
                メールアドレスで登録
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-black px-2 text-zinc-500">外部アカウントで登録</span>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-base relative" 
            variant="outline"
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
          >
             {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
             ) : (
               <>
                 <Github className="absolute left-4 w-5 h-5" />
                 GitHubで登録
               </>
             )}
          </Button>
        </div>

        <div className="text-center">
            <Button variant="link" asChild className="text-zinc-500">
                <Link href="/zaiko/login">すでにアカウントをお持ちの方はこちら</Link>
            </Button>
        </div>

        <p className="text-xs text-center text-zinc-400">
          登録することで、<br />
          利用規約 および プライバシーポリシー に<br />
          同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}

