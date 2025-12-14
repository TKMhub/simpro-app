import { getJuiceProject } from '@/lib/juice/actions';
import RecordClient from '@/components/juice/RecordClient';
import { notFound } from 'next/navigation';

export default async function RecordPage(props: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ matchId?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const project = await getJuiceProject(params.slug);
  
  if (!project) {
    return notFound();
  }

  const matchId = searchParams.matchId;
  const initialMatch = matchId ? project.matches.find(m => m.id === matchId) : undefined;

  return <RecordClient project={project} initialMatch={initialMatch} />;
}
