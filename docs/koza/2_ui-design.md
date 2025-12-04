# UI デザイン (UI Design)

## 各画面のワイヤーフレーム

### 1. Dashboard (`/koza/dashboard`)
*   **Header**: アプリロゴ、ナビゲーション、ユーザーアイコン
*   **Summary Cards**: 総資産額、前月比、年初来増減
*   **Main Chart**: 資産推移の積み上げ面グラフ or 棒グラフ（X軸: 年月, Y軸: 金額）
*   **Allocation**: 資産種別ポートフォリオ（円グラフ）

### 2. Monthly Input (`/koza/monthly`)
*   **Filter**: 対象年月の選択（YYYY年MM月）
*   **Input Table**:
    *   行: 口座名
    *   列: 残高入力欄、メモ、前月比（自動計算）
    *   最下部: 合計表示
*   **Action**: 保存ボタン、前月コピーボタン

### 3. Account List (`/koza/accounts`)
*   **List**: 口座カードのグリッド表示
    *   銀行、証券などでグルーピング
    *   各カードに現在の残高、所有者ラベル
*   **Add Button**: 新規口座追加モーダル/画面へ遷移

### 4. Account Detail (`/koza/accounts/[id]`)
*   **Info**: 口座名、種別、所有者情報
*   **History**: この口座の月次残高履歴テーブル
*   **Chart**: この口座単体の推移グラフ

### 5. Settings (`/koza/settings`)
*   **Members**: 家族メンバーの管理
*   **Asset Types**: 口座種別のカスタマイズ（基本は固定だが表示順など）

## 必要コンポーネント一覧
*   `Sidebar`: 左側ナビゲーション（Dashboard, Monthly, Accounts, Settings）
*   `StatCard`: 重要指標を表示するカード
*   `BalanceInputTable`: 月次入力用のテーブルコンポーネント
*   `AssetChart`: Recharts等を使用したグラフコンポーネント
*   `AccountCard`: 口座情報を表示するカード

## デザインポリシー
*   **Color Palette**:
    *   Primary: Deep Green / Navy (信頼感、安定)
    *   Background: Beige / Off-white (温かみ)
    *   Accent: Gold / Muted Orange (資産、注目)
*   **Font**:
    *   日本語: Noto Sans JP or Hiragino Sans
    *   数字: Inter or Roboto Mono (等幅で読みやすく)
*   **Spacing**: ゆったりとした余白（8pxの倍数ベース）

## レスポンシブ方針
*   **PC**: サイドバー固定、2カラム構成
*   **Mobile**: ハンバーガーメニュー、1カラム構成。テーブルは横スクロール許容またはカード型リストへの切り替え

