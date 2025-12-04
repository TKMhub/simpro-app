"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Landmark, LineChart, PiggyBank, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const accounts = [
  { id: "1", name: "三菱UFJ銀行 (Main)", type: "BANK", owner: "Family", balance: 1200000 },
  { id: "2", name: "住信SBIネット銀行", type: "BANK", owner: "Husband", balance: 500000 },
  { id: "3", name: "楽天証券 (積立)", type: "SECURITIES", owner: "Wife", balance: 3400000 },
  { id: "4", name: "SBI証券 (夫)", type: "SECURITIES", owner: "Husband", balance: 2100000 },
  { id: "5", name: "iDeCo (妻)", type: "IDECO", owner: "Wife", balance: 800000 },
  { id: "6", name: "タンス預金", type: "GOODS", owner: "Family", balance: 100000 },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'BANK': return <Landmark className="h-5 w-5" />;
    case 'SECURITIES': return <LineChart className="h-5 w-5" />;
    case 'IDECO': return <PiggyBank className="h-5 w-5" />;
    case 'GOLD': return <Coins className="h-5 w-5" />;
    default: return <CreditCard className="h-5 w-5" />;
  }
};

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 font-serif">Accounts</h1>
          <p className="text-stone-500 mt-2">管理口座の一覧</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          口座を追加
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Link href={`/koza/accounts/${account.id}`} key={account.id} className="block group">
            <Card className="h-full border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2 text-emerald-800">
                  <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    {getTypeIcon(account.type)}
                  </div>
                  <span className="font-semibold text-sm">{account.type}</span>
                </div>
                <Badge variant="outline" className="text-stone-500 border-stone-200">
                  {account.owner}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-lg mb-1 group-hover:text-emerald-700 transition-colors">{account.name}</CardTitle>
                <div className="text-2xl font-bold text-stone-900 mt-2">
                  ¥{account.balance.toLocaleString()}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-stone-400">
                最終更新: 2024/05/01
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

