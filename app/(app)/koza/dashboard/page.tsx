"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, TrendingUp, Wallet, Landmark, ArrowDownRight } from "lucide-react";

// Mock Data (Assets)
const trendData = [
  { month: '2023-10', amount: 1200 },
  { month: '2023-11', amount: 1250 },
  { month: '2023-12', amount: 1400 },
  { month: '2024-01', amount: 1380 },
  { month: '2024-02', amount: 1420 },
  { month: '2024-03', amount: 1450 },
  { month: '2024-04', amount: 1540 },
];

// Mock Data (Income/Expense)
const balanceData = [
  { month: '10月', income: 45, expense: 30, balance: 15 },
  { month: '11月', income: 45, expense: 35, balance: 10 },
  { month: '12月', income: 90, expense: 50, balance: 40 }, // Bonus
  { month: '1月', income: 45, expense: 45, balance: 0 },
  { month: '2月', income: 45, expense: 32, balance: 13 },
  { month: '3月', income: 45, expense: 38, balance: 7 },
];

const allocationData = [
  { name: 'Bank', value: 800, color: '#059669' }, // Emerald 600
  { name: 'Securities', value: 500, color: '#d97706' }, // Amber 600
  { name: 'iDeCo', value: 200, color: '#3b82f6' }, // Blue 500
  { name: 'Gold', value: 40, color: '#eab308' }, // Yellow 500
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950 font-serif">Dashboard</h1>
        <p className="text-stone-500 mt-2">資産状況の概要と推移</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <Card className="bg-white border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">総資産</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">¥15,400,000</div>
            <p className="text-xs text-stone-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
              先月比 +2.5%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">年初来増減</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">+¥1,200,000</div>
            <p className="text-xs text-stone-500 mt-1">
              着実に資産形成できています
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">現金比率</CardTitle>
            <Landmark className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">52%</div>
            <p className="text-xs text-stone-500 mt-1">
              目標: 50% (適正範囲)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trend Chart (Asset Growth) */}
        <Card className="col-span-1 lg:col-span-2 border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-emerald-900">資産推移</CardTitle>
            <CardDescription>過去6ヶ月間の総資産推移 (単位: 万円)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#065f46' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#059669" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Allocation Chart (Portfolio) */}
        <Card className="col-span-1 border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-emerald-900">ポートフォリオ</CardTitle>
            <CardDescription>資産種別内訳</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-stone-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-stone-900">{item.value}万</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income/Expense Analysis */}
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-emerald-900">月次収支推移</CardTitle>
          <CardDescription>収入・支出・収支差額の推移 (単位: 万円)</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={balanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend iconType="circle" />
              <Bar dataKey="income" name="収入" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="balance" name="収支差" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
