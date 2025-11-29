"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Menu, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZaikoHeaderProps {
  title?: string;
  leftIcon?: "back" | "home" | "menu" | ReactNode;
  rightIcon?: ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  className?: string;
}

export function ZaikoHeader({
  title,
  leftIcon = "menu",
  rightIcon,
  onLeftClick,
  onRightClick,
  className,
}: ZaikoHeaderProps) {
  const renderLeftIcon = () => {
    if (typeof leftIcon !== "string") {
      return leftIcon;
    }

    switch (leftIcon) {
      case "back":
        return <ArrowLeft className="size-6" />;
      case "home":
        return <Home className="size-6" />;
      case "menu":
        return <Menu className="size-6" />;
      default:
        return null;
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-800/95 dark:supports-[backdrop-filter]:bg-gray-800/80 px-4",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onLeftClick}
        className="h-10 w-10 rounded-full"
        aria-label={leftIcon === "back" ? "戻る" : leftIcon === "home" ? "ホーム" : "メニュー"}
      >
        {renderLeftIcon()}
      </Button>

      {title && (
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1 text-center px-4">
          {title}
        </h1>
      )}

      {rightIcon ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRightClick}
          className="h-10 w-10 rounded-full"
        >
          {rightIcon}
        </Button>
      ) : (
        <div className="w-10" /> // スペーサー
      )}
    </motion.header>
  );
}

