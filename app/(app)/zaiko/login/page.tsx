'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ZaikoLoginPage() {
  const router = useRouter();
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setIsGithubLoading(true);
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
        setIsGithubLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsEmailLoading(true);
    const supabase = createClient();
    try {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/zaiko/dashboard`,
            },
        });
        if (error) throw error;
        alert('ログイン用のリンクをメールで送信しました。確認してください。');
    } catch (e) {
        console.error(e);
        alert('ログイン処理に失敗しました');
    } finally {
        setIsEmailLoading(false);
    }
  };

  const isLoading = isGithubLoading || isEmailLoading;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <ZaikoHeader
        title="ログイン"
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
           <h1 className="text-2xl font-bold">おかえりなさい</h1>
           <p className="text-zinc-500 text-sm">
             Zaiko<span className="text-green-500">.</span>アカウントにログインして<br />
             家族との共有を始めましょう
           </p>
        </div>

        <div className="w-full space-y-3">
          <Button 
            className="w-full h-12 text-base relative" 
            variant="outline"
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
          >
             {isGithubLoading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
             ) : (
               <>
                 <Github className="absolute left-4 w-5 h-5" />
                 GitHubで続ける
               </>
             )}
          </Button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-black px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <Input 
                type="email" 
                placeholder="メールアドレス" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
                disabled={isLoading}
            />
            <Button 
                type="submit"
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white" 
                disabled={isLoading || !email}
            >
                {isEmailLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                メールアドレスでログイン
            </Button>
          </form>
        </div>

        <div className="text-center">
            <Button variant="link" asChild className="text-zinc-500">
                <Link href="/zaiko/signup">アカウントをお持ちでない方はこちら</Link>
            </Button>
        </div>

        <p className="text-xs text-center text-zinc-400">
          利用規約 および プライバシーポリシー に<br />
          同意した上でログインしてください。
        </p>
      </div>
    </div>
  );
}
