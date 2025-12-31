'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Bell, Users, LogOut, ChevronRight, Plus, Trash2, Copy, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { createZaikoCategory, deleteZaikoCategory, createZaikoLocation, deleteZaikoLocation, joinZaikoFamily } from '../_lib/actions';
import { useTheme } from 'next-themes';

type SettingsClientProps = {
    user: any;
    membership: any;
    family: any;
    categories: any[];
    locations: any[];
};

export default function SettingsClient({
    user,
    membership,
    family,
    categories,
    locations
}: SettingsClientProps) {
    const router = useRouter();
    const isAdmin = membership.role === 'ADMIN';
    const { theme, setTheme } = useTheme();
    
    // Master Data State
    const [newCategory, setNewCategory] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [joinCode, setJoinCode] = useState('');

    const handleCopyInvite = () => {
        const url = `${window.location.origin}/zaiko/invite/${family.inviteCode}`;
        navigator.clipboard.writeText(url);
        toast.success('招待リンクをコピーしました');
    };

    const handleNotificationClick = () => {
        toast.info('通知は現在開発中となります');
    };

    const handleJoinFamily = async () => {
        if (!joinCode) return;
        try {
            const res = await joinZaikoFamily(joinCode);
            if (res.success) {
                toast.success('家族に参加しました');
                setJoinCode('');
                router.refresh();
            }
        } catch (e) {
            toast.error('参加に失敗しました。コードを確認してください。');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory) return;
        try {
            await createZaikoCategory(newCategory);
            setNewCategory('');
            toast.success('カテゴリを追加しました');
            router.refresh();
        } catch (e) {
            toast.error('追加に失敗しました');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteZaikoCategory(id);
            toast.success('カテゴリを削除しました');
            router.refresh();
        } catch (e) {
            toast.error('削除に失敗しました');
        }
    };

    const handleAddLocation = async () => {
        if (!newLocation) return;
        try {
            await createZaikoLocation(newLocation);
            setNewLocation('');
            toast.success('場所を追加しました');
            router.refresh();
        } catch (e) {
            toast.error('追加に失敗しました');
        }
    };

    const handleDeleteLocation = async (id: string) => {
        try {
            await deleteZaikoLocation(id);
            toast.success('場所を削除しました');
            router.refresh();
        } catch (e) {
            toast.error('削除に失敗しました');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <ZaikoHeader
                title="設定"
                showBack
                onBack={() => router.back()}
            />

            <div className="px-4 py-6 space-y-6">

                {/* Account */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-zinc-500 px-2">アカウント</h3>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left" onClick={() => router.push('/zaiko/member')}>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-zinc-500" />
                                <span>家族・メンバー管理</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-zinc-300" />
                        </button>
                    </div>
                </div>

                {/* Family Invitation */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-zinc-500 px-2">家族・招待</h3>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm p-4 space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserPlus className="h-5 w-5 text-zinc-500" />
                                <div>
                                    <div className="text-sm font-medium">招待リンク</div>
                                    <div className="text-xs text-zinc-400">リンクを共有して家族を招待</div>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={handleCopyInvite}>
                                <Copy className="h-4 w-4 mr-2" />
                                コピー
                            </Button>
                         </div>
                         
                         <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                             <Label className="text-xs text-zinc-500 mb-2 block">別の家族に参加する</Label>
                             <div className="flex gap-2">
                                 <Input 
                                     placeholder="招待コードを入力" 
                                     value={joinCode}
                                     onChange={(e) => setJoinCode(e.target.value)}
                                     className="h-9"
                                 />
                                 <Button size="sm" onClick={handleJoinFamily} disabled={!joinCode}>
                                     参加
                                 </Button>
                             </div>
                         </div>
                    </div>
                </div>

                {/* App Settings */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-zinc-500 px-2">アプリ設定</h3>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <Moon className="h-5 w-5 text-zinc-500" />
                                <span>ダークモード</span>
                            </div>
                            <Switch 
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => {
                                    setTheme(checked ? 'dark' : 'light');
                                    // Cookieに設定を保存 (サーバーサイドレンダリング時のチラつき防止)
                                    document.cookie = `theme=${checked ? 'dark' : 'light'}; path=/; max-age=31536000`;
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={handleNotificationClick}>
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-zinc-500" />
                                <span>通知</span>
                            </div>
                            <Switch checked={false} onCheckedChange={handleNotificationClick} />
                        </div>
                    </div>
                </div>

                {/* Admin Only: Master Maintenance */}
                {isAdmin && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-zinc-500 px-2">マスター管理 (管理者のみ)</h3>
                        
                        {/* Categories */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm p-4">
                            <h4 className="text-sm font-medium mb-3">カテゴリ設定</h4>
                            <div className="space-y-2 mb-4">
                                {categories.map((cat: any) => (
                                    <div key={cat.id} className="flex items-center justify-between py-1 px-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded">
                                        <span className="text-sm">{cat.name}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDeleteCategory(cat.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="新しいカテゴリ" 
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="h-8 text-sm"
                                />
                                <Button size="sm" variant="secondary" onClick={handleAddCategory} disabled={!newCategory}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Locations */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm p-4">
                            <h4 className="text-sm font-medium mb-3">保管場所設定</h4>
                            <div className="space-y-2 mb-4">
                                {locations.map((loc: any) => (
                                    <div key={loc.id} className="flex items-center justify-between py-1 px-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded">
                                        <span className="text-sm">{loc.name}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDeleteLocation(loc.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="新しい場所" 
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    className="h-8 text-sm"
                                />
                                <Button size="sm" variant="secondary" onClick={handleAddLocation} disabled={!newLocation}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-100 mt-8">
                    <LogOut className="h-4 w-4 mr-2" />
                    ログアウト
                </Button>

                <p className="text-center text-xs text-zinc-400 mt-4">
                    Zaiko<span className="text-green-500">.</span> v0.1.0 (Beta)
                </p>

            </div>
        </div>
    );
}

