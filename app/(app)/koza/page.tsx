import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function KozaLandingPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-stone-50">
      <div className="max-w-4xl w-full px-6 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
            <Wallet className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 font-serif">
            Cosa <span className="text-emerald-600">Financial</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            家族の資産を、もっとシンプルに、もっと透明に。<br />
            複数の口座・証券・iDeCoを一元管理できる資産管理アプリケーション。
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/koza/dashboard">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full h-12 text-lg">
                ダッシュボードへ <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/koza/monthly">
              <Button variant="outline" size="lg" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full h-12 text-lg">
                資産を入力
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/50 backdrop-blur">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800">ポートフォリオ可視化</h3>
              <p className="text-stone-500 text-sm">
                現金、株式、投資信託などの資産配分を一目で把握。リスク管理を容易に。
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/50 backdrop-blur">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800">資産推移グラフ</h3>
              <p className="text-stone-500 text-sm">
                毎月の入力データから資産の増減をグラフ化。長期的な資産形成をサポート。
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/50 backdrop-blur">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800">家族口座管理</h3>
              <p className="text-stone-500 text-sm">
                夫、妻、子供、共有口座など、所有者ごとに口座をタグ付けして管理可能。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
