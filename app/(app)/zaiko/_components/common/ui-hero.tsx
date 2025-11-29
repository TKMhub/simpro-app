'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Settings } from 'lucide-react';
import { ZaikoHeader } from '../layout/zaiko-header';
import { InventoryList } from '../inventory/inventory-list';
import { InventoryFilterChips } from '../inventory/inventory-filter-chips';
import { AlertBanner } from './alert-banner';
import { ZAIKO_CATEGORIES, InventoryStatus } from '../../_lib/zaiko-constants';

// Mock Data for Preview
const MOCK_PREVIEW_ITEMS = [
  { id: '1', name: 'トイレットペーパー', quantity: 2, status: 'low' as InventoryStatus, category: 'daily', iconName: '🧻', location: 'トイレ棚' },
  { id: '2', name: 'ハンドソープ', quantity: 1, status: 'enough' as InventoryStatus, category: 'hygiene', iconName: '🧼', location: '洗面所' },
  { id: '3', name: '醤油', quantity: 0, status: 'empty' as InventoryStatus, category: 'food', iconName: '🍱', location: 'キッチン' },
  { id: '4', name: '洗濯洗剤', quantity: 3, status: 'enough' as InventoryStatus, category: 'cleaning', iconName: '👕', location: '洗面所' },
  { id: '5', name: 'マヨネーズ', quantity: 1, status: 'low' as InventoryStatus, category: 'food', iconName: '🥗', location: '冷蔵庫' },
];

export function UiHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-black pb-16 pt-12">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-green-50 to-transparent dark:from-green-950/30 -z-10" />
      
      <div className="px-6 flex flex-col items-center text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4 max-w-lg mx-auto">
          <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300">
            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 mr-2" />
            Beta版リリース
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
            家の在庫、<br className="sm:hidden" />
            考える時間ゼロへ
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-balance max-w-md mx-auto">
            買い物中に「あれあったっけ？」と悩むのはもう終わり。<br className="hidden sm:block" />
            家族みんなで、スマートな在庫管理を。
          </p>
        </div>

        <div className="flex flex-col w-full max-w-xs gap-3 mx-auto">
          <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 dark:shadow-green-900/20 rounded-xl h-12 text-base">
            <Link href="/zaiko/login">
              無料で始める
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            <a href="#features" className="flex items-center justify-center gap-1">
              機能を見る <ChevronRight className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Mock UI Preview - Simplified Layout */}
        <div className="relative w-full max-w-[320px] mx-auto mt-8">
           {/* Simple Frame */}
           {mounted ? (
             <div className="relative w-full aspect-[9/18] bg-white dark:bg-black rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex flex-col">
                   {/* Header */}
                   <div className="relative z-20">
                     <ZaikoHeader 
                       title="マイ在庫" 
                       showBack={false}
                       rightAction={
                         <div className="p-2 text-zinc-500">
                           <Settings className="h-5 w-5" />
                         </div>
                       }
                       className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-100 dark:border-zinc-800"
                     />
                   </div>
                   
                   {/* Content */}
                   <div className="flex-1 overflow-hidden relative bg-zinc-50 dark:bg-black"> 
                      <div className="h-full space-y-2 overflow-y-auto no-scrollbar pb-20">
                         <AlertBanner count={2} className="pointer-events-none mt-2" />
                         <InventoryFilterChips 
                           options={ZAIKO_CATEGORIES} 
                           selectedId="all" 
                           onChange={() => {}} 
                           className="sticky top-0 z-10 pointer-events-none" 
                         />
                         <div className="px-4 mt-2">
                            <InventoryList 
                              items={MOCK_PREVIEW_ITEMS} 
                              onItemClick={()=>{}} 
                              onItemEdit={()=>{}} 
                            />
                         </div>
                      </div>

                      {/* Fab Button Mock */}
                      <div className="absolute bottom-6 right-6 z-30 h-14 w-14 rounded-full bg-green-600 shadow-xl shadow-green-500/30 flex items-center justify-center text-white">
                         <Plus className="h-7 w-7" />
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="relative w-full aspect-[9/18] bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 animate-pulse" />
           )}
        </div>
      </div>
    </div>
  );
}
