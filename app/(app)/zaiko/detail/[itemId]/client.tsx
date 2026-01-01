'use client';

import React, { useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZaikoHeader } from '../../_components/layout/zaiko-header';
import { InventoryDetailForm } from '../../_components/inventory/inventory-detail-form';
import { ZaikoItem } from '../../_lib/types';
import { updateZaikoItem, deleteZaikoItem } from '../../_lib/actions';
import { ZAIKO_CATEGORIES, ZAIKO_LOCATIONS } from '../../_lib/zaiko-constants';

export function ZaikoDetailClient({ 
  item, 
  categories = [], 
  locations = [] 
}: { 
  item: ZaikoItem, 
  categories?: any[], 
  locations?: any[] 
}) {
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

  // Map old constant IDs to new DB UUIDs if applicable
  const initialValues = useMemo(() => {
    // 1. Try to find if item.category matches a DB category ID (already migrated)
    const isDbCategory = categories.some(c => c.id === item.category);
    let categoryValue = item.category;

    if (!isDbCategory) {
        // 2. If not, check if it's an old Constant ID (e.g. 'food')
        const constantCat = ZAIKO_CATEGORIES.find(c => c.id === item.category);
        if (constantCat) {
            // 3. Find the corresponding DB category by Name
            const matchingDbCat = categories.find(c => c.name === constantCat.label);
            if (matchingDbCat) {
                categoryValue = matchingDbCat.id; // Use the new UUID
            }
        }
    }

    // Same for location
    const isDbLocation = locations.some(l => l.id === item.location);
    let locationValue = item.location || '';
    if (item.location && !isDbLocation) {
        const constantLoc = ZAIKO_LOCATIONS.find(l => l.id === item.location);
        if (constantLoc) {
            const matchingDbLoc = locations.find(l => l.name === constantLoc.label);
            if (matchingDbLoc) {
                locationValue = matchingDbLoc.id;
            }
        }
    }

    return {
        name: item.name,
        quantity: item.quantity,
        icon: item.icon,
        category: categoryValue,
        threshold: item.threshold,
        location: locationValue,
        memo: item.memo || '',
        autoConsume: item.autoConsume,
        consumeQuantity: item.consumeQuantity,
        consumeInterval: item.consumeInterval,
    };
  }, [item, categories, locations]);

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
          categories={categories}
          locations={locations}
        />
      </div>
    </div>
  );
}
