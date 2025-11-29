"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

export function AlertBanner({ count, onClick, className }: AlertBannerProps) {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "mx-4 mt-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800",
        className
      )}
    >
      <Button
        variant="ghost"
        onClick={onClick}
        className="w-full justify-between p-4 h-auto hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
            要チェックの在庫が <span className="font-bold">{count}</span> 件あります
          </span>
        </div>
        <ChevronRight className="size-5 text-yellow-600 dark:text-yellow-400" />
      </Button>
    </motion.div>
  );
}

