// Zodスキーマ定義（在庫管理用）

import { z } from "zod";

export const inventoryCreateSchema = z.object({
  name: z.string().min(1, "アイテム名を入力してください").max(50, "50文字以内で入力してください"),
  icon: z.string().min(1, "アイコンを選択してください"),
  category: z.string().min(1, "カテゴリを選択してください"),
  location: z.string().optional(),
  quantity: z.number().int().min(0, "数量は0以上で入力してください"),
  threshold: z.number().int().min(0, "閾値は0以上で入力してください"),
  memo: z.string().max(500, "500文字以内で入力してください").optional(),
});

export const inventoryUpdateSchema = inventoryCreateSchema.partial();

export type InventoryCreateInput = z.infer<typeof inventoryCreateSchema>;
export type InventoryUpdateInput = z.infer<typeof inventoryUpdateSchema>;

