"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ZaikoHeader } from "../_components/layout/zaiko-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "../_lib/motion-presets";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

// モックデータ
interface AlertItem {
  id: string;
  type: "threshold" | "empty" | "member";
  message: string;
  itemName?: string;
  timestamp: Date;
  resolved: boolean;
}

const mockAlerts: AlertItem[] = [
  {
    id: "1",
    type: "threshold",
    message: "在庫が閾値以下になりました",
    itemName: "トイレットペーパー",
    timestamp: new Date(2024, 0, 15, 10, 30),
    resolved: false,
  },
  {
    id: "2",
    type: "empty",
    message: "在庫が0になりました",
    itemName: "ティッシュペーパー",
    timestamp: new Date(2024, 0, 14, 15, 20),
    resolved: true,
  },
  {
    id: "3",
    type: "member",
    message: "新しいメンバーが参加しました",
    timestamp: new Date(2024, 0, 13, 9, 15),
    resolved: false,
  },
];

export default function ZaikoAlertPage() {
  const router = useRouter();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "threshold":
        return <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-400" />;
      case "empty":
        return <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />;
      case "member":
        return <Bell className="size-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Bell className="size-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "threshold":
        return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "empty":
        return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "member":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "";
    }
  };

  return (
    <>
      <ZaikoHeader
        title="通知履歴"
        leftIcon="back"
        onLeftClick={() => router.back()}
      />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="px-4 py-6"
      >
        {mockAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="size-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              通知履歴はありません
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {mockAlerts.map((alert, index) => (
              <motion.div key={alert.id} variants={staggerItem} custom={index}>
                <Card
                  className={`p-4 border-2 ${getAlertColor(alert.type)} ${
                    alert.resolved ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className={`text-base font-semibold ${
                            alert.resolved
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {alert.message}
                        </p>
                        {alert.resolved && (
                          <CheckCircle2 className="size-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        )}
                      </div>
                      {alert.itemName && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {alert.itemName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(alert.timestamp, "yyyy年M月d日 H:mm", {
                          locale: ja,
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

