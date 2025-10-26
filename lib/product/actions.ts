"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { fetchNotionBlocks } from "@/lib/blog/notion-client";
import { normalizeNotionDocument } from "@/lib/blog/notion-normalize";
import { resolveProductNotionPageId } from "./notion-resolver";
import { getProductCoverPublicUrl } from "./image";
import type { ProductHeader } from "./types";

type ListParams = {
  q?: string;
  tags?: string[];
  category?: string;
  type?: 'Tool' | 'Template' | 'Service';
  page?: number;
  pageSize?: number;
  sort?: "created" | "updated";
  order?: "asc" | "desc";
  status?: "published" | "draft" | "archived" | "all";
};

const PAGE_SIZE_DEFAULT = 12;

export async function getProductList(params: ListParams = {}) {
  const {
    q = "",
    tags = [],
    category,
    type,
    page = 1,
    pageSize = PAGE_SIZE_DEFAULT,
    sort = "updated",
    order = "desc",
    status = "published",
  } = params;

  const where: Prisma.ProductPostWhereInput = {};
  where.isPublic = true;
  if (status !== "all") where.status = status as any;
  if (category) where.category = category;
  if (type) where.type = type as any;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
      { tags: { hasSome: [q] } },
    ];
  }
  if (tags.length) where.AND = tags.map((t) => ({ tags: { has: t } }));

  const orderBy: Prisma.ProductPostOrderByWithRelationInput =
    sort === "created" ? { createdAt: order as any } : { updatedAt: order as any };

  const [total, rows] = await Promise.all([
    prisma.productPost.count({ where }),
    prisma.productPost.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
  ]);

  const items: ProductHeader[] = await Promise.all(
    rows.map(async (r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      description: r.description || undefined,
      author: r.author,
      category: r.category,
      type: r.type as ProductHeader["type"],
      tags: r.tags,
      isPublic: r.isPublic,
      status: r.status as ProductHeader["status"],
      goodCount: r.goodCount,
      headerImagePath: r.headerImagePath ?? undefined,
      headerImageUrl: getProductCoverPublicUrl({ imgPath: r.headerImagePath || undefined, slug: r.slug }) || undefined,
      notionPageId: r.notionPageId,
      contentLink: r.contentLink ?? null,
      actionType: r.actionType as ProductHeader["actionType"],
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      publishedAt: r.publishedAt?.toISOString() ?? null,
    }))
  );

  return { items, total, page, pageSize };
}

export async function getProductDetailBySlug(slug: string): Promise<{ header: ProductHeader; notion: { blocks: any[]; unavailable?: boolean } } | null> {
  const p = await prisma.productPost.findFirst({ where: { slug, isPublic: true } });
  if (!p) return null;

  const header: ProductHeader = {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description || undefined,
    author: p.author,
    category: p.category,
    type: p.type as ProductHeader["type"],
    tags: p.tags,
    isPublic: p.isPublic,
    status: p.status as ProductHeader["status"],
    goodCount: p.goodCount,
    headerImagePath: p.headerImagePath ?? undefined,
    headerImageUrl: getProductCoverPublicUrl({ imgPath: p.headerImagePath || undefined, slug: p.slug }) || undefined,
    notionPageId: p.notionPageId,
    contentLink: p.contentLink ?? null,
    actionType: p.actionType as ProductHeader["actionType"],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    publishedAt: p.publishedAt?.toISOString() ?? null,
  };

  let notion;
  try {
    const pageId = await resolveProductNotionPageId({ hintIdOrTitle: p.notionPageId, titleCandidates: [p.title] });
    if (!pageId) {
      notion = { blocks: [], unavailable: true };
    } else {
      const rawBlocks = await fetchNotionBlocks(pageId);
      notion = await normalizeNotionDocument(rawBlocks);
    }
  } catch {
    notion = { blocks: [], unavailable: true };
  }

  return { header, notion };
}
