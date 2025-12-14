import React from 'react';
import { cn } from '@/lib/utils';

interface SectionBlockProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
}

export function SectionBlock({
  title,
  subtitle,
  children,
  className,
  dark = false,
  id,
}: SectionBlockProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-12 px-6',
        dark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-8 text-center space-y-2">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {subtitle && (
            <p className={cn("text-sm", dark ? "text-zinc-400" : "text-zinc-500")}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="mx-auto">
        {children}
      </div>
    </section>
  );
}

