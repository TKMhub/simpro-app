'use client';

import { useState } from 'react';
import { ArrowLeft, Save, User, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [nickname, setNickname] = useState('自分');
  const [avatar, setAvatar] = useState(null);

  const handleSave = () => {
    console.log({ nickname, avatar });
    // In a real app, you'd save this data
    router.push(`/juice/group/${params.slug}`);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="flex items-center px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <Link href={`/juice/group/${params.slug}`} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="ml-2 text-lg font-bold text-slate-800 dark:text-white">プロフィール設定</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        {/* Avatar Section */}
        <section className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-600 transition-colors">
              <Camera className="w-5 h-5 text-white" />
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </section>

        {/* Nickname Section */}
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
        </section>
      </main>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-[430px] pointer-events-auto">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center space-x-2 text-lg"
          >
            <Save className="w-5 h-5" />
            <span>保存する</span>
          </button>
        </div>
      </div>
    </div>
  );
}
