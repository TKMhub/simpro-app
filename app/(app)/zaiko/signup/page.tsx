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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ZaikoSignupPage() {
  const router = useRouter();
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailSentDialog, setShowEmailSentDialog] = useState(false);

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

  const handleEmailSignup = async (e: React.FormEvent) => {
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
        setShowEmailSentDialog(true);
    } catch (e: any) {
        console.error(e);
        // Supabase rate limit error handling
        if (e.message?.includes('security purposes') || e.status === 429) {
            alert('セキュリティのため、しばらく時間を置いてから再試行してください。');
        } else {
            alert('登録処理に失敗しました');
        }
    } finally {
        setIsEmailLoading(false);
    }
  };

  const isLoading = isGithubLoading || isEmailLoading;

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
             まずは無料でアカウント作成。<br />
             シンプルな在庫管理を体験しましょう
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
                メールアドレスで登録
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-black px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>
          
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
                 GitHubで登録
               </>
             )}
          </Button>

        </div>
        
        {/* Powered by Simpro */}
        <div className="flex flex-col items-center gap-2 pt-4 opacity-50">
            <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Powered by</span>
            <div className="relative w-20 h-5">
                <Image 
                    src="/Simplo_gray_main_sub.svg" 
                    alt="Simplo" 
                    fill 
                    className="object-contain dark:invert" 
                />
            </div>
            <p className="text-[10px] text-zinc-400">“Simple is Professional”</p>
        </div>

        <div className="text-center pt-4">
            <Button variant="link" asChild className="text-zinc-500">
                <Link href="/zaiko/login">すでにアカウントをお持ちの方はこちら</Link>
            </Button>
        </div>

        <p className="text-xs text-center text-zinc-400">
          利用規約 および プライバシーポリシー に<br />
          同意した上で登録してください。
        </p>

        <Dialog open={showEmailSentDialog} onOpenChange={setShowEmailSentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                 <Image 
                   src="/zaiko-logo.svg" 
                   alt="Zaiko Logo" 
                   fill 
                   className="object-contain"
                 />
              </div>
              <DialogTitle className="text-center">メールを送信しました</DialogTitle>
              <DialogDescription className="text-center">
                登録用のリンクをメールで送信しました。<br />
                メールを確認して、リンクからログインしてください。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button type="button" onClick={() => setShowEmailSentDialog(false)} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-w-[120px]">
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
