import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  
  const products = [
    { name: "Zaiko.", href: "/product/zaiko" },
    { name: "Juice.", href: "/product/juice" },
  ];

  return (
    <footer className="my-5 sm:mt-16">
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className=" flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 rounded-xl border border-white/10 bg-[#343434] text-neutral-200 shadow-sm shadow-black/5">
          <div className="flex">

          <div className=" justify-between">
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <span className="font-medium text-neutral-200">
                Simplo
              </span>
              <span aria-hidden>-</span>
              <span>@ {year}</span>
            </div>

            <nav
              aria-label="フッターナビゲーション"
              className="order-last sm:order-none"
              >
              <ul className="flex items-center gap-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                    >
                    about
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                    >
                    blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product"
                    className="px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                    >
                    product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/link"
                    className="px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                    >
                    link
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          </div>
          {/* Products */}
          <div className="mt-3">
            <span className="uppercase tracking-wide text-neutral-400">Products</span>
            <nav aria-label="プロダクト一覧">
              <ul className="flex flex-wrap gap-1.5">
                {products.map((p) => (
                  <li key={p.name}>
                    <Link
                      href={p.href}
                      className="inline-block rounded-md border border-white/10 px-2.5 py-1 text-xs text-neutral-200 hover:bg-white/10 transition-colors"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
