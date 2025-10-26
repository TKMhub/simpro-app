"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { resolveHeaderImageUrl } from "./image";
import { normalizeNotionDocument } from "./notion-normalize";
import { fetchNotionBlocks } from "./notion-client";
import { resolveBlogNotionPageId } from "./notion-resolver";
import type { BlogHeader, NotionDocument } from "./types";
import { DEFAULT_HEADER_IMAGE } from "./constants";

type ListParams = {
  q?: string;
  tags?: string[];
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: "created" | "updated";
  order?: "asc" | "desc";
  status?: "published" | "draft" | "archived" | "all";
};

const PAGE_SIZE_DEFAULT = 10;

export async function getBlogList(params: ListParams = {}) {
  const {
    q = "",
    tags = [],
    category,
    page = 1,
    pageSize = PAGE_SIZE_DEFAULT,
    sort = "updated",
    order = "desc",
    status = "published",
  } = params;

  const where: Prisma.BlogPostWhereInput = {};
  // 公開記事のみ
  where.isPublic = true;
  if (status !== "all") where.status = status;
  if (category) where.category = category;

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
      { tags: { hasSome: [q] } },
    ];
  }
  if (tags.length) where.AND = tags.map((t) => ({ tags: { has: t } }));

  const orderBy: Prisma.BlogPostOrderByWithRelationInput =
    sort === "created" ? { createdAt: order } : { updatedAt: order };

  const [total, rows] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const items: BlogHeader[] = await Promise.all(
    rows.map(async (r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      author: r.author,
      category: r.category,
      tags: r.tags,
      isPublic: r.isPublic,
      status: r.status as BlogHeader["status"],
      goodCount: r.goodCount,
      headerImagePath: r.headerImagePath ?? undefined,
      headerImageUrl: await resolveHeaderImageUrl(r.headerImagePath || undefined) || DEFAULT_HEADER_IMAGE,
      notionPageId: r.notionPageId,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      publishedAt: r.publishedAt?.toISOString() ?? null,
    }))
  );

  return { items, total, page, pageSize };
}

// Blogのカテゴリとカテゴリ別のタグ一覧を集約して返す
export async function getBlogFacets(): Promise<{
  categories: string[];
  categoryTags: Record<string, string[]>;
}> {
  const rows = await prisma.blogPost.findMany({
    where: { isPublic: true, status: "published" },
    select: { category: true, tags: true },
  });

  const categorySet = new Set<string>();
  const catTagsMap = new Map<string, Set<string>>();

  for (const r of rows) {
    const cat = r.category || "";
    if (!cat) continue;
    categorySet.add(cat);
    if (!catTagsMap.has(cat)) catTagsMap.set(cat, new Set());
    const set = catTagsMap.get(cat)!;
    for (const t of r.tags || []) set.add(t);
  }

  const categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b));
  const categoryTags: Record<string, string[]> = {};
  for (const c of categories) {
    const tags = Array.from(catTagsMap.get(c) ?? []).sort((a, b) => a.localeCompare(b));
    categoryTags[c] = tags;
  }

  return { categories, categoryTags };
}

export async function getBlogDetailBySlug(slug: string): Promise<{ header: BlogHeader; notion: NotionDocument } | null> {
  // 非公開は除外して取得
  const post = await prisma.blogPost.findFirst({ where: { slug, isPublic: true } });
  if (!post) return null;

  const header: BlogHeader = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    author: post.author,
    category: post.category,
    tags: post.tags,
    isPublic: post.isPublic,
    status: post.status as BlogHeader["status"],
    goodCount: post.goodCount,
    headerImagePath: post.headerImagePath ?? undefined,
    headerImageUrl: await resolveHeaderImageUrl(post.headerImagePath || undefined) || DEFAULT_HEADER_IMAGE,
    notionPageId: post.notionPageId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() ?? null,
  };

  let notion;
  try {
    // Normalize or resolve Notion page ID from DB value or title
    const pageId = await resolveBlogNotionPageId({
      hintIdOrTitle: post.notionPageId,
      titleCandidates: [post.title],
    });

    if (!pageId) {
      notion = { blocks: [], unavailable: true };
    } else {
      const rawBlocks = await fetchNotionBlocks(pageId);
      notion = await normalizeNotionDocument(rawBlocks);
    }
  } catch (e) {
    // Notion側で取得できない場合は空ドキュメントとして返す
    notion = { blocks: [], unavailable: true };
  }

  return { header, notion };
}
