"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitDevelopmentRequest } from "@/app/_actions/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RequestType } from "@/lib/generated/prisma";

export default function NewRequestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "WEB" as RequestType,
    background: "",
    requirements: "",
    deadline: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.background) {
      toast.error("背景・目的は必須です");
      return;
    }

    setIsLoading(true);
    try {
      await submitDevelopmentRequest(formData);
      toast.success("依頼を受け付けました。管理画面またはメールにてご連絡いたします。");
      router.push("/contact"); // Redirect to contact or dashboard
    } catch (error) {
      toast.error("送信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">開発依頼・相談</CardTitle>
          <CardDescription>
            以下のフォームにご記入ください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>依頼種別</Label>
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData({...formData, type: v as RequestType})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEB">Webアプリケーション開発</SelectItem>
                  <SelectItem value="TOOL">業務ツール・自動化</SelectItem>
                  <SelectItem value="CONSULTATION">相談・その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>背景・目的 (必須)</Label>
              <Textarea
                placeholder="解決したい課題や、作りたいものの概要をご記入ください"
                value={formData.background}
                onChange={(e) => setFormData({...formData, background: e.target.value})}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>要件・機能 (任意)</Label>
              <Textarea
                placeholder="具体的な機能や要件があればご記入ください"
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>希望納期 (任意)</Label>
                <Input
                  placeholder="例: 2026年3月末"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>予算感 (任意)</Label>
                <Input
                  placeholder="例: 50~100万円"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                送信する
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

