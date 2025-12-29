'use client';

import Image from 'next/image';
import { ArrowRight, Calculator, Trophy, BarChart3, Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { createNewProject } from '@/lib/juice/actions';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function JuiceLandingPage() {
  const router = useRouter();

  const handleStart = async () => {
    try {
        const result = await createNewProject();
        if (result.success && result.slug) {
            router.push(`/juice/group/${result.slug}`);
        } else {
            console.error('Failed to create project:', result.error);
            // Fallback for offline/error: generate locally (though it won't be saved in DB immediately)
            // But since we want short IDs, client-side generation is risky for collision.
            // Better to show error toast.
            toast.error('プロジェクト作成に失敗しました。もう一度お試しください。');
        }
    } catch (e) {
        console.error(e);
        toast.error('エラーが発生しました');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="px-6 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Juice<span className="text-cyan-500">.</span>
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[10%] w-20 h-20 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
          <div className="absolute top-[20%] right-[15%] w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-[10%] left-[20%] w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        </div>

        <div className="z-10 relative">
          <div className="w-40 h-40 mx-auto relative animate-bounce-slow">
            <Image
              src="/juice-logo.svg"
              alt="Juice Logo"
              width={160}
              height={160}
              className="drop-shadow-2xl"
              priority
            />
          </div>
          
          <div className="mt-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              勝負の行方は、
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                ジュース
              </span>
              が決める。
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              ライバルとの勝負、ジュースポイントで記録して
              <br />
              どちらが勝ち越しているか可視化しよう。
            </p>
          </div>

          <div className="mt-10">
            <button 
              onClick={handleStart}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 ring-offset-2 focus:ring-2 ring-cyan-400"
            >
              今すぐ始める
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-4 text-xs text-slate-400">ログイン不要・完全無料</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-900 py-12 px-6 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10 relative">
        <h2 className="text-center text-xl font-bold mb-8 text-slate-800 dark:text-slate-200">
          How it works
        </h2>
        
        <div className="grid gap-6">
          <FeatureCard
            icon={<Link2 className="w-8 h-8 text-emerald-500" />}
            title="グループ作成 & 招待"
            description="専用URLを発行して友達を招待。ログイン不要ですぐにグループを作れます。"
          />
          <FeatureCard 
            icon={<Calculator className="w-8 h-8 text-cyan-500" />}
            title="ルール設定 & 記録"
            description="あらゆる勝負に対応。カスタムルールで順位ごとのポイントも自由に設定可能。"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8 text-yellow-500" />}
            title="ランキング自動集計"
            description="グループ内の総合ランキングを自動で集計。誰が一番強いか一目瞭然。"
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8 text-purple-500" />}
            title="ジュースで可視化"
            description="勝ち越し状況をジュースの本数で換算。貸し借りが一目でわかります。"
          />
        </div>

        {/* How to use Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-center text-xl font-bold mb-8 text-slate-800 dark:text-slate-200">
            使用方法ガイド
          </h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-xl px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-white">グループ作成と招待</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">ワンクリックで作成、URLで簡単招待</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  面倒な登録は不要です。「今すぐ始める」ボタンを押すだけで、あなた専用のグループが作成されます。
                  発行されたURLをLINEやDiscordで友達に送るだけで、招待は完了です。
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">詳細な手順</h4>
                  <StepList steps={[
                    "トップページの「今すぐ始める」をクリックしてグループを自動作成",
                    "グループ画面右上の「共有」ボタンからURLをコピー",
                    "友達にURLを送信（パスワードを設定して入室制限をかけることも可能です）",
                    "必要に応じて設定画面からグループ名を変更"
                  ]} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-xl px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-white">メンバー参加と登録</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">ニックネームだけで即参加可能</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  招待されたメンバーは、URLを開いて自分のニックネームを入力するだけで参加できます。
                  アカウント作成やログインは必須ではありません。
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">詳細な手順</h4>
                  <StepList steps={[
                    "共有されたURLにアクセス",
                    "「メンバーとして参加」で名前を入力して登録",
                    "ログインユーザーは自分のプロフィールアイコンをそのまま使用可能",
                    "間違えて登録しても、管理者が後からメンバーを削除・編集可能"
                  ]} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-xl px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-white">勝負の記録とルール設定</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">順位に応じたポイント計算を自動化</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  ゲームが終わったら順位を入力するだけ。事前に設定したポイント配分ルールに基づいて、
                  自動的に勝ち負けが計算されます。「大富豪」や「麻雀」など、ゲームごとのプリセットも用意。
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">詳細な手順</h4>
                  <StepList steps={[
                    "「記録する」ボタンを押し、参加メンバーを選択",
                    "メンバーごとの順位（1位、2位...）を選択して保存",
                    "「カスタムルール」設定で、1位は+50点、最下位は-50点などの傾斜配分を自由に調整",
                    "得点制のゲームの場合は、スコアを直接入力することも可能（今後のアップデートで対応予定）"
                  ]} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-xl px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-white">ジュース換算と清算</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">「結局だれがどれくらい勝ってるの？」を可視化</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  ポイントの差を「ジュース何本分」というわかりやすい単位に換算して表示します。
                  「100ポイント = ジュース1本」のようにレートを設定することで、直感的に勝敗を把握できます。
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">詳細な手順</h4>
                  <StepList steps={[
                    "ダッシュボードで全員のトータルスコアを確認",
                    "スコアの横に表示される🥤アイコンで、平均との差（勝ち越し/負け越し）を確認",
                    "「設定」メニューから、1ジュースあたりのポイントレート（例: 150pt）を変更可能",
                    "清算が終わったら「リセット」機能で新しいシーズンを開始することも可能"
                  ]} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-950 rounded-full shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <div className="mt-4 pl-4 border-l-2 border-slate-100 dark:border-slate-700 space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-500 ring-4 ring-white dark:ring-slate-900" />
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step}</p>
        </div>
      ))}
    </div>
  );
}
