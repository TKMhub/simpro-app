'use client';

import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Save, Coffee, Beer, Utensils, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RecordPage() {
  const router = useRouter();
  const [winner, setWinner] = useState('自分');
  const [loser, setLoser] = useState('相手');
  const [item, setItem] = useState('ジュース');
  const [quantity, setQuantity] = useState(1);

  const presets = [
    { name: 'ジュース', icon: <Zap className="w-4 h-4" /> },
    { name: 'コーヒー', icon: <Coffee className="w-4 h-4" /> },
    { name: 'ランチ', icon: <Utensils className="w-4 h-4" /> },
    { name: 'ビール', icon: <Beer className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    // Phase 1: Just mock the save and redirect
    // In Phase 2, we will save to localStorage or DB
    console.log({ winner, loser, item, quantity });
    router.push('/juice/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="flex items-center px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <Link href="/juice/dashboard" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 text-lg font-bold text-slate-800 dark:text-white">記録する</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        {/* Players Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">WINNER (もらう人)</label>
              <input
                type="text"
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
                className="w-full text-lg font-bold p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-cyan-400 focus:outline-none shadow-sm text-slate-900 dark:text-white transition-colors"
              />
            </div>
            <div className="pt-6 text-slate-300 dark:text-slate-700">
              <ArrowRightIcon />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">LOSER (おごる人)</label>
              <input
                type="text"
                value={loser}
                onChange={(e) => setLoser(e.target.value)}
                className="w-full text-lg font-bold p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-transparent focus:border-red-400 focus:outline-none shadow-sm text-slate-900 dark:text-white transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Item Section */}
        <section className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">WHAT (賭けたもの)</label>
          <div className="grid grid-cols-2 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setItem(preset.name)}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold transition-all ${
                  item === preset.name
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {preset.icon}
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="その他..."
            className="w-full mt-2 p-3 rounded-xl bg-transparent border-2 border-slate-200 dark:border-slate-800 focus:border-cyan-400 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
          />
        </section>

        {/* Quantity Section */}
        <section className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">AMOUNT (数量)</label>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors active:scale-95"
            >
              <Minus className="w-8 h-8" />
            </button>
            
            <div className="flex items-baseline space-x-2">
              <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                {quantity}
              </span>
              <span className="text-xl font-bold text-slate-400">本/個</span>
            </div>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors active:scale-95"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
        </section>
      </main>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-[430px] pointer-events-auto">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center space-x-2 text-lg"
          >
            <Save className="w-5 h-5" />
            <span>記録を保存</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
