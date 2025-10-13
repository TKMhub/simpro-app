import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findPostBySlug } from "@/lib/blogData";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = findPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = findPostBySlug(slug);
  if (!post) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
      <nav className="mt-6 sm:mt-10 text-sm">
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← 記事一覧へ戻る
        </Link>
      </nav>

      <article className="mt-4 sm:mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {new Date(post.date).toLocaleDateString("ja-JP")} ・ {post.author}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>

        {post.coverImage && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg border">
            <Image
              src={post.coverImage}
              alt="cover"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none mt-6">
          {post.content.split("\n\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  );
}

