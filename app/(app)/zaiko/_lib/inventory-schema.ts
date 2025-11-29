/**
 * 在庫管理用のZodスキーマ定義
 */

import { z } from 'zod';

/**
 * 在庫アイテム作成用スキーマ
 */
export const inventoryCreateSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(50, '名前は50文字以内で入力してください'),
  icon: z.string().default('📦'),
  category: z.string().min(1, 'カテゴリを選択してください'),
  location: z.string().optional(),
  quantity: z
    .number()
    .int('整数で入力してください')
    .min(0, '0以上の数値を入力してください')
    .default(0),
  threshold: z
    .number()
    .int('整数で入力してください')
    .min(0, '0以上の数値を入力してください')
    .default(3),
  memo: z.string().max(200, 'メモは200文字以内で入力してください').optional(),
});

/**
 * 在庫アイテム更新用スキーマ
 */
export const inventoryUpdateSchema = inventoryCreateSchema.partial().extend({
  id: z.string().min(1),
});

/**
 * 在庫数量変更用スキーマ
 */
export const inventoryQuantityChangeSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().int().min(0),
});

/**
 * 型定義
 */
export type InventoryCreateInput = z.infer<typeof inventoryCreateSchema>;
export type InventoryUpdateInput = z.infer<typeof inventoryUpdateSchema>;
export type InventoryQuantityChangeInput = z.infer<
  typeof inventoryQuantityChangeSchema
>;

