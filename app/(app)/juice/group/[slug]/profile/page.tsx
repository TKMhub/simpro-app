import { getJuiceProject } from '@/lib/juice/actions';
import ProfileClient from '@/components/juice/ProfileClient';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';

export default async function ProfilePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = await getJuiceProject(params.slug);
  
  if (!project) {
    return notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If not logged in, we can't identify "me" easily in this simple implementation.
    // In a real app, we might check a cookie.
    // For now, redirect to login or show error.
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-xl font-bold mb-4">ログインが必要です</h1>
            <p className="text-slate-500 mb-6">プロフィールの編集にはログインが必要です。</p>
            <a href="/login" className="px-6 py-3 bg-cyan-500 text-white rounded-full font-bold">ログインする</a>
        </div>
    );
  }

  const member = project.members.find(m => m.userId === user.id);

  if (!member) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-xl font-bold mb-4">メンバーが見つかりません</h1>
            <p className="text-slate-500 mb-6">このグループに参加していません。</p>
            <a href={`/juice/group/${params.slug}`} className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold">グループに戻る</a>
        </div>
      );
  }

  return <ProfileClient projectSlug={params.slug} member={member} />;
}
