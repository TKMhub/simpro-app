# WBS (Work Breakdown Structure)

## レベル 1: プロジェクト立ち上げ
*   1.1 要件定義・設計 (docs作成) [完了]
*   1.2 環境構築 (Next.jsフォルダ作成) [完了]

## レベル 2: UI 実装 (Mock)
*   2.1 レイアウト・サイドバー実装 (2h)
*   2.2 Dashboard 画面実装 (3h)
*   2.3 Account List / Detail 実装 (3h)
*   2.4 Monthly Input 実装 (4h)
*   2.5 Settings 実装 (2h)

## レベル 3: バックエンド連携 (Server Actions)
*   3.1 Prisma Schema 定義・Migrate (1h)
*   3.2 Seed データの作成 (1h)
*   3.3 データ取得処理の実装 (3h)
*   3.4 更新・登録処理の実装 (3h)

## 想定工数
*   合計: 約 20-30 時間
*   スケジュール感: 平日1h × 5日 + 休日3h × 2日 = 週11h
    *   Week 1: UI 実装完了
    *   Week 2: バックエンド連携・テスト

## ガントチャート例 (Markdown)
| Task | Week 1 | Week 2 |
|---|---|---|
| 設計・環境 | ■ | |
| UI 実装 | ■■■ | |
| DB・API | | ■■ |
| Test・Fix | | ■ |

