'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InventoryStatus } from '../../_lib/zaiko-constants';
import {
  getStatusColor,
  getStatusLabel,
} from '../../_lib/zaiko-constants';
import { tapAnimation } from '../../_lib/motion-presets';

interface InventoryCardProps {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  location?: string;
  status: InventoryStatus;
  onClick?: () => void;
  onQuickEdit?: () => void;
}

export function InventoryCard({
  name,
  icon,
  quantity,
  location,
  status,
  onClick,
  onQuickEdit,
}: InventoryCardProps) {
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  const statusColorClass =
    status === 'enough'
      ? 'bg-[#32D17D] text-white'
      : status === 'low'
        ? 'bg-[#FFB800] text-white'
        : 'bg-[#FF3B30] text-white';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={tapAnimation}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'cursor-pointer border-2 transition-all hover:shadow-md',
          status === 'empty' && 'border-[#FF3B30]/30',
          status === 'low' && 'border-[#FFB800]/30'
        )}
        onClick={onClick}
      >
        <CardContent className="flex items-center gap-4 p-4">
          {/* アイコン */}
          <div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl',
              status === 'enough' && 'bg-[#32D17D]/10',
              status === 'low' && 'bg-[#FFB800]/10',
              status === 'empty' && 'bg-[#FF3B30]/10'
            )}
          >
            {icon}
          </div>

          {/* 中央部分 */}
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate text-base font-bold">{name}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold">残り: {quantity}個</span>
              {location && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="truncate">{location}</span>
                </>
              )}
            </div>
          </div>

          {/* 右側 */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Badge className={cn('px-3 py-1 text-xs font-bold', statusColorClass)}>
              {statusLabel}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                onQuickEdit?.();
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

