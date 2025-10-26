import { Suspense } from "react";
import BlogListClient from "./ui/BlogListClient";
import { getBlogList, getBlogFacets } from "@/lib/blog/actions";

export default async function BlogListPage() {
  const { items, total, page, pageSize } = await getBlogList({
    page: 1,
    pageSize: 15,
    sort: "updated",
    order: "asc",
    status: "all",
  });
  const facets = await getBlogFacets();
  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl px-4 sm:px-6 pb-16" /> }>
      <BlogListClient
        initialItems={items}
        initialTotal={total}
        initialPage={page}
        initialPageSize={pageSize}
        facets={facets}
      />
    </Suspense>
  );
}
