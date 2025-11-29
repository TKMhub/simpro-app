# ドキュメント構成 (Docs Structure)

Simproプロジェクトのドキュメントは、プロジェクト全体に関わる共通ドキュメントと、各アプリケーションごとの個別ドキュメントに分かれて管理されています。

## 1. ルートディレクトリ (`docs/`)
プロジェクト全体に適用されるルールや技術スタックを定義します。

- **`project-rules.md`**: 開発ルール、コーディング規約、命名規則、開発フローなど。
- **`tech-stack.md`**: 使用している技術スタック（Next.js, Supabase, Tailwind CSSなど）の一覧。
- **`docs-structure.md`**: （本ファイル）ドキュメントのディレクトリ構成の説明。

## 2. Simpro (`docs/simpro/`)
Simpro（メインブログ/ポートフォリオ部分）に関するドキュメントです。

- **`0.project-management.md`**: タスク管理、進捗状況、TODOリスト。
- **`1.api-design.md`**: APIエンドポイント設計。
- **`2.ui-ux-design.md`**: UI/UXデザイン、コンポーネント設計。
- **`3.architecture.md`**: システムアーキテクチャ、ディレクトリ構成。
- **`4.database-design.md`**: データベース設計（スキーマなど）。
- **`5.api-design.md`**: (重複・統合予定) API設計の詳細。

## 3. Zaiko (`docs/zaiko/`)
在庫管理アプリ「Zaiko」に関するドキュメントです。

- **`0.project-management.md`**: Zaikoアプリのタスク管理、進捗状況。
- **`1.requirements.md`**: 要件定義書（アプリ概要、ターゲット、機能要件など）。
- **`2.ui-ux-design.md`**: Zaiko独自のUI/UX設計。
- **`3.architecture.md`**: Zaikoのアーキテクチャ設計。
- **`4.database-design.md`**: 在庫管理用データベース設計。
- **`5.api-design.md`**: Zaiko用API設計。

---
**備考**:
- 新しいアプリを追加する場合は、`docs/` 配下にディレクトリを作成し、同様の番号体系（0〜5）でドキュメントを整備してください。
