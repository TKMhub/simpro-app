# API 設計 (API Design)

※ 現段階では Server Actions を主に使用する想定だが、外部連携やClient Side Fetching用にAPIルートを定義する場合の仕様案。

## 1. 残高取得
`GET /api/koza/balances`

### Request Query
*   `year`: number (Optional) - 指定年のデータを取得
*   `month`: number (Optional) - 指定月のデータを取得
*   `accountId`: string (Optional) - 特定口座のみ

### Response
```json
{
  "data": [
    {
      "id": "bal_xxxxx",
      "accountId": "acc_yyyyy",
      "year": 2024,
      "month": 4,
      "amount": 1500000,
      "memo": "給与振込後"
    }
  ]
}
```

## 2. 月次データコピー
`POST /api/koza/monthly/copy`

### Request Body
```json
{
  "targetYear": 2024,
  "targetMonth": 5,
  "sourceYear": 2024,
  "sourceMonth": 4
}
```
### Response
*   200 OK: コピー成功件数などを返却

## 3. 残高登録・更新
`POST /api/koza/balance`

### Request Body
```json
{
  "accountId": "acc_yyyyy",
  "year": 2024,
  "month": 5,
  "amount": 1600000,
  "memo": "微増"
}
```
### Response
*   200 OK: 更新後のデータ

