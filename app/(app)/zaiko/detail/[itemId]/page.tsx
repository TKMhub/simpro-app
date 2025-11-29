import React from 'react';
import { ZaikoDetailClient } from './client';

type Params = Promise<{ itemId: string }>;

export default async function ZaikoDetailPage({ params }: { params: Params }) {
  const { itemId } = await params;

  return <ZaikoDetailClient itemId={itemId} />;
}

