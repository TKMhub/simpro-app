'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZaikoHeader } from '../_components/layout/zaiko-header';

const ALERTS = [
  { id: 1, title: '在庫切れ：醤油', time: '10分前', type: 'empty' },
  { id: 2, title: '在庫少：トイレットペーパー', time: '1時間前', type: 'low' },
  { id: 3, title: '在庫少：マヨネーズ', time: '昨日', type: 'low' },
];

export default function ZaikoAlertPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <ZaikoHeader
        title="通知"
        showBack
        onBack={() => router.back()}
      />

      <div className="px-4 py-4 space-y-4">
        {ALERTS.map((alert) => (
          <div key={alert.id} className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm flex items-start gap-3">
             <div className={`mt-1 h-2 w-2 rounded-full ${alert.type === 'empty' ? 'bg-red-500' : 'bg-yellow-500'}`} />
             <div className="flex-1">
                <p className="font-bold text-sm">{alert.title}</p>
                <p className="text-xs text-zinc-500 mt-1">{alert.time}</p>
             </div>
             {alert.type === 'empty' && (
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => router.push('/zaiko/tobuy')}>
                  <ShoppingCart className="w-3 h-3 mr-1" /> 追加
                </Button>
             )}
          </div>
        ))}
        
        {ALERTS.length === 0 && (
           <div className="text-center py-20 text-zinc-500">
             <Bell className="mx-auto h-12 w-12 mb-4 opacity-20" />
             <p>新しい通知はありません</p>
           </div>
        )}
      </div>
    </div>
  );
}

