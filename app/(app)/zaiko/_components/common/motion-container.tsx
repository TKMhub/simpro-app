import React from 'react';
import { cn } from '@/lib/utils';

// Simple fade-in animation container using Tailwind CSS animation utilities
// since we are avoiding adding framer-motion dependency for now.

interface MotionContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: 'none' | 'small' | 'medium' | 'long';
}

export function MotionContainer({ children, className, delay = 'none' }: MotionContainerProps) {
  const delayClass = {
    none: '',
    small: 'delay-100',
    medium: 'delay-300',
    long: 'delay-500',
  }[delay];

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both',
        delayClass,
        className
      )}
    >
      {children}
    </div>
  );
}

