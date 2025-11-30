import React from 'react';
import { getShoppingList } from '../_lib/actions';
import ZaikoTobuyClient from './client';

export const dynamic = 'force-dynamic';

export default async function ZaikoTobuyPage() {
  const items = await getShoppingList();
  return <ZaikoTobuyClient initialItems={items} />;
}
