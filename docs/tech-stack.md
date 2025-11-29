# Tech Stack

## 言語 (Language)
- **TypeScript**: ^5 (静的型付けによる堅牢な開発)

## フレームワーク・コア (Framework & Core)
- **Next.js**: 15.5.4 (App Router採用)
- **React**: 19.1.0

## スタイリング・UI (Styling & UI)
- **Tailwind CSS**: ^4
- **shadcn/ui** (基盤コンポーネントとして採用)
  - Radix UI Primitives (@radix-ui/react-*) をベースに使用
- **Lucide React**: アイコンセット
- **next-themes**: ダークモード対応
- **clsx / tailwind-merge**: クラス名の条件付き結合と競合解決
- **class-variance-authority (cva)**: バリアント管理
- **tw-animate-css**: アニメーション

## データベース・バックエンド (Database & Backend)
- **Supabase**
  - **Authentication**: ユーザー認証
  - **Database**: PostgreSQL (Prisma経由および直接利用)
  - **Storage**: ファイルストレージ
- **Prisma**: ORM (データベース操作、マイグレーション)

## 外部サービス連携 (Integrations)
- **Notion API** (@notionhq/client): コンテンツ管理、データ同期

## フォーム・バリデーション (Forms & Validation)
- **React Hook Form**: フォーム状態管理
- **Zod**: スキーマバリデーション (@hookform/resolvers で統合)

## その他ユーティリティ (Utilities)
- **date-fns**: 日付操作
- **recharts**: グラフ描画
- **xlsx**: Excelファイル処理
- **sonner**: トースト通知
