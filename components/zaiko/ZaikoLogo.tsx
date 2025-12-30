import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ZaikoLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function ZaikoLogo({ className, showText = true, textClassName }: ZaikoLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-8 w-8 shrink-0">
        <Image 
          src="/zaiko-logo.svg" 
          alt="Zaiko Logo" 
          fill 
          className="object-contain" 
          priority
        />
      </div>
      {showText && (
        <span className={cn("text-lg font-bold tracking-tight", textClassName)}>
          Zaiko<span className="text-green-500">.</span>
        </span>
      )}
    </div>
  );
}

