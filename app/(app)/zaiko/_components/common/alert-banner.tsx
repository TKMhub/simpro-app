import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  count: number;
  href?: string;
  className?: string;
}

export function AlertBanner({ count, href = '/zaiko/tobuy', className }: AlertBannerProps) {
  if (count <= 0) return null;

  return (
    <Link href={href} className={cn("block px-4 py-2", className)}>
      <div className="flex items-center justify-between rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 p-3 active:scale-[0.98] transition-transform">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-orange-900 dark:text-orange-100">
              在庫切れ・不足あり
            </span>
            <span className="text-xs text-orange-700 dark:text-orange-300">
              要チェックのアイテムが <span className="font-bold">{count}</span> 件あります
            </span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-orange-400" />
      </div>
    </Link>
  );
}

