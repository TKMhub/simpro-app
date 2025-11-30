import React from 'react';
import { ZaikoDetailClient } from './client';
import { getZaikoItem } from '../../_lib/actions';
import { notFound } from 'next/navigation';

type Params = Promise<{ itemId: string }>;

export default async function ZaikoDetailPage({ params }: { params: Params }) {
  const { itemId } = await params;
  const item = await getZaikoItem(itemId);

  if (!item) {
    notFound();
  }

  return <ZaikoDetailClient item={item} />;
}
