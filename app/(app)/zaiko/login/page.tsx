"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ZaikoHeader } from "../_components/layout/zaiko-header";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "../_lib/motion-presets";
import { Package } from "lucide-react";

export default function ZaikoLoginPage() {
  const router = useRouter();

  return (
    <>
      <ZaikoHeader
        title="ログイン"
        leftIcon="back"
        onLeftClick={() => router.push("/zaiko")}
      />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="px-4 py-12"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-[#32D17D]/10 dark:bg-[#32D17D]/20 mb-4">
            <Package className="size-10 text-[#32D17D]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ログイン
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Zaikoのご利用にはログインが必要です
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => {
              // TODO: Google OAuth実装
              console.log("Googleでログイン");
            }}
            className="w-full h-12 text-base bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg className="size-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Googleでログイン
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                または
              </span>
            </div>
          </div>

          <Button
            onClick={() => {
              // TODO: メールアドレスログイン実装
              console.log("メールアドレスでログイン");
            }}
            variant="outline"
            className="w-full h-12 text-base"
          >
            メールアドレスでログイン
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-8">
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
        </p>
      </motion.div>
    </>
  );
}

