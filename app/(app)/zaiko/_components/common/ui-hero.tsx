"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInUp, fadeInDown, scaleIn } from "../../_lib/motion-presets";
import { ArrowRight } from "lucide-react";

interface UIHeroProps {
  catchCopy: string;
  subCopy?: string;
  primaryCTA?: {
    label: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    label: string;
    onClick: () => void;
  };
  mockImage?: React.ReactNode;
}

export function UIHero({
  catchCopy,
  subCopy,
  primaryCTA,
  secondaryCTA,
  mockImage,
}: UIHeroProps) {
  return (
    <div className="relative overflow-hidden px-4 py-16">
      <motion.div
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
          {catchCopy}
        </h1>
        {subCopy && (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            {subCopy}
          </p>
        )}
      </motion.div>

      {mockImage && (
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          {mockImage}
        </motion.div>
      )}

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        {primaryCTA && (
          <Button
            onClick={primaryCTA.onClick}
            size="lg"
            className="bg-[#32D17D] hover:bg-[#22C55E] text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-green-500/30 dark:shadow-green-500/20"
          >
            {primaryCTA.label}
            <ArrowRight className="ml-2 size-5" />
          </Button>
        )}
        {secondaryCTA && (
          <button
            onClick={secondaryCTA.onClick}
            className="text-sm text-[#32D17D] dark:text-[#32D17D] font-medium hover:underline"
          >
            {secondaryCTA.label}
          </button>
        )}
      </motion.div>
    </div>
  );
}

