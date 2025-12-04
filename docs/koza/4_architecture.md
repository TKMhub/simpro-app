# アーキテクチャ (Architecture)

## 技術スタック
*   **Framework**: Next.js (App Router)
*   **UI Library**: Shadcn UI (Radix UI + Tailwind CSS)
*   **Charting**: Recharts or Chart.js
*   **Database**: PostgreSQL (Supabase)
*   **ORM**: Prisma
*   **State Management**: React Server Components + Client Components State

## データフロー
1.  **Server Components**: Prisma を経由して DB からデータを取得（非同期）。
2.  **Client Components**: 取得したデータを Props として受け取り、描画。
3.  **Actions (Server Actions)**: フォーム入力やボタン操作（保存、追加）を Server Actions で処理し、DB 更新後 `revalidatePath` で画面更新。

## ページ遷移図

```mermaid
graph TD
    Dashboard[/koza/dashboard] --> Monthly[/koza/monthly]
    Dashboard --> AccountList[/koza/accounts]
    Dashboard --> Settings[/koza/settings]
    
    AccountList --> AccountDetail[/koza/accounts/:id]
    
    Monthly --> Monthly[前月/翌月へ移動]
```

## ディレクトリ構成連携
*   `app/koza/layout.tsx` で共通のサイドバーとヘッダーを提供し、その中に各ページの `children` をレンダリングする。

