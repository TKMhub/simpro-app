export type ProductHeader = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  author: string;
  category: string;
  type: 'Tool' | 'Template' | 'Service';
  tags: string[];
  isPublic: boolean;
  status: 'draft' | 'published' | 'archived';
  goodCount: number;
  headerImageUrl?: string;
  headerImagePath?: string;
  notionPageId: string;
  contentLink?: string | null;
  actionType: 'transition' | 'download';
  createdAt: string; // ISO
  updatedAt: string; // ISO
  publishedAt?: string | null; // ISO
};

export type ProductNotionDocument = {
  blocks: Array<any>;
  unavailable?: boolean;
};
