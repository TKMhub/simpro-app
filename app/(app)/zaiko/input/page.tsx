'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ZaikoHeader } from '../_components/layout/zaiko-header';
import { InventoryDetailForm } from '../_components/inventory/inventory-detail-form';

export default function ZaikoInputPage() {
  const router = useRouter();

  const handleSubmit = (values: any) => {
    console.log('Submitted:', values);
    // TODO: Implement API call
    router.push('/zaiko/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <ZaikoHeader
        title="新しい在庫を追加"
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

