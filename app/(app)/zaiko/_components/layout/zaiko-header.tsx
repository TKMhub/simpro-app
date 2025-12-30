import React from 'react';
import Link from 'next/link';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ZaikoLogo } from '@/components/zaiko/ZaikoLogo';

interface ZaikoHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

export function ZaikoHeader({
  title = 'Zaiko',
  showBack = false,
  onBack,
  rightAction,
  className,
  transparent = false,
}: ZaikoHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 items-center justify-between px-4 transition-all duration-200',
        transparent
          ? 'bg-transparent text-white'
          : 'bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 dark:text-white border-b border-zinc-200 dark:border-zinc-800',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className={cn("-ml-2", transparent ? "hover:bg-white/20 text-white" : "")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Link href="/zaiko/dashboard" className="flex items-center gap-2">
            <ZaikoLogo showText={!title || title === 'Zaiko'} />
          </Link>
        )}
        {title && title !== 'Zaiko' && (
          <h1 className="text-base font-bold leading-none tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightAction || (
          <Button
            variant="ghost"
            size="icon"
            className={cn(transparent ? "hover:bg-white/20 text-white" : "")}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}

