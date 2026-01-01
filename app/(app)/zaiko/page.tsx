import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Zap, Share2, Bell, ShoppingCart, Smartphone } from 'lucide-react';
import { ZaikoHeader } from './_components/layout/zaiko-header';
import { UiHero } from './_components/common/ui-hero';
import { SectionBlock } from './_components/common/section-block';
import { FeatureCard } from './_components/common/feature-card';
import { MotionContainer } from './_components/common/motion-container';
import { createClient } from '@/lib/supabase/server';

export default async function ZaikoLpPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/zaiko/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black pb-20">
      <ZaikoHeader 
        title="" 
        rightAction={
          <Button asChild variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs">
            <Link href="/zaiko/login">ログイン</Link>
          </Button>
        }
      />

      <main>
        {/* Hero Section */}
        <UiHero />

        {/* Problem Section */}
        <SectionBlock className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100">
          <MotionContainer>
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center">こんな「困った」ありませんか？</h2>
              <ul className="space-y-4">
                {[
                  '買い物中に「あれ、まだあったっけ？」と迷う',
                  'トイレットペーパーが急に切れて焦る',
                  '家族が使ったのに補充してくれない',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl shadow-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold text-sm">
                      !
                    </span>
                    <span className="text-sm font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </MotionContainer>
        </SectionBlock>

        {/* Solution Section */}
        <SectionBlock title={<>Zaiko<span className="text-green-500">.</span>なら解決できます</>} subtitle="在庫管理のストレスをゼロに">
          <div className="grid grid-cols-1 gap-4">
             <MotionContainer delay="small">
              <FeatureCard 
                icon={CheckCircle2}
                title="一目でわかる"
                description="アプリを開けば、家の在庫状況が一目瞭然。買い物中の迷いがなくなります。"
              />
            </MotionContainer>
            <MotionContainer delay="medium">
              <FeatureCard 
                icon={Bell}
                title="自動で通知"
                description="在庫が少なくなったら自動でお知らせ。買い忘れを確実に防げます。"
              />
            </MotionContainer>
            <MotionContainer delay="long">
              <FeatureCard 
                icon={Share2}
                title="家族で共有"
                description="リアルタイムに同期されるので、誰が買っても、使っても、常に最新。"
              />
            </MotionContainer>
          </div>
        </SectionBlock>

        {/* Feature Grid */}
        <SectionBlock id="features" title="便利な機能" className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100">
          <div className="grid grid-cols-2 gap-3">
             {[
               { icon: Zap, label: '簡単入力', desc: 'タップだけで完了' },
               { icon: ShoppingCart, label: '買い物リスト', desc: '自動で作成' },
               { icon: Smartphone, label: 'スマホ最適化', desc: '片手でサクサク' },
               { icon: Bell, label: '期限管理', desc: '賞味期限も' },
             ].map((item, i) => (
               <div key={i} className="flex flex-col items-center text-center p-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl shadow-sm">
                 <item.icon className="w-8 h-8 text-green-500 mb-2" />
                 <h3 className="font-bold text-sm">{item.label}</h3>
                 <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
               </div>
             ))}
          </div>
        </SectionBlock>

        {/* FAQ Section */}
        <SectionBlock title="よくある質問">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>無料で使えますか？</AccordionTrigger>
              <AccordionContent>
                はい、基本的な機能はすべて無料でご利用いただけます。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>家族は何人まで招待できますか？</AccordionTrigger>
              <AccordionContent>
                特に制限はありません。ご家族全員で共有してご利用いただけます。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>iPhoneでもAndroidでも使えますか？</AccordionTrigger>
              <AccordionContent>
                はい、Webブラウザからアクセスできるため、機種を問わずご利用いただけます。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SectionBlock>

        {/* Bottom CTA */}
        <div className="sticky bottom-0 p-4 bg-white/90 dark:bg-black/90 backdrop-blur border-t border-zinc-200 dark:border-zinc-800">
           <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg h-12 text-base font-bold">
            <Link href="/zaiko/login">
              今すぐ始める
            </Link>
          </Button>
          <p className="text-center text-[10px] text-zinc-400 mt-2">
            ご利用にはログインが必要です
          </p>
        </div>

        {/* Powered by Simpro */}
        <div className="flex flex-col items-center gap-2 py-8 opacity-50">
            <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Powered by</span>
            <span className="text-xl font-bold text-zinc-400 tracking-widest">Simplo</span>
            <p className="text-[10px] text-zinc-400">“Simple is Professional”</p>
        </div>
      </main>
    </div>
  );
}
