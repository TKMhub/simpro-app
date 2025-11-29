"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../../_lib/motion-presets";
import { cn } from "@/lib/utils";

interface SectionBlockProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function SectionBlock({
  title,
  subtitle,
  children,
  className,
}: SectionBlockProps) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn("py-12 px-4", className)}
    >
      {title && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.section>
  );
}

