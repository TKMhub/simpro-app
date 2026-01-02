'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function ZaikoLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const errorMsg = searchParams.get('message');
  const [showRegisteredDialog, setShowRegisteredDialog] = useState(!!registered);
  const [showLoginErrorDialog, setShowLoginErrorDialog] = useState(!!errorMsg || searchParams.has('error'));

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
                shouldCreateUser: false, // 新規登録を防ぐ
            },
        });
        if (error) throw error;
        alert('ログイン用のリンクをメールで送信しました。確認してください。');
    } catch (e: any) {
        console.error(e);
        // エラー時はログイン情報がない可能性が高いためダイアログを表示
        setShowLoginErrorDialog(true);
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
        
        <Dialog open={showRegisteredDialog} onOpenChange={setShowRegisteredDialog}>
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
              <DialogTitle className="text-center">ユーザー登録が完了しました</DialogTitle>
              <DialogDescription className="text-center">
                登録ありがとうございます。<br />
                再度ログインしてご利用を開始してください。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button type="button" onClick={() => setShowRegisteredDialog(false)} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-w-[120px]">
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showLoginErrorDialog} onOpenChange={setShowLoginErrorDialog}>
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
              <DialogTitle className="text-center">
                {errorMsg ? '認証エラー' : 'ログイン情報が見つかりませんでした'}
              </DialogTitle>
              <DialogDescription className="text-center">
                {errorMsg ? (
                    <>
                    {errorMsg.includes('code verifier') 
                        ? 'ブラウザが異なるため認証できませんでした。登録を開始したブラウザと同じブラウザでリンクを開くか、最初からやり直してください。' 
                        : '認証に失敗しました。リンクの期限切れの可能性があります。'}
                    <br />もう一度お試しください。
                    </>
                ) : (
                    <>
                    アカウントが見つかりませんでした。<br />
                    アカウントをお持ちでない場合は、新規登録をお願いします。
                    </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setShowLoginErrorDialog(false)} className="w-full sm:w-auto">
                閉じる
              </Button>
              <Button type="button" onClick={() => router.push('/zaiko/signup')} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                アカウント作成へ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="text-center space-y-2 flex flex-col items-center mt-8">
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

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                {/* Border removed as per request */}
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
                 GitHubで続ける
               </>
             )}
          </Button>

        </div>

        <div className="text-center pt-4 pb-8 space-y-8">
            <div className="text-center">
                <Button variant="link" asChild className="text-zinc-500">
                    <Link href="/zaiko/signup">アカウントをお持ちでない方はこちら</Link>
                </Button>
            </div>

            <p className="text-xs text-center text-zinc-400">
              <Link href="/terms" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100">利用規約</Link>
              {' '}および{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100">プライバシーポリシー</Link>
              {' '}に<br />
              同意した上でログインしてください。
            </p>

            {/* Powered by Simpro */}
            <div className="flex flex-col items-center gap-2 opacity-50 pb-8">
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
        </div>
      </div>
    </div>
  );
}

export default function ZaikoLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-400" /></div>}>
      <ZaikoLoginContent />
    </Suspense>
  );
}