'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Filter {
  id: string;
  label: string;
  icon?: string;
}

interface InventoryFilterChipsProps {
  filters: Filter[];
  activeId: string;
  onChange: (id: string) => void;
}

export function InventoryFilterChips({
  filters,
  activeId,
  onChange,
}: InventoryFilterChipsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4">
      <div className="flex gap-2">
        {filters.map((filter) => {
          const isActive = filter.id === activeId;
          return (
            <motion.div
              key={filter.id}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Badge
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer px-4 py-2 text-sm font-semibold transition-all hover:scale-105',
                  isActive
                    ? 'bg-[#32D17D] text-white hover:bg-[#2BB870]'
                    : 'border-2 hover:bg-muted'
                )}
                onClick={() => onChange(filter.id)}
              >
                {filter.icon && <span className="mr-1.5">{filter.icon}</span>}
                {filter.label}
              </Badge>
            </motion.div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

