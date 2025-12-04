"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 font-serif">Settings</h1>
        <p className="text-stone-500 mt-2">家族とアプリの設定</p>
      </div>

      <Card className="border-emerald-100">
        <CardHeader>
          <CardTitle>家族メンバー (Users)</CardTitle>
          <CardDescription>資産の所有者として割り当てるメンバーを管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border border-stone-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-emerald-100 text-emerald-700">F</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-stone-900">Family (共通)</p>
                <p className="text-xs text-stone-500">家計全体の資産</p>
              </div>
            </div>
            <Button variant="outline" size="sm">編集</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-stone-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-700">H</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-stone-900">Husband</p>
                <p className="text-xs text-stone-500">夫の個人資産</p>
              </div>
            </div>
            <Button variant="outline" size="sm">編集</Button>
          </div>

           <div className="flex items-center justify-between p-4 bg-white border border-stone-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-pink-100 text-pink-700">W</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-stone-900">Wife</p>
                <p className="text-xs text-stone-500">妻の個人資産</p>
              </div>
            </div>
            <Button variant="outline" size="sm">編集</Button>
          </div>

          <Button variant="ghost" className="w-full border-2 border-dashed border-stone-200 text-stone-500 hover:border-emerald-300 hover:text-emerald-700 h-12">
            <Plus className="h-4 w-4 mr-2" />
            メンバーを追加
          </Button>
        </CardContent>
      </Card>

      <Card className="border-emerald-100">
        <CardHeader>
          <CardTitle>表示設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="currency">通貨単位</Label>
            <Input type="text" id="currency" placeholder="JPY (¥)" disabled defaultValue="JPY (¥)" />
            <p className="text-xs text-stone-500">現在は日本円のみ対応しています</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

