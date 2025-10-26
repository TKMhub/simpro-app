export type BlogHeader = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  status: 'draft' | 'published' | 'archived';
  goodCount: number;
  headerImageUrl?: string;
  headerImagePath?: string;
  notionPageId: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  publishedAt?: string | null; // ISO
};

export type NotionBlockNormalized =
  | { type: 'paragraph'; richText: string }
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'bulleted_list_item'; richText: string }
  | { type: 'numbered_list_item'; richText: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'code'; language?: string; code: string }
  | { type: 'table'; rows: string[][] }
  | { type: 'quote'; richText: string }
  | { type: 'divider' }
  | { type: 'callout'; richText: string; icon?: string };

export type NotionDocument = {
  blocks: Array<NotionBlockNormalized>;
  // 取得に失敗した場合に true（画面はフォールバック表示）
  unavailable?: boolean;
};
