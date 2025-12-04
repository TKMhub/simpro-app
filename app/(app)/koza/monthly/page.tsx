"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Copy, Loader2 } from "lucide-react";

// Mock Accounts
const accounts = [
  { id: "1", name: "三菱UFJ銀行 (Main)", type: "BANK", prevBalance: 1200000 },
  { id: "2", name: "住信SBIネット銀行", type: "BANK", prevBalance: 500000 },
  { id: "3", name: "楽天証券 (積立)", type: "SECURITIES", prevBalance: 3400000 },
  { id: "4", name: "SBI証券 (夫)", type: "SECURITIES", prevBalance: 2100000 },
  { id: "5", name: "iDeCo (妻)", type: "IDECO", prevBalance: 800000 },
  { id: "6", name: "タンス預金", type: "GOODS", prevBalance: 100000 },
];

export default function MonthlyInputPage() {
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("5");
  const [isSaving, setIsSaving] = useState(false);
  
  // State for inputs
  const [inputs, setInputs] = useState<Record<string, number>>(
    // Initialize with some dummy logic or empty
    {}
  );
  
  const handleCopyPrev = () => {
    // Mock copy logic
    const newInputs = { ...inputs };
    accounts.forEach(acc => {
      newInputs[acc.id] = acc.prevBalance;
    });
    setInputs(newInputs);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => setIsSaving(false), 1500);
  };

  const calculateTotal = () => {
    return Object.values(inputs).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 font-serif">Monthly Input</h1>
          <p className="text-stone-500 mt-2">月次残高の入力・管理</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-stone-200">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023年</SelectItem>
              <SelectItem value="2024">2024年</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-stone-300">|</span>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[80px] border-none shadow-none focus:ring-0">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}月</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl text-emerald-900">2024年5月 残高入力</CardTitle>
            <CardDescription>各口座の月末時点の評価額を入力してください</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyPrev} className="text-emerald-700 border-emerald-200 hover:bg-emerald-50">
              <Copy className="h-4 w-4 mr-2" />
              前月からコピー
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              保存する
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px]">口座名</TableHead>
                <TableHead>種別</TableHead>
                <TableHead className="text-right">前月残高</TableHead>
                <TableHead className="w-[200px]">今月残高</TableHead>
                <TableHead>メモ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-emerald-50/30">
                  <TableCell className="font-medium text-stone-700">{account.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                      {account.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-stone-500">
                    ¥{account.prevBalance.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={inputs[account.id] || ''}
                      onChange={(e) => setInputs({...inputs, [account.id]: Number(e.target.value)})}
                      className="text-right font-mono"
                      placeholder="0" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="備考..." className="border-none bg-transparent focus:bg-white focus:ring-1 focus:ring-emerald-500" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* Total Row */}
            <TableBody className="border-t-2 border-emerald-100">
              <TableRow className="hover:bg-transparent font-bold bg-emerald-50/50">
                <TableCell colSpan={3} className="text-right text-emerald-900">合計</TableCell>
                <TableCell className="text-right text-xl text-emerald-900 font-mono">
                  ¥{calculateTotal().toLocaleString()}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

