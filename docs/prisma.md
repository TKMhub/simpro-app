#schema.prismaを修正した場合に、変更をSupabase側のDBに反映する方法

**schema を修正 → Prisma のマイグレーションで Supabase に反映**
ßという流れ。

---

## 1. まず schema を整える

```bash
# フォーマット
npx prisma format

# 定義チェック
npx prisma validate
```

複数 schema があるなら

```bash
npx prisma format --schema=prisma/koza.schema.prisma
npx prisma validate --schema=prisma/koza.schema.prisma
```

---

## 2. Supabase に反映（推奨：migrate dev）

### 初回以降 共通の流れ

```bash
# 例：koza 用の変更
npx prisma migrate dev --name add_koza_columns
# または
npx prisma migrate dev --schema=prisma/koza.schema.prisma --name add_koza_columns
```

やっていること

* `prisma/migrations/xxxx_add_koza_columns/` を作成
* その中に SQL（ALTER TABLE / CREATE TABLE）が生成
* `DATABASE_URL` 先の Supabase に対して ALTER を実行

`.env` で

```env
DATABASE_URL="postgresql://postgres:xxxxx@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

みたいに Supabase の接続文字列が入っていれば、その DB が更新される。

---

## 3. 本番DBだけ変えたいとき（deploy）

開発環境と本番を分けていて

* 開発用 Supabase で `migrate dev` 済み
* 本番 Supabase に同じ変更を適用したい

なら本番の `DATABASE_URL` を設定して

```bash
npx prisma migrate deploy
# schema 指定するなら
npx prisma migrate deploy --schema=prisma/koza.schema.prisma
```

---

## 4. どうしても簡易に反映したいとき（db push）

まだ本格運用前で
「マイグレーション履歴どうでもいい、今の schema をそのまま DB に合わせたい」
なら一時的に `db push` もあり。

```bash
npx prisma db push
# または
npx prisma db push --schema=prisma/koza.schema.prisma
```

注意

* スキーマは反映される
* `prisma/migrations` は増えない
* 本番運用になったら `migrate dev / deploy` に切り替えた方がいい

---

## 5. 代表的な変更パターンとコマンド

### カラム追加・nullable 変更・デフォルト追加

→ そのまま `migrate dev` でOK

```bash
npx prisma migrate dev --name add_balance_memo
```

### 既存カラム削除・型変更など破壊的変更

* 影響しそうなデータを確認
* 必要なら Supabase 側でバックアップ
* その後 `migrate dev`

---

ざっくりまとめると

1. `schema.prisma` を直す
2. `npx prisma format` `npx prisma validate`
3. **開発中なら** `npx prisma migrate dev --name xxx`
4. **本番環境は** `npx prisma migrate deploy`
