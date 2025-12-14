"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import type { SummaryItem } from "@/lib/summaryData";

export type SummarySliderProps = {
  items: SummaryItem[];
  // Auto-advance interval in ms. Set <= 0 to disable.
  intervalMs?: number; // default disabled
};

export default function SummarySlider({ items, intervalMs = 0 }: SummarySliderProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const hoverRef = React.useRef(false);
  const draggingRef = React.useRef(false);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = React.useCallback(() => {
    clearTimer();
    if (!api) return;
    if (!intervalMs || intervalMs <= 0) return; // disabled
    timerRef.current = setInterval(() => {
      // Only advance when not hovered and not dragging
      if (!hoverRef.current && !draggingRef.current) {
        api.scrollNext();
      }
    }, intervalMs);
  }, [api, clearTimer, intervalMs]);

  React.useEffect(() => {
    if (!api) return;
    startTimer();

    const onPointerDown = () => { draggingRef.current = true; clearTimer(); };
    const onPointerUp = () => { draggingRef.current = false; startTimer(); };
    const onMouseEnter = () => { hoverRef.current = true; clearTimer(); };
    const onMouseLeave = () => { hoverRef.current = false; startTimer(); };

    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);

    const emblaRoot = api.rootNode();
    emblaRoot?.addEventListener("mouseenter", onMouseEnter);
    emblaRoot?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
      emblaRoot?.removeEventListener("mouseenter", onMouseEnter);
      emblaRoot?.removeEventListener("mouseleave", onMouseLeave);
      clearTimer();
    };
  }, [api, clearTimer, startTimer]);

  return (
    <div className="mx-3 sm:mx-4 md:mx-6">
      {/* Mobile: Vertical Stack */}
      <div className="flex flex-col gap-4 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="w-full">
            <SummaryCard item={item} />
          </div>
        ))}
      </div>

      {/* Desktop: Carousel */}
      <div className="hidden md:block">
        <Carousel
          opts={{ loop: true, align: "start", dragFree: false }}
          setApi={setApi}
          className="relative"
        >
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-4 py-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                <SummaryCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

function SummaryCard({ item }: { item: SummaryItem }) {
  return (
    <div className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:-translate-y-1">
      {/* Image Area */}
      <div className="relative w-full aspect-[2/1] bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden border-b border-slate-100/50 dark:border-slate-800/50">
        {item.image?.src ? (
          <Image
            src={item.image.src}
            alt={item.image.alt ?? item.title}
            fill
            className={item.imageFit === "contain" ? "object-contain p-8 transition-transform duration-500 group-hover:scale-105" : "object-cover transition-transform duration-500 group-hover:scale-105"}
            priority={false}
            unoptimized={item.image.src.toLowerCase().endsWith('.svg')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        {/* Category Badge overlay */}
        {item.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm font-semibold capitalize border border-slate-200/50 dark:border-slate-800/50">
              {item.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-bold text-lg leading-tight text-slate-800 dark:text-slate-200 transition-colors line-clamp-1 ${item.hoverColorClass ?? "group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}>
              {item.titleComponent ?? item.title}
            </h3>
          </div>
          
          {item.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-10">
              {item.description}
            </p>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.slice(0, 3).map((t, i) => (
                <span 
                  key={`${item.id}-tag-${i}`}
                  className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-end">
          {item.cta?.href && (
            <Link 
              href={item.cta.href} 
              className={`inline-flex items-center text-sm font-semibold transition-colors ${item.ctaColorClass ?? "text-blue-600/90 dark:text-blue-400/90 hover:text-blue-700 dark:hover:text-blue-300"}`}
            >
              {item.cta.label ?? "View Details"}
              <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
