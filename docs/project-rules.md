# Project Rules

Simproプロジェクトの開発ルールおよび規約です。

## 1. 開発プロセス
- **タスク管理**: `docs/project-management.md` にてタスクを管理する。
- **開発の順序**: 原則として以下の順序で進める（`docs/project-management.md` のタスク作成時もこれを基準とする）。
    1. **UIの作成**: 画面の見た目やインタラクションを先行して実装する。
    2. **バックエンド構築**: DBスキーマの定義やモデルの作成を行う。
    3. **APIの実装**: UIとバックエンドを繋ぐAPIやServer Actionsを作成する。
- **ブランチ戦略**: 機能ごと、または修正ごとにブランチを切ることを推奨（例: `feature/add-blog-search`）。
- **コミットメッセージ**: `feat:`, `fix:`, `docs:` などのプレフィックスをつける（Conventional Commits）。

## 2. 命名規則 (Naming Conventions)

### ファイル・ディレクトリ
プロジェクト内で命名規則が混在している箇所がありますが、新規作成時は以下を推奨します。
- **ディレクトリ**: `kebab-case` (例: `blog-posts`, `ui`)
- **コンポーネントファイル**: `PascalCase` (例: `Header.tsx`, `BlogList.tsx`)
- **ロジック・データファイル**: `kebab-case` (例: `notion-client.ts`, `utils.ts`)
  - ※既存の `blogData.ts` (camelCase) などは維持するが、新規はkebab-caseに統一していく方針。
- **Next.js App Router**: `page.tsx`, `layout.tsx`, `route.ts` 等の予約語に従う。

### コード内
- **変数・関数**: `camelCase`
- **Reactコンポーネント**: `PascalCase`
- **型・インターフェース**: `PascalCase`
- **定数**: `UPPER_SNAKE_CASE`

## 3. コーディング規約
- **TypeScript**: Strictモードで記述し、`any` は避ける。
- **Imports**: 絶対パスエイリアス `@/...` を使用する（例: `import { cn } from "@/lib/utils"`）。
- **Exports**: コンポーネントは `export function` (Named Export) を基本とする（`export default` は `page.tsx` や `layout.tsx` に限定すると一貫性が保ちやすい）。

## 4. 環境構築・ツール
- **パッケージ管理**: `npm`
- **ORM**: Prisma (`npx prisma generate`, `npx prisma migrate dev`)
- **Lint/Format**: ESLint, Prettier

## 5. データベース・インフラ (Supabase / Prisma)

- **共通インフラの利用**:
  - Simpro-app内のすべてのアプリケーションは、同一のSupabaseプロジェクトおよび同一のPrisma定義を利用する。
  - 認証機能（Auth）やSimpro全体で利用するテーブルについては、一般的な命名規則（例: `users`, `profiles` 等）を使用する。

- **テーブル命名規則（個別アプリケーション）**:
  - 特定のアプリケーション（例: `zaiko`）でのみ使用するテーブルについては、DB上でどのアプリのものか判別できるようにする。
  - **規則**: `{table_name}_{app_name}`
  - **例**: Zaikoアプリの品目テーブルの場合 → `item_zaiko`

## 6. AI (Cursor) への指示出し
- ドキュメント (`docs/`) を積極的にコンテキストとして与える。
- 実装を変更した際は、対応するドキュメントも更新するよう指示する。
