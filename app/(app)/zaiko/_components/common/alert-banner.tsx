'use client';

import { motion } from 'framer-motion';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { slideInDown } from '../../_lib/motion-presets';

interface AlertBannerProps {
  count: number;
  onClick: () => void;
}

export function AlertBanner({ count, onClick }: AlertBannerProps) {
  if (count === 0) return null;

  return (
    <motion.div
      variants={slideInDown}
      initial="hidden"
      animate="visible"
      className="mb-4"
    >
      <Alert
        className="cursor-pointer border-[#FFB800] bg-[#FFB800]/10 hover:bg-[#FFB800]/20 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-[#FFB800]" />
            <AlertDescription className="font-medium text-base">
              要チェックの在庫が {count} 件あります
            </AlertDescription>
          </div>
          <ChevronRight className="h-5 w-5 text-[#FFB800]" />
        </div>
      </Alert>
    </motion.div>
  );
}

