import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ZaikoShellProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ZaikoShell({ children, className, noPadding = false }: ZaikoShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex justify-center w-full">
      <div className="w-full max-w-[430px] bg-white dark:bg-zinc-950 min-h-screen shadow-2xl overflow-hidden relative flex flex-col">
        <ScrollArea className="flex-1 h-full w-full">
          <main className={cn('flex-1', !noPadding && 'px-4 py-6', className)}>
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}

