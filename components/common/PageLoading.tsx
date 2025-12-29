"use client"
import React from 'react';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type PageLoadingProps = {
  className?: string;
  message?: string;
};

export default function PageLoading({ className, message }: PageLoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[50vh] flex-1 p-6 animate-in fade-in duration-300", className)}>
      <div className="relative mb-8">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
        
        {/* Logo */}
        <div className="relative w-16 h-16 animate-bounce-slow">
            <Image
                src="/juice-logo.svg"
                alt="Juice Loading"
                fill
                className="object-contain drop-shadow-lg"
                priority
            />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-3">
        <Spinner className="w-6 h-6 text-cyan-500" />
        {message && (
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                {message}
            </p>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
