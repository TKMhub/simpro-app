'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, History, Users, Share2, Check, ChevronDown, User, Trash2, Pencil, Lock, Key, MoreHorizontal, Settings } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { JuiceProjectData, addMember, removeMember, updateMemberProfile, setProjectPassword, verifyProjectPassword, deleteMatch, updateProjectName } from '@/lib/juice/actions';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

type Props = {
  project: JuiceProjectData;
  currentUserEmail?: string | null;
};

export default function DashboardClient({ project, currentUserEmail }: Props) {
  const [copied, setCopied] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Project Name State
  const [projectNameInput, setProjectNameInput] = useState(project.name);
  const [isUpdatingProjectName, setIsUpdatingProjectName] = useState(false);

  // Member Management State
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  // Edit member state
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingMemberName, setEditingMemberName] = useState('');
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);

  // Password Protection State
  // const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false); // Replaced by isSettingsOpen
  const [passwordInput, setPasswordInput] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(!project.hasPassword); // Automatically verified if no password
  const [verifyPasswordInput, setVerifyPasswordInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setProjectNameInput(project.name);
  }, [project.name]);

  // Check auth cookie on mount (client-side verify if needed, but server component usually handles initial auth check)
  // For this implementation, we will use a simple client-side gate for the UI if hasPassword is true.
  // In a real app, Middleware is better.
  useEffect(() => {
      // Avoid running effect if already verified or project has no password
      if (!project.hasPassword) {
          // Check if we already showed the toast for this session/project to avoid double toast
          // Using a session storage flag or just ref
          const hasShownToast = sessionStorage.getItem(`juice_pass_toast_${project.id}`);
          if (!hasShownToast) {
              // Initial popup for password setting if not set
              // Use a small timeout to not block rendering
              const timer = setTimeout(() => {
                  toast('セキュリティ設定', {
                      description: 'パスワードを設定して、プロジェクトを保護することをお勧めします。',
                      action: {
                          label: '設定する',
                          onClick: () => setIsSettingsOpen(true),
                      },
                      duration: 8000,
                  });
                  sessionStorage.setItem(`juice_pass_toast_${project.id}`, 'true');
              }, 1000);
              return () => clearTimeout(timer);
          }
          return;
      }

      if (project.hasPassword && !isVerified) {
          const checkAuth = async () => {
              // Simplification: We'll implement a 'checkProjectAuth' action.
              const { checkProjectAuth } = await import('@/lib/juice/actions');
              const isAuth = await checkProjectAuth(project.id);
              setIsVerified(isAuth);
          };
          checkAuth();
      }
  }, [project.hasPassword, project.id, isVerified]);

  const handleUpdateProjectName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectNameInput.trim()) return;

    setIsUpdatingProjectName(true);
    try {
      const res = await updateProjectName(project.id, project.slug, projectNameInput);
      if (res.success) {
        toast.success('グループ名を変更しました');
        // Dialog stays open or close? Let's keep it open or close based on UX. 
        // Maybe close it to indicate success clearly.
        // setIsSettingsOpen(false); 
      } else {
        toast.error('変更に失敗しました');
      }
    } catch {
      toast.error('エラーが発生しました');
    } finally {
      setIsUpdatingProjectName(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!passwordInput.trim()) return;
      
      setIsSettingPassword(true);
      try {
          const res = await setProjectPassword(project.id, passwordInput);
          if (res.success) {
              toast.success('パスワードを設定しました');
              setIsSettingsOpen(false);
              setPasswordInput('');
              setIsVerified(true); // Creator is authenticated
              // Ideally refresh page to update project.hasPassword prop, but router.refresh() works too
              // router.refresh(); // We need useRouter
          } else {
              toast.error('設定に失敗しました');
          }
      } catch (e) {
          toast.error('エラーが発生しました');
      } finally {
          setIsSettingPassword(false);
      }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!verifyPasswordInput.trim()) return;

      setIsVerifying(true);
      try {
          const res = await verifyProjectPassword(project.id, verifyPasswordInput);
          if (res.success) {
              toast.success('認証されました');
              setIsVerified(true);
          } else {
              toast.error('パスワードが間違っています');
          }
      } catch (e) {
          toast.error('エラーが発生しました');
      } finally {
          setIsVerifying(false);
      }
  };

  // Load saved member selection on mount
  useEffect(() => {
    const saved = localStorage.getItem(`juice_member_${project.id}`);
    if (saved) {
      // Verify saved ID still exists in project
      if (project.members.find(m => m.id === saved)) {
        setSelectedMemberId(saved);
      }
    }
  }, [project.id, project.members]);

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    localStorage.setItem(`juice_member_${project.id}`, memberId);
    toast.success('表示プレイヤーを切り替えました');
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    setIsAddingMember(true);
    try {
      const res = await addMember(project.id, project.slug, newMemberName);
      if (res.success) {
        toast.success(`${newMemberName}を追加しました`);
        setNewMemberName('');
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

  const handleRemoveMember = async (memberId: string) => {
    try {
        const res = await removeMember(memberId, project.slug);
        if (res.success) {
            toast.success('メンバーを削除しました');
            if (selectedMemberId === memberId) {
                setSelectedMemberId(null);
                localStorage.removeItem(`juice_member_${project.id}`);
            }
        } else {
            toast.error('削除に失敗しました');
        }
    } catch (error) {
        console.error(error);
        toast.error('エラーが発生しました');
    }
  };

  const openEditMemberDialog = (member: { id: string, name: string }) => {
      setEditingMemberId(member.id);
      setEditingMemberName(member.name);
      setIsEditMemberDialogOpen(true);
  };

  const handleUpdateMemberName = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingMemberName.trim() || !editingMemberId) return;

      setIsUpdatingMember(true);
      try {
          const res = await updateMemberProfile(editingMemberId, project.slug, editingMemberName, null);
          if (res.success) {
              toast.success('名前を変更しました');
              setIsEditMemberDialogOpen(false);
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

  const handleDeleteMatch = async (matchId: string) => {
      toast.promise(deleteMatch(matchId, project.slug), {
          loading: '削除中...',
          success: '履歴を削除しました',
          error: '削除に失敗しました',
      });
  };

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

  // Identify "Me" based on selection, or fallback to smart detection
  const myMember = selectedMemberId 
    ? memberStats.find(m => m.id === selectedMemberId) 
    : (memberStats.find(m => m.userId && m.userId === currentUserEmail) || 
       memberStats.find(m => m.name === '自分') || 
       memberStats[0]);

  // Update selection state if fallback was used
  useEffect(() => {
    if (!selectedMemberId && myMember) {
        setSelectedMemberId(myMember.id);
    }
  }, [selectedMemberId, myMember]);

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

  if (project.hasPassword && !isVerified) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                      Password Protected
                  </h1>
                  <p className="text-slate-500 text-sm mb-8">
                      このグループにアクセスするにはパスワードが必要です。
                  </p>
                  
                  <form onSubmit={handleVerifyPassword} className="space-y-4">
                      <Input
                          type="password"
                          placeholder="Password"
                          value={verifyPasswordInput}
                          onChange={(e) => setVerifyPasswordInput(e.target.value)}
                          className="text-center text-lg"
                      />
                      <Button 
                          type="submit" 
                          className="w-full h-12 text-lg font-bold rounded-xl"
                          disabled={isVerifying || !verifyPasswordInput}
                      >
                          {isVerifying ? 'Verifying...' : 'Unlock'}
                      </Button>
                  </form>
              </div>
          </div>
      );
  }

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

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Settings className="w-4 h-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900">
                <DialogHeader>
                    <DialogTitle>グループ設定</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">一般</TabsTrigger>
                    <TabsTrigger value="security">セキュリティ</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-4 py-4">
                    <form onSubmit={handleUpdateProjectName} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="project-name">グループ名</Label>
                            <Input
                                id="project-name"
                                value={projectNameInput}
                                onChange={(e) => setProjectNameInput(e.target.value)}
                                placeholder="グループ名"
                                className="text-slate-900 dark:text-white"
                            />
                        </div>
                        <Button type="submit" disabled={isUpdatingProjectName || !projectNameInput.trim()} className="w-full">
                            {isUpdatingProjectName ? '保存中...' : '保存'}
                        </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4 py-4">
                    <form onSubmit={handleSetPassword} className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg flex items-center gap-3">
                            <div className={`p-2 rounded-full ${project.hasPassword ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                {project.hasPassword ? <Lock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {project.hasPassword ? 'パスワード保護中' : 'パスワード未設定'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {project.hasPassword ? 'このグループは保護されています' : '誰でもアクセス可能です'}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500">
                            {project.hasPassword 
                                ? '新しいパスワードを設定すると、以前のパスワードは無効になります。' 
                                : 'パスワードを設定すると、URLを知っているユーザーでもパスワードを入力しないとアクセスできなくなります。'}
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">パスワード</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="新しいパスワード"
                                className="text-slate-900 dark:text-white"
                            />
                        </div>
                        <Button type="submit" disabled={isSettingPassword || !passwordInput.trim()} className="w-full">
                            {isSettingPassword ? '設定中...' : '保存'}
                        </Button>
                    </form>
                  </TabsContent>
                </Tabs>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 text-sm font-bold bg-white dark:bg-slate-900 pr-3 pl-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors outline-none focus:ring-2 focus:ring-cyan-500/20">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  {myMember?.avatarUrl ? (
                     <Image src={myMember.avatarUrl} alt={myMember.name} className="w-full h-full object-cover" />
                  ) : (
                     <User className="w-3 h-3 text-slate-500" />
                  )}
                </div>
                <span className="text-slate-800 dark:text-white truncate max-w-[80px]">{myMember?.name || 'Select'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>表示プレイヤー切り替え</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {memberStats.map(member => (
                <DropdownMenuItem 
                  key={member.id} 
                  onClick={() => handleMemberSelect(member.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                        {member.avatarUrl ? (
                            <Image src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px]">👤</span>
                        )}
                    </div>
                    <span>{member.name}</span>
                  </div>
                  {myMember?.id === member.id && <Check className="w-4 h-4 text-cyan-500" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <Link href={`/juice/group/${project.slug}/profile`}>
                <DropdownMenuItem className="text-xs text-slate-500 cursor-pointer">
                   <Users className="w-3 h-3 mr-2" />
                   プロフィール設定へ
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-cyan-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-cyan-100 text-sm font-bold uppercase tracking-wider mb-1">TOTAL</p>
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

          <div 
            onClick={() => setIsManageMembersOpen(true)}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
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
                <div key={match.id} className="relative group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm pr-12">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${point > 0 ? 'bg-cyan-50 dark:bg-cyan-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      <span className="text-xs font-bold text-slate-400">{rank}位</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {match.gameTitle || `${match.results.length}人対戦`}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {new Date(match.playedAt).toLocaleDateString()}
                        {match.gameTitle && <span className="ml-2 text-slate-300">({match.results.length}人)</span>}
                      </p>
                    </div>
                  </div>
                  <div className={`font-black text-lg ${point > 0 ? 'text-cyan-500' : 'text-slate-400'}`}>
                    {point > 0 ? '+' : ''}{point}
                  </div>
                  
                  {/* Menu */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/juice/group/${project.slug}/record?matchId=${match.id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    編集
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                                onClick={() => {
                                    if(confirm('本当に削除しますか？')) handleDeleteMatch(match.id);
                                }} 
                                className="text-red-500 cursor-pointer focus:text-red-500"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                削除
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Member Management Dialog */}
      <Dialog open={isManageMembersOpen} onOpenChange={setIsManageMembersOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white font-bold">メンバー管理</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Add New Member */}
            <form onSubmit={handleAddMember} className="flex gap-2">
                <Input
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="新しいメンバー名..."
                    className="flex-1 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-200 dark:border-slate-700"
                />
                <Button type="submit" disabled={isAddingMember || !newMemberName.trim()} size="icon" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                    <Plus className="w-4 h-4" />
                </Button>
            </form>

            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">メンバー一覧 ({project.members.length})</p>
                <div className="space-y-2">
                    {project.members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                    {member.avatarUrl ? (
                                        <Image src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <User className="w-4 h-4 text-slate-500" />
                                    )}
                                </div>
                                <span className="font-bold truncate text-slate-900 dark:text-slate-100">{member.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-slate-400 hover:text-cyan-500"
                                    onClick={() => openEditMemberDialog(member)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white dark:bg-slate-900">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-slate-900 dark:text-white">メンバー削除</AlertDialogTitle>
                                            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                                                {member.name} を削除してもよろしいですか？<br />
                                                これまでの対戦履歴からも削除されます。
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="text-slate-900 dark:text-white border-slate-200 dark:border-slate-700">キャンセル</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleRemoveMember(member.id)} className="bg-red-500 hover:bg-red-600 text-white">
                                                削除
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsManageMembersOpen(false)} className="text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Name Dialog (Nested) */}
      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900">
            <DialogHeader>
                <DialogTitle>名前の変更</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateMemberName} className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="edit-name-dash">名前</Label>
                    <Input
                        id="edit-name-dash"
                        value={editingMemberName}
                        onChange={(e) => setEditingMemberName(e.target.value)}
                        placeholder="メンバー名を入力..."
                        autoFocus
                        className="text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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

