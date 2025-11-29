'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { InventoryCard } from './inventory-card';
import { InventoryStatus } from '../../_lib/zaiko-constants';
import { staggerContainer, staggerItem } from '../../_lib/motion-presets';
import { Skeleton } from '@/components/ui/skeleton';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  location?: string;
  status: InventoryStatus;
  category: string;
}

interface InventoryListProps {
  items: InventoryItem[];
  isLoading?: boolean;
  onItemClick?: (item: InventoryItem) => void;
  onQuickEdit?: (item: InventoryItem) => void;
}

export function InventoryList({
  items,
  isLoading = false,
  onItemClick,
  onQuickEdit,
}: InventoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center"
      >
        <div className="mb-4 text-6xl">📦</div>
        <h3 className="mb-2 text-lg font-bold">在庫がありません</h3>
        <p className="text-sm text-muted-foreground">
          右下の + ボタンから在庫を追加しましょう
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={staggerItem}
            layout
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <InventoryCard
              {...item}
              onClick={() => onItemClick?.(item)}
              onQuickEdit={() => onQuickEdit?.(item)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

