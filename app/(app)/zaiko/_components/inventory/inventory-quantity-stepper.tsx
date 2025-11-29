"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryQuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
  label?: string;
}

export function InventoryQuantityStepper({
  value,
  min = 0,
  max,
  onChange,
  className,
  label,
}: InventoryQuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (max === undefined || value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-12 w-12 rounded-full border-2"
        >
          <Minus className="size-5" />
        </Button>

        <div className="flex-1 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold text-gray-900 dark:text-gray-100"
            >
              {value}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
          className="h-12 w-12 rounded-full border-2"
        >
          <Plus className="size-5" />
        </Button>
      </div>
    </div>
  );
}

