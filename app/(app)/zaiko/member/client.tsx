'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { ZaikoMemberWithProfile } from '../_lib/types';

interface ZaikoMemberClientProps {
  members: ZaikoMemberWithProfile[];
  currentUserId: string | null;
}

export default function ZaikoMemberClient({ members, currentUserId }: ZaikoMemberClientProps) {
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
           <Button className="w-full" onClick={() => alert('招待機能は準備中です')}>招待リンクをコピー</Button>
        </div>

        {/* Member List */}
        <div className="space-y-2">
           <h3 className="text-sm font-bold text-zinc-500 px-2">参加メンバー</h3>
           <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
              {members.map((member) => {
                const isMe = member.userId === currentUserId;
                const name = member.user.displayName || member.user.email;
                return (
                    <div key={member.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={member.user.avatarUrl || ''} />
                            <AvatarFallback>{name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-sm">{name} {isMe && '(あなた)'}</p>
                            <p className="text-xs text-zinc-500">{member.role}</p>
                        </div>
                    </div>
                    {!isMe && (
                        <Button variant="ghost" size="sm" className="text-zinc-400">
                        編集
                        </Button>
                    )}
                    </div>
                );
              })}
           </div>
        </div>

      </div>
    </div>
  );
}

