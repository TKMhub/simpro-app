'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ZaikoHeader } from '../_components/layout/zaiko-header';

const MEMBERS = [
  { id: 1, name: '自分', role: '管理者', isMe: true },
  { id: 2, name: '妻', role: '編集者', isMe: false },
  { id: 3, name: '息子', role: '閲覧のみ', isMe: false },
];

export default function ZaikoMemberPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <ZaikoHeader
        title="メンバー管理"
        showBack
        onBack={() => router.back()}
      />

      <div className="px-4 py-6 space-y-6">
        
        {/* Invite Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm text-center space-y-4">
           <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
             <UserPlus className="h-6 w-6" />
           </div>
           <div>
             <h3 className="font-bold">家族を招待</h3>
             <p className="text-xs text-zinc-500 mt-1">
               招待リンクを送って<br />在庫をリアルタイム共有しましょう
             </p>
           </div>
           <Button className="w-full">招待リンクをコピー</Button>
        </div>

        {/* Member List */}
        <div className="space-y-2">
           <h3 className="text-sm font-bold text-zinc-500 px-2">参加メンバー</h3>
           <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              {MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4">
                   <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">{member.name} {member.isMe && '(あなた)'}</p>
                        <p className="text-xs text-zinc-500">{member.role}</p>
                      </div>
                   </div>
                   {!member.isMe && (
                     <Button variant="ghost" size="sm" className="text-zinc-400">
                       編集
                     </Button>
                   )}
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}

