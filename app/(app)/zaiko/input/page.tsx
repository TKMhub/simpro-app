import React from 'react';
import ZaikoInputClient from './client';
import { getZaikoSettingsData } from '../_lib/actions';

export default async function ZaikoInputPage() {
  const data = await getZaikoSettingsData();
  // If data is null (unauthorized), the form will just fallback to default constants,
  // or we could redirect to login here. But typically middleware handles this or layout.
  // We'll pass empty arrays if null, and form falls back to constants.
  return <ZaikoInputClient categories={data?.categories} locations={data?.locations} />;
}
