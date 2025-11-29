'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZaikoHeader } from '../../_components/layout/zaiko-header';
import { InventoryDetailForm } from '../../_components/inventory/inventory-detail-form';

export function ZaikoDetailClient({ itemId }: { itemId: string }) {
  const router = useRouter();

  // Mock initial data fetch
  const initialValues = {
    name: 'トイレットペーパー', // In real app, fetch based on itemId
    quantity: 2,
    iconName: '🧻',
    categoryId: 'daily',
    threshold: 2,
    locationId: 'toilet_shelf',
    memo: 'コストコで買う',
  };

  const handleSubmit = (values: any) => {
    console.log('Updated:', values);
    router.push('/zaiko/dashboard');
  };

  const handleDelete = () => {
    if (confirm('本当に削除しますか？')) {
      console.log('Deleted:', itemId);
      router.push('/zaiko/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <ZaikoHeader
        title="編集"
        showBack
        onBack={() => router.back()}
        rightAction={
          <Button variant="ghost" size="icon" className="text-red-500" onClick={handleDelete}>
            <Trash2 className="h-5 w-5" />
          </Button>
        }
      />

      <div className="px-4 py-6">
        <InventoryDetailForm
          defaultValues={initialValues}
          onSubmit={handleSubmit}
          isEdit
        />
      </div>
    </div>
  );
}

