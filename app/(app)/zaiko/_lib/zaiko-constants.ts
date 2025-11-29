// Zaikoアプリの定数定義

export const ZAIKO_COLORS = {
  accent: "#32D17D", // グリーン系アクセント
  accentDark: "#22C55E", // ダークモード用
} as const;

// 在庫ステータス
export type InventoryStatus = "enough" | "low" | "empty";

export const INVENTORY_STATUS_CONFIG: Record<
  InventoryStatus,
  { label: string; color: string; bgColor: string }
> = {
  enough: {
    label: "十分",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  low: {
    label: "残り少",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  empty: {
    label: "切れ",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
};

// カテゴリ一覧
export const CATEGORIES = [
  { id: "all", label: "すべて" },
  { id: "food", label: "食品" },
  { id: "daily", label: "日用品" },
  { id: "detergent", label: "洗剤" },
  { id: "tissue", label: "ティッシュ" },
  { id: "toilet", label: "トイレ用品" },
  { id: "kitchen", label: "キッチン用品" },
  { id: "bath", label: "バス用品" },
  { id: "other", label: "その他" },
] as const;

// 保管場所
export const LOCATIONS = [
  "キッチン",
  "洗面所",
  "トイレ",
  "収納棚",
  "冷蔵庫",
  "冷凍庫",
  "その他",
] as const;

// アイコン一覧（lucide-reactのアイコン名）
export const INVENTORY_ICONS = [
  "Package",
  "ShoppingCart",
  "Box",
  "Container",
  "Archive",
  "Layers",
  "Grid3x3",
  "Cube",
] as const;

// モックデータ用のアイテム型
export interface MockInventoryItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  quantity: number;
  threshold: number;
  location?: string;
  status: InventoryStatus;
  memo?: string;
}

// ステータス判定ロジック
export function getInventoryStatus(
  quantity: number,
  threshold: number
): InventoryStatus {
  if (quantity <= 0) return "empty";
  if (quantity <= threshold) return "low";
  return "enough";
}

