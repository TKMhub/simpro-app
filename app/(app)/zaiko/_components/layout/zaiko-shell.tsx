'use client';

import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ZaikoShellProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

export function ZaikoShell({
  children,
  className,
  withPadding = true,
}: ZaikoShellProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="mx-auto max-w-[430px]">
        <motion.div
          className={cn(
            'relative min-h-screen',
            withPadding && 'px-4 pb-20',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

interface ZaikoContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ZaikoContent({ children, className }: ZaikoContentProps) {
  return (
    <motion.div
      className={cn('space-y-4', className)}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

