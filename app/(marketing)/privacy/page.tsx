import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="p-4 pt-8">
        <h1 className="font-bold text-center text-xl">プライバシーポリシー</h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">1. 個人情報の収集</h2>
          <p>
            当方は、ユーザーが本サービスを利用する際に、氏名（表示名）、メールアドレス、プロフィール画像などの個人情報を収集する場合があります。また、GoogleやGitHub等の外部サービス連携を通じて得られる情報も収集範囲に含まれます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">2. 利用目的</h2>
          <p>
            収集した個人情報は、以下の目的で利用します。
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>本サービスの提供・運営のため</li>
            <li>ユーザーからのお問い合わせに回答するため</li>
            <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
            <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">3. 個人情報の第三者提供</h2>
          <p>
            当方は、法令に基づく場合を除き、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">4. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーの内容は、ユーザーに通知することなく変更することができるものとします。変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
          </p>
        </section>

        <section>
            <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">5. お問い合わせ</h2>
            <p>
                本ポリシーに関するお問い合わせは、開発者（Takumi）のSNSまたはGitHubアカウントまでお願いいたします。
            </p>
        </section>

        <div className="pt-8 text-right text-xs text-zinc-500">
            2025年12月31日 制定
        </div>
      </div>
    </div>
  );
}

