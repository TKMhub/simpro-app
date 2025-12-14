'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Bell, Users, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ZaikoHeader } from '../_components/layout/zaiko-header';

export default function ZaikoSettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <ZaikoHeader
        title="設定"
        showBack
        onBack={() => router.back()}
      />

      <div className="px-4 py-6 space-y-6">
        
        {/* Account */}
        <div className="space-y-2">
           <h3 className="text-sm font-bold text-zinc-500 px-2">アカウント</h3>
           <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left" onClick={() => router.push('/zaiko/member')}>
                 <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-zinc-500" />
                    <span>家族・メンバー管理</span>
                 </div>
                 <ChevronRight className="h-4 w-4 text-zinc-300" />
              </button>
           </div>
        </div>

        {/* App Settings */}
        <div className="space-y-2">
           <h3 className="text-sm font-bold text-zinc-500 px-2">アプリ設定</h3>
           <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              <div className="flex items-center justify-between p-4">
                 <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-zinc-500" />
                    <span>ダークモード</span>
                 </div>
                 <Switch />
              </div>
              <div className="flex items-center justify-between p-4">
                 <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-zinc-500" />
                    <span>通知</span>
                 </div>
                 <Switch defaultChecked />
              </div>
           </div>
        </div>

        <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-100 mt-8">
           <LogOut className="h-4 w-4 mr-2" />
           ログアウト
        </Button>
        
        <p className="text-center text-xs text-zinc-400 mt-4">
          Zaiko<span className="text-green-500">.</span> v0.1.0 (Beta)
        </p>

      </div>
    </div>
  );
}

