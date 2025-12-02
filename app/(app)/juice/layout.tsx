import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Juice - 勝敗をジュースで精算',
  description: '負けた方がジュースをおごる。そんな日常の勝負を楽しく記録するアプリ。',
};

export default function JuiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center w-full font-sans antialiased text-slate-900 dark:text-slate-50 selection:bg-cyan-200 selection:text-cyan-900">
      <div className="w-full max-w-[430px] bg-white dark:bg-black min-h-screen shadow-2xl overflow-hidden relative flex flex-col border-x border-slate-200 dark:border-slate-800">
        {children}
      </div>
    </div>
  );
}
