'use server';

import { prisma } from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// --- Types ---

export type JuiceProjectData = {
  id: string;
  slug: string;
  name: string;
  hasPassword?: boolean; // Added
  members: {
    id: string;
    name: string;
    avatarUrl: string | null;
    userId: string | null;
  }[];
  matches: {
    id: string;
    playedAt: Date;
    gameTitle?: string | null;
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
 * Create a new project with a short ID based slug.
 */
export async function createNewProject() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let ownerId: string | undefined = undefined;
    const membersCreate = [];

    if (user) {
        ownerId = user.id;
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
        membersCreate.push({
            name: '自分',
        });
    }

    try {
        // Create project to get auto-incremented shortId
        // We use a temporary slug first, then update it
        const tempSlug = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        
        const project = await prisma.juiceProject.create({
            data: {
                slug: tempSlug,
                name: 'New Group',
                ownerId: ownerId ?? null,
                members: {
                    create: membersCreate
                }
            }
        });

        // Ensure shortId is available. 
        // Note: 'shortId' is an autoincrement integer field.
        // If the Prisma Client type definitions are stale, accessing 'shortId' might cause issues, 
        // or 'select' might fail if the field isn't recognized by the query engine.
        // We assume 'npx prisma generate' has been run successfully.
        
        let shortId = project.shortId;
        
        // Reload if undefined (though create should return it if schema is correct)
        if (shortId === undefined) {
             // Explicitly select shortId to ensure it's fetched
             // Cast to any to bypass potential TS errors if types are slightly out of sync during dev
            const reloaded = await prisma.juiceProject.findUnique({
                where: { id: project.id },
                select: { shortId: true }
            }) as { shortId: number } | null;
            
            if (reloaded) {
                shortId = reloaded.shortId;
            }
        }

        if (shortId === undefined) {
            // Fallback if shortId is still missing (e.g. DB migration issue)
            console.warn("shortId missing after creation, using random fallback");
            shortId = Math.floor(Math.random() * 1000000);
        }

        // Generate short slug from shortId
        // e.g. 1 => 0001, or hash based
        // Request: "e08bc07e-dくらいの桁数" -> 8 chars + suffix? Or just short unique string.
        // Request said "e08bc07e-dくらいの桁数" which is still long (10 chars), but "確実に重複しないように連番などにして"
        // Let's use the auto-increment shortId to generate a concise, unique slug.
        // Base36 encode the shortId to make it URL friendly and short.
        // e.g. shortId=1000 -> "rs"
        // To prevent enumeration, we can add a small random suffix or hash.
        
        // shortId(10進数) -> Base36
        const idPart = shortId.toString(36); 
        // Add random suffix for obscurity if desired, but user asked for "連番などにして" to ensure uniqueness.
        // Pure sequence is shortest and safest for uniqueness.
        // Let's prefix with 'g-' to make it look like a group ID. e.g. "g-1", "g-a", "g-10"
        
        const newSlug = `g-${idPart}`; 
        
        // Update the project with the final slug and name
        await prisma.juiceProject.update({
            where: { id: project.id },
            data: {
                slug: newSlug,
                name: `${newSlug.toUpperCase()}`,
            }
        });

        return { success: true, slug: newSlug };

    } catch (e) {
        console.error("Failed to create new project", e);
        return { success: false, error: e };
    }
}
// 以前の getJuiceProject を削除し、一つにまとめる
// ... (他の関数はそのまま)

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
      return {
          ...project,
          hasPassword: !!project.passwordHash
      };
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
        membersCreate.push({
            name: '自分',
        });
    }
  
    try {
      // Create project to get auto-incremented shortId
      const tempSlug = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      const project = await prisma.juiceProject.create({
        data: {
          slug: tempSlug,
          name: 'New Group',
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
  
      let shortId = project.shortId;
          
      // Reload if undefined
      if (shortId === undefined) {
          const reloaded = await prisma.juiceProject.findUnique({
              where: { id: project.id },
              select: { shortId: true }
          }) as { shortId: number } | null;
          
          if (reloaded) {
              shortId = reloaded.shortId;
          }
      }

      if (shortId === undefined) {
          console.warn("shortId missing after creation, using random fallback");
          shortId = Math.floor(Math.random() * 1000000);
      }

      const idPart = shortId.toString(36); 
      const newSlug = `g-${idPart}`; 
      
      await prisma.juiceProject.update({
          where: { id: project.id },
          data: {
              slug: newSlug,
              name: `${newSlug.toUpperCase()}`,
          }
      });
  
      return {
          ...project,
          slug: newSlug, // Return the new slug
          name: `${newSlug.toUpperCase()}`,
          hasPassword: false
      };
    } catch (e) {
      console.error("Failed to create project", e);
      return null;
    }
}

/**
 * Set or Update Project Password
 */
export async function setProjectPassword(projectId: string, password: string) {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await prisma.juiceProject.update({
            where: { id: projectId },
            data: { passwordHash }
        });
        
        // Auto-authenticate creator
        const cookieStore = await cookies();
        cookieStore.set(`juice_auth_${projectId}`, 'true', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: e };
    }
}

/**
 * Verify Project Password
 */
export async function verifyProjectPassword(projectId: string, password: string) {
    try {
        const project = await prisma.juiceProject.findUnique({
            where: { id: projectId },
            select: { passwordHash: true }
        });

        if (!project || !project.passwordHash) {
             return { success: false, error: 'Password not set' };
        }

        const isValid = await bcrypt.compare(password, project.passwordHash);
        if (isValid) {
            const cookieStore = await cookies();
            cookieStore.set(`juice_auth_${projectId}`, 'true', { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30 // 30 days
            });
            return { success: true };
        } else {
            return { success: false, error: 'Incorrect password' };
        }
    } catch (e) {
        console.error(e);
        return { success: false, error: e };
    }
}

/**
 * Check if user is authenticated for project (Server-side check)
 */
export async function checkProjectAuth(projectId: string) {
    const cookieStore = await cookies();
    const auth = cookieStore.get(`juice_auth_${projectId}`);
    return auth?.value === 'true';
}

/**
 * Add a new member to the project.
 */
export async function addMember(projectId: string, slug: string, name: string) {
  try {
    const member = await prisma.juiceMember.create({
      data: {
        projectId,
        name,
      },
    });
    revalidatePath(`/juice/group/${slug}`);
    return { success: true, member };
  } catch (error) {
    console.error('Failed to add member:', error);
    return { success: false, error };
  }
}

/**
 * Remove a member from the project.
 */
export async function removeMember(memberId: string, slug: string) {
  try {
    await prisma.juiceMember.delete({
      where: { id: memberId },
    });
    revalidatePath(`/juice/group/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to remove member:', error);
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
 * Delete a match.
 */
export async function deleteMatch(matchId: string, slug: string) {
  try {
    await prisma.juiceMatch.delete({
      where: { id: matchId },
    });
    revalidatePath(`/juice/group/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete match:', error);
    return { success: false, error };
  }
}

/**
 * Update a match (delete existing results and recreate).
 */
export async function updateMatch(
  matchId: string,
  slug: string,
  playedAt: Date,
  results: { memberId: string; rank: number; points: number }[],
  gameTitle?: string
) {
  try {
    await prisma.$transaction(async (tx) => {
      // Update match details
      await tx.juiceMatch.update({
        where: { id: matchId },
        data: {
          playedAt,
          gameTitle,
        },
      });

      // Delete old results
      await tx.juiceMatchResult.deleteMany({
        where: { matchId },
      });

      // Create new results
      await tx.juiceMatchResult.createMany({
        data: results.map(r => ({
          matchId,
          memberId: r.memberId,
          rank: r.rank,
          points: r.points,
        })),
      });
    });

    revalidatePath(`/juice/group/${slug}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update match:', error);
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
