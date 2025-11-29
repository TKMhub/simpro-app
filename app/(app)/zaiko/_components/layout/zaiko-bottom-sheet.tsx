"use client";

import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

interface ZaikoBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export function ZaikoBottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ZaikoBottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-t-2 border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
        >
          {(title || description) && (
            <SheetHeader className="text-left mb-4">
              {title && (
                <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </SheetTitle>
              )}
              {description && (
                <SheetDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </SheetDescription>
              )}
            </SheetHeader>
          )}
          <div className="pb-4">{children}</div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

