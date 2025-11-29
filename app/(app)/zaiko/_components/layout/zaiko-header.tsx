'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ZaikoHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function ZaikoHeader({
  title,
  showBack = false,
  onBack,
  rightAction,
}: ZaikoHeaderProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/zaiko/dashboard', label: 'ダッシュボード', icon: '🏠' },
    { href: '/zaiko/tobuy', label: '買い物リスト', icon: '🛒' },
    { href: '/zaiko/member', label: 'メンバー管理', icon: '👥' },
    { href: '/zaiko/alert', label: '通知履歴', icon: '🔔' },
    { href: '/zaiko/settings', label: '設定', icon: '⚙️' },
  ];

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {/* 左側 */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link href="/zaiko" className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
            </Link>
          )}
        </div>

        {/* 中央 */}
        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-tight">
            {title}
          </h1>
        )}

        {/* 右側 */}
        <div className="flex items-center gap-2">
          {rightAction || (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-1 pt-8">
                  <div className="mb-6 flex items-center gap-3 border-b pb-4">
                    <span className="text-3xl">📦</span>
                    <div>
                      <h2 className="font-bold text-lg">Zaiko</h2>
                      <p className="text-xs text-muted-foreground">
                        在庫管理アプリ
                      </p>
                    </div>
                  </div>
                  {menuItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-3 text-base"
                      >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </motion.header>
  );
}

