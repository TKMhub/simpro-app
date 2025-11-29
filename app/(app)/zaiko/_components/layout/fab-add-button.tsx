'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FabAddButtonProps {
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
}

export function FabAddButton({
  onClick,
  className,
  icon,
  label = '追加',
}: FabAddButtonProps) {
  return (
    <motion.div
      className={cn('fixed bottom-6 right-6 z-40', className)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      }}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onClick}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-[#32D17D] hover:bg-[#2BB870] text-white"
          aria-label={label}
        >
          {icon || <Plus className="h-6 w-6" />}
        </Button>
      </motion.div>
    </motion.div>
  );
}

