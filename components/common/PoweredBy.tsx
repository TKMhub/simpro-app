import ThemedLogo from '@/components/common/ThemedLogo';
import { cn } from '@/lib/utils';

interface PoweredByProps {
  className?: string;
}

export function PoweredBy({ className }: PoweredByProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 opacity-50 pb-8", className)}>
        <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Powered by</span>
        <div className="relative w-20 h-5">
            <ThemedLogo 
                width={80} 
                height={20} 
                className="w-full h-full object-contain" 
            />
        </div>
        <p className="text-[10px] text-zinc-400">“Simple is Professional”</p>
    </div>
  );
}

