import React from 'react';
import { getZaikoSettingsData } from '../_lib/actions';
import SettingsClient from './client';
import { redirect } from 'next/navigation';

export default async function ZaikoSettingsPage() {
  const data = await getZaikoSettingsData();

  if (!data) {
    // ログインしていない、またはエラーの場合はリダイレクト
    redirect('/auth/login');
  }

  return (
    <SettingsClient 
      user={data.user}
      membership={data.membership}
      family={data.family}
      categories={data.categories}
      locations={data.locations}
    />
  );
}
