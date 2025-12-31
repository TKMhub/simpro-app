'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { ZaikoItem } from './types';
import { ZaikoFamilyRole } from '@prisma/client';
import { ZAIKO_CATEGORIES, ZAIKO_LOCATIONS } from './zaiko-constants';

// -----------------------------------------------------------------------------
// Helper: Seed Default Data
// -----------------------------------------------------------------------------
export async function seedZaikoFamilyData(familyId: string) {
    // Categories
    for (const cat of ZAIKO_CATEGORIES) {
        await prisma.zaikoCategory.upsert({
            where: { familyId_name: { familyId, name: cat.label } },
            update: {},
            create: {
                // If possible, we could use fixed IDs but Prisma auto-generates UUIDs.
                // We will rely on name matching for now or just generate new ones.
                // Note: If we want to support existing items with "food" ID, we might want to allow setting ID.
                // But typically we should migrate existing items.
                // For now, let's just create them. The UI will use these.
                familyId,
                name: cat.label,
            }
        });
    }

    // Locations
    for (const loc of ZAIKO_LOCATIONS) {
        await prisma.zaikoLocation.upsert({
            where: { familyId_name: { familyId, name: loc.label } },
            update: {},
            create: {
                familyId,
                name: loc.label,
            }
        });
    }
}

// -----------------------------------------------------------------------------
// User & Auth
// -----------------------------------------------------------------------------

export async function getZaikoUser(): Promise<any | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Find or Create Common Profile
  let profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    try {
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email!,
          displayName: user.user_metadata?.full_name || user.email?.split('@')[0],
          avatarUrl: user.user_metadata?.avatar_url,
          joinedApps: ['zaiko'],
        },
      });
      
      // Default Family
      const family = await prisma.zaikoFamily.create({
        data: {
            name: 'マイ在庫',
            inviteCode: Math.random().toString(36).substring(2, 10),
            createdBy: profile.id,
            members: {
                create: {
                    userId: profile.id,
                    role: 'ADMIN',
                }
            }
        }
      });
      await seedZaikoFamilyData(family.id);

    } catch (e) {
      console.error('Failed to create profile:', e);
      return null;
    }
  } else {
      if (!profile.joinedApps.includes('zaiko')) {
          await prisma.profile.update({
              where: { id: profile.id },
              data: {
                  joinedApps: {
                      push: 'zaiko'
                  }
              }
          });
      }
      
      const existingFamily = await prisma.zaikoFamilyMember.findFirst({
          where: { userId: profile.id }
      });
      
      if (!existingFamily) {
         const family = await prisma.zaikoFamily.create({
            data: {
                name: 'マイ在庫',
                inviteCode: Math.random().toString(36).substring(2, 10),
                createdBy: profile.id,
                members: {
                    create: {
                        userId: profile.id,
                        role: 'ADMIN',
                    }
                }
            }
          });
          await seedZaikoFamilyData(family.id);
      }
  }

  return profile;
}

// -----------------------------------------------------------------------------
// Inventory Actions
// -----------------------------------------------------------------------------

export async function getZaikoItems() {
    const user = await getZaikoUser();
    if (!user) return [];

    const memberships = await prisma.zaikoFamilyMember.findMany({
        where: { userId: user.id },
        select: { familyId: true }
    });
    const familyIds = memberships.map(m => m.familyId);

    const items = await prisma.zaikoItem.findMany({
        where: {
            familyId: { in: familyIds }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return items;
}

export async function getZaikoItem(id: string) {
    const user = await getZaikoUser();
    if (!user) return null;

    const item = await prisma.zaikoItem.findUnique({
        where: { id },
    });
    
    return item;
}

export async function createZaikoItem(data: {
    name: string;
    quantity: number;
    threshold: number;
    category: string;
    location?: string;
    icon: string;
    memo?: string;
    familyId?: string; // 指定がなければデフォルト家族
}) {
    const user = await getZaikoUser();
    if (!user) throw new Error('Unauthorized');

    let familyId = data.familyId;
    if (!familyId) {
        const membership = await prisma.zaikoFamilyMember.findFirst({
            where: { userId: user.id },
            select: { familyId: true }
        });
        if (!membership) throw new Error('No family found');
        familyId = membership.familyId;
    }

    await prisma.zaikoItem.create({
        data: {
            ...data,
            familyId,
            createdBy: user.id,
        }
    });

    revalidatePath('/zaiko/dashboard');
}

export async function updateZaikoItem(id: string, data: Partial<ZaikoItem>) {
    const user = await getZaikoUser();
    if (!user) throw new Error('Unauthorized');

    await prisma.zaikoItem.update({
        where: { id },
        data,
    });

    revalidatePath('/zaiko/dashboard');
    revalidatePath(`/zaiko/detail/${id}`);
}

export async function deleteZaikoItem(id: string) {
    const user = await getZaikoUser();
    if (!user) throw new Error('Unauthorized');

    await prisma.zaikoItem.delete({
        where: { id },
    });

    revalidatePath('/zaiko/dashboard');
}

// -----------------------------------------------------------------------------
// Member Actions
// -----------------------------------------------------------------------------

export async function getZaikoMembers() {
    const user = await getZaikoUser();
    if (!user) return { members: [], currentUserId: null, family: null };

    const membership = await prisma.zaikoFamilyMember.findFirst({
        where: { userId: user.id },
        include: { family: true }
    });
    if (!membership) return { members: [], currentUserId: user.id, family: null };

    const members = await prisma.zaikoFamilyMember.findMany({
        where: { familyId: membership.familyId },
        include: { user: true }
    });

    return { members, currentUserId: user.id, family: membership.family };
}

// -----------------------------------------------------------------------------
// Settings Actions
// -----------------------------------------------------------------------------

export async function getZaikoSettingsData() {
    const user = await getZaikoUser();
    if (!user) return null;

    const membership = await prisma.zaikoFamilyMember.findFirst({
        where: { userId: user.id },
        include: { family: true }
    });

    if (!membership) return null;

    const family = membership.family;
    const categories = await prisma.zaikoCategory.findMany({
        where: { familyId: family.id },
        orderBy: { name: 'asc' }
    });
    const locations = await prisma.zaikoLocation.findMany({
        where: { familyId: family.id },
        orderBy: { name: 'asc' }
    });

    // If no categories found (e.g. existing family before migration), seed them now
    if (categories.length === 0) {
        await seedZaikoFamilyData(family.id);
        // Re-fetch
        const newCategories = await prisma.zaikoCategory.findMany({
            where: { familyId: family.id },
            orderBy: { name: 'asc' }
        });
        const newLocations = await prisma.zaikoLocation.findMany({
            where: { familyId: family.id },
            orderBy: { name: 'asc' }
        });
        return {
            user,
            membership,
            family,
            categories: newCategories,
            locations: newLocations
        };
    }

    return {
        user,
        membership,
        family,
        categories,
        locations
    };
}

export async function createZaikoCategory(name: string) {
    const user = await getZaikoUser();
    if (!user) throw new Error('Unauthorized');

    const membership = await prisma.zaikoFamilyMember.findFirst({
        where: { userId: user.id },
    });
    if (!membership) throw new Error('No family found');
    if (membership.role !== 'ADMIN') throw new Error('Permission denied');

    await prisma.zaikoCategory.create({
        data: {
            familyId: membership.familyId,
            name,
        }
    });

    revalidatePath('/zaiko/settings');
}

export async function deleteZaikoCategory(id: string) {
    const user = await getZaikoUser();
    if (!user) throw new Error('Unauthorized');

    const membership = await prisma.zaikoFamilyMember.findFirst({
        where: { userId: user.id },
    });
    if (!membership) throw new Error('No family found');
    if (membership.role !== 'ADMIN') throw new Error('Permission denied');
    
    const category = await prisma.zaikoCategory.findUnique({ where: { id } });
    if (category?.familyId !== membership.familyId) throw new Error('Permission denied');

    await prisma.zaikoCategory.delete({
        where: { id },
    });

    revalidatePath('/zaiko/settings');
}

export async function createZaikoLocation(name: string) {
    const user = await getZaikoUser();
    if (!user) throw new Error('Unauthorized');

    const membership = await prisma.zaikoFamilyMember.findFirst({
        where: { userId: user.id },
    });
    if (!membership) throw new Error('No family found');
    if (membership.role !== 'ADMIN') throw new Error('Permission denied');

    await prisma.zaikoLocation.create({
        data: {
            familyId: membership.familyId,
            name,
        }
    });

    revalidatePath('/zaiko/settings');
}

export async function deleteZaikoLocation(id: string) {
    const user = await getZaikoUser();
    if (!user) throw new Error('Unauthorized');

    const membership = await prisma.zaikoFamilyMember.findFirst({
        where: { userId: user.id },
    });
    if (!membership) throw new Error('No family found');
    if (membership.role !== 'ADMIN') throw new Error('Permission denied');

    const location = await prisma.zaikoLocation.findUnique({ where: { id } });
    if (location?.familyId !== membership.familyId) throw new Error('Permission denied');

    await prisma.zaikoLocation.delete({
        where: { id },
    });

    revalidatePath('/zaiko/settings');
}

export async function joinZaikoFamily(inviteCode: string) {
    const user = await getZaikoUser();
    if (!user) throw new Error('Unauthorized');

    const family = await prisma.zaikoFamily.findUnique({
        where: { inviteCode }
    });

    if (!family) throw new Error('Invalid invite code');

    const existing = await prisma.zaikoFamilyMember.findUnique({
        where: {
            familyId_userId: {
                familyId: family.id,
                userId: user.id
            }
        }
    });

    if (existing) {
        return { success: true, message: 'Already a member' };
    }

    await prisma.zaikoFamilyMember.create({
        data: {
            familyId: family.id,
            userId: user.id,
            role: 'EDITOR'
        }
    });

    revalidatePath('/zaiko');
    return { success: true, message: 'Joined family successfully' };
}

// -----------------------------------------------------------------------------
// Shopping List Actions
// -----------------------------------------------------------------------------

export async function getShoppingList() {
    const items = await getZaikoItems();
    return items.filter(item => item.quantity <= item.threshold || item.quantity === 0);
}
