'use server';

import { prisma } from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// --- Types ---

export type JuiceProjectData = {
  id: string;
  slug: string;
  name: string;
  members: {
    id: string;
    name: string;
    avatarUrl: string | null;
    userId: string | null;
  }[];
  matches: {
    id: string;
    playedAt: Date;
    results: {
      memberId: string;
      rank: number;
      points: number;
    }[];
  }[];
};

export type PlayerStats = {
  memberId: string;
  name: string;
  avatarUrl: string | null;
  totalGames: number;
  totalPoints: number; // Balance
  wins: number; // 1st place count
};

// --- Actions ---

/**
 * Get project details by slug.
 * Creates a new project if it doesn't exist (for demo purposes/ease of use).
 */
export async function getJuiceProject(slug: string): Promise<JuiceProjectData | null> {
  // Try to find existing project
  const project = await prisma.juiceProject.findUnique({
    where: { slug },
    include: {
      members: {
        orderBy: { createdAt: 'asc' },
      },
      matches: {
        orderBy: { playedAt: 'desc' },
        take: 20, // Limit recent history
        include: {
          results: true,
        },
      },
    },
  });

  if (project) {
    return project;
  }

  // If not found, create one
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let ownerId: string | undefined = undefined;
  const membersCreate = [];

  if (user) {
    ownerId = user.id;
    // Ensure Profile exists for the user
    let profile = await prisma.profile.findUnique({ where: { id: user.id } });
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email!,
          displayName: user.user_metadata.full_name || 'User',
        }
      });
    }
    
    membersCreate.push({
       userId: user.id,
       name: profile.displayName || 'Me',
       avatarUrl: profile.avatarUrl,
    });
  } else {
      // 未ログインの場合、作成者をゲストメンバーとして追加
      // NOTE: このメンバーとクライアントを紐付ける仕組みが別途必要だが、
      // ここではとりあえずプロジェクト作成を優先する。
      membersCreate.push({
          name: '自分',
          // userId is null
      });
  }

  try {
    const newProject = await prisma.juiceProject.create({
      data: {
        slug,
        name: `${slug}'s Group`,
        ownerId: ownerId ?? null,
        members: {
          create: membersCreate
        }
      },
      include: {
        members: true,
        matches: { include: { results: true } },
      }
    });
    return newProject;
  } catch (e) {
    console.error("Failed to create project", e);
    return null;
  }
}

/**
 * Add a new member to the project.
 */
export async function addMember(projectId: string, name: string) {
  try {
    const member = await prisma.juiceMember.create({
      data: {
        projectId,
        name,
      },
    });
    // We can't easily revalidate specific path without slug, 
    // but usually this is called from a client component that can refresh.
    // Or we should pass slug to this action.
    return { success: true, member };
  } catch (error) {
    console.error('Failed to add member:', error);
    return { success: false, error };
  }
}

/**
 * Record a match result.
 */
export async function recordMatch(
  projectId: string, 
  slug: string, 
  playedAt: Date, 
  results: { memberId: string; rank: number; points: number }[],
  gameTitle?: string
) {
  try {
    await prisma.juiceMatch.create({
      data: {
        projectId,
        playedAt,
        gameTitle,
        results: {
          create: results.map(r => ({
            memberId: r.memberId,
            rank: r.rank,
            points: r.points,
          })),
        },
      },
    });
    
    revalidatePath(`/juice/group/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to record match:', error);
    return { success: false, error };
  }
}

/**
 * Update member profile.
 * Can also sync to global profile if userId is present.
 */
export async function updateMemberProfile(
  memberId: string, 
  slug: string, 
  name: string, 
  avatarUrl: string | null,
  syncToGlobal: boolean = false
) {
  try {
    const member = await prisma.juiceMember.update({
      where: { id: memberId },
      data: { name, avatarUrl },
    });

    if (syncToGlobal && member.userId) {
      await prisma.profile.update({
        where: { id: member.userId },
        data: {
          displayName: name,
          avatarUrl: avatarUrl,
        },
      });
    }

    revalidatePath(`/juice/group/${slug}`);
    revalidatePath(`/juice/group/${slug}/profile`);
    return { success: true, member };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, error };
  }
}

/**
 * Upload avatar image to Supabase Storage.
 */
export async function uploadAvatar(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return { success: false, error: 'No file provided' };

  const supabase = await createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return { success: true, publicUrl };
}

/**
 * Join the project as the current authenticated user.
 */
export async function joinAsCurrentUser(projectId: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not logged in' };

  // Check if already a member
  const existingMember = await prisma.juiceMember.findFirst({
    where: { projectId, userId: user.id },
  });

  if (existingMember) return { success: true, member: existingMember };

  // Get or create profile
  let profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email!,
        displayName: user.user_metadata.full_name || 'User',
      }
    });
  }

  try {
    const member = await prisma.juiceMember.create({
      data: {
        projectId,
        userId: user.id,
        name: profile.displayName || 'User',
        avatarUrl: profile.avatarUrl,
      },
    });
    revalidatePath(`/juice/group/${slug}`);
    return { success: true, member };
  } catch (error) {
     console.error('Failed to join:', error);
     return { success: false, error };
  }
}
