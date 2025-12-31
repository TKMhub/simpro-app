import React from 'react';
import { ZaikoDetailClient } from './client';
import { getZaikoItem, getZaikoSettingsData } from '../../_lib/actions';
import { notFound } from 'next/navigation';

type Params = Promise<{ itemId: string }>;

export default async function ZaikoDetailPage({ params }: { params: Params }) {
  const { itemId } = await params;
  
  // Parallel fetch item and master data
  const [item, settingsData] = await Promise.all([
    getZaikoItem(itemId),
    getZaikoSettingsData()
  ]);

  if (!item) {
    notFound();
  }

  return <ZaikoDetailClient 
            item={item} 
            categories={settingsData?.categories} 
            locations={settingsData?.locations} 
         />;
}
