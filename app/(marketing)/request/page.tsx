import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Code2, Database, Rocket, Wrench, ShieldCheck, MonitorPlay } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestLandingPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="py-24 text-center container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
          受託開発・業務改善
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Webアプリ開発から業務自動化ツールまで。<br />
          あなたの「やりたい」を技術で実現します。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8 text-lg h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-xl">
            <Link href="/request/new">見積もり・相談を依頼する</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-lg h-14">
            <Link href="/contact">まずは相談する</Link>
          </Button>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">提供サービス</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <Code2 className="w-12 h-12 text-blue-500 mb-4" />
                <CardTitle className="text-xl">Webアプリケーション開発</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Next.js / Supabase を用いたモダンで高速なWebアプリ開発。SaaS、社内システム、マッチングサイトなど。
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <Database className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle className="text-xl">業務自動化・ツール</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Excel/VBA、GAS、Pythonスクリプトによる定型業務の自動化。データ集計、レポート作成、API連携など。
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <Rocket className="w-12 h-12 text-purple-500 mb-4" />
                <CardTitle className="text-xl">PoC / プロトタイプ</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                新規事業の検証用プロトタイプを短期間で開発。MVP（Minimum Viable Product）の設計から実装まで。
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Operation & Maintenance */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">運用・保守サポート</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">システム保守・運用代行</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground pt-0 pl-[4.5rem]">
              <p className="mb-4">
                開発したシステムのサーバー監視、障害対応、ライブラリのアップデート等を代行します。
                安定稼働を維持し、ビジネスの継続性を担保します。
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 定期バックアップ・監視</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> セキュリティアップデート</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 障害時の復旧対応</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <MonitorPlay className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl">自走支援・レクチャー</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground pt-0 pl-[4.5rem]">
              <p className="mb-4">
                「自分たちで運用・改修できるようになりたい」というチーム向けに、技術レクチャーやコードレビューを実施します。
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> ソースコード解説・勉強会</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 環境構築サポート</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 定期的なメンタリング</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">開発の流れ</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              { title: "ヒアリング", desc: "課題や要望を詳しくお伺いします。Zoom等でオンライン実施。" },
              { title: "提案・見積もり", desc: "最適な技術選定と概算見積もりをご提示します。" },
              { title: "契約・着手", desc: "契約締結後、開発に着手します。チャット等で密に連携。" },
              { title: "開発・確認", desc: "定期的に進捗を共有し、認識齟齬を防ぎながら進めます。" },
              { title: "納品", desc: "動作確認完了後、本番環境へのデプロイまたはソースコード納品。" },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-20 bg-primary/5 dark:bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">まずはお気軽にご相談ください</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            予算に合わせた提案も可能です。漠然としたアイデアの状態でも構いません。
          </p>
          <Button asChild size="lg" className="rounded-full px-12 text-lg h-16 shadow-xl bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/request/new">見積もり・相談を依頼する</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
