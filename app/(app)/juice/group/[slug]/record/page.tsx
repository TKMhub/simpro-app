import { getJuiceProject } from '@/lib/juice/actions';
import RecordClient from '@/components/juice/RecordClient';
import { notFound } from 'next/navigation';

export default async function RecordPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = await getJuiceProject(params.slug);
  
  if (!project) {
    return notFound();
  }

  return <RecordClient project={project} />;
}
