'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZaikoHeader } from '../../_components/layout/zaiko-header';
import { InventoryDetailForm } from '../../_components/inventory/inventory-detail-form';
import { ZaikoItem } from '../../_lib/types';
import { updateZaikoItem, deleteZaikoItem } from '../../_lib/actions';

export function ZaikoDetailClient({ item }: { item: ZaikoItem }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleSubmit = (values: any) => {
    startTransition(async () => {
        try {
            await updateZaikoItem(item.id, values);
            router.push('/zaiko/dashboard');
        } catch(e) {
            console.error('Failed to update', e);
        }
    });
  };

  const handleDelete = () => {
    if (confirm('本当に削除しますか？')) {
      startTransition(async () => {
        try {
            await deleteZaikoItem(item.id);
            router.push('/zaiko/dashboard');
        } catch(e) {
            console.error('Failed to delete', e);
        }
      });
    }
  };

  const initialValues = {
    name: item.name,
    quantity: item.quantity,
    iconName: item.icon,
    category: item.category,
    threshold: item.threshold,
    location: item.location || '',
    memo: item.memo || '',
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
