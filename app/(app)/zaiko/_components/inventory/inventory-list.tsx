"use client";

import { motion, AnimatePresence } from "framer-motion";
import { InventoryCard } from "./inventory-card";
import { InventoryStatus } from "../../_lib/zaiko-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItem } from "../../_lib/motion-presets";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location?: string;
  status: InventoryStatus;
  iconName?: string;
}

interface InventoryListProps {
  items: InventoryItem[];
  isLoading?: boolean;
  onItemClick: (id: string) => void;
  onQuickEdit: (id: string) => void;
}

export function InventoryList({
  items,
  isLoading = false,
  onItemClick,
  onQuickEdit,
}: InventoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 px-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          在庫が登録されていません
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4 px-4 pb-24"
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={staggerItem}
            custom={index}
          >
            <InventoryCard
              name={item.name}
              quantity={item.quantity}
              location={item.location}
              status={item.status}
              iconName={item.iconName}
              onClick={() => onItemClick(item.id)}
              onQuickEdit={() => onQuickEdit(item.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

