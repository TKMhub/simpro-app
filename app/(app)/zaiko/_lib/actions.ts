'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { ZaikoItem } from './types';

// -----------------------------------------------------------------------------
// User & Auth
// -----------------------------------------------------------------------------

// 公開プロフィール (Profile) を取得する
// ここでは "ZaikoProfile" ではなくプロジェクト共通の "Profile" を扱う
// (ただし Action名などはZaikoアプリ内での利用を想定して getZaikoUser としているが、
//  実体は共通 Profile を返している)
export async function getZaikoUser(): Promise<any | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Find or Create Common Profile
  // 注意: ここで参照するテーブルは共通の "Profile"
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
          joinedApps: ['zaiko'], // 初回ログイン時に 'zaiko' を追加
        },
      });
      
      // 初回ユーザーにはデフォルトの家族を作成
      await prisma.zaikoFamily.create({
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

    } catch (e) {
      console.error('Failed to create profile:', e);
      return null;
    }
  } else {
      // 既存ユーザーだがZaikoは初めての場合
      if (!profile.joinedApps.includes('zaiko')) {
          await prisma.profile.update({
              where: { id: profile.id },
              data: {
                  joinedApps: {
                      push: 'zaiko'
                  }
              }
          });
          
          // Zaiko用の初期データ作成
          const existingFamily = await prisma.zaikoFamilyMember.findFirst({
              where: { userId: profile.id }
          });
          
          if (!existingFamily) {
             await prisma.zaikoFamily.create({
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
          }
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

    // ユーザーが所属する家族のID一覧を取得
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
    
    // TODO: 権限チェック (所属する家族のアイテムか)
    
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
        // デフォルトの家族を取得 (とりあえず最初のひとつ)
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
    if (!user) return { members: [], currentUserId: null };

    // 簡易的に、ユーザーが所属する最初の家族のメンバーを返す仕様とする
    const membership = await prisma.zaikoFamilyMember.findFirst({
        where: { userId: user.id },
    });
    if (!membership) return { members: [], currentUserId: user.id };

    const members = await prisma.zaikoFamilyMember.findMany({
        where: { familyId: membership.familyId },
        include: { user: true }
    });

    return { members, currentUserId: user.id };
}

// -----------------------------------------------------------------------------
// Shopping List Actions
// -----------------------------------------------------------------------------

export async function getShoppingList() {
    const items = await getZaikoItems();
    // 在庫切れ または 閾値以下のアイテムをフィルタリング
    // quantity <= threshold OR quantity === 0
    return items.filter(item => item.quantity <= item.threshold || item.quantity === 0);
}
