BlogPost 一括作成ツール（Excel/CSV）

- 置き場所: `tools/blogPostCreateByExcel/`
- 概要: BlogPost 用のヘッダー列に合わせた Excel または CSV を読み込み、DB に `BlogPost` レコードを一括作成します（Prisma 利用）。

対応ファイル形式
- `.xlsx`（要: `xlsx` パッケージのインストール）
- `.csv`（カンマ区切り。ダブルクオート対応）

ヘッダー定義（列名）
- 必須: `title`, `slug`, `author`, `notionPageId`
- 任意: `category`, `tags`, `status`, `isPublic`, `goodCount`, `headerImagePath`, `publishedAt`
  - `tags`: カンマ区切り（例: `nextjs,typescript,ui`）
  - `status`: `draft` | `published` | `archived`（未指定は `draft`）
  - `isPublic`: `true/false` or `1/0` or `yes/no`（未指定は `false`）
  - `publishedAt`: `YYYY-MM-DD` など日付文字列（未指定は null）

サンプル
- `blog_posts.csv` を同梱しています。Excel を使いたい場合は、この CSV を Excel で開いて `.xlsx` 形式で保存してご利用ください。

使い方
1) 依存インストール（Excel を直接読みたい場合のみ）
   - `npm i xlsx`

2) コマンド実行
   - CSV の例: `npm run blog:import:excel`
   - 任意のファイル指定: `npm run blog:import:excel -- --file tools/blogPostCreateByExcel/blog_posts.xlsx`
   - 事前確認（書き込みなし）: 末尾に `--dry-run`

注意事項
- DB 接続は `.env` の `DATABASE_URL`/`DIRECT_URL` を使用します。
- 一意制約（`slug`, `notionPageId`）に該当する重複行は `skipDuplicates` でスキップします。
- 本ツールは `tools/blogPostCreateByExcel/index.js` に実装されています。

  - サンプルCSVでプレビュー
      - npm run blog:import:excel -- --dry-run
  - サンプルCSVを投入
      - npm run blog:import:excel
  - 自分のExcel/CSVでプレビュー
      - npm run blog:import:excel -- --file tools/blogPostCreateByExcel/your_posts.xlsx --dry-run
      - npm run blog:import:excel -- --file tools/blogPostCreateByExcel/your_posts.csv --dry-run
  - 自分のExcel/CSVを投入
      - npm run blog:import:excel -- --file tools/blogPostCreateByExcel/your_posts.xlsx
      - npm run blog:import:excel -- --file tools/blogPostCreateByExcel/your_posts.csv