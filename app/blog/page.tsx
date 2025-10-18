import { Suspense } from "react";
import BlogListClient from "./ui/BlogListClient";

export default function BlogListPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl px-4 sm:px-6 pb-16" /> }>
      <BlogListClient />
    </Suspense>
  );
}
