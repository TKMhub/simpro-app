'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { cn } from '@/lib/utils';

const TOBUY_ITEMS = [
  { id: '1', name: 'トイレットペーパー', need: 4, checked: false },
  { id: '3', name: '醤油', need: 1, checked: false },
  { id: '5', name: 'マヨネーズ', need: 1, checked: false },
];

export default function ZaikoTobuyPage() {
  const router = useRouter();
  const [items, setItems] = useState(TOBUY_ITEMS);

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const handleComplete = () => {
    // Logic to update inventory
    router.push('/zaiko/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      <ZaikoHeader
        title="買い物リスト"
        showBack
        onBack={() => router.back()}
      />

      <div className="flex-1 px-4 py-4 space-y-4">
        {items.length === 0 ? (
           <div className="text-center py-20 text-zinc-500">
             <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-20" />
             <p>買うべきものはありません</p>
           </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
             {items.map((item) => (
               <div 
                 key={item.id} 
                 className={cn(
                   "flex items-center justify-between p-4 transition-colors",
                   item.checked ? "bg-green-50/50 dark:bg-green-900/10" : ""
                 )}
                 onClick={() => toggleCheck(item.id)}
               >
                 <div className="flex items-center gap-4">
                    <Checkbox checked={item.checked} className="h-6 w-6 rounded-full" />
                    <div className={cn(item.checked ? "opacity-50 line-through" : "")}>
                       <p className="font-bold">{item.name}</p>
                       <p className="text-xs text-zinc-500">あと {item.need} 個必要</p>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {items.some(i => i.checked) && (
        <div className="sticky bottom-0 p-4 bg-white/90 dark:bg-black/90 backdrop-blur border-t border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-2">
           <Button className="w-full h-12 font-bold shadow-lg" onClick={handleComplete}>
             <Check className="mr-2 h-4 w-4" />
             選択したアイテムを補充済みにする
           </Button>
        </div>
      )}
    </div>
  );
}

