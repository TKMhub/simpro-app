'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { ZaikoShell, ZaikoContent } from '../_components/layout/zaiko-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { staggerContainer, staggerItem } from '../_lib/motion-presets';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Moon,
  Sun,
  Monitor,
  LogOut,
  User,
  Home,
  Info,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

export default function ZaikoSettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [emptyStockAlert, setEmptyStockAlert] = useState(true);

  const handleLogout = () => {
    // TODO: Phase 3で認証実装
    toast.success('ログアウトしました');
    router.push('/zaiko');
  };

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };

  return (
    <>
      <ZaikoHeader
        title="設定"
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
            {/* アカウント情報 */}
            <motion.div variants={staggerItem}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    アカウント
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                    <div>
                      <p className="font-semibold">山田太郎</p>
                      <p className="text-sm text-muted-foreground">
                        taro@example.com
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      編集
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 家族/グループ */}
            <motion.div variants={staggerItem}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    家族/グループ
                  </CardTitle>
                  <CardDescription className="text-base">
                    現在のグループ: <strong>山田家</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full text-base"
                    onClick={() => router.push('/zaiko/member')}
                  >
                    メンバー管理
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* 表示設定 */}
            <motion.div variants={staggerItem}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {themeIcons[theme as keyof typeof themeIcons] || themeIcons.system}
                    表示設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">テーマ</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light" className="text-base">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            ライトモード
                          </div>
                        </SelectItem>
                        <SelectItem value="dark" className="text-base">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            ダークモード
                          </div>
                        </SelectItem>
                        <SelectItem value="system" className="text-base">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            システム設定に従う
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 通知設定 */}
            <motion.div variants={staggerItem}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    通知設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">
                        通知を受け取る
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        在庫アラートなどの通知を受け取ります
                      </p>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">在庫が少ない時</Label>
                        <p className="text-xs text-muted-foreground">
                          閾値以下になった時に通知
                        </p>
                      </div>
                      <Switch
                        checked={lowStockAlert}
                        onCheckedChange={setLowStockAlert}
                        disabled={!notificationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">在庫が切れた時</Label>
                        <p className="text-xs text-muted-foreground">
                          在庫が0になった時に通知
                        </p>
                      </div>
                      <Switch
                        checked={emptyStockAlert}
                        onCheckedChange={setEmptyStockAlert}
                        disabled={!notificationsEnabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* その他 */}
            <motion.div variants={staggerItem}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    その他
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base"
                  >
                    利用規約
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base"
                  >
                    プライバシーポリシー
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    ライセンス情報
                  </Button>
                  <Separator className="my-2" />
                  <div className="px-4 py-2 text-center text-sm text-muted-foreground">
                    Version 1.0.0 (Phase 1: UI実装)
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ログアウト */}
            <motion.div variants={staggerItem} className="pb-8">
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 border-2 text-base font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                ログアウト
              </Button>
            </motion.div>
          </motion.div>
        </ZaikoContent>
      </ZaikoShell>
    </>
  );
}

