'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, GripVertical, Crown, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JuiceProjectData, addMember, recordMatch } from '@/lib/juice/actions';
import { toast } from 'sonner';

// Re-using the types from the action or defining local ones for UI state
type PlayerUI = {
  id: string; // memberId
  name: string;
  rank: number;
  points: number;
};

type RankSetting = {
  rank: number;
  points: number;
};

// Default rank settings (can be adjusted)
const initialRankSettings: RankSetting[] = [
  { rank: 1, points: 2 },
  { rank: 2, points: 1 },
  { rank: 3, points: -1 },
  { rank: 4, points: -2 },
  { rank: 5, points: -3 }, // Extended just in case
];

type Props = {
  project: JuiceProjectData;
};

export default function RecordClient({ project }: Props) {
  const router = useRouter();
  
  // Initialize players from project members
  // Default to selecting the first 4 members or all if less than 4
  const [activePlayers, setActivePlayers] = useState<PlayerUI[]>([]);
  
  // Available members to add
  // const availableMembers = project.members.filter(m => !activePlayers.find(p => p.id === m.id));

  const [rankSettings, setRankSettings] = useState(initialRankSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initial setup: Take up to 4 members
    const initial = project.members.slice(0, 4).map((m, index) => ({
      id: m.id,
      name: m.name,
      rank: index + 1,
      points: 0, // Will be calculated
    }));
    setActivePlayers(initial);
  }, [project.members]);

  // Recalculate points when rankSettings or activePlayers change (re-indexing ranks)
  useEffect(() => {
    setActivePlayers(prev => {
      return prev.map((p, index) => {
        const rank = index + 1;
        const setting = rankSettings.find(s => s.rank === rank);
        return { 
          ...p, 
          rank, 
          points: setting ? setting.points : 0 
        };
      });
    });
  }, [rankSettings, activePlayers.length]); // Dependency on length to trigger re-calc on add/remove

  const handlePointSettingChange = (rank: number, newPoints: number) => {
    setRankSettings(prev => 
      prev.map(s => s.rank === rank ? { ...s, points: newPoints } : s)
    );
    // If we need to add a new rank setting dynamically
    if (!rankSettings.find(s => s.rank === rank)) {
        setRankSettings(prev => [...prev, { rank, points: newPoints }].sort((a, b) => a.rank - b.rank));
    }
  };

  const handleMovePlayer = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === activePlayers.length - 1) return;

    const newPlayers = [...activePlayers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newPlayers[index], newPlayers[targetIndex]] = [newPlayers[targetIndex], newPlayers[index]];
    
    setActivePlayers(newPlayers);
  };

  const handleAddMember = async () => {
    const name = prompt('新しいメンバーの名前を入力してください');
    if (!name) return;

    // Call server action to add member
    const res = await addMember(project.id, name);
    if (res.success && res.member) {
      toast.success(`${name}を追加しました`);
      // Add to active players
      setActivePlayers(prev => [
        ...prev,
        {
          id: res.member!.id,
          name: res.member!.name,
          rank: prev.length + 1,
          points: 0 // Will be calc'd by effect
        }
      ]);
    } else {
      toast.error('メンバー追加に失敗しました');
    }
  };

  // Select an existing member not currently in the game
  const handleAddExistingMember = (memberId: string) => {
    const member = project.members.find(m => m.id === memberId);
    if (!member) return;
    
    setActivePlayers(prev => [
      ...prev,
      {
        id: member.id,
        name: member.name,
        rank: prev.length + 1,
        points: 0
      }
    ]);
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const results = activePlayers.map(p => ({
        memberId: p.id,
        rank: p.rank,
        points: p.points,
      }));

      const res = await recordMatch(project.id, project.slug, new Date(), results);
      
      if (res.success) {
        toast.success('記録しました！');
        router.push(`/juice/group/${project.slug}`);
      } else {
        toast.error('保存に失敗しました');
        console.error(res.error);
      }
    } catch (e) {
      toast.error('エラーが発生しました');
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter out players already in the game to show "Add" options
  const unselectedMembers = project.members.filter(m => !activePlayers.find(p => p.id === m.id));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="flex items-center px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <Link href={`/juice/group/${project.slug}`} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 text-lg font-bold text-slate-800 dark:text-white">勝敗を記録</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Players & Ranks</label>
            <div className="flex gap-2">
                 {/* Only show "Add New" if simpler. Or maybe a dropdown for existing. */}
                 <button onClick={handleAddMember} className="text-xs font-bold text-cyan-500 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> 新規追加
                 </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {activePlayers.map((player, index) => (
              <div key={player.id} className="flex items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col mr-3 gap-1">
                   <button onClick={() => handleMovePlayer(index, 'up')} disabled={index === 0} className="text-slate-300 hover:text-cyan-500 disabled:opacity-30">▲</button>
                   <GripVertical className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                   <button onClick={() => handleMovePlayer(index, 'down')} disabled={index === activePlayers.length - 1} className="text-slate-300 hover:text-cyan-500 disabled:opacity-30">▼</button>
                </div>
                
                <div className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${player.rank === 1 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {player.rank === 1 ? <Crown className="w-6 h-6 text-amber-400" /> : player.rank}
                  </div>
                  <span className="ml-4 font-bold text-slate-800 dark:text-white">{player.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                   <span className={`font-black text-lg ${player.points > 0 ? 'text-cyan-500' : 'text-slate-400'}`}>
                     {player.points > 0 ? '+' : ''}{player.points}
                   </span>
                </div>
              </div>
            ))}
          </div>

          {unselectedMembers.length > 0 && (
            <div className="mt-4">
                <p className="text-xs text-slate-400 mb-2">未選択のメンバー:</p>
                <div className="flex flex-wrap gap-2">
                    {unselectedMembers.map(m => (
                        <button 
                            key={m.id} 
                            onClick={() => handleAddExistingMember(m.id)}
                            className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-600 dark:text-slate-300"
                        >
                            + {m.name}
                        </button>
                    ))}
                </div>
            </div>
          )}

        </section>
        
        <section>
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Point Allocation</label>
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
             <div className="space-y-2">
              {activePlayers.map((p) => {
                  // Find or create setting for this rank
                  const setting = rankSettings.find(s => s.rank === p.rank) || { rank: p.rank, points: 0 };
                  return (
                    <div key={p.rank} className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 last:border-0 py-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{p.rank}位</span>
                    <div className="flex items-center">
                        <input
                        type="number"
                        value={setting.points}
                        onChange={(e) => handlePointSettingChange(p.rank, parseInt(e.target.value, 10) || 0)}
                        className="w-16 text-right font-bold bg-slate-100 dark:bg-slate-800 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-white"
                        />
                        <span className="font-bold w-6 text-right pr-1">pt</span>
                    </div>
                    </div>
                  );
              })}
             </div>
           </div>
        </section>
      </main>

      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-[430px] pointer-events-auto">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center space-x-2 text-lg disabled:opacity-70"
          >
            {isSubmitting ? <span className="animate-spin">⏳</span> : <Save className="w-5 h-5" />}
            <span>記録を保存</span>
          </button>
        </div>
      </div>
    </div>
  );
}

