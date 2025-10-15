import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      {/* Intro */}
      <section className="text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/taku.jpg"
            alt="プロフィール画像"
            width={128}
            height={128}
            className="rounded-full shadow-md"
            priority
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            taku / システムエンジニア・ITコンサルタント
          </h1>
          <p className="text-[var(--muted-foreground)]">
            日頃、考えていることや学んだことをこちらに記事にまとめたり、個人開発をしています。<br />
            可能な限り有意義な情報をお届けできるようにします。
          </p>
        </div>
      </section>

      {/* Career */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">経歴</h2>
        <div className="relative pl-5 border-l border-[var(--color-border)] space-y-6">
          <div>
            <div className="text-sm text-[var(--muted-foreground)]">2021〜2023</div>
            <p className="mt-1 leading-relaxed">
              システムエンジニアとして、バックエンドからフロントエンドまで幅広くWebアプリケーション開発に従事。<br/>
              当時、実務で使用していた技術スタックは、Vue.js / Spring / PostgreSQL / AWS（保守） でした。
            </p>
          </div>
          <div>
            <div className="text-sm text-[var(--muted-foreground)]">2023〜現在</div>
            <p className="mt-1 leading-relaxed">
              コンサルティングファームに転職。
            </p>
          </div>
          <div>
            <div className="text-sm text-[var(--muted-foreground)]">Parallel</div>
            <p className="mt-1 leading-relaxed">
              個人開発では「Simpro」を開発中。Web開発を実践形式で修行中。<br/>
              Webアプリテンプレートやツールも配布、有意義な情報をお届けできるようなサイトにする予定。
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">スキル</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-medium mb-2">言語</h3>
            <p className="text-[var(--muted-foreground)]">Java / TypeScript / Python / VBA</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-medium mb-2">フレームワーク</h3>
            <p className="text-[var(--muted-foreground)]">Next.js / React / Django / Spring</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-medium mb-2">クラウド・DB</h3>
            <p className="text-[var(--muted-foreground)]">Supabase / Prisma / Vercel / AWS（修行中）</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-medium mb-2">その他</h3>
            <p className="text-[var(--muted-foreground)]">Shadcn / TailwindCSS / Notion API / OpenAI API</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-blue-700/20 py-14 px-6 text-center">
          <h2 className="text-2xl font-semibold mb-3">Mission</h2>
          <p className="text-lg sm:text-xl">
            複雑な仕組みを“シンプルに使える形”に変換する
          </p>
        </div>
      </section>
    </main>
  );
}

