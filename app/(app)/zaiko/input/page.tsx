"use client";

import { useRouter } from "next/navigation";
import { ZaikoHeader } from "../_components/layout/zaiko-header";
import { InventoryDetailForm } from "../_components/inventory/inventory-detail-form";
import type { InventoryCreateInput } from "../_lib/inventory-schema";

export default function ZaikoInputPage() {
  const router = useRouter();

  const handleSubmit = (data: InventoryCreateInput) => {
    // TODO: API呼び出し
    console.log("新規登録:", data);
    router.push("/zaiko/dashboard");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <ZaikoHeader
        title="新しい在庫を追加"
        leftIcon="back"
        onLeftClick={handleCancel}
      />
      <InventoryDetailForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="登録"
      />
    </>
  );
}

