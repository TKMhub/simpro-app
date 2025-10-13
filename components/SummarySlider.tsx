"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SummaryItem } from "@/lib/summaryData";

export type SummarySliderProps = {
  items: SummaryItem[];
  intervalMs?: number; // default 3500
};

export default function SummarySlider({ items, intervalMs = 3500 }: SummarySliderProps) {
  const [api, setApi] = React.useState<ReturnType<typeof import("embla-carousel-react")["default"]> | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const hoverRef = React.useRef(false);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = React.useCallback(() => {
    clearTimer();
    if (!api) return;
    timerRef.current = setInterval(() => {
      // Only advance when not hovered and not dragging
      const isDragging = api.pointerDown?.() ?? false;
      if (!hoverRef.current && !isDragging) {
        api.scrollNext();
      }
    }, intervalMs);
  }, [api, clearTimer, intervalMs]);

  React.useEffect(() => {
    if (!api) return;
    startTimer();

    const onPointerDown = () => clearTimer();
    const onPointerUp = () => startTimer();
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
      <Carousel
        opts={{ loop: true, align: "start", dragFree: false }}
        setApi={setApi as any}
        className="relative"
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg line-clamp-1">
                    {item.title}
                  </CardTitle>
                  {item.description && (
                    <CardDescription
                      className="text-sm"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </CardDescription>
                  )}
                </CardHeader>
                {item.image?.src && (
                  <div className="px-6">
                    <div className="relative w-full overflow-hidden rounded-lg aspect-[16/9] bg-black/5 dark:bg-white/5">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt ?? item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                  </div>
                )}
                <CardContent className="mt-3">
                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {item.tags.map((t, i) => (
                        <Badge key={`${item.id}-tag-${i}`} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end">
                    {item.cta?.href && (
                      <Button asChild size="sm">
                        <Link href={item.cta.href} aria-label={item.cta.label ?? item.title}>
                          {item.cta.label ?? "詳しく"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
