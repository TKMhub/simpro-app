"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, CreditCard, Settings, Wallet } from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "/koza/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Monthly Input",
    url: "/koza/monthly",
    icon: Calendar,
  },
  {
    title: "Accounts",
    url: "/koza/accounts",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "/koza/settings",
    icon: Settings,
  },
];

export function KozaSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-emerald-900 text-stone-100 shadow-xl fixed left-0 top-0 z-50">
      <div className="flex items-center gap-2 p-6 border-b border-emerald-800">
        <Wallet className="h-8 w-8 text-amber-400" />
        <span className="text-xl font-bold tracking-tight font-serif">Koza</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {items.map((item) => {
          const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-800/80 text-white shadow-sm translate-x-1"
                  : "text-emerald-100/70 hover:bg-emerald-800/50 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-emerald-800 bg-emerald-950/30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-700 flex items-center justify-center border border-emerald-600">
            <span className="text-sm font-bold">K</span>
          </div>
          <div className="text-xs">
            <p className="font-medium text-white">Koza Family</p>
            <p className="text-emerald-400">koza@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

