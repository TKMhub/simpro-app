"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cardHover } from "../../_lib/motion-presets";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      variants={cardHover}
      whileHover="y"
      className={cn("h-full", className)}
    >
      <Card className="h-full p-6 flex flex-col items-center text-center gap-4 border-2 hover:border-[#32D17D]/30 dark:hover:border-[#32D17D]/20 transition-colors">
        <div className="size-16 rounded-full bg-[#32D17D]/10 dark:bg-[#32D17D]/20 flex items-center justify-center text-[#32D17D]">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}

