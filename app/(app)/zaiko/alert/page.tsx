'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { ZaikoShell, ZaikoContent } from '../_components/layout/zaiko-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { staggerContainer, staggerItem } from '../_lib/motion-presets';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Alert {
  id: string;
  itemName: string;
  icon: string;
  type: 'low' | 'empty';
  quantity: number;
  timestamp: Date;
  isRead: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    itemName: '食器用洗剤',
    icon: '🧼',
    type: 'empty',
    quantity: 1,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分前
    isRead: false,
  },
  {
    id: '2',
    itemName: 'トイレットペーパー',
    icon: '🧻',
    type: 'low',
    quantity: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2時間前
    isRead: false,
  },
  {
    id: '3',
    itemName: 'ティッシュボックス',
    icon: '📄',
    type: 'low',
    quantity: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5時間前
    isRead: true,
  },
  {
    id: '4',
    itemName: 'ハンドソープ',
    icon: '🧴',
    type: 'empty',
    quantity: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1日前
    isRead: true,
  },
];

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days === 1) return '昨日';
  return `${days}日前`;
}

export default function ZaikoAlertPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map((alert) => ({ ...alert, isRead: true })));
  };

  const typeLabels = {
    low: '残り少',
    empty: '在庫切れ',
  };

  const typeColors = {
    low: 'border-[#FFB800]/30 bg-[#FFB800]/5',
    empty: 'border-[#FF3B30]/30 bg-[#FF3B30]/5',
  };

  const typeBadgeColors = {
    low: 'bg-[#FFB800] text-white',
    empty: 'bg-[#FF3B30] text-white',
  };

  return (
    <>
      <ZaikoHeader
        title="通知履歴"
        showBack
        onBack={() => router.back()}
        rightAction={
          unreadCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
              onClick={handleMarkAllAsRead}
            >
              すべて既読
            </Button>
          ) : undefined
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
            {/* サマリー */}
            {unreadCount > 0 && (
              <motion.div variants={staggerItem}>
                <Card className="border-2 border-[#FFB800] bg-[#FFB800]/10">
                  <CardContent className="flex items-center gap-3 p-4">
                    <AlertCircle className="h-6 w-6 shrink-0 text-[#FFB800]" />
                    <div>
                      <p className="font-bold">
                        {unreadCount}件の未読通知があります
                      </p>
                      <p className="text-sm text-muted-foreground">
                        早めに対応しましょう
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 通知リスト */}
            {alerts.length === 0 ? (
              <motion.div
                variants={staggerItem}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center"
              >
                <div className="mb-4 text-6xl">🔔</div>
                <h3 className="mb-2 text-lg font-bold">通知はありません</h3>
                <p className="text-sm text-muted-foreground">
                  在庫アラートが発生すると、ここに表示されます
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`border-2 transition-all ${
                        alert.isRead
                          ? 'opacity-60 grayscale'
                          : typeColors[alert.type]
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-start gap-4">
                          {/* アイコン */}
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background text-3xl">
                            {alert.icon}
                          </div>

                          {/* 情報 */}
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <h3 className="text-base font-bold">
                                {alert.itemName}
                              </h3>
                              <Badge
                                className={`shrink-0 px-2 py-0.5 text-xs font-bold ${typeBadgeColors[alert.type]}`}
                              >
                                {typeLabels[alert.type]}
                              </Badge>
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">
                              {alert.type === 'empty'
                                ? '在庫が切れました'
                                : `残り${alert.quantity}個です`}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {formatTimestamp(alert.timestamp)}
                            </div>
                          </div>
                        </div>

                        {/* アクション */}
                        <div className="flex gap-2">
                          {!alert.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-1 text-xs"
                              onClick={() => handleMarkAsRead(alert.id)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              既読にする
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs font-semibold"
                            onClick={() => router.push('/zaiko/tobuy')}
                          >
                            買い物リストへ
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </ZaikoContent>
      </ZaikoShell>
    </>
  );
}

