"use client";

import * as React from "react";
import ChannelTabs from "@/components/ChannelTabs";
import SummarySlider from "@/components/SummarySlider";
import type { Section, SummaryItem } from "@/lib/summaryData";

export type LandingSummaryProps = {
  sections: Section[];
  items: SummaryItem[];
};

export default function LandingSummary({ sections, items }: LandingSummaryProps) {
  const [tab, setTab] = React.useState<Section["id"]>(sections[0]?.id ?? "about");

  const filtered = React.useMemo(() => items.filter((i) => i.section === tab), [items, tab]);

  // Auto-rotate tabs every 3s to match request
  React.useEffect(() => {
    if (!sections || sections.length === 0) return;
    const interval = setInterval(() => {
      setTab((current) => {
        const idx = sections.findIndex((s) => s.id === current);
        const nextIdx = (idx + 1) % sections.length;
        return sections[nextIdx]?.id ?? current;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [sections]);

  return (
    <section className="mt-6 sm:mt-8 md:mt-10">
      <ChannelTabs sections={sections} value={tab} onValueChange={setTab} />
      <div className="mt-4">
        <SummarySlider items={filtered} intervalMs={3000} />
      </div>
    </section>
  );
}
