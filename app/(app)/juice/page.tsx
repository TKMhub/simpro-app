'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calculator, Trophy, BarChart3 } from 'lucide-react';

export default function JuiceLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
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
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              勝負の行方は、<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                ジュース
              </span>
              が決める。
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              負けた方がおごる。その一瞬の熱狂と貸し借りを、スマートに記録しよう。
            </p>
          </div>

          <div className="mt-10">
            <Link 
              href="/juice/dashboard" 
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 ring-offset-2 focus:ring-2 ring-cyan-400"
            >
              今すぐ始める
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
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
            icon={<Trophy className="w-8 h-8 text-yellow-500" />}
            title="勝負する"
            description="スポーツ、ゲーム、じゃんけん。あらゆる勝負の結果が決まったら..."
          />
          <FeatureCard 
            icon={<Calculator className="w-8 h-8 text-cyan-500" />}
            title="記録する"
            description="「誰が」「誰に」「何を」おごるのか。計算機のようにサクッと入力。"
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8 text-purple-500" />}
            title="可視化する"
            description="どちらが勝ち越しているか一目瞭然。次回の勝負へのモチベーションに。"
          />
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
