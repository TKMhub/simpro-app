'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { ZaikoShell, ZaikoContent } from '../_components/layout/zaiko-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ZaikoBottomSheet } from '../_components/layout/zaiko-bottom-sheet';
import { staggerContainer, staggerItem } from '../_lib/motion-presets';
import { useRouter } from 'next/navigation';
import { UserPlus, Link as LinkIcon, Copy, Check, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  initial: string;
}

const mockMembers: Member[] = [
  {
    id: '1',
    name: '山田太郎',
    email: 'taro@example.com',
    role: 'admin',
    initial: '太',
  },
  {
    id: '2',
    name: '山田花子',
    email: 'hanako@example.com',
    role: 'editor',
    initial: '花',
  },
  {
    id: '3',
    name: '山田次郎',
    email: 'jiro@example.com',
    role: 'viewer',
    initial: '次',
  },
];

const roleLabels: Record<string, string> = {
  admin: '管理者',
  editor: '編集者',
  viewer: '閲覧者',
};

const roleColors: Record<string, string> = {
  admin: 'bg-[#32D17D] text-white',
  editor: 'bg-blue-500 text-white',
  viewer: 'bg-muted text-muted-foreground',
};

export default function ZaikoMemberPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isInviteSheetOpen, setIsInviteSheetOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('ZAIKO-2024-ABC123');
  const [isCopied, setIsCopied] = useState(false);

  const handleRoleChange = (newRole: 'admin' | 'editor' | 'viewer') => {
    if (selectedMember) {
      setMembers(
        members.map((m) =>
          m.id === selectedMember.id ? { ...m, role: newRole } : m
        )
      );
      setSelectedMember({ ...selectedMember, role: newRole });
      toast.success('権限を変更しました');
    }
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    toast.success('招待コードをコピーしました');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenEditSheet = (member: Member) => {
    setSelectedMember(member);
    setIsEditSheetOpen(true);
  };

  return (
    <>
      <ZaikoHeader
        title="メンバー管理"
        showBack
        onBack={() => router.back()}
      />
      <ZaikoShell>
        <ZaikoContent>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* 招待セクション */}
            <motion.div variants={staggerItem}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <UserPlus className="h-5 w-5" />
                    メンバーを招待
                  </CardTitle>
                  <CardDescription className="text-base">
                    家族や同居人を招待して在庫を共有しましょう
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setIsInviteSheetOpen(true)}
                    size="lg"
                    className="w-full gap-2 bg-[#32D17D] text-base font-bold text-white hover:bg-[#2BB870]"
                  >
                    <LinkIcon className="h-5 w-5" />
                    招待リンクを発行
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* メンバー一覧 */}
            <motion.div variants={staggerItem}>
              <h2 className="mb-4 text-xl font-bold">
                メンバー ({members.length}人)
              </h2>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-2">
                      <CardContent className="flex items-center gap-4 p-4">
                        {/* アバター */}
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="bg-[#32D17D]/20 text-xl font-bold">
                            {member.initial}
                          </AvatarFallback>
                        </Avatar>

                        {/* 情報 */}
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 truncate text-base font-bold">
                            {member.name}
                          </h3>
                          <p className="truncate text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>

                        {/* 権限バッジ */}
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <Badge
                            className={`px-3 py-1 text-xs font-bold ${roleColors[member.role]}`}
                          >
                            {roleLabels[member.role]}
                          </Badge>
                          {member.role !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenEditSheet(member)}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </ZaikoContent>
      </ZaikoShell>

      {/* 招待 Bottom Sheet */}
      <ZaikoBottomSheet
        open={isInviteSheetOpen}
        onOpenChange={setIsInviteSheetOpen}
        title="メンバーを招待"
      >
        <div className="space-y-6">
          <div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              招待コードを共有して、家族や同居人を招待しましょう。
              <br />
              招待された人はこのコードを入力することで参加できます。
            </p>

            <div className="space-y-3">
              <Label className="text-base font-semibold">招待コード</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteCode}
                  readOnly
                  className="h-12 text-center text-base font-mono font-bold"
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="shrink-0 gap-2 px-6"
                  onClick={handleCopyInviteCode}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      コピー
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-4">
            <h4 className="mb-2 font-semibold">💡 招待の流れ</h4>
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>招待コードをコピー</li>
              <li>家族や同居人に共有</li>
              <li>相手がアプリで招待コードを入力</li>
              <li>自動的にメンバーとして追加されます</li>
            </ol>
          </div>

          <Button
            onClick={() => setIsInviteSheetOpen(false)}
            size="lg"
            className="w-full bg-[#32D17D] text-base font-bold text-white hover:bg-[#2BB870]"
          >
            閉じる
          </Button>
        </div>
      </ZaikoBottomSheet>

      {/* メンバー編集 Bottom Sheet */}
      <ZaikoBottomSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        title="メンバー設定"
      >
        {selectedMember && (
          <div className="space-y-6">
            {/* メンバー情報 */}
            <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-[#32D17D]/20 text-2xl font-bold">
                  {selectedMember.initial}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{selectedMember.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedMember.email}
                </p>
              </div>
            </div>

            {/* 権限変更 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">権限</Label>
              <Select
                value={selectedMember.role}
                onValueChange={(value: 'admin' | 'editor' | 'viewer') =>
                  handleRoleChange(value)
                }
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" className="text-base">
                    👑 管理者 - すべての操作が可能
                  </SelectItem>
                  <SelectItem value="editor" className="text-base">
                    ✏️ 編集者 - 在庫の追加・編集が可能
                  </SelectItem>
                  <SelectItem value="viewer" className="text-base">
                    👀 閲覧者 - 在庫の閲覧のみ
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 削除ボタン */}
            <Button
              variant="outline"
              className="w-full gap-2 text-base text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setMembers(members.filter((m) => m.id !== selectedMember.id));
                setIsEditSheetOpen(false);
                toast.success('メンバーを削除しました');
              }}
            >
              メンバーを削除
            </Button>
          </div>
        )}
      </ZaikoBottomSheet>
    </>
  );
}

