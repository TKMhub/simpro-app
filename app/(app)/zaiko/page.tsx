"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ZaikoHeader } from "./_components/layout/zaiko-header";
import { UIHero } from "./_components/common/ui-hero";
import { SectionBlock } from "./_components/common/section-block";
import { FeatureCard } from "./_components/common/feature-card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Bell,
  Users,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "./_lib/motion-presets";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ZaikoLandingPage() {
  const router = useRouter();

  return (
    <>
      <ZaikoHeader
        title="Zaiko"
        rightIcon={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/zaiko/login")}
            className="text-sm"
          >
            ログイン
          </Button>
        }
      />

      {/* Hero Section */}
      <UIHero
        catchCopy="家の在庫、考える時間ゼロへ"
        subCopy="スマホ1つでラクに登録・補充・共有できる在庫管理アプリ"
        primaryCTA={{
          label: "無料で始める",
          onClick: () => router.push("/zaiko/login"),
        }}
        secondaryCTA={{
          label: "機能を見る",
          onClick: () => {
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" });
          },
        }}
        mockImage={
          <div className="w-full max-w-xs">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-800">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <div className="size-10 rounded-full bg-[#32D17D]/20 flex items-center justify-center">
                      <Package className="size-5 text-[#32D17D]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        }
      />

      {/* 課題セクション */}
      <SectionBlock
        title="こんなお悩みありませんか？"
        className="bg-gray-50 dark:bg-gray-900/50"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {[
            { icon: AlertCircle, text: "トイレットペーパーが急に切れる" },
            { icon: AlertCircle, text: "買い物中に「あれあったっけ？」と悩む" },
            {
              icon: AlertCircle,
              text: "家族で在庫状況を共有できていない",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border"
            >
              <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <item.icon className="size-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </SectionBlock>

      {/* 解決策セクション */}
      <SectionBlock title="Zaikoがあれば">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {[
            { icon: CheckCircle2, text: "残り個数が一目でわかる" },
            { icon: CheckCircle2, text: "家族全員のスマホで共有" },
            { icon: CheckCircle2, text: "少なくなったら自動で通知" },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
            >
              <div className="size-10 rounded-full bg-[#32D17D]/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="size-5 text-[#32D17D]" />
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </SectionBlock>

      {/* 主要機能 */}
      <SectionBlock
        id="features"
        title="主要機能"
        subtitle="Zaikoの便利な機能をご紹介"
      >
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            icon={<Package className="size-8" />}
            title="在庫一覧"
            description="すべての在庫を一目で確認"
          />
          <FeatureCard
            icon={<Bell className="size-8" />}
            title="自動アラート"
            description="在庫が少なくなったら通知"
          />
          <FeatureCard
            icon={<Users className="size-8" />}
            title="家族共有"
            description="家族全員で在庫を共有"
          />
          <FeatureCard
            icon={<ShoppingCart className="size-8" />}
            title="買い物リスト"
            description="必要なものを自動でリスト化"
          />
        </div>
      </SectionBlock>

      {/* FAQ */}
      <SectionBlock
        title="よくある質問"
        className="bg-gray-50 dark:bg-gray-900/50"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              無料で使えますか？
            </AccordionTrigger>
            <AccordionContent>
              はい、Zaikoは完全無料でご利用いただけます。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              家族は何人まで使えますか？
            </AccordionTrigger>
            <AccordionContent>
              家族の人数に制限はありません。何人でもご利用いただけます。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              データは安全ですか？
            </AccordionTrigger>
            <AccordionContent>
              はい、すべてのデータは暗号化され、安全に保管されます。
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SectionBlock>

      {/* CTA Section */}
      <SectionBlock className="pb-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            今すぐ始めましょう
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            機能を利用するにはログインが必要です
          </p>
          <Button
            onClick={() => router.push("/zaiko/login")}
            size="lg"
            className="bg-[#32D17D] hover:bg-[#22C55E] text-white px-8 py-6 text-base font-semibold rounded-xl"
          >
            無料で始める
          </Button>
        </motion.div>
      </SectionBlock>
    </>
  );
}

