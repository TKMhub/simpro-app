"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ZaikoHeader } from "../_components/layout/zaiko-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Copy, Users } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "../_lib/motion-presets";
import { cn } from "@/lib/utils";

// モックデータ
const mockMembers = [
  {
    id: "1",
    name: "山田太郎",
    email: "yamada@example.com",
    role: "管理者",
    avatar: "YT",
  },
  {
    id: "2",
    name: "山田花子",
    email: "hanako@example.com",
    role: "編集者",
    avatar: "YH",
  },
  {
    id: "3",
    name: "山田次郎",
    email: "jiro@example.com",
    role: "閲覧者",
    avatar: "YJ",
  },
];

export default function ZaikoMemberPage() {
  const router = useRouter();
  const [members] = useState(mockMembers);
  const [inviteCode, setInviteCode] = useState("ABC123");
  const [inputCode, setInputCode] = useState("");

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/zaiko/invite/${inviteCode}`;
    navigator.clipboard.writeText(link);
    alert("招待リンクをコピーしました");
  };

  const handleJoinByCode = () => {
    // TODO: コードで参加する処理
    console.log("参加コード:", inputCode);
    alert("参加リクエストを送信しました");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "管理者":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "編集者":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "閲覧者":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
      default:
        return "";
    }
  };

  return (
    <>
      <ZaikoHeader
        title="メンバー"
        leftIcon="back"
        onLeftClick={() => router.back()}
      />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="px-4 py-6 space-y-6"
      >
        {/* 招待セクション */}
        <Card className="p-6 border-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <UserPlus className="size-5 text-[#32D17D]" />
            メンバーを招待
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                招待リンク
              </p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/zaiko/invite/${inviteCode}`}
                  readOnly
                  className="flex-1 bg-gray-50 dark:bg-gray-800"
                />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                招待コードで参加
              </p>
              <div className="flex gap-2">
                <Input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="招待コードを入力"
                  className="flex-1"
                />
                <Button
                  onClick={handleJoinByCode}
                  className="bg-[#32D17D] hover:bg-[#22C55E] text-white"
                >
                  参加
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* メンバー一覧 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Users className="size-5 text-[#32D17D]" />
            メンバー一覧 ({members.length}人)
          </h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {members.map((member, index) => (
              <motion.div key={member.id} variants={staggerItem} custom={index}>
                <Card className="p-4 border-2">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-[#32D17D]/10 dark:bg-[#32D17D]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-[#32D17D]">
                        {member.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {member.email}
                      </p>
                    </div>
                    <Badge className={cn("text-xs", getRoleColor(member.role))}>
                      {member.role}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

