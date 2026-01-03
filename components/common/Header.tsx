"use client";

import ThemedLogo from "@/components/common/ThemedLogo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu as MenuIcon, ChevronDown, Home } from "lucide-react";
import AuthHeader from "@/app/_components/auth-header";
import { getCurrentProfile } from "@/app/_actions/user";
import { cn } from "@/lib/utils";

// Define a minimal profile type locally
type ProfileWithRole = {
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
} | null;

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState<ProfileWithRole>(null);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Scroll logic
    lastY.current = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastY.current;
          const threshold = 6;
          if (Math.abs(delta) > threshold) {
            if (delta > 0 && currentY > 64) {
              setHidden(true);
            } else {
              setHidden(false);
            }
          }
          lastY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Fetch Profile
    getCurrentProfile().then((p) => {
      if (p) setProfile(p as any); 
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItemClass = "px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-[var(--hover-surface)] transition-colors capitalize flex items-center gap-1 cursor-pointer";

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6 mt-3 sm:mt-5">
        <div
          className={cn(
            "flex items-center gap-3 sm:gap-4 py-1.5 sm:py-2 px-4 sm:px-6 md:px-8 rounded-xl transition-all duration-500",
            "backdrop-blur-lg border-[var(--glass-border)]",
            scrolled
            ? "bg-gradient-to-r bg-blue-700/20 to-gray-700/20"
            : "bg-gradient-to-r bg-blue-700/20 to-gray-700/20"
          )}
        >
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 px-2 sm:px-4 py-2 shrink-0">
            <ThemedLogo width={50} height={70} priority />
          </Link>

              {/* Mobile: Theme toggle + Hamburger */}
          <div className="sm:hidden ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="メニューを開く">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] sm:max-w-sm bg-background border-r border-border">
                <SheetHeader className="p-0">
                  <SheetTitle className="sr-only">メニュー</SheetTitle>
                </SheetHeader>
                <div className="py-2 pl-5">
                  <Link href="/" className="inline-flex items-center gap-2">
                    <ThemedLogo width={100} height={100} priority />
                  </Link>
                </div>
                <div className="flex flex-col mt-4">
                  <nav>
                    <ul className="flex flex-col gap-1.5">
                      <li>
                        <SheetClose asChild>
                           <Link href="/" className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors text-foreground">
                              <Home size={18} /> Home
                           </Link>
                        </SheetClose>
                      </li>
                      
                      {/* About Submenu */}
                      <li className="px-3 py-2">
                         <div className="font-bold text-lg mb-2 text-foreground">About</div>
                         <div className="pl-2 flex flex-col gap-1 border-l-2 border-border ml-1">
                            <SheetClose asChild>
                               <Link href="/about" className="block py-2 px-3 text-base text-muted-foreground hover:text-foreground transition-colors">About</Link>
                            </SheetClose>
                            <SheetClose asChild>
                               <Link href="/link" className="block py-2 px-3 text-base text-muted-foreground hover:text-foreground transition-colors">Link</Link>
                            </SheetClose>
                         </div>
                      </li>
                      
                      {/* Output Submenu */}
                      <li className="px-3 py-2">
                         <div className="font-bold text-lg mb-2 text-foreground">Output</div>
                         <div className="pl-2 flex flex-col gap-1 border-l-2 border-border ml-1">
                            <SheetClose asChild>
                               <Link href="/product" className="block py-2 px-3 text-base text-muted-foreground hover:text-foreground transition-colors">Product</Link>
                            </SheetClose>
                            <SheetClose asChild>
                               <Link href="/blog" className="block py-2 px-3 text-base text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                            </SheetClose>
                         </div>
                      </li>

                      {/* Contact Submenu */}
                      <li className="px-3 py-2">
                         <div className="font-bold text-lg mb-2 text-foreground">Contact</div>
                         <div className="pl-2 flex flex-col gap-1 border-l-2 border-border ml-1">
                            <SheetClose asChild>
                               <Link href="/request" className="block py-2 px-3 text-base text-muted-foreground hover:text-foreground transition-colors">Request</Link>
                            </SheetClose>
                            <SheetClose asChild>
                               <Link href="/contact" className="block py-2 px-3 text-base text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                            </SheetClose>
                         </div>
                      </li>
                      
                      {profile?.role === "SUPER_ADMIN" && (
                         <li>
                           <SheetClose asChild>
                             <Link href="/admin" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent transition-colors text-foreground">
                               Admin
                             </Link>
                           </SheetClose>
                         </li>
                      )}
                    </ul>
                  </nav>
                  <div className="grow" />
                  <div className="mt-8 px-3 pb-6">
                    <AuthHeader context="sheet" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Right: Nav (Desktop) */}
          <nav className="ml-auto pr-1 sm:pr-2 hidden sm:flex items-center gap-3">
            <ul className="flex items-center gap-2 sm:gap-3 md:gap-4 text-sm">
              {/* About Dropdown */}
              <li>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className={cn(navItemClass, "outline-none")}>
                     About <ChevronDown size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="bg-[var(--glass-bg)] backdrop-blur-md border-[var(--glass-border)]">
                     <DropdownMenuItem asChild>
                        <Link href="/about" className="cursor-pointer">About</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <Link href="/link" className="cursor-pointer">Link</Link>
                     </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </li>
              
              {/* Output Dropdown */}
              <li>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className={cn(navItemClass, "outline-none")}>
                     Output <ChevronDown size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="bg-[var(--glass-bg)] backdrop-blur-md border-[var(--glass-border)]">
                     <DropdownMenuItem asChild>
                        <Link href="/product" className="cursor-pointer">Product</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <Link href="/blog" className="cursor-pointer">Blog</Link>
                     </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </li>

              {/* Contact Dropdown */}
              <li>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className={cn(navItemClass, "outline-none")}>
                     Contact <ChevronDown size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="bg-[var(--glass-bg)] backdrop-blur-md border-[var(--glass-border)]">
                     <DropdownMenuItem asChild>
                        <Link href="/request" className="cursor-pointer">Request</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <Link href="/contact" className="cursor-pointer">Contact</Link>
                     </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </li>

              {profile?.role === "SUPER_ADMIN" && (
                <li>
                  <Link href="/admin" className={navItemClass}>
                    admin
                  </Link>
                </li>
              )}
              
              <li className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3 ml-1">
                 <ThemeToggle />
                 <Link href="/" aria-label="Home" className="p-2 rounded-md hover:bg-accent transition-colors">
                    <Home size={18} />
                 </Link>
              </li>
            </ul>
            <AuthHeader />
          </nav>
        </div>
      </div>
    </div>
  );
}
