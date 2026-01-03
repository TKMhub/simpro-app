import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  
  const products = [
    { name: "Zaiko.", href: "/product/zaiko" },
    { name: "Juice.", href: "/product/juice" },
  ];

  return (
    <footer className="my-10 sm:my-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="p-8 rounded-3xl border border-white/10 bg-[#343434] text-neutral-200 shadow-sm shadow-black/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Brand Section */}
            <div className="md:col-span-4 flex flex-col gap-4">
               <div className="flex flex-col">
                  <span className="font-bold text-2xl tracking-tight text-white">Simplo</span>
                  <span className="text-xs text-neutral-400 mt-1">
                    Simplified products for your life.
                  </span>
               </div>
               <span className="text-xs text-neutral-500 mt-auto">© {year} Simplo. All rights reserved.</span>
            </div>

            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* About */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider opacity-70">About</h3>
                <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">About</Link>
                  </li>
                  <li>
                    <Link href="/link" className="hover:text-white transition-colors">Link</Link>
                  </li>
                </ul>
              </div>

              {/* Output */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider opacity-70">Output</h3>
                <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
                  <li>
                    <Link href="/product" className="hover:text-white transition-colors">Product</Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                  </li>
                </ul>
                
                {/* Product Tags */}
                <div className="pt-2">
                   <div className="text-xs text-neutral-500 mb-2">Projects</div>
                   <div className="flex flex-wrap gap-2">
                      {products.map((p) => (
                        <Link 
                          key={p.name} 
                          href={p.href}
                          className="inline-block px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-neutral-300"
                        >
                          {p.name}
                        </Link>
                      ))}
                   </div>
                </div>
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider opacity-70">Contact</h3>
                <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
                  <li>
                    <Link href="/request" className="hover:text-white transition-colors">Request</Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
