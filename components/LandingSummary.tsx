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

  return (
    <section className="mt-6 sm:mt-8 md:mt-10">
      <ChannelTabs sections={sections} value={tab} onValueChange={setTab} />
      <div className="mt-4">
        <SummarySlider items={filtered} />
      </div>
    </section>
  );
}

