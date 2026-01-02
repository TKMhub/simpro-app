import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PoweredByProps {
  className?: string;
}

export function PoweredBy({ className }: PoweredByProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 opacity-50 pb-8", className)}>
        <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Powered by</span>
        <div className="relative w-20 h-5">
            <Image 
                src="/Simplo_gray_main_sub.svg" 
                alt="Simplo" 
                fill 
                className="object-contain dark:invert" 
            />
        </div>
        <p className="text-[10px] text-zinc-400">“Simple is Professional”</p>
    </div>
  );
}

