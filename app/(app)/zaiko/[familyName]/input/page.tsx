import React from 'react';
import ZaikoFamilyInputClient from './client';

type Params = Promise<{ familyName: string }>;

export default async function ZaikoFamilyInputPage({ params }: { params: Params }) {
  const { familyName } = await params;
  return <ZaikoFamilyInputClient familyName={familyName} />;
}
