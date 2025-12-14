'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, GripVertical, Crown, Plus, Pencil, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JuiceProjectData, addMember, recordMatch, updateMatch, updateMemberProfile } from '@/lib/juice/actions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  initialMatch?: JuiceProjectData['matches'][number];
};

export default function RecordClient({ project, initialMatch }: Props) {
  const router = useRouter();
  const isEditing = !!initialMatch;
  
  // Initialize players from project members
  // Default to selecting the first 4 members or all if less than 4
  const [activePlayers, setActivePlayers] = useState<PlayerUI[]>([]);
  
  // Available members to add
  // const availableMembers = project.members.filter(m => !activePlayers.find(p => p.id === m.id));

  const [rankSettings, setRankSettings] = useState(initialRankSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Game title state
  const [gameTitle, setGameTitle] = useState('');

  // ... (dialog states)
  
  // New member dialog state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Select members dialog state
  const [isSelectMembersOpen, setIsSelectMembersOpen] = useState(false);

  // Edit member dialog state
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingMemberName, setEditingMemberName] = useState('');
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);

  useEffect(() => {
    if (initialMatch) {
      // Initialize from match for editing
      setGameTitle(initialMatch.gameTitle || '');
      
      const players = initialMatch.results
        .sort((a, b) => a.rank - b.rank)
        .map(r => {
           const member = project.members.find(m => m.id === r.memberId);
           return {
               id: r.memberId,
               name: member?.name || 'Unknown',
               rank: r.rank,
               points: r.points
           };
        });
      setActivePlayers(players);
      
      // Initialize rank settings from the match data
      const distinctRanks = Array.from(new Set(players.map(p => p.rank)));
      const newSettings = distinctRanks.map(rank => {
          const p = players.find(pl => pl.rank === rank);
          return { rank, points: p ? p.points : 0 };
      }).sort((a, b) => a.rank - b.rank);
      
      const mergedSettings = [...newSettings];
      initialRankSettings.forEach(init => {
          if (!mergedSettings.find(s => s.rank === init.rank)) {
              mergedSettings.push(init);
          }
      });
      setRankSettings(mergedSettings.sort((a, b) => a.rank - b.rank));

    } else {
        // Initial setup: Take up to 4 members
        const initial = project.members.slice(0, 4).map((m, index) => {
        const rank = index + 1;
        const setting = initialRankSettings.find(s => s.rank === rank);
        return {
            id: m.id,
            name: m.name,
            rank,
            points: setting ? setting.points : 0, // Initial calculation
        };
        });
        setActivePlayers(initial);
    }
  }, [project.members, initialMatch]);

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
    
    // Recalculate ranks and points immediately
    const updatedPlayers = newPlayers.map((p, idx) => {
        const rank = idx + 1;
        const setting = rankSettings.find(s => s.rank === rank);
        return { 
          ...p, 
          rank, 
          points: setting ? setting.points : 0 
        };
    });

    setActivePlayers(updatedPlayers);
  };

  const handleSubmitNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    
    setIsAddingMember(true);
    try {
      // Call server action to add member
      const res = await addMember(project.id, project.slug, newMemberName);
      
      if (res.success && res.member) {
        toast.success(`${newMemberName}を追加しました`);
        // Add to active players
        setActivePlayers(prev => {
          const newRank = prev.length + 1;
          // Use current rankSettings state, fallback to initial if not found (though rankSettings should be up to date)
          // We can't easily access the latest state in this callback unless we use a functional update that reads it, 
          // but rankSettings is a separate state.
          // However, since rankSettings is in the closure of this function (which is recreated on render), 
          // it might be slightly stale if handleSubmitNewMember isn't recreated.
          // But handleSubmitNewMember is not wrapped in useCallback, so it should have the latest rankSettings.
          
          const setting = rankSettings.find(s => s.rank === newRank);
          
          return [
            ...prev,
            {
              id: res.member!.id,
              name: res.member!.name,
              rank: newRank,
              points: setting ? setting.points : 0 
            }
          ];
        });
        setNewMemberName('');
        setIsAddMemberOpen(false);
      } else {
        toast.error('メンバー追加に失敗しました');
      }
    } catch (error) {
      console.error(error);
      toast.error('エラーが発生しました');
    } finally {
      setIsAddingMember(false);
    }
  };

  const openEditMemberDialog = (id: string, currentName: string) => {
    setEditingMemberId(id);
    setEditingMemberName(currentName);
    setIsEditMemberOpen(true);
  };

  const handleUpdateMemberName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemberName.trim() || !editingMemberId) return;

    setIsUpdatingMember(true);
    try {
        const res = await updateMemberProfile(editingMemberId, project.slug, editingMemberName, null);
        if (res.success) {
            toast.success('名前を変更しました');
            
            // Update local state
            setActivePlayers(prev => prev.map(p => 
                p.id === editingMemberId ? { ...p, name: editingMemberName } : p
            ));
            
            setIsEditMemberOpen(false);
        } else {
            toast.error('名前の変更に失敗しました');
        }
    } catch (error) {
        console.error(error);
        toast.error('エラーが発生しました');
    } finally {
        setIsUpdatingMember(false);
    }
  };

  const handleAddExistingMember = (memberId: string) => {
    const member = project.members.find(m => m.id === memberId);
    if (!member) return;
    
    // Avoid duplicates
    if (activePlayers.find(p => p.id === memberId)) return;

    const newRank = activePlayers.length + 1;
    const setting = rankSettings.find(s => s.rank === newRank);

    setActivePlayers(prev => [
      ...prev,
      {
        id: member.id,
        name: member.name,
        rank: newRank,
        points: setting ? setting.points : 0
      }
    ]);
  };

  const handleRemovePlayer = (memberId: string) => {
    setActivePlayers(prev => prev.filter(p => p.id !== memberId));
  };

  const handleToggleMember = (memberId: string) => {
      const isActive = activePlayers.some(p => p.id === memberId);
      if (isActive) {
          handleRemovePlayer(memberId);
      } else {
          handleAddExistingMember(memberId);
      }
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

      let res;
      if (isEditing && initialMatch) {
        res = await updateMatch(initialMatch.id, project.slug, initialMatch.playedAt, results, gameTitle);
      } else {
        res = await recordMatch(project.id, project.slug, new Date(), results, gameTitle);
      }
      
      if (res.success) {
        toast.success(isEditing ? '記録を更新しました！' : '記録しました！');
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
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Game Title</label>
          <Input
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            placeholder="ゲーム名 (例: マリオカート、サッカー)"
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Players & Ranks</label>
            <div className="flex gap-2">
                 <Dialog open={isSelectMembersOpen} onOpenChange={setIsSelectMembersOpen}>
                   <DialogTrigger asChild>
                     <button className="text-xs font-bold text-slate-400 hover:text-cyan-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md transition-colors">
                        <Users className="w-3 h-3" /> 参加メンバー選択
                     </button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                       <DialogTitle>参加メンバーの選択</DialogTitle>
                     </DialogHeader>
                     <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                        <p className="text-sm text-slate-500">
                            チェックが入っているメンバーのみ、今回の対戦記録とポイント変動が保存されます。
                        </p>
                        <div className="space-y-2">
                            {project.members.map(member => {
                                const isChecked = activePlayers.some(p => p.id === member.id);
                                return (
                                    <div key={member.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <Checkbox 
                                            id={`member-${member.id}`} 
                                            checked={isChecked}
                                            onCheckedChange={() => handleToggleMember(member.id)}
                                        />
                                        <label 
                                            htmlFor={`member-${member.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                                        >
                                            {member.name}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                     </div>
                     <DialogFooter>
                       <Button onClick={() => setIsSelectMembersOpen(false)}>完了</Button>
                     </DialogFooter>
                   </DialogContent>
                 </Dialog>

                 <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                   <DialogTrigger asChild>
                     <button className="text-xs font-bold text-cyan-500 flex items-center gap-1 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded-md hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors">
                        <Plus className="w-3 h-3" /> 新規追加
                     </button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                       <DialogTitle>新規メンバー追加</DialogTitle>
                     </DialogHeader>
                     <form onSubmit={handleSubmitNewMember} className="grid gap-4 py-4">
                       <div className="grid gap-2">
                         <Label htmlFor="name">名前</Label>
                         <Input
                           id="name"
                           value={newMemberName}
                           onChange={(e) => setNewMemberName(e.target.value)}
                           placeholder="メンバー名を入力..."
                           autoFocus
                         />
                       </div>
                       <DialogFooter>
                         <Button type="submit" disabled={isAddingMember || !newMemberName.trim()}>
                           {isAddingMember ? '追加中...' : '追加'}
                         </Button>
                       </DialogFooter>
                     </form>
                   </DialogContent>
                 </Dialog>
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
                  <span className="ml-4 font-bold text-slate-800 dark:text-white mr-2">{player.name}</span>
                  <button 
                    onClick={() => openEditMemberDialog(player.id, player.name)}
                    className="text-slate-300 hover:text-slate-500 p-1"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                   <span className={`font-black text-lg ${player.points > 0 ? 'text-cyan-500' : 'text-slate-400'}`}>
                     {player.points > 0 ? '+' : ''}{player.points}
                   </span>
                   <button 
                     onClick={() => handleRemovePlayer(player.id)}
                     className="ml-2 text-slate-200 hover:text-red-400 p-1"
                     title="この対戦から除外（不参加）"
                   >
                     <X className="w-4 h-4" />
                   </button>
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

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>メンバー名の変更</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateMemberName} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">名前</Label>
              <Input
                id="edit-name"
                value={editingMemberName}
                onChange={(e) => setEditingMemberName(e.target.value)}
                placeholder="メンバー名を入力..."
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isUpdatingMember || !editingMemberName.trim()}>
                {isUpdatingMember ? '変更中...' : '変更'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

