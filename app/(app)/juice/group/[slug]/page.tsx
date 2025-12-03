'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus, History, Users, Share2 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

// --- Mock Data ---
const summary = {
  totalGames: 25,
  totalPlayers: 4,
   myBalance: 7,
};

const recentHistory = [
  { id: 1, date: '2023/12/02', players: 4, myRank: 1, point: 2 },
  { id: 2, date: '2023/12/01', players: 4, myRank: 3, point: -1 },
  { id: 3, date: '2023/11/28', players: 2, myRank: 2, point: -1 },
  { id: 4, date: '2023/11/25', players: 3, myRank: 1, point: 2 },
];

// Data for "Who owes whom"
const totalBalanceData = [
  { name: '自分', Taro: 5, Jiro: 2, Saburo: 0 },
  { name: 'Taro', 自分: -5, Jiro: -3, Saburo: 1 },
  { name: 'Jiro', 自分: -2, Taro: 3, Saburo: -1 },
  { name: 'Saburo', 自分: 0, Taro: -1, Jiro: 1 },
];

const dailyBalanceData = [
   { name: '自分', Taro: 1, Jiro: 0, Saburo: 1 },
   { name: 'Taro', 自分: -1, Jiro: 1, Saburo: 0 },
   { name: 'Jiro', 自分: 0, Taro: -1, Saburo: -1 },
   { name: 'Saburo', 自分: -1, Taro: 0, Jiro: 1 },
];
// --- End Mock Data ---


export default function GroupPage() {
  const params = useParams<{ slug: string }>();
  const [view, setView] = useState('total'); // 'total' or 'daily'
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const chartData = view === 'total' ? totalBalanceData : dailyBalanceData;
  const otherPlayers = totalBalanceData.map(p => p.name).filter(name => name !== '自分');

  const handleShare = () => {
    // In a real app, this would copy the URL to the clipboard
    // For example: navigator.clipboard.writeText(window.location.href);
    alert('Group URL copied to clipboard! (mock)');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <header className="px-6 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Juice<span className="text-cyan-500">.</span>
          </h1>
          {/* <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Group ID: {params.slug}</p> */}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <Link href={`/juice/group/${params.slug}/profile`} className="flex items-center space-x-2 text-sm font-bold bg-white dark:bg-slate-900 pr-3 pl-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              {/* In a real app, this would be an Image component with the user's avatar */}
              <span className="text-xs">👤</span>
            </div>
            <span className="text-slate-800 dark:text-white">自分</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-cyan-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-cyan-100 text-sm font-bold uppercase tracking-wider mb-1">My Net Balance</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-black">{summary.myBalance > 0 ? '+' : ''}{summary.myBalance}</span>
                <span className="text-xl font-bold opacity-80">本</span>
              </div>
              <p className="mt-2 text-sm opacity-90 font-medium">
                あなたは現在、勝ち越しています！
              </p>
            </div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/30 flex items-center justify-center mb-3 text-slate-500 dark:text-slate-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">Total Games</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalGames}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/30 flex items-center justify-center mb-3 text-slate-500 dark:text-slate-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">Players</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summary.totalPlayers}</p>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">対戦相手別バランス</h2>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full text-xs font-bold">
              <button onClick={() => setView('total')} className={`px-3 py-1 rounded-full ${view === 'total' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>Total</button>
              <button onClick={() => setView('daily')} className={`px-3 py-1 rounded-full ${view === 'daily' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>Daily</button>
            </div>
          </div>
          <div className="h-64 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.5)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                {otherPlayers.map((player, index) => (
                  <Bar key={player} dataKey={player} stackId="a" fill={['#06b6d4', '#ec4899', '#f59e0b'][index % 3]} radius={[0, 0, 0, 0]} />
                ))}
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
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${log.point > 0 ? 'bg-cyan-50 dark:bg-cyan-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <span className="text-xs font-bold text-slate-400">{log.myRank}位</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{log.players}人対戦</p>
                    <p className="text-xs text-slate-400 font-medium">{log.date}</p>
                  </div>
                </div>
                <div className={`font-black text-lg ${log.point > 0 ? 'text-cyan-500' : 'text-slate-400'}`}>
                  {log.point > 0 ? '+' : ''}{log.point}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6">
        <Link 
          href={`/juice/group/${params.slug}/record`}
          className="w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
}
