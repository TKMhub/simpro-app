"use client";

import { useRouter, useParams } from "next/navigation";
import { ZaikoHeader } from "../../_components/layout/zaiko-header";
import { InventoryDetailForm } from "../../_components/inventory/inventory-detail-form";
import type { InventoryCreateInput } from "../../_lib/inventory-schema";

export default function ZaikoFamilyInputPage() {
  const router = useRouter();
  const params = useParams();
  const familyName = params.familyName as string;

  const handleSubmit = (data: InventoryCreateInput) => {
    // TODO: API呼び出し（家族用）
    console.log("家族用新規登録:", { familyName, ...data });
    router.push("/zaiko/dashboard");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <ZaikoHeader
        title={`${familyName}の在庫を追加`}
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

