import { ZaikoItem, Profile, ZaikoFamily, ZaikoFamilyMember } from '@/lib/generated/prisma';

export type { ZaikoItem, Profile as ZaikoProfile, ZaikoFamily, ZaikoFamilyMember };

export type ZaikoItemWithFamily = ZaikoItem & {
  family: ZaikoFamily;
};

export type ZaikoMemberWithProfile = ZaikoFamilyMember & {
  user: Profile;
};

