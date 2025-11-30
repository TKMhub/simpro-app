"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";

function AuthErrorListenerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      // エラーメッセージの表示
      toast.error("ログインが正常に完了できませんでした", {
        description: "もう一度お試しいただくか、管理者にお問い合わせください。",
        duration: 5000,
      });

      // URLからエラーパラメータを削除
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  return null;
}

export function AuthErrorListener() {
  return (
    <Suspense>
      <AuthErrorListenerContent />
    </Suspense>
  );
}
