'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

// Update User Theme Preference
export async function updateThemePreference(theme: 'light' | 'dark') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await prisma.profile.update({
        where: { id: user.id },
        data: {
            theme: theme === 'dark' ? 'DARK' : 'LIGHT'
        }
    });
    
    // Note: Revalidating everything might not be needed for theme,
    // but useful if we render theme-specific content server-side.
    // revalidatePath('/'); 
}

