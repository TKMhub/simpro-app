"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/summaryData";

export type ChannelTabsProps = {
  sections: Section[];
  value: Section["id"];
  onValueChange: (next: Section["id"]) => void;
};

export default function ChannelTabs({ sections, value, onValueChange }: ChannelTabsProps) {
  return (
    <div
      className={cn(
        // glass + diagonal gradient row
        "mx-3 sm:mx-4 md:mx-6",
      )}
    >
      <div
        className={cn(
          "w-full rounded-2xl p-2",
          "backdrop-blur-xl backdrop-saturate-150",
          // Match hero cover glass background for consistent hue/visibility
          "bg-[var(--cover-glass-bg)]",
          "ring-1 ring-[var(--glass-border)] shadow-lg shadow-black/10"
        )}
      >
        <Tabs value={value} onValueChange={(v) => onValueChange(v as Section["id"]) }>
          <TabsList
            className={cn(
              // make it transparent to show our glass background, but keep padding for pill triggers
              "bg-transparent p-1 h-auto gap-2",
            )}
          >
            {sections.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium",
                  // inactive style
                  "text-[var(--cover-foreground)]/80",
                  // active pill emphasis
                  "data-[state=active]:text-[var(--cover-foreground)]",
                  // Light: white pill on dark-ish glass, Dark: subtle black pill on white glass
                  "data-[state=active]:bg-white/70 data-[state=active]:shadow-sm",
                  "dark:data-[state=active]:bg-black/20",
                  // hover effect
                  "hover:bg-white/25 dark:hover:bg-black/10 transition-colors"
                )}
                aria-label={s.label}
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
