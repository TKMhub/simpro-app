'use client';

import Link from 'next/link';
import { Plus, TrendingUp, TrendingDown, History, User } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  // Mock Data
  const summary = {
    won: 12,
    lost: 5,
    balance: 7,
  };

  const recentHistory = [
    { id: 1, date: '2023/12/01', opponent: 'Ken', item: 'ジュース', amount: 1, result: 'win' },
    { id: 2, date: '2023/11/28', opponent: 'Taro', item: 'ランチ', amount: 1, result: 'lose' },
    { id: 3, date: '2023/11/25', opponent: 'Ken', item: 'コーヒー', amount: 2, result: 'win' },
    { id: 4, date: '2023/11/20', opponent: 'Jiro', item: 'ジュース', amount: 1, result: 'win' },
  ];

  const chartData = [
    { name: 'Ken', balance: 3 },
    { name: 'Taro', balance: -1 },
    { name: 'Jiro', balance: 1 },
    { name: 'Sato', balance: 4 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <header className="px-6 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Juice<span className="text-cyan-500">.</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Dashboard</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
          <User className="w-5 h-5 text-slate-400" />
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-cyan-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-cyan-100 text-sm font-bold uppercase tracking-wider mb-1">Net Balance</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-black">+{summary.balance}</span>
                <span className="text-xl font-bold opacity-80">本</span>
              </div>
              <p className="mt-2 text-sm opacity-90 font-medium">
                あなたは現在、勝ち越しています！
              </p>
            </div>
            {/* Decor */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3 text-green-600 dark:text-green-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">Total Won</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.won}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3 text-red-500 dark:text-red-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">Total Lost</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.lost}</p>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">対戦相手別収支</h2>
          </div>
          <div className="h-64 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="balance" 
                  fill="#06b6d4" 
                  radius={[6, 6, 6, 6]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* History Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              最近の履歴
            </h2>
            <Link href="#" className="text-xs font-bold text-cyan-500 hover:text-cyan-600">
              すべて見る
            </Link>
          </div>
          <div className="space-y-3">
            {recentHistory.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-12 rounded-full ${log.result === 'win' ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{log.item} x{log.amount}</p>
                    <p className="text-xs text-slate-400 font-medium">vs {log.opponent} • {log.date}</p>
                  </div>
                </div>
                <div className={`font-black text-lg ${log.result === 'win' ? 'text-cyan-500' : 'text-slate-400'}`}>
                  {log.result === 'win' ? '+' : '-'}{log.amount}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6">
        <Link 
          href="/juice/record" 
          className="w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
}
