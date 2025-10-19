"use server";

import { prisma } from "@/lib/db/prisma";
import { resolveHeaderImageUrl } from "./image";
import { normalizeNotionDocument } from "./notion-normalize";
import { fetchNotionBlocks } from "./notion-client";
import type { BlogHeader, NotionDocument } from "./types";

type ListParams = {
  q?: string;
  tags?: string[];
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
    page = 1,
    pageSize = PAGE_SIZE_DEFAULT,
    sort = "updated",
    order = "desc",
    status = "published",
  } = params;

  const where: any = {};
  // 公開記事のみ
  where.isPublic = true;
  if (status !== "all") where.status = status;

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
      { tags: { hasSome: [q] } },
    ];
  }
  if (tags.length) where.AND = tags.map((t) => ({ tags: { has: t } }));

  const orderBy = sort === "created" ? { createdAt: order } : { updatedAt: order };

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
      headerImageUrl: r.headerImagePath ? await resolveHeaderImageUrl(r.headerImagePath) : undefined,
      notionPageId: r.notionPageId,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      publishedAt: r.publishedAt?.toISOString() ?? null,
    }))
  );

  return { items, total, page, pageSize };
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
    headerImageUrl: post.headerImagePath ? await resolveHeaderImageUrl(post.headerImagePath) : undefined,
    notionPageId: post.notionPageId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() ?? null,
  };

  const rawBlocks = await fetchNotionBlocks(post.notionPageId);
  const notion = await normalizeNotionDocument(rawBlocks);

  return { header, notion };
}
