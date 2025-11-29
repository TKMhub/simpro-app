'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryQuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function InventoryQuantityStepper({
  value,
  min = 0,
  max = 999,
  onChange,
  className,
}: InventoryQuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2"
          onClick={handleDecrement}
          disabled={value <= min}
        >
          <Minus className="h-5 w-5" />
        </Button>
      </motion.div>

      <div className="relative flex h-16 w-24 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-4xl font-bold tabular-nums"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2 bg-[#32D17D] text-white hover:bg-[#2BB870] hover:text-white"
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}

