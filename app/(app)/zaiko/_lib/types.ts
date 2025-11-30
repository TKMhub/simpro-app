import { ZaikoItem, ZaikoProfile, ZaikoFamily, ZaikoFamilyMember } from '@/lib/generated/prisma';

export type { ZaikoItem, ZaikoProfile, ZaikoFamily, ZaikoFamilyMember };

export type ZaikoItemWithFamily = ZaikoItem & {
  family: ZaikoFamily;
};

export type ZaikoMemberWithProfile = ZaikoFamilyMember & {
  user: ZaikoProfile;
};

