"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const historyData = [
  { month: '2023-11', amount: 1000 },
  { month: '2023-12', amount: 1100 },
  { month: '2024-01', amount: 1050 },
  { month: '2024-02', amount: 1150 },
  { month: '2024-03', amount: 1180 },
  { month: '2024-04', amount: 1200 },
];

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-stone-500 hover:text-emerald-700">
          <Link href="/koza/accounts">
            <ArrowLeft className="h-5 w-5 mr-2" />
            一覧に戻る
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 font-serif">三菱UFJ銀行 (Main)</h1>
          <p className="text-stone-500 mt-2">ID: {id} | Type: BANK | Owner: Family</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-stone-600">
            <Edit className="h-4 w-4 mr-2" />
            編集
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-100 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 border-emerald-100">
          <CardHeader>
            <CardTitle>残高推移</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle>最新情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-stone-500">現在の残高</p>
              <p className="text-3xl font-bold text-emerald-900">¥1,200,000</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">前月比</p>
              <p className="text-lg font-medium text-emerald-600">+¥20,000</p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <p className="text-sm text-stone-500 mb-2">直近のメモ</p>
              <div className="bg-stone-50 p-3 rounded text-sm text-stone-600">
                給与振込あり。カード引き落とし済み。
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

