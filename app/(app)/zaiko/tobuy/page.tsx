"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ZaikoHeader } from "../_components/layout/zaiko-header";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "../_lib/motion-presets";
import { INVENTORY_STATUS_CONFIG } from "../_lib/zaiko-constants";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// モックデータ
interface ToBuyItem {
  id: string;
  name: string;
  icon: string;
  currentQuantity: number;
  targetQuantity: number;
  needQuantity: number;
  status: "low" | "empty";
  checked: boolean;
}

const mockToBuyItems: ToBuyItem[] = [
  {
    id: "1",
    name: "トイレットペーパー",
    icon: "Package",
    currentQuantity: 3,
    targetQuantity: 5,
    needQuantity: 2,
    status: "low",
    checked: false,
  },
  {
    id: "2",
    name: "ティッシュペーパー",
    icon: "Box",
    currentQuantity: 0,
    targetQuantity: 3,
    needQuantity: 3,
    status: "empty",
    checked: false,
  },
  {
    id: "3",
    name: "ラップ",
    icon: "Archive",
    currentQuantity: 2,
    targetQuantity: 5,
    needQuantity: 3,
    status: "low",
    checked: false,
  },
];

export default function ZaikoToBuyPage() {
  const router = useRouter();
  const [items, setItems] = useState(mockToBuyItems);

  const handleCheck = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const checkedCount = items.filter((item) => item.checked).length;
  const totalItems = items.length;

  return (
    <>
      <ZaikoHeader
        title="買い物リスト"
        leftIcon="back"
        onLeftClick={() => router.back()}
      />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="px-4 py-6"
      >
        {/* ヘッダー情報 */}
        <div className="mb-6 p-4 bg-[#32D17D]/10 dark:bg-[#32D17D]/20 rounded-xl border border-[#32D17D]/30">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="size-6 text-[#32D17D]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              買い物リスト
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {checkedCount}/{totalItems} アイテムを購入済み
          </p>
        </div>

        {/* リスト */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="size-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              買い物リストは空です
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {items.map((item, index) => {
              const statusConfig = INVENTORY_STATUS_CONFIG[item.status];
              const IconComponent =
                (LucideIcons[item.icon as keyof typeof LucideIcons] as React.ComponentType<{
                  className?: string;
                }>) || LucideIcons.Package;

              return (
                <motion.div key={item.id} variants={staggerItem} custom={index}>
                  <Card
                    className={cn(
                      "p-4 border-2 transition-all",
                      item.checked
                        ? "opacity-60 bg-gray-50 dark:bg-gray-800"
                        : "hover:border-[#32D17D]/30 dark:hover:border-[#32D17D]/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => handleCheck(item.id)}
                        className="size-5"
                      />
                      <div className="size-12 rounded-full bg-[#32D17D]/10 dark:bg-[#32D17D]/20 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="size-6 text-[#32D17D]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-base font-semibold mb-1",
                            item.checked
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-900 dark:text-gray-100"
                          )}
                        >
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "text-xs",
                              statusConfig.color,
                              statusConfig.bgColor
                            )}
                          >
                            {statusConfig.label}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.needQuantity}個買う
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

