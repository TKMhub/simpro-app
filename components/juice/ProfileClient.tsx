'use client';

import { useState } from 'react';
import { ArrowLeft, Save, User, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateMemberProfile, uploadAvatar } from '@/lib/juice/actions';
import { toast } from 'sonner';
import Image from 'next/image';

type Props = {
  projectSlug: string;
  member: {
    id: string;
    name: string;
    avatarUrl: string | null;
    userId: string | null;
  };
};

export default function ProfileClient({ projectSlug, member }: Props) {
  const router = useRouter();
  const [nickname, setNickname] = useState(member.name);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(member.avatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Upload
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await uploadAvatar(formData);
        if (res.success && res.publicUrl) {
          setAvatarUrl(res.publicUrl);
          toast.success('画像をアップロードしました');
        } else {
          toast.error('画像のアップロードに失敗しました');
          console.error(res.error);
        }
      } catch (err) {
        console.error(err);
        toast.error('アップロードエラー');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (isSaving || isUploading) return;
    setIsSaving(true);
    
    // Check if we should sync to global profile (only if user is linked)
    // For now, always sync if linked.
    const syncToGlobal = !!member.userId;

    try {
      const res = await updateMemberProfile(member.id, projectSlug, nickname, avatarUrl, syncToGlobal);
      if (res.success) {
        toast.success('プロフィールを更新しました');
        router.push(`/juice/group/${projectSlug}`);
      } else {
        toast.error('更新に失敗しました');
        console.error(res.error);
      }
    } catch (e) {
      console.error(e);
      toast.error('エラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="flex items-center px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <Link href={`/juice/group/${projectSlug}`} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 text-lg font-bold text-slate-800 dark:text-white">プロフィール設定</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        <section className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>
            <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-600 transition-colors shadow-md ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploading ? <span className="animate-spin text-white text-xs">...</span> : <Camera className="w-5 h-5 text-white" />}
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
            </label>
          </div>
          <p className="text-xs text-slate-400">
            {member.userId ? 'Simproアカウントと連携中' : 'ゲストメンバー'}
          </p>
        </section>

        <section>
          <label htmlFor="nickname" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            Nickname
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full text-lg font-bold p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-cyan-400 focus:outline-none shadow-sm text-slate-900 dark:text-white transition-colors"
          />
          {member.userId && (
            <p className="mt-2 text-xs text-slate-400">
              ※ここで変更すると、他のSimproアプリ（Zaikoなど）のプロフィールも更新されます。
            </p>
          )}
        </section>
      </main>

      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-[430px] pointer-events-auto">
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center space-x-2 text-lg disabled:opacity-70"
          >
            {isSaving ? <span className="animate-spin">⏳</span> : <Save className="w-5 h-5" />}
            <span>保存する</span>
          </button>
        </div>
      </div>
    </div>
  );
}

