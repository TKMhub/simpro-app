"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma as PrismaNS } from "@/lib/generated/prisma";
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

  const where: any = {};
  where.isPublic = true;
  if (status !== "all") where.status = status;
  if (category) where.category = category;
  if (type) where.type = type;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
      { tags: { hasSome: [q] } },
    ];
  }
  if (tags.length) where.AND = tags.map((t) => ({ tags: { has: t } }));

  const orderBy = sort === "created" ? { createdAt: order } : { updatedAt: order };

  // Fallback to SQL if the generated client (old) lacks ProductPost delegate
  const hasDelegate = typeof (prisma as any).productPost?.count === "function" && typeof (prisma as any).productPost?.findMany === "function";

  let total: number;
  let rows: any[];

  if (hasDelegate) {
    [total, rows] = await Promise.all([
      (prisma as any).productPost.count({ where }),
      (prisma as any).productPost.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
  } else {
    // Build SQL WHERE
    const whereSqls: any[] = [PrismaNS.sql`"isPublic" = true`];
    if (status !== "all") whereSqls.push(PrismaNS.sql`"status"::text = ${status}`);
    if (category) whereSqls.push(PrismaNS.sql`"category" = ${category}`);
    if (type) whereSqls.push(PrismaNS.sql`"type"::text = ${type}`);
    if (q) {
      const like = `%${q}%`;
      whereSqls.push(PrismaNS.sql`(title ILIKE ${like} OR author ILIKE ${like} OR EXISTS(SELECT 1 FROM unnest("tags") t WHERE t = ${q}))`);
    }
    if (tags.length) {
      // Require all selected tags to be present using EXISTS for each tag
      for (const t of tags) {
        whereSqls.push(PrismaNS.sql`EXISTS(SELECT 1 FROM unnest("tags") tag WHERE tag = ${t})`);
      }
    }
    const whereSql = whereSqls.length ? PrismaNS.sql`WHERE ${PrismaNS.join(whereSqls, PrismaNS.sql` AND `)}` : PrismaNS.sql``;

    const orderField = sort === "created" ? PrismaNS.sql`"createdAt"` : PrismaNS.sql`"updatedAt"`;
    const orderDir = order === "asc" ? PrismaNS.sql`ASC` : PrismaNS.sql`DESC`;
    const offset = (page - 1) * pageSize;

    const countRows = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*)::int AS count
      FROM "ProductPost"
      ${whereSql}
    `;
    total = countRows?.[0]?.count ?? 0;

    rows = await prisma.$queryRaw<any[]>`
      SELECT id, title, slug, description, author, category, type, tags, status, "isPublic" as "isPublic",
             "goodCount" as "goodCount", "headerImagePath" as "headerImagePath", "notionPageId" as "notionPageId",
             "contentLink" as "contentLink", "actionType" as "actionType",
             to_char("createdAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "createdAt",
             to_char("updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as "updatedAt",
             CASE WHEN "publishedAt" IS NULL THEN NULL ELSE to_char("publishedAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') END as "publishedAt"
      FROM "ProductPost"
      ${whereSql}
      ORDER BY ${orderField} ${orderDir}
      OFFSET ${offset} LIMIT ${pageSize}
    `;
  }

  const items: ProductHeader[] = await Promise.all(
    rows.map(async (r) => {
      const createdAtISO = typeof r.createdAt === 'string' ? r.createdAt : r.createdAt.toISOString();
      const updatedAtISO = typeof r.updatedAt === 'string' ? r.updatedAt : r.updatedAt.toISOString();
      const publishedAtISO = r.publishedAt == null ? null : (typeof r.publishedAt === 'string' ? r.publishedAt : r.publishedAt.toISOString());
      return ({
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
      createdAt: createdAtISO,
      updatedAt: updatedAtISO,
      publishedAt: publishedAtISO,
    });
    })
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
