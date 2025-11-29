"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FabAddButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function FabAddButton({
  onClick,
  icon,
  className,
  "aria-label": ariaLabel = "追加",
}: FabAddButtonProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 200,
      }}
      className={cn(
        "fixed bottom-6 right-6 z-50 sm:right-1/2 sm:translate-x-[calc(50vw-215px)]",
        className
      )}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onClick}
          size="icon"
          className="h-14 w-14 rounded-full bg-[#32D17D] hover:bg-[#22C55E] shadow-lg shadow-green-500/30 dark:shadow-green-500/20"
          aria-label={ariaLabel}
        >
          {icon || <Plus className="size-6 text-white" />}
        </Button>
      </motion.div>
    </motion.div>
  );
}

