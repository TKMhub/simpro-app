'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZaikoHeader } from '../_components/layout/zaiko-header';

export default function ZaikoLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (provider: string) => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      router.push('/zaiko/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <ZaikoHeader
        title="ログイン"
        showBack
        onBack={() => router.back()}
        rightAction={<div className="w-8" />}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
           <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 text-white shadow-xl shadow-green-200 dark:shadow-green-900/20 mb-4">
              <span className="font-bold text-4xl">Z</span>
           </div>
           <h1 className="text-2xl font-bold">おかえりなさい</h1>
           <p className="text-zinc-500 text-sm">
             Zaikoアカウントにログインして<br />
             家族との共有を始めましょう
           </p>
        </div>

        <div className="w-full space-y-3">
          <Button 
            className="w-full h-12 text-base relative" 
            variant="outline"
            onClick={() => handleLogin('google')}
            disabled={isLoading}
          >
             {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
             ) : (
               <>
                 <span className="absolute left-4 text-xl">G</span>
                 Googleで続ける
               </>
             )}
          </Button>
          
          <Button 
             className="w-full h-12 text-base" 
             variant="outline"
             disabled={isLoading}
          >
             メールアドレスでログイン
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

