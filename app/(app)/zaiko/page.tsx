'use client';

import { motion } from 'framer-motion';
import { UIHero } from './_components/common/ui-hero';
import { SectionBlock } from './_components/common/section-block';
import { FeatureCard } from './_components/common/feature-card';
import { MotionContainer } from './_components/common/motion-container';
import { ZaikoHeader } from './_components/layout/zaiko-header';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { staggerContainer, staggerItem } from './_lib/motion-presets';
import Link from 'next/link';

export default function ZaikoLandingPage() {
  const features = [
    {
      icon: '📊',
      title: '在庫一覧',
      description:
        'すべての在庫を一目で確認。残量、保管場所、ステータスを視覚的に表示します。',
    },
    {
      icon: '🔔',
      title: '自動アラート',
      description:
        '在庫が少なくなったら自動で通知。買い忘れを防ぎます。',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: '家族共有',
      description:
        '家族みんなで在庫情報を共有。誰でも更新できて、リアルタイムで同期されます。',
    },
    {
      icon: '🛒',
      title: '買い物リスト',
      description:
        '在庫が少ないアイテムを自動でリスト化。買い物がスムーズになります。',
    },
  ];

  const beforePoints = [
    '🧻 トイレットペーパーが急に切れる',
    '🤔 買い物中に"あれあったっけ？"と悩む',
    '😰 家族で在庫状況を共有できていない',
    '📝 在庫管理アプリは入力が面倒で続かない',
  ];

  const afterPoints = [
    '✅ 残り個数が一目でわかる',
    '📱 家族全員のスマホで共有',
    '🔔 少なくなったら自動で通知',
    '⚡ ボタン1つで簡単に在庫を更新',
  ];

  const useCases = [
    {
      icon: '🏠',
      title: '夫婦で家事分担',
      description:
        '買い物担当が変わっても、在庫状況が一目瞭然。買い忘れがなくなります。',
    },
    {
      icon: '🚗',
      title: '旅行前の確認',
      description:
        '出かける前に在庫を確認。足りないものを事前に買い足せます。',
    },
    {
      icon: '👴',
      title: '実家の在庫管理',
      description:
        '遠く離れた実家の在庫も管理可能。両親の買い物をサポートできます。',
    },
  ];

  const faqs = [
    {
      question: '無料で使えますか？',
      answer:
        'はい、基本機能は完全無料でご利用いただけます。家族での共有も追加料金なしで可能です。',
    },
    {
      question: '家族は何人まで使えますか？',
      answer:
        '現在、1つのグループにつき最大10名まで招待可能です。ほとんどのご家庭で十分にご利用いただける人数です。',
    },
    {
      question: 'スマホだけで使えますか？',
      answer:
        'はい、スマホに最適化されたWebアプリです。iPhone、Androidどちらでもブラウザからアクセスしてご利用いただけます。',
    },
    {
      question: '在庫の登録は簡単ですか？',
      answer:
        'とても簡単です。アイテム名、数量、カテゴリを選ぶだけ。アイコンも豊富に用意しているので、視覚的にわかりやすく管理できます。',
    },
    {
      question: 'データは安全ですか？',
      answer:
        'Supabaseを使用した安全なデータベースで管理しています。各家族のデータは完全に分離されており、他のユーザーからは見えません。',
    },
  ];

  return (
    <div className="relative min-h-screen">
      <ZaikoHeader />

      {/* Hero Section */}
      <UIHero />

      <div className="mx-auto max-w-6xl px-4">
        {/* 課題セクション */}
        <SectionBlock
          id="problem"
          title="こんなお悩みありませんか？"
          subtitle="在庫管理のあるあるな問題"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto grid max-w-2xl gap-4"
          >
            {beforePoints.map((point, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="border-2 border-muted">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="text-2xl">{point.split(' ')[0]}</div>
                    <p className="text-base font-medium leading-relaxed">
                      {point.split(' ').slice(1).join(' ')}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </SectionBlock>

        {/* 解決策セクション */}
        <SectionBlock
          id="solution"
          title="Zaikoがあれば"
          subtitle="在庫管理の悩みをすべて解決"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto grid max-w-2xl gap-4"
          >
            {afterPoints.map((point, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="border-2 border-[#32D17D] bg-[#32D17D]/5">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="text-2xl">{point.split(' ')[0]}</div>
                    <p className="text-base font-semibold leading-relaxed">
                      {point.split(' ').slice(1).join(' ')}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </SectionBlock>

        {/* 主要機能 */}
        <SectionBlock
          id="features"
          title="主要機能"
          subtitle="シンプルで使いやすい、必要な機能がすべて揃っています"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => (
              <MotionContainer key={index} type="slideInUp" delay={index * 0.1}>
                <FeatureCard {...feature} />
              </MotionContainer>
            ))}
          </div>
        </SectionBlock>

        {/* 利用シーン */}
        <SectionBlock
          id="use-cases"
          title="こんなシーンで活躍"
          subtitle="家族の日常をより快適に"
        >
          <div className="grid gap-6 sm:grid-cols-3">
            {useCases.map((useCase, index) => (
              <MotionContainer key={index} type="scaleIn" delay={index * 0.1}>
                <Card className="h-full border-2">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 text-5xl">{useCase.icon}</div>
                    <h3 className="mb-3 text-lg font-bold">{useCase.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              </MotionContainer>
            ))}
          </div>
        </SectionBlock>

        {/* FAQ */}
        <SectionBlock
          id="faq"
          title="よくある質問"
          subtitle="疑問や不安を解消します"
        >
          <MotionContainer type="fadeIn">
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-base font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </MotionContainer>
        </SectionBlock>

        {/* CTA Section */}
        <section className="py-20">
          <MotionContainer type="scaleIn">
            <Card className="border-2 border-[#32D17D] bg-gradient-to-br from-[#32D17D]/10 to-[#32D17D]/5">
              <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
                <div className="text-5xl">📦</div>
                <h2 className="text-3xl font-bold">
                  今すぐZaikoを始めましょう
                </h2>
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                  家族みんなで在庫を共有して、買い忘れをゼロに。
                  <br />
                  登録は無料、たった1分で始められます。
                </p>
                <Link href="/zaiko/login">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      className="h-14 rounded-full bg-[#32D17D] px-10 text-lg font-bold text-white shadow-xl hover:bg-[#2BB870]"
                    >
                      無料で始める
                    </Button>
                  </motion.div>
                </Link>
                <p className="text-sm text-muted-foreground">
                  機能を利用するにはログインが必要です
                </p>
              </CardContent>
            </Card>
          </MotionContainer>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="text-xl font-bold">Zaiko</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Zaiko. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

