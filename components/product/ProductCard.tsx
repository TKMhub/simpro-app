import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";

export function ProductCard({
  slug,
  title,
  description,
  stack,
  coverUrl,
}: {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  coverUrl: string;
}) {
  const visibleTags = stack.slice(0, 3);
  const extraCount = Math.max(0, stack.length - visibleTags.length);
  
  // Logos for Juice and Zaiko should be contained and smaller
  const isLogo = slug === 'juice' || slug === 'zaiko';

  return (
    <Link href={`/product/${slug}`} className="block group h-full">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--card)] shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.01] h-full flex flex-col">
        <div className={`relative aspect-[16/9] w-full ${isLogo ? 'bg-zinc-50 dark:bg-zinc-900 p-8' : ''}`}>
          <ImageWithFallback
            src={coverUrl}
            alt={`${title} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className={isLogo ? "object-contain p-4" : "object-cover"}
            fallbackSrc="/Simplo_gray_main_sub.jpg"
            priority={false}
          />
          {!isLogo && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />}
          <div className={`absolute inset-x-0 bottom-0 p-4 sm:p-5 ${isLogo ? 'text-foreground' : 'text-white'}`}>
            <h3 className={`text-lg font-semibold tracking-tight ${!isLogo ? 'drop-shadow' : ''}`}>{title}</h3>
            <p className={`mt-1 text-xs sm:text-sm opacity-90 line-clamp-2 ${!isLogo ? 'drop-shadow-sm' : 'text-muted-foreground'}`}>
              {description}
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-5 flex flex-col grow border-t">
          <div className="flex items-start gap-2 overflow-hidden h-8">
            {visibleTags.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2.5 h-8 inline-flex items-center text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/20"
              >
                {t}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="rounded-full border px-2.5 h-8 inline-flex items-center text-xs text-[var(--muted-foreground)] bg-[var(--muted)]/20">
                +{extraCount}
              </span>
            )}
          </div>
          <div className="mt-auto pt-4 text-sm text-blue-600">詳しく見る →</div>
        </div>
      </div>
    </Link>
  );
}
