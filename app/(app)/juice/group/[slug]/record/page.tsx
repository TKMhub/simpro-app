'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, GripVertical, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

const initialPlayers = [
  { id: 1, name: '自分', rank: 1, points: 0 },
  { id: 2, name: 'Taro', rank: 2, points: 0 },
  { id: 3, name: 'Jiro', rank: 3, points: 0 },
  { id: 4, name: 'Saburo', rank: 4, points: 0 },
];

const initialRankSettings = [
  { rank: 1, points: 2 },
  { rank: 2, points: 1 },
  { rank: 3, points: -1 },
  { rank: 4, points: -2 },
];

export default function RecordPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [players, setPlayers] = useState(initialPlayers);
  const [rankSettings, setRankSettings] = useState(initialRankSettings);

  useEffect(() => {
    // Recalculate points whenever rankSettings change
    const updatedPlayers = players.map(player => {
      const setting = rankSettings.find(s => s.rank === player.rank);
      return { ...player, points: setting ? setting.points : 0 };
    });
    setPlayers(updatedPlayers);
  }, [rankSettings, players]);

  
  const handlePointSettingChange = (rank, newPoints) => {
    const updatedSettings = rankSettings.map(setting =>
      setting.rank === rank ? { ...setting, points: newPoints } : setting
    );
    setRankSettings(updatedSettings);
  };

  const handleSave = () => {
    console.log({ players, rankSettings });
    router.push(`/juice/group/${params.slug}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="flex items-center px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <Link href={`/juice/group/${params.slug}`} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 text-lg font-bold text-slate-800 dark:text-white">勝敗を記録</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Players & Ranks</label>
            <button className="text-xs font-bold text-cyan-500">Add Player</button>
          </div>
          <div className="space-y-3">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </section>
        
        <section>
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Point Allocation</label>
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
             <div className="space-y-2">
              {rankSettings.map(setting => (
                <div key={setting.rank} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{setting.rank}位</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={setting.points}
                      onChange={(e) => handlePointSettingChange(setting.rank, parseInt(e.target.value, 10) || 0)}
                      className="w-16 text-right font-bold bg-slate-100 dark:bg-slate-800 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-white"
                    />
                    <span className="font-bold w-6 text-right pr-1">pt</span>
                  </div>
                </div>
              ))}
             </div>
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

function PlayerCard({ player }) {
  const rankColor = {
    1: 'text-amber-400',
    2: 'text-slate-400',
    3: 'text-orange-400'
  }

  return (
    <div className="flex items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <GripVertical className="w-5 h-5 text-slate-300 dark:text-slate-600 mr-3 cursor-grab active:cursor-grabbing" />
      <div className="flex-1 flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${rankColor[player.rank] || 'text-slate-500'}`}>
          {player.rank === 1 ? <Crown className="w-6 h-6 text-amber-400" /> : player.rank}
        </div>
        <input 
          type="text"
          value={player.name}
          readOnly // For now, the name is not editable in this component
          className="ml-4 font-bold text-slate-800 dark:text-white bg-transparent focus:outline-none"
        />
      </div>
      <div className="flex items-center space-x-2">
         <span className={`font-black text-lg ${player.points > 0 ? 'text-cyan-500' : 'text-slate-400'}`}>
           {player.points > 0 ? '+' : ''}{player.points}
         </span>
      </div>
    </div>
  );
}
