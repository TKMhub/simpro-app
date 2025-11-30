import React from 'react';
import { getZaikoItems } from '../_lib/actions';
import ZaikoDashboardClient from './client';

export const dynamic = 'force-dynamic';

export default async function ZaikoDashboardPage() {
  const items = await getZaikoItems();

  return <ZaikoDashboardClient initialItems={items} />;
}
