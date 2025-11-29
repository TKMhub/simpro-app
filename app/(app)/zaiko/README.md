# 📦 Zaiko - 在庫管理アプリ

家庭の在庫管理を"考える時間ゼロへ"。
家族みんなで在庫を共有して、買い忘れをゼロに。

## 🚀 クイックスタート

### 開発サーバーの起動

```bash
npm run dev
```

### アクセス

- **LP**: http://localhost:3000/zaiko
- **ダッシュボード**: http://localhost:3000/zaiko/dashboard

## 📱 実装済み画面（Phase 1）

### パブリック
- ✅ ランディングページ (`/zaiko`)
- ✅ ログイン画面 (`/zaiko/login`)

### メイン機能
- ✅ ダッシュボード（在庫一覧） (`/zaiko/dashboard`)
- ✅ 在庫詳細・編集 (`/zaiko/detail/[itemId]`)
- ✅ 在庫新規登録 (`/zaiko/input`)
- ✅ 買い物リスト (`/zaiko/tobuy`)

### 管理機能
- ✅ メンバー管理 (`/zaiko/member`)
- ✅ 通知履歴 (`/zaiko/alert`)
- ✅ 設定 (`/zaiko/settings`)

## 🎨 デザイン特徴

- **スマホネイティブアプリ風UI**: Apple風の余白と軽さ
- **滑らかなアニメーション**: Framer Motionによる高品質なアニメーション
- **高い視認性**: 大きめのフォント、明瞭なコントラスト
- **ダークモード対応**: システム設定に連動
- **レスポンシブ**: 最大幅430pxでスマホ最適化

## 📦 技術スタック

- **Next.js 15** - App Router
- **TypeScript** - 型安全な開発
- **Tailwind CSS v4** - スタイリング
- **Framer Motion** - アニメーション
- **Shadcn/UI** - UIコンポーネント
- **React Hook Form + Zod** - フォーム管理

## 📁 ディレクトリ構造

```
zaiko/
├── _components/      # コンポーネント
│   ├── layout/      # レイアウト系
│   ├── inventory/   # 在庫系
│   └── common/      # 共通系
├── _lib/            # ユーティリティ
├── _hooks/          # カスタムフック（Phase 3）
└── [pages]/         # 各ページ
```

## 🎯 現在のフェーズ

**Phase 1: UI/UX実装 ✅ 完了**

現在はモックデータを使用しています。
Phase 2-3でSupabase連携を実装予定。

## 📝 詳細ドキュメント

- [要件定義書](../../../docs/zaiko/1.requirements.md)
- [UI/UX設計](../../../docs/zaiko/2.ui-ux-design.md)
- [Phase 1 完了報告](../../../docs/zaiko/phase1-ui-completion.md)
- [プロジェクト管理](../../../docs/zaiko/0.project-management.md)

## 🔜 次のステップ

### Phase 2: バックエンド構築
- データベース設計
- Supabaseスキーマ定義
- マイグレーション

### Phase 3: API連携
- 認証実装
- CRUD API実装
- リアルタイム同期

---

**開発状況**: Phase 1 完了 ✅  
**開発日**: 2025年11月29日

