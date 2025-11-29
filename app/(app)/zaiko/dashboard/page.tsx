'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Plus, Minus, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { InventoryFilterChips } from '../_components/inventory/inventory-filter-chips';
import { InventoryList } from '../_components/inventory/inventory-list';
import { AlertBanner } from '../_components/common/alert-banner';
import { FabAddButton } from '../_components/layout/fab-add-button';
import { ZaikoBottomSheet } from '../_components/layout/zaiko-bottom-sheet';
import { ZAIKO_CATEGORIES, ZAIKO_LOCATIONS } from '../_lib/zaiko-constants';

// Mock Data
const MOCK_ITEMS = [
  { id: '1', name: 'トイレットペーパー', quantity: 2, status: 'low', category: 'daily', iconName: '🧻', location: 'トイレ棚' },
  { id: '2', name: 'ハンドソープ', quantity: 1, status: 'enough', category: 'hygiene', iconName: '🧼', location: '洗面所' },
  { id: '3', name: '醤油', quantity: 0, status: 'empty', category: 'food', iconName: '🍱', location: 'キッチンパントリー' },
  { id: '4', name: '洗濯洗剤', quantity: 3, status: 'enough', category: 'cleaning', iconName: '👕', location: 'ランドリーラック' },
  { id: '5', name: 'マヨネーズ', quantity: 1, status: 'low', category: 'food', iconName: '🥗', location: '冷蔵庫' },
  { id: '6', name: '単3電池', quantity: 8, status: 'enough', category: 'other', iconName: '🔋', location: 'リビング棚' },
];

type Item = {
    id: string;
    name: string;
    quantity: number;
    status: string;
    category: string;
    iconName: string;
    location: string;
};

export default function ZaikoDashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([...MOCK_ITEMS]);
  const [filter, setFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Filter Logic
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const lowStockCount = items.filter(i => i.status === 'low' || i.status === 'empty').length;

  // Handlers
  const handleItemClick = (id: string) => {
    router.push(`/zaiko/detail/${id}`);
  };

  const handleQuickEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) setEditingItem(item);
  };

  const handleUpdateQuantity = (delta: number) => {
    if (!editingItem) return;
    const newItem = { ...editingItem, quantity: Math.max(0, editingItem.quantity + delta) };
    
    // Simple status update logic
    if (newItem.quantity === 0) newItem.status = 'empty';
    else if (newItem.quantity <= 1) newItem.status = 'low'; // Mock threshold
    else newItem.status = 'enough';

    setItems(prev => prev.map(i => i.id === newItem.id ? newItem : i));
    setEditingItem(newItem);
  };

  const handleDelete = () => {
     if (!editingItem) return;
     setItems(prev => prev.filter(i => i.id !== editingItem.id));
     setEditingItem(null);
  }

  return (
    <div className="min-h-screen pb-20 bg-zinc-50 dark:bg-black">
      <ZaikoHeader
        title="マイ在庫"
        rightAction={
          <Button variant="ghost" size="icon" onClick={() => router.push('/zaiko/settings')}>
            <Settings className="h-5 w-5" />
          </Button>
        }
      />

      <div className="space-y-2">
        <AlertBanner count={lowStockCount} />
        
        <InventoryFilterChips
          options={ZAIKO_CATEGORIES}
          selectedId={filter}
          onChange={setFilter}
        />

        <div className="px-4 mt-4">
          <InventoryList
            items={filteredItems}
            onItemClick={handleItemClick}
            onItemEdit={handleQuickEdit}
          />
        </div>
      </div>

      <FabAddButton />

      {/* Quick Edit Sheet */}
      <ZaikoBottomSheet
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        title={editingItem?.name}
      >
        <div className="space-y-6 pt-4">
          {/* Status & Location Info */}
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{editingItem?.location || '未設定'}</span>
            </div>
            {editingItem?.quantity === 0 && (
                <span className="text-red-500 font-bold">在庫切れ</span>
            )}
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between px-8">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-2 text-zinc-400 hover:text-zinc-900 hover:border-zinc-900"
              onClick={() => handleUpdateQuantity(-1)}
              disabled={!editingItem || editingItem.quantity <= 0}
            >
              <Minus className="h-8 w-8" />
            </Button>
            
            <div className="text-center min-w-[80px]">
              <span className="text-5xl font-bold tracking-tighter">
                {editingItem?.quantity}
              </span>
              <p className="text-xs text-zinc-400 mt-1">現在の個数</p>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-2 text-zinc-400 hover:text-zinc-900 hover:border-zinc-900"
              onClick={() => handleUpdateQuantity(1)}
            >
              <Plus className="h-8 w-8" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-4">
             <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-100" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                削除
             </Button>
             <Button className="w-full" onClick={() => {
                if(editingItem) router.push(`/zaiko/detail/${editingItem.id}`);
             }}>
                詳細編集
             </Button>
          </div>
        </div>
      </ZaikoBottomSheet>
    </div>
  );
}

