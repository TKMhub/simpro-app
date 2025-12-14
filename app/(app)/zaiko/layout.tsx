import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zaiko. - 家庭の在庫管理をゼロに',
  description: '家族で使える在庫管理アプリ。買い忘れも、買いすぎも、もうありません。',
};

export default function ZaikoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex justify-center w-full font-sans antialiased text-zinc-900 dark:text-zinc-50">
      <div className="w-full max-w-[430px] bg-white dark:bg-black min-h-screen shadow-2xl overflow-hidden relative flex flex-col">
        {children}
      </div>
    </div>
  );
}

