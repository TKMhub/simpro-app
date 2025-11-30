'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ZaikoHeader } from '../../_components/layout/zaiko-header';
import { InventoryDetailForm } from '../../_components/inventory/inventory-detail-form';
import { createZaikoItem } from '../../_lib/actions';

export default function ZaikoFamilyInputClient({ familyName }: { familyName: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleSubmit = (values: any) => {
    startTransition(async () => {
        try {
            // familyName を元に familyId を特定するロジックが理想だが
            // 現状はデフォルトの家族に追加する
            await createZaikoItem(values);
            router.push('/zaiko/dashboard');
        } catch(e) {
            console.error('Failed to create item', e);
        }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <ZaikoHeader
        title={`${decodeURIComponent(familyName)}家の在庫を追加`}
        showBack
        onBack={() => router.back()}
        rightAction={<div className="w-8" />} // Spacer
      />
      
      <div className="px-4 py-6">
        <InventoryDetailForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

