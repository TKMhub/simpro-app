import React from 'react';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
}

interface InventoryFilterChipsProps {
  options: readonly FilterOption[];
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function InventoryFilterChips({
  options,
  selectedId,
  onChange,
  className,
}: InventoryFilterChipsProps) {
  return (
    <div className={cn('w-full bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-14 z-40 py-2 border-b border-zinc-100 dark:border-zinc-900', className)}>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex w-max space-x-2 px-4 py-1">
          <button
            onClick={() => onChange('all')}
            className={cn(
              'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-all shrink-0',
              selectedId === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            )}
          >
            すべて
          </button>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={cn(
                'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-all shrink-0',
                selectedId === option.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
