"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ZaikoHeader } from "../_components/layout/zaiko-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Users,
  LogOut,
  Trash2,
} from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "../_lib/motion-presets";
import { useEffect } from "react";

export default function ZaikoSettingsPage() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize from cookie, then localStorage
    let initial = false;
    try {
      if (typeof document !== "undefined") {
        const m = document.cookie.match(/(?:^|; )theme=([^;]+)/);
        const fromCookie = m ? decodeURIComponent(m[1]) : null;
        const fromLocal = localStorage.getItem("theme");
        const v = fromCookie || fromLocal;
        initial = v ? v === "dark" : false;
      }
    } catch {
      initial = false;
    }
    setIsDark(initial);
  }, []);

  const handleThemeToggle = (checked: boolean) => {
    setIsDark(checked);
    try {
      const value = checked ? "dark" : "light";
      localStorage.setItem("theme", value);
      document.cookie = `theme=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
      document.documentElement.classList.toggle("dark", checked);
    } catch {
      // ignore write errors
    }
  };

  const handleLogout = () => {
    if (confirm("ログアウトしますか？")) {
      // TODO: ログアウト処理
      console.log("ログアウト");
      router.push("/zaiko/login");
    }
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "アカウントを削除しますか？この操作は取り消せません。"
      )
    ) {
      // TODO: アカウント削除処理
      console.log("アカウント削除");
    }
  };

  return (
    <>
      <ZaikoHeader
        title="設定"
        leftIcon="back"
        onLeftClick={() => router.back()}
      />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="px-4 py-6 space-y-6"
      >
        {/* テーマ設定 */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            {isDark ? (
              <Moon className="size-5 text-[#32D17D]" />
            ) : (
              <Sun className="size-5 text-[#32D17D]" />
            )}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              テーマ
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme" className="text-base text-gray-700 dark:text-gray-300">
              ダークモード
            </Label>
            <Switch
              id="theme"
              checked={isDark === null ? false : isDark}
              onCheckedChange={handleThemeToggle}
              disabled={isDark === null}
            />
          </div>
        </Card>

        {/* 通知設定 */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="size-5 text-[#32D17D]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              通知
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="notifications"
              className="text-base text-gray-700 dark:text-gray-300"
            >
              在庫アラート通知
            </Label>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </Card>

        {/* 家族設定 */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            <Users className="size-5 text-[#32D17D]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              家族
            </h2>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-base"
            onClick={() => router.push("/zaiko/member")}
          >
            <Users className="size-5 mr-2" />
            メンバー管理
          </Button>
        </Card>

        {/* その他 */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="size-5 text-[#32D17D]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              その他
            </h2>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-12 text-base"
              onClick={() => router.push("/zaiko/alert")}
            >
              <Bell className="size-5 mr-2" />
              通知履歴
            </Button>
          </div>
        </Card>

        {/* 危険な操作 */}
        <Card className="p-6 border-2 border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            危険な操作
          </h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-12 text-base border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="size-5 mr-2" />
              ログアウト
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-12 text-base border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="size-5 mr-2" />
              アカウントを削除
            </Button>
          </div>
        </Card>
      </motion.div>
    </>
  );
}

