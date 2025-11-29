import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UiHero() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-black pb-16 pt-12">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-green-50 to-transparent dark:from-green-950/30 -z-10" />
      
      <div className="px-6 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4 max-w-sm">
          <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300">
            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 mr-2" />
            Beta版リリース
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
            家の在庫、<br />
            考える時間ゼロへ
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            買い物中に「あれあったっけ？」と悩むのはもう終わり。<br />
            家族みんなで、スマートな在庫管理を。
          </p>
        </div>

        <div className="flex flex-col w-full max-w-xs gap-3">
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

        {/* Mock UI Preview */}
        <div className="relative mt-8 w-full max-w-[280px] aspect-[9/19] bg-zinc-950 rounded-[2rem] border-4 border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
           <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[1.5rem] overflow-hidden flex flex-col">
              {/* Fake App Header */}
              <div className="h-12 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                 <span className="text-xs font-bold">Zaiko</span>
              </div>
              {/* Fake List */}
              <div className="p-3 space-y-3">
                {[
                   { name: 'ハンドソープ', status: 'enough' },
                   { name: 'トイレットペーパー', status: 'low' },
                   { name: '醤油', status: 'enough' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex-1 min-w-0">
                       <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mb-1" />
                       <div className="h-2 w-10 bg-zinc-100 dark:bg-zinc-800 rounded" />
                    </div>
                    <div className={cn("w-2 h-2 rounded-full", item.status === 'low' ? 'bg-yellow-500' : 'bg-green-500')} />
                  </div>
                ))}
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900">
                   <div className="h-2 w-full bg-red-200 dark:bg-red-800 rounded mb-1" />
                   <div className="h-2 w-2/3 bg-red-200 dark:bg-red-800 rounded" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

