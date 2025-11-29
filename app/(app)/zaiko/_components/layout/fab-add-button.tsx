import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FabAddButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function FabAddButton({ href = '/zaiko/input', onClick, className }: FabAddButtonProps) {
  const ButtonContent = (
    <Button
      size="icon"
      className={cn(
        "h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white transition-transform active:scale-90",
        className
      )}
      onClick={onClick}
    >
      <Plus className="h-7 w-7" />
    </Button>
  );

  if (href) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Link href={href}>
          {ButtonContent}
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {ButtonContent}
    </div>
  );
}

