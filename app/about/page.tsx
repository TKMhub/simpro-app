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
            たくみ / Webエンジニア・ITコンサルタント
          </h1>
          <p className="text-[var(--muted-foreground)]">
            システム開発と個人サービスを通じて、シンプルに価値を生む。
          </p>
        </div>
      </section>

      {/* Career */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">経歴</h2>
        <div className="relative pl-5 border-l border-[var(--color-border)] space-y-6">
          <div>
            <div className="text-sm text-[var(--muted-foreground)]">2020〜2023</div>
            <p className="mt-1 leading-relaxed">
              倉庫物流会社の基幹システムマイグレーション案件に従事。要件定義〜開発〜リリースを一貫して担当。
            </p>
          </div>
          <div>
            <div className="text-sm text-[var(--muted-foreground)]">2023〜現在</div>
            <p className="mt-1 leading-relaxed">
              コンサルティングファーム「ノースサンド」に転職。PMOとして生命保険システム刷新案件を推進。半年でシニアコンサルタントに昇格。
            </p>
          </div>
          <div>
            <div className="text-sm text-[var(--muted-foreground)]">Parallel</div>
            <p className="mt-1 leading-relaxed">
              並行して、個人開発ブランド「Simpro」「CodeParts」を運営し、Webアプリテンプレートや自動化ツールを配布中。
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
            <p className="text-[var(--muted-foreground)]">AWS / Supabase / Prisma</p>
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

