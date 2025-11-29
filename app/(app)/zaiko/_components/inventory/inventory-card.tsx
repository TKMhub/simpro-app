import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { InventoryStatus, STATUS_CONFIG } from '../../_lib/zaiko-constants';

interface InventoryCardProps {
  name: string;
  quantity: number;
  location?: string;
  status: InventoryStatus;
  iconName?: string; // Emoji or icon name
  onClick?: () => void;
  onQuickEdit?: (e: React.MouseEvent) => void;
  className?: string;
}

export function InventoryCard({
  name,
  quantity,
  location,
  status,
  iconName = '📦',
  onClick,
  onQuickEdit,
  className,
}: InventoryCardProps) {
  const statusConfig = STATUS_CONFIG[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 p-4 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer',
        className
      )}
    >
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-2xl">
        {iconName}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-base truncate text-zinc-900 dark:text-zinc-100">
            {name}
          </h3>
          <Badge
            variant="secondary"
            className={cn('h-5 px-1.5 text-[10px] font-normal gap-1', statusConfig.color)}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', statusConfig.dot)} />
            {statusConfig.label}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>残り: <span className="font-medium text-zinc-900 dark:text-zinc-200 text-sm">{quantity}</span> 個</span>
          {location && (
            <span className="truncate max-w-[100px] border-l border-zinc-200 dark:border-zinc-700 pl-3">
              {location}
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 -mr-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        onClick={(e) => {
          e.stopPropagation();
          onQuickEdit?.(e);
        }}
      >
        <MoreHorizontal className="h-5 w-5" />
        <span className="sr-only">メニュー</span>
      </Button>
    </div>
  );
}

