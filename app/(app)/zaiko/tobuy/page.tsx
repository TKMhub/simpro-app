'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { ZaikoShell, ZaikoContent } from '../_components/layout/zaiko-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { staggerContainer, staggerItem } from '../_lib/motion-presets';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Share2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ToBuyItem {
  id: string;
  name: string;
  icon: string;
  currentQuantity: number;
  targetQuantity: number;
  needQuantity: number;
  status: 'empty' | 'low';
  checked: boolean;
}

const mockToBuyItems: ToBuyItem[] = [
  {
    id: '1',
    name: 'トイレットペーパー',
    icon: '🧻',
    currentQuantity: 3,
    targetQuantity: 10,
    needQuantity: 7,
    status: 'low',
    checked: false,
  },
  {
    id: '2',
    name: '食器用洗剤',
    icon: '🧼',
    currentQuantity: 1,
    targetQuantity: 3,
    needQuantity: 2,
    status: 'empty',
    checked: false,
  },
  {
    id: '4',
    name: 'ティッシュボックス',
    icon: '📄',
    currentQuantity: 2,
    targetQuantity: 5,
    needQuantity: 3,
    status: 'low',
    checked: false,
  },
];

export default function ZaikoToBuyPage() {
  const router = useRouter();
  const [items, setItems] = useState<ToBuyItem[]>(mockToBuyItems);

  const uncheckedCount = items.filter((item) => !item.checked).length;
  const checkedCount = items.filter((item) => item.checked).length;

  const handleCheck = (itemId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleShare = () => {
    const itemList = items
      .filter((item) => !item.checked)
      .map((item) => `${item.icon} ${item.name} × ${item.needQuantity}個`)
      .join('\n');

    const shareText = `【買い物リスト】\n\n${itemList}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Zaiko 買い物リスト',
          text: shareText,
        })
        .then(() => toast.success('共有しました'))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('買い物リストをコピーしました');
    }
  };

  const handleCompleteAll = () => {
    // TODO: Phase 3で在庫数を更新
    toast.success('購入完了としてマークしました！');
    setItems(items.map((item) => ({ ...item, checked: true })));
  };

  const statusColors = {
    empty: 'border-[#FF3B30]/30 bg-[#FF3B30]/5',
    low: 'border-[#FFB800]/30 bg-[#FFB800]/5',
  };

  const statusBadgeColors = {
    empty: 'bg-[#FF3B30] text-white',
    low: 'bg-[#FFB800] text-white',
  };

  const statusLabels = {
    empty: '在庫切れ',
    low: '残り少',
  };

  return (
    <>
      <ZaikoHeader
        title="買い物リスト"
        showBack
        onBack={() => router.back()}
        rightAction={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        }
      />
      <ZaikoShell>
        <ZaikoContent>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* サマリーカード */}
            <motion.div variants={staggerItem}>
              <Card className="border-2 border-[#32D17D] bg-gradient-to-br from-[#32D17D]/10 to-[#32D17D]/5">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#32D17D]" />
                    <h2 className="text-lg font-bold">買うべきアイテム</h2>
                  </div>
                  <div className="flex items-end gap-4">
                    <div>
                      <div className="text-4xl font-bold text-[#32D17D]">
                        {uncheckedCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        残りアイテム
                      </div>
                    </div>
                    {checkedCount > 0 && (
                      <div>
                        <div className="text-2xl font-bold text-muted-foreground">
                          {checkedCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          完了
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* リストアイテム */}
            {items.length === 0 ? (
              <motion.div
                variants={staggerItem}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center"
              >
                <div className="mb-4 text-6xl">🎉</div>
                <h3 className="mb-2 text-lg font-bold">
                  買うものはありません
                </h3>
                <p className="text-sm text-muted-foreground">
                  すべての在庫が十分です
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`border-2 transition-all ${
                        item.checked
                          ? 'opacity-50 grayscale'
                          : statusColors[item.status]
                      }`}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        {/* チェックボックス */}
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => handleCheck(item.id)}
                          className="h-6 w-6"
                        />

                        {/* アイコン */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background text-3xl">
                          {item.icon}
                        </div>

                        {/* 情報 */}
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`mb-1 truncate text-base font-bold ${
                              item.checked ? 'line-through' : ''
                            }`}
                          >
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              {item.needQuantity}個 買う
                            </span>
                            <span>•</span>
                            <span>
                              残り: {item.currentQuantity}個 → 目標:{' '}
                              {item.targetQuantity}個
                            </span>
                          </div>
                        </div>

                        {/* ステータスバッジ */}
                        {!item.checked && (
                          <Badge
                            className={`shrink-0 px-3 py-1 text-xs font-bold ${statusBadgeColors[item.status]}`}
                          >
                            {statusLabels[item.status]}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* アクションボタン */}
            {items.length > 0 && (
              <motion.div variants={staggerItem} className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-[#32D17D] text-base font-bold text-white hover:bg-[#2BB870]"
                  onClick={handleCompleteAll}
                  disabled={uncheckedCount === 0}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  すべて購入完了
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 text-base font-semibold"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                  リストを共有
                </Button>
              </motion.div>
            )}
          </motion.div>
        </ZaikoContent>
      </ZaikoShell>
    </>
  );
}

