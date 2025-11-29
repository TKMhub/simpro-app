"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Package } from "lucide-react";
import { InventoryStatus, INVENTORY_STATUS_CONFIG } from "../../_lib/zaiko-constants";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface InventoryCardProps {
  name: string;
  quantity: number;
  location?: string;
  status: InventoryStatus;
  iconName?: string;
  onClick: () => void;
  onQuickEdit: () => void;
  className?: string;
}

export function InventoryCard({
  name,
  quantity,
  location,
  status,
  iconName = "Package",
  onClick,
  onQuickEdit,
  className,
}: InventoryCardProps) {
  const statusConfig = INVENTORY_STATUS_CONFIG[status];
  const IconComponent =
    (LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{
      className?: string;
    }>) || Package;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("cursor-pointer", className)}
      onClick={onClick}
    >
      <Card className="p-4 hover:shadow-md transition-shadow border-2 hover:border-[#32D17D]/30 dark:hover:border-[#32D17D]/20">
        <div className="flex items-start gap-4">
          {/* アイコン */}
          <div className="flex-shrink-0">
            <div className="size-12 rounded-full bg-[#32D17D]/10 dark:bg-[#32D17D]/20 flex items-center justify-center">
              <IconComponent className="size-6 text-[#32D17D]" />
            </div>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {name}
              </h3>
              <Badge
                className={cn(
                  "text-xs font-medium px-2 py-0.5",
                  statusConfig.color,
                  statusConfig.bgColor
                )}
              >
                {statusConfig.label}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                残り: <span className="font-semibold">{quantity}</span>個
              </p>
              {location && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  保管場所: {location}
                </p>
              )}
            </div>
          </div>

          {/* クイック編集ボタン */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onQuickEdit();
            }}
            aria-label="クイック編集"
          >
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

