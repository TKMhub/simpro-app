'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, History, Users, Share2, Check } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { JuiceProjectData, joinAsCurrentUser } from '@/lib/juice/actions';
import { toast } from 'sonner';

type Props = {
  project: JuiceProjectData;
  currentUserEmail?: string | null;
};

export default function DashboardClient({ project, currentUserEmail }: Props) {
  const [copied, setCopied] = useState(false);

  // --- Data Processing ---
  
  // Calculate stats per member
  const memberStats = project.members.map(member => {
    let totalPoints = 0;
    let gamesPlayed = 0;
    
    project.matches.forEach(match => {
      const result = match.results.find(r => r.memberId === member.id);
      if (result) {
        totalPoints += result.points;
        gamesPlayed++;
      }
    });

    return {
      ...member,
      totalPoints,
      gamesPlayed,
    };
  });

  // Identify "Me" (current user or first member as fallback/demo)
  // Logic: If currentUserEmail matches a member's linked user, that's "Me".
  // Otherwise, we might rely on a cookie or local storage ID in a real "no-login" app.
  // For this version, we'll try to find the member linked to the current user, or just pick the first one if not found to avoid crashing.
  // In a real scenario, we'd have a "Select who you are" modal if not logged in.
  const myMember = memberStats.find(m => m.userId && m.userId === currentUserEmail) || 
                   memberStats.find(m => m.name === '自分') || 
                   memberStats[0];

  const myBalance = myMember ? myMember.totalPoints : 0;
  
  // Chart Data Preparation (Simplified: Just showing total points per player for now)
  // The original "Vs Player" matrix is complex to calculate without specific match pairing logic.
  // We will show "Total Balance" for each player instead.
  const chartData = memberStats.map(m => ({
    name: m.name,
    points: m.totalPoints,
  }));

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('URLをコピーしました');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = async () => {
    const res = await joinAsCurrentUser(project.id, project.slug);
    if (res.success) {
      toast.success('参加しました！');
    } else {
      toast.error('参加に失敗しました: ' + res.error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <header className="px-6 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Juice<span className="text-cyan-500">.</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{project.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
          
          {myMember ? (
            <Link href={`/juice/group/${project.slug}/profile`} className="flex items-center space-x-2 text-sm font-bold bg-white dark:bg-slate-900 pr-3 pl-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                {myMember.avatarUrl ? (
                   <img src={myMember.avatarUrl} alt={myMember.name} className="w-full h-full object-cover" />
                ) : (
                   <span className="text-xs">👤</span>
                )}
              </div>
              <span className="text-slate-800 dark:text-white truncate max-w-[80px]">{myMember.name}</span>
            </Link>
          ) : (
            <button onClick={handleJoin} className="text-xs font-bold bg-cyan-500 text-white px-3 py-2 rounded-full hover:bg-cyan-600">
              参加する
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-cyan-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-cyan-100 text-sm font-bold uppercase tracking-wider mb-1">My Net Balance</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-black">{myBalance > 0 ? '+' : ''}{myBalance}</span>
                <span className="text-xl font-bold opacity-80">本</span>
              </div>
              <p className="mt-2 text-sm opacity-90 font-medium">
                {myBalance > 0 ? '勝ち越しています！' : myBalance < 0 ? '負け越しています...' : '現在プラスマイナスゼロです'}
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
              <p className="text-2xl font-black text-slate-900 dark:text-white">{project.matches.length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/30 flex items-center justify-center mb-3 text-slate-500 dark:text-slate-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">Players</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{project.members.length}</p>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">プレイヤースコア</h2>
            {/* View toggle could be implemented to switch chart types */}
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
                <Bar dataKey="points" fill="#06b6d4" radius={[4, 4, 4, 4]} />
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
          </div>
          <div className="space-y-3">
            {project.matches.map((match) => {
              // Find my result in this match
              const myResult = myMember ? match.results.find(r => r.memberId === myMember.id) : null;
              const point = myResult ? myResult.points : 0;
              const rank = myResult ? myResult.rank : '-';

              return (
                <div key={match.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${point > 0 ? 'bg-cyan-50 dark:bg-cyan-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      <span className="text-xs font-bold text-slate-400">{rank}位</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{match.results.length}人対戦</p>
                      <p className="text-xs text-slate-400 font-medium">{new Date(match.playedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`font-black text-lg ${point > 0 ? 'text-cyan-500' : 'text-slate-400'}`}>
                    {point > 0 ? '+' : ''}{point}
                  </div>
                </div>
              );
            })}
            {project.matches.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                まだ対戦履歴がありません。
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6">
        <Link 
          href={`/juice/group/${project.slug}/record`}
          className="w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
}

