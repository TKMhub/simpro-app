import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
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
}: QuantityStepperProps) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= min}
        className="h-12 w-12 rounded-full border-2"
      >
        <Minus className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 text-center">
        <span className="text-4xl font-bold tabular-nums tracking-tight">
          {value}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
        className="h-12 w-12 rounded-full border-2"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}

