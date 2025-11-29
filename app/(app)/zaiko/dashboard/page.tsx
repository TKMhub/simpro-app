'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { ZaikoShell, ZaikoContent } from '../_components/layout/zaiko-shell';
import { AlertBanner } from '../_components/common/alert-banner';
import { FabAddButton } from '../_components/layout/fab-add-button';
import { InventoryList, InventoryItem } from '../_components/inventory/inventory-list';
import { InventoryFilterChips } from '../_components/inventory/inventory-filter-chips';
import { ZaikoBottomSheet } from '../_components/layout/zaiko-bottom-sheet';
import { InventoryQuantityStepper } from '../_components/inventory/inventory-quantity-stepper';
import { Button } from '@/components/ui/button';
import { INVENTORY_CATEGORIES, getInventoryStatus } from '../_lib/zaiko-constants';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { MapPin, Trash2 } from 'lucide-react';

// モックデータ
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'トイレットペーパー',
    icon: '🧻',
    quantity: 3,
    location: 'トイレ棚',
    status: 'low',
    category: 'toiletries',
  },
  {
    id: '2',
    name: '食器用洗剤',
    icon: '🧼',
    quantity: 1,
    location: 'キッチン',
    status: 'empty',
    category: 'detergent',
  },
  {
    id: '3',
    name: 'ハンドソープ',
    icon: '🧴',
    quantity: 5,
    location: '洗面所',
    status: 'enough',
    category: 'daily',
  },
  {
    id: '4',
    name: 'ティッシュボックス',
    icon: '📄',
    quantity: 2,
    location: 'リビング',
    status: 'low',
    category: 'tissue',
  },
  {
    id: '5',
    name: 'ラップ',
    icon: '🍱',
    quantity: 8,
    location: 'キッチン',
    status: 'enough',
    category: 'kitchen',
  },
  {
    id: '6',
    name: 'ゴミ袋',
    icon: '🗑️',
    quantity: 10,
    location: '収納',
    status: 'enough',
    category: 'daily',
  },
];

export default function ZaikoDashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // フィルタリング
  const filteredItems =
    activeFilter === 'all'
      ? items
      : items.filter((item) => item.category === activeFilter);

  // アラート対象のアイテム数
  const alertCount = items.filter(
    (item) => item.status === 'low' || item.status === 'empty'
  ).length;

  const handleItemClick = (item: InventoryItem) => {
    router.push(`/zaiko/detail/${item.id}`);
  };

  const handleQuickEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsBottomSheetOpen(true);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (selectedItem) {
      const newStatus = getInventoryStatus(newQuantity, 3);
      setItems(
        items.map((item) =>
          item.id === selectedItem.id
            ? { ...item, quantity: newQuantity, status: newStatus }
            : item
        )
      );
      setSelectedItem({ ...selectedItem, quantity: newQuantity, status: newStatus });
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setIsBottomSheetOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <>
      <ZaikoHeader title="在庫一覧" />
      <ZaikoShell>
        <ZaikoContent>
          {/* アラートバナー */}
          <AlertBanner
            count={alertCount}
            onClick={() => router.push('/zaiko/tobuy')}
          />

          {/* セクションタイトル */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-4 text-2xl font-bold">マイ在庫</h2>
          </motion.div>

          {/* フィルターチップ */}
          <InventoryFilterChips
            filters={INVENTORY_CATEGORIES}
            activeId={activeFilter}
            onChange={setActiveFilter}
          />

          {/* 在庫リスト */}
          <InventoryList
            items={filteredItems}
            onItemClick={handleItemClick}
            onQuickEdit={handleQuickEdit}
          />
        </ZaikoContent>

        {/* FAB */}
        <FabAddButton onClick={() => router.push('/zaiko/input')} />
      </ZaikoShell>

      {/* クイック編集 Bottom Sheet */}
      <ZaikoBottomSheet
        open={isBottomSheetOpen}
        onOpenChange={setIsBottomSheetOpen}
        title="クイック編集"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* アイテム情報 */}
            <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-4xl">
                {selectedItem.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold">{selectedItem.name}</h3>
                {selectedItem.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedItem.location}
                  </div>
                )}
              </div>
            </div>

            {/* 数量調整 */}
            <div>
              <label className="mb-3 block text-sm font-semibold">在庫数量</label>
              <div className="flex justify-center">
                <InventoryQuantityStepper
                  value={selectedItem.quantity}
                  onChange={handleQuantityChange}
                />
              </div>
            </div>

            <Separator />

            {/* アクション */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-base"
                onClick={() => {
                  setIsBottomSheetOpen(false);
                  router.push(`/zaiko/detail/${selectedItem.id}`);
                }}
              >
                詳細を編集
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-base text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                削除
              </Button>
            </div>
          </div>
        )}
      </ZaikoBottomSheet>
    </>
  );
}

