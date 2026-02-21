export const ZAIKO_CATEGORIES = [
  { id: 'food', label: '食品', icon: '🍎' },
  { id: 'daily', label: '日用品', icon: '🧻' },
  { id: 'kitchen', label: 'キッチン', icon: '🍳' },
  { id: 'cleaning', label: '掃除', icon: '🧹' },
  { id: 'hygiene', label: '衛生', icon: '🧼' },
  { id: 'kids', label: '子供', icon: '👶' },
  { id: 'other', label: 'その他', icon: '📦' },
] as const;

export const ZAIKO_LOCATIONS = [
  { id: 'kitchen_pantry', label: 'キッチンパントリー' },
  { id: 'under_sink', label: 'シンク下' },
  { id: 'washroom_shelf', label: '洗面所棚' },
  { id: 'storage_room', label: '納戸' },
  { id: 'toilet_shelf', label: 'トイレ棚' },
  { id: 'living_shelf', label: 'リビング棚' },
  { id: 'bedroom_closet', label: '寝室クローゼット' },
  { id: 'entrance', label: '玄関' },
] as const;

export type InventoryStatus = 'enough' | 'low' | 'empty';

export const STATUS_CONFIG = {
  enough: { label: '十分', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', dot: 'bg-green-500' },
  low: { label: '残り少', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', dot: 'bg-yellow-500' },
  empty: { label: '切れ', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', dot: 'bg-red-500' },
} as const;

export function getInventoryStatus(quantity: number, threshold: number): InventoryStatus {
  if (quantity === 0) return 'empty';
  if (quantity <= threshold) return 'low';
  return 'enough';
}