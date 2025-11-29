import React from 'react';
import { InventoryCard } from './inventory-card';
import { InventoryStatus } from '../../_lib/zaiko-constants';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location?: string;
  status: InventoryStatus;
  iconName: string;
}

interface InventoryListProps {
  items: InventoryItem[];
  onItemClick: (id: string) => void;
  onItemEdit: (id: string) => void;
}

export function InventoryList({ items, onItemClick, onItemEdit }: InventoryListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-4 mb-4">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">在庫がありません</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          右下のボタンから<br />新しいアイテムを追加しましょう
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-24">
      {items.map((item) => (
        <InventoryCard
          key={item.id}
          name={item.name}
          quantity={item.quantity}
          location={item.location}
          status={item.status}
          iconName={item.iconName}
          onClick={() => onItemClick(item.id)}
          onQuickEdit={() => onItemEdit(item.id)}
          className="animate-in fade-in slide-in-from-bottom-2 duration-500"
        />
      ))}
    </div>
  );
}

