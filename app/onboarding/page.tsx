"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitOnboarding } from "./actions";
import { createClient } from "@/lib/supabase/client";

function Meteors() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute right-0 top-0 bottom-0 w-full h-full">
         <span className="meteor" style={{ top: "10%", left: "80%", "--dur": "2.5s", "--delay": "0s", "--size": "2px", "--angle": "-15deg", "--color": "#1d4ed8" } as any} />
         <span className="meteor" style={{ top: "40%", left: "60%", "--dur": "3.5s", "--delay": "1s", "--size": "2px", "--angle": "-15deg", "--color": "#ffffff" } as any} />
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnTo") || "/login";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    try {
        let avatarUrl = "";

        // Upload Avatar if selected
        if (avatarFile) {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    alert('画像のアップロードに失敗しました');
                    setIsLoading(false);
                    return;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName);
                
                avatarUrl = publicUrl;
            }
        }

        // Add extra data to FormData
        formData.append("returnUrl", returnUrl);
        if (avatarUrl) {
            formData.append("avatarUrl", avatarUrl);
        }

        await submitOnboarding(formData);
    } catch (e) {
        console.error(e);
        alert('登録処理中にエラーが発生しました');
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-black relative overflow-hidden">
      
      <div
        className={cn(
          "relative w-full max-w-md rounded-3xl overflow-hidden",
          "backdrop-blur-xl backdrop-saturate-150",
          "bg-[var(--cover-glass-bg)] ring-1 ring-[var(--glass-border)] shadow-2xl shadow-black/10"
        )}
      >
        <Meteors />

        <div className="relative z-10 p-8 sm:p-10 flex flex-col items-center">
          
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="relative w-32 h-10 mb-2">
               <Image 
                 src="/Simplo_white_blue.svg" 
                 alt="Simplo" 
                 fill 
                 className="object-contain"
                 priority
               />
            </div>
            <h1 className="text-xl font-bold text-zinc-800 dark:text-white">プロフィール登録</h1>
            <p className="text-sm text-center text-zinc-500 dark:text-[var(--cover-foreground)]/80">
              あなたについて教えてください
            </p>
          </div>

          <div className="w-full space-y-4">
            <form action={handleSubmit} className="space-y-6">
              
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3">
                <div 
                    className="relative w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {previewUrl ? (
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    ) : (
                        <Camera className="w-8 h-8 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                />
                <span className="text-xs text-zinc-500">プロフィール画像 (任意)</span>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  表示名 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="例: たくみ"
                  required
                  className={cn(
                      "h-12 rounded-xl border-zinc-200/50 bg-white/50 backdrop-blur-sm",
                      "focus:bg-white focus:ring-2 focus:ring-blue-500/20",
                      "dark:border-zinc-700/50 dark:bg-zinc-900/50 dark:focus:bg-zinc-900",
                      "transition-all duration-200"
                  )}
                  disabled={isLoading}
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  自己紹介 (任意)
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="例: エンジニアをしています。"
                  className={cn(
                      "min-h-[100px] rounded-xl border-zinc-200/50 bg-white/50 backdrop-blur-sm resize-none",
                      "focus:bg-white focus:ring-2 focus:ring-blue-500/20",
                      "dark:border-zinc-700/50 dark:bg-zinc-900/50 dark:focus:bg-zinc-900",
                      "transition-all duration-200"
                  )}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className={cn(
                    "w-full h-12 text-base rounded-xl mt-2",
                    "bg-blue-600 hover:bg-blue-700 text-white",
                    "shadow-lg shadow-blue-500/20",
                    "transition-all duration-200"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  "登録して完了"
                )}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center">
             <p className="text-xs text-zinc-400 dark:text-zinc-500">
               登録後、再度ログイン画面へ移動します。
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
