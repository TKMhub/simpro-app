"use client";
import { Github, Twitter, Instagram, BookOpen, FileText } from "lucide-react";

const links = [
  { title: "GitHub", href: "https://github.com/TKMhub", Icon: Github },
  { title: "X", href: "https://x.com/", Icon: Twitter },
  { title: "Instagram", href: "https://instagram.com/", Icon: Instagram },
  { title: "Qiita", href: "https://qiita.com/", Icon: BookOpen },
  { title: "Zenn", href: "https://zenn.dev/", Icon: FileText },
];

function LinkButton({
  title,
  href,
  Icon,
}: {
  title: string;
  href: string;
  Icon: React.ElementType;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 w-full sm:w-auto rounded-xl px-4 py-3 border border-[var(--color-border)] bg-white/40 backdrop-blur-md hover:bg-white/70 dark:bg-gray-900/40 transition-colors"
    >
      <Icon className="size-5" />
      <span className="font-medium">{title}</span>
    </a>
  );
}

export default function LinkPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Link</h1>
        <p className="text-[var(--muted-foreground)]">SNSや技術系アカウントのリンクをまとめる。</p>
      </header>

      <section>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          {links.map((l) => (
            <LinkButton key={l.title} title={l.title} href={l.href} Icon={l.Icon} />
          ))}
        </div>
      </section>
    </main>
  );
}

