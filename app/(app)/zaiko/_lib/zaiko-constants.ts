/**
 * Zaiko アプリケーションの定数定義
 */

export const ZAIKO_THEME = {
  colors: {
    primary: {
      light: '#32D17D',
      DEFAULT: '#2BB870',
      dark: '#239F5E',
    },
    status: {
      enough: '#32D17D',
      low: '#FFB800',
      empty: '#FF3B30',
    },
  },
  spacing: {
    mobile: {
      maxWidth: '430px',
      padding: '1rem',
    },
  },
} as const;

export type InventoryStatus = 'enough' | 'low' | 'empty';

export const INVENTORY_CATEGORIES = [
  { id: 'all', label: 'すべて', icon: '📦' },
  { id: 'food', label: '食品', icon: '🍽️' },
  { id: 'daily', label: '日用品', icon: '🧴' },
  { id: 'detergent', label: '洗剤', icon: '🧼' },
  { id: 'tissue', label: 'ティッシュ類', icon: '📄' },
  { id: 'toiletries', label: 'トイレ用品', icon: '🚽' },
  { id: 'kitchen', label: 'キッチン用品', icon: '🍳' },
  { id: 'other', label: 'その他', icon: '📌' },
] as const;

export const INVENTORY_LOCATIONS = [
  { id: 'kitchen', label: 'キッチン', icon: '🍳' },
  { id: 'toilet', label: 'トイレ', icon: '🚽' },
  { id: 'bathroom', label: '洗面所', icon: '🚿' },
  { id: 'storage', label: '収納', icon: '📦' },
  { id: 'living', label: 'リビング', icon: '🛋️' },
  { id: 'bedroom', label: '寝室', icon: '🛏️' },
  { id: 'other', label: 'その他', icon: '📍' },
] as const;

export const INVENTORY_ICONS = [
  '🧻', '🧼', '🧴', '🧽', '🧹', '🧺', '🚽', '🚿',
  '🍽️', '🥢', '🍴', '🥄', '🔪', '🥘', '🍳', '🥗',
  '🥤', '☕', '🍵', '🧃', '🧊', '🧂', '🌶️', '🧈',
  '📄', '🗞️', '📋', '📌', '📍', '📎', '📏', '✂️',
  '💡', '🔋', '🔌', '🕯️', '🧯', '🔒', '🔑', '🪛',
  '🧵', '🪡', '🧶', '👕', '🧦', '🧤', '🎒', '👜',
] as const;

/**
 * 在庫ステータスの判定
 */
export function getInventoryStatus(
  quantity: number,
  threshold: number
): InventoryStatus {
  if (quantity <= 0) return 'empty';
  if (quantity <= threshold) return 'low';
  return 'enough';
}

/**
 * ステータスに応じた色を取得
 */
export function getStatusColor(status: InventoryStatus): string {
  return ZAIKO_THEME.colors.status[status];
}

/**
 * ステータスに応じたラベルを取得
 */
export function getStatusLabel(status: InventoryStatus): string {
  const labels: Record<InventoryStatus, string> = {
    enough: '十分',
    low: '残り少',
    empty: '在庫切れ',
  };
  return labels[status];
}

