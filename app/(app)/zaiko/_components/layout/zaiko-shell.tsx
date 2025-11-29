"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ZaikoShellProps {
  children: ReactNode;
  className?: string;
}

export function ZaikoShell({ children, className }: ZaikoShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`mx-auto max-w-md bg-white dark:bg-gray-800 shadow-lg min-h-screen relative ${className || ""}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

