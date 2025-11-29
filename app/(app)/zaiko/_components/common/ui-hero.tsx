'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fadeIn, slideInUp, staggerContainer, staggerItem } from '../../_lib/motion-presets';

export function UIHero() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* 背景装飾 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-[#32D17D]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-4 text-center"
      >
        {/* キャッチコピー */}
        <motion.div variants={staggerItem} className="mb-6">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            家の在庫、
            <br />
            <span className="bg-gradient-to-r from-[#32D17D] to-[#2BB870] bg-clip-text text-transparent">
              考える時間ゼロへ
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            トイレットペーパー、洗剤、調味料…
            <br />
            家族みんなで在庫を共有して、買い忘れをゼロに。
          </p>
        </motion.div>

        {/* iPhoneモック */}
        <motion.div
          variants={staggerItem}
          className="relative mx-auto mb-10 max-w-sm"
        >
          <div className="relative overflow-hidden rounded-[3rem] border-8 border-gray-800 bg-gray-800 shadow-2xl">
            <div className="aspect-[9/19.5] bg-gradient-to-br from-background via-background to-muted/30 p-4">
              {/* モックUI */}
              <div className="space-y-3 pt-8">
                <div className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#32D17D]/20 text-2xl">
                      🧻
                    </div>
                    <div>
                      <p className="font-semibold">トイレットペーパー</p>
                      <p className="text-sm text-muted-foreground">残り: 3個</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-[#FFB800] px-3 py-1 text-xs font-bold text-white">
                    少
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#32D17D]/20 text-2xl">
                      🧼
                    </div>
                    <div>
                      <p className="font-semibold">食器用洗剤</p>
                      <p className="text-sm text-muted-foreground">残り: 1個</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-[#FF3B30] px-3 py-1 text-xs font-bold text-white">
                    切
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#32D17D]/20 text-2xl">
                      🧴
                    </div>
                    <div>
                      <p className="font-semibold">ハンドソープ</p>
                      <p className="text-sm text-muted-foreground">残り: 5個</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-[#32D17D] px-3 py-1 text-xs font-bold text-white">
                    十分
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ノッチ */}
          <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-gray-800" />
        </motion.div>

        {/* CTAボタン */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/zaiko/login">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="h-12 gap-2 rounded-full bg-[#32D17D] px-8 text-base font-bold text-white shadow-lg hover:bg-[#2BB870] hover:shadow-xl"
              >
                無料で始める
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
          <Link href="#features">
            <Button
              variant="ghost"
              size="lg"
              className="h-12 rounded-full px-6 text-base font-semibold"
            >
              機能を見る
            </Button>
          </Link>
        </motion.div>

        {/* 補足 */}
        <motion.p
          variants={fadeIn}
          className="mt-6 text-sm text-muted-foreground"
        >
          機能を利用するにはログインが必要です
        </motion.p>
      </motion.div>
    </section>
  );
}

