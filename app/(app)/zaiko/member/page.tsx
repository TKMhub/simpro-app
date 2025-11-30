import React from 'react';
import { getZaikoMembers } from '../_lib/actions';
import ZaikoMemberClient from './client';

export const dynamic = 'force-dynamic';

export default async function ZaikoMemberPage() {
  const { members, currentUserId } = await getZaikoMembers();
  return <ZaikoMemberClient members={members} currentUserId={currentUserId} />;
}
