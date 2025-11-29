"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ZaikoHeader } from "../../_components/layout/zaiko-header";
import { InventoryDetailForm } from "../../_components/inventory/inventory-detail-form";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import {
  INVENTORY_STATUS_CONFIG,
  getInventoryStatus,
  type MockInventoryItem,
} from "../../_lib/zaiko-constants";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "../../_lib/motion-presets";

// モックデータ（実際にはAPIから取得）
const mockItem: MockInventoryItem = {
  id: "1",
  name: "トイレットペーパー",
  icon: "Package",
  category: "toilet",
  quantity: 3,
  threshold: 2,
  location: "トイレ",
  status: "low",
  memo: "12ロール入り",
};

export default function ZaikoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.itemId as string;

  // TODO: 実際のデータ取得
  const [item] = useState(mockItem);
  const [isEditing, setIsEditing] = useState(false);

  const statusConfig = INVENTORY_STATUS_CONFIG[item.status];
  const IconComponent =
    (LucideIcons[item.icon as keyof typeof LucideIcons] as React.ComponentType<{
      className?: string;
    }>) || LucideIcons.Package;

  const handleSubmit = (data: any) => {
    // TODO: API呼び出し
    console.log("保存:", data);
    setIsEditing(false);
    router.back();
  };

  const handleDelete = () => {
    // TODO: 削除確認ダイアログとAPI呼び出し
    if (confirm("本当に削除しますか？")) {
      console.log("削除:", itemId);
      router.back();
    }
  };

  if (isEditing) {
    return (
      <>
        <ZaikoHeader
          title="編集"
          leftIcon="back"
          onLeftClick={() => setIsEditing(false)}
        />
        <InventoryDetailForm
          defaultValues={item}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </>
    );
  }

  return (
    <>
      <ZaikoHeader
        title={item.name}
        leftIcon="back"
        onLeftClick={() => router.back()}
        rightIcon={<Trash2 className="size-5" />}
        onRightClick={handleDelete}
      />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="px-4 py-6 space-y-6"
      >
        {/* アイテム情報カード */}
        <Card className="p-6 border-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="size-20 rounded-2xl bg-[#32D17D]/10 dark:bg-[#32D17D]/20 flex items-center justify-center flex-shrink-0">
              <IconComponent className="size-10 text-[#32D17D]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {item.name}
              </h1>
              <Badge
                className={`${statusConfig.color} ${statusConfig.bgColor} text-xs font-medium px-2 py-1`}
              >
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                現在の在庫
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {item.quantity}個
              </p>
            </div>

            {item.location && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  保管場所
                </p>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {item.location}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                アラート閾値
              </p>
              <p className="text-base text-gray-900 dark:text-gray-100">
                {item.threshold}個以下で通知
              </p>
            </div>

            {item.memo && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  メモ
                </p>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {item.memo}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 編集ボタン */}
        <button
          onClick={() => setIsEditing(true)}
          className="w-full py-4 bg-[#32D17D] hover:bg-[#22C55E] text-white rounded-xl font-semibold text-base transition-colors"
        >
          変更を保存
        </button>
      </motion.div>
    </>
  );
}

