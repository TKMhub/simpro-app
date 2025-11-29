"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Filter {
  id: string;
  label: string;
}

interface InventoryFilterChipsProps {
  filters: Filter[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function InventoryFilterChips({
  filters,
  activeId,
  onChange,
  className,
}: InventoryFilterChipsProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide",
        className
      )}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {filters.map((filter) => {
        const isActive = filter.id === activeId;
        return (
          <motion.div
            key={filter.id}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(filter.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap",
                isActive
                  ? "bg-[#32D17D] hover:bg-[#22C55E] text-white border-[#32D17D]"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              )}
            >
              {filter.label}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

