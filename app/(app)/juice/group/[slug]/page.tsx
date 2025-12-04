import { getJuiceProject } from '@/lib/juice/actions';
import DashboardClient from '@/components/juice/DashboardClient';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function GroupPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = await getJuiceProject(params.slug);
  
  if (!project) {
    // If project auto-creation failed (e.g. not logged in and no existing project)
    // We might want to show a "Create Project" page or redirect.
    // For now, 404.
    return notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <DashboardClient project={project} currentUserEmail={user?.email || user?.id} />
  );
}
