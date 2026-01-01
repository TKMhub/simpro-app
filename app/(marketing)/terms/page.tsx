import React from 'react';
import { ZaikoHeader } from '@/app/(app)/zaiko/_components/layout/zaiko-header';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* 簡易ヘッダー: 戻るボタン等は共通Headerのpropsで制御可能だが、ここではシンプルに */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 p-4">
        <h1 className="font-bold text-center">利用規約</h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">第1条（適用）</h2>
          <p>
            本利用規約（以下「本規約」といいます。）は、Simpro（以下「当方」といいます。）が提供するサービス（以下「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">第2条（サービスの性質）</h2>
          <p>
            本サービスは、個人開発によるベータ版サービスです。機能の追加、変更、中断、終了が予告なく行われる場合があります。当方は、本サービスの継続的な提供や、データの完全性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">第3条（禁止事項）</h2>
          <p>
            ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>当方のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
            <li>不正アクセスをし、またはこれを試みる行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">第4条（免責事項）</h2>
          <p>
            当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            当方は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">第5条（準拠法・裁判管轄）</h2>
          <p>
            本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当方の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
        </section>

        <div className="pt-8 text-right text-xs text-zinc-500">
            2025年12月31日 制定
        </div>
      </div>
    </div>
  );
}

