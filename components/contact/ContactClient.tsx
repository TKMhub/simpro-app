"use client";

import { useState, useEffect } from "react";
import { ContactThread, ContactMessage, ContactType, Profile } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createContactWithFirstMessage, sendMessage, getThreadDetails } from "@/app/_actions/contact";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Loader2, Send, Plus, MessageSquare, Mail, LogIn, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Define generic types that match the Prisma return types used
type ThreadWithMessages = ContactThread & {
  messages: ContactMessage[];
};

type FullThread = ContactThread & {
  messages: (ContactMessage & { user: Profile })[];
  user: Profile;
};

export default function ContactClient({ 
  initialThreads, 
  userId 
}: { 
  initialThreads: ThreadWithMessages[], 
  userId: string | null
}) {
  const [threads, setThreads] = useState<ThreadWithMessages[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeDetails, setActiveDetails] = useState<FullThread | null>(null);
  const [input, setInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const router = useRouter();

  // Handle desktop auto-select
  useEffect(() => {
    if (window.innerWidth >= 768 && !activeThreadId && !isCreating && initialThreads.length > 0) {
        setActiveThreadId(initialThreads[0].id);
    }
  }, []);

  const showMobileContent = !!(activeThreadId || isCreating);

  // Create form state
  const [newSubject, setNewSubject] = useState("");
  const [newType, setNewType] = useState<ContactType | "X_DM">("X_DM");
  const [initialMessage, setInitialMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactName, setContactName] = useState("");

  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
    if (activeThreadId && !isCreating && userId) {
      setIsLoadingMessages(true);
      getThreadDetails(activeThreadId).then((data) => {
        if (data) setActiveDetails(data as unknown as FullThread);
        setIsLoadingMessages(false);
      });
    }
  }, [activeThreadId, isCreating, userId]);

  // Handlers
  const handleCreate = async () => {
    // Validation
    if (newType === "X_DM") return;
    if (newType === "CHAT" && !userId) {
      router.push("/login?returnUrl=/contact");
      return;
    }
    if (newType === "EMAIL_FORM" && !contactEmail && !userId) {
      toast.error("メールアドレスは必須です");
      return;
    }
    if (!initialMessage) {
        toast.error("メッセージを入力してください");
        return;
    }

    setIsLoading(true);
    try {
      const thread = await createContactWithFirstMessage({
        type: newType,
        subject: newSubject,
        email: contactEmail,
        name: contactName
      }, initialMessage);

      if (newType === "EMAIL_FORM" && !userId) {
          toast.success("お問い合わせを受け付けました。確認メールをお送りします。");
          setNewSubject("");
          setInitialMessage("");
          setContactEmail("");
          setContactName("");
          // Reset view
          setIsCreating(false);
          // If not logged in, we can't show the thread in the list as we don't track session anonymously yet
          // So just show success state or remain on "create new"
          return;
      }

      setThreads([ { ...thread, messages: [] }, ...threads ]);
      setActiveThreadId(thread.id);
      setIsCreating(false);
      setNewSubject("");
      setInitialMessage("");
      setContactEmail("");
      setContactName("");
      router.refresh(); 
    } catch (e) {
      toast.error("作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!activeThreadId || !input.trim() || !userId) return;
    const content = input;
    setInput("");
    
    // Optimistic update
    const tempMsg: any = {
      id: "temp-" + Date.now(),
      content,
      createdAt: new Date(),
      userId,
      user: { id: userId, avatarUrl: null, displayName: "Me" }, // partial mock
      isAdminResponse: false
    };
    
    if (activeDetails) {
        setActiveDetails({
            ...activeDetails,
            messages: [...activeDetails.messages, tempMsg]
        });
    }

    try {
      await sendMessage(activeThreadId, content);
      // Refetch to be sure or keep optimistic
      const updated = await getThreadDetails(activeThreadId);
      if (updated) setActiveDetails(updated as unknown as FullThread);
      router.refresh();
    } catch (e) {
      toast.error("送信に失敗しました");
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Sidebar List (Only visible if logged in and has threads) */}
      {userId && (
        <div className={cn(
            "w-full md:w-80 flex-col gap-4 border-r border-border pr-6",
            showMobileContent ? "hidden md:flex" : "flex"
        )}>
            <Button onClick={() => setIsCreating(true)} className="w-full shadow-sm bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
              <Plus className="mr-2 h-4 w-4" /> 新しい問い合わせ
            </Button>
            <ScrollArea className="flex-1 -mr-4 pr-4">
            <div className="flex flex-col gap-2">
                {threads.map(thread => (
                <div
                    key={thread.id}
                    onClick={() => {
                    setActiveThreadId(thread.id);
                    setIsCreating(false);
                    }}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer group",
                      activeThreadId === thread.id && !isCreating 
                        ? "bg-muted border-border shadow-sm" 
                        : "hover:bg-accent border-transparent hover:border-border"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "font-bold text-xs flex items-center gap-1.5 px-2 py-0.5 rounded-full",
                      thread.type === "CHAT" 
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                    )}>
                        {thread.type === "CHAT" ? <MessageSquare size={12} /> : <Mail size={12} />}
                        {thread.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                        {format(new Date(thread.updatedAt), "MM/dd")}
                    </span>
                    </div>
                    {thread.subject && <div className="text-sm font-bold mb-1 truncate text-foreground">{thread.subject}</div>}
                    <div className="text-xs text-muted-foreground truncate leading-relaxed">
                    {thread.messages[0]?.content || "No messages"}
                    </div>
                </div>
                ))}
            </div>
            </ScrollArea>
        </div>
      )}

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col h-full",
        !userId && "max-w-2xl mx-auto w-full items-center justify-center py-8",
        userId && !showMobileContent ? "hidden md:flex" : "flex"
      )}>
        {(isCreating || (!userId && threads.length === 0)) ? (
          <div className={cn(
            "w-full h-fit flex flex-col gap-6 rounded-xl py-6",
            !userId && "max-w-xl"
          )}>
            <div className="pb-4 border-b border-border flex items-center gap-2">
              {userId && (
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsCreating(false)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                  <h2 className="text-2xl font-bold tracking-tight">お問い合わせ</h2>
                  <p className="text-muted-foreground mt-1">
                    ご質問、ご要望などお気軽にお送りください。
                  </p>
              </div>
            </div>
            <div className="space-y-6">
              <Tabs defaultValue={newType} onValueChange={(v) => setNewType(v as ContactType | "X_DM")} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted p-1 rounded-full">
                  <TabsTrigger 
                    value="X_DM"
                    className="rounded-full data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-100 dark:data-[state=active]:text-zinc-900 transition-colors"
                  >
                    X (DM)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="CHAT"
                    className="rounded-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 transition-colors"
                  >
                    チャット
                  </TabsTrigger>
                  <TabsTrigger 
                    value="EMAIL_FORM"
                    className="rounded-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 transition-colors"
                  >
                    メールフォーム
                  </TabsTrigger>
                </TabsList>

                <div className="min-h-[420px]">
                {newType === "X_DM" ? (
                   <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 h-full min-h-[400px] border rounded-lg bg-card border-border">
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full">
                        <div className="relative w-8 h-8">
                          <Image 
                            src="/icons/x.svg" 
                            alt="X" 
                            fill 
                            className="object-contain dark:invert" 
                          />
                        </div>
                      </div>
                      <div className="max-w-md space-y-2">
                        <h3 className="font-bold text-xl">X (旧Twitter) DM</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Xのダイレクトメッセージからもお問い合わせいただけます。<br/>
                          お気軽にご連絡ください。
                        </p>
                      </div>
                      <Button asChild size="lg" className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                          <a href="https://x.com/simpro_app" target="_blank" rel="noopener noreferrer">
                              DMを送る
                          </a>
                      </Button>
                   </div>
                ) : newType === "CHAT" && !userId ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/50 rounded-lg border border-border min-h-[400px]">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <LogIn className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">ログインが必要です</h3>
                        <p className="text-sm text-muted-foreground">チャット機能を利用してリアルタイムにやり取りするにはログインしてください。</p>
                      </div>
                      <Button onClick={() => router.push("/login?returnUrl=/contact")} className="w-full max-w-xs mt-2" variant="default">
                          ログインページへ
                      </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={cn(
                      "border p-3 rounded-lg text-xs mb-4 flex gap-2 items-center",
                      newType === "CHAT" 
                        ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300"
                        : "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30 text-orange-800 dark:text-orange-400"
                    )}>
                        <span className={cn(
                          "font-bold px-1.5 py-0.5 rounded",
                          newType === "CHAT"
                            ? "bg-blue-200 dark:bg-blue-900/50"
                            : "bg-orange-200 dark:bg-orange-900/50"
                        )}>Note</span>
                        <span>返信にお時間をいただく場合がございます。</span>
                    </div>

                    {newType === "EMAIL_FORM" && !userId && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">お名前</label>
                                <Input 
                                    value={contactName} 
                                    onChange={e => setContactName(e.target.value)} 
                                    placeholder="Simplo 太郎" 
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">メールアドレス <span className="text-red-500">*</span></label>
                                <Input 
                                    value={contactEmail} 
                                    onChange={e => setContactEmail(e.target.value)} 
                                    placeholder="your@email.com" 
                                    type="email"
                                    required
                                    className="bg-background"
                                />
                            </div>
                        </div>
                    )}
                    
                    {newType === "EMAIL_FORM" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">件名</label>
                        <Input 
                            value={newSubject} 
                            onChange={e => setNewSubject(e.target.value)} 
                            placeholder="お問い合わせの件名" 
                            className="bg-background"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">メッセージ <span className="text-red-500">*</span></label>
                      <Textarea 
                        value={initialMessage} 
                        onChange={e => setInitialMessage(e.target.value)} 
                        placeholder="お問い合わせ内容をご記入ください..." 
                        rows={6}
                        className="bg-background resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      {userId && (
                        <Button variant="ghost" onClick={() => setIsCreating(false)}>キャンセル</Button>
                      )}
                      <Button 
                          onClick={handleCreate} 
                          disabled={isLoading || !initialMessage || (newType === "CHAT" && !userId)}
                          className="min-w-[120px]"
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        送信する
                      </Button>
                    </div>
                  </div>
                )}
                </div>
              </Tabs>
            </div>
          </div>
        ) : activeThread && userId ? (
          <div className="flex flex-col h-full relative rounded-2xl overflow-hidden bg-card/60 backdrop-blur-md border border-border shadow-xl">
             <div className="border-b border-border p-4 bg-card/50 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="md:hidden -ml-2 h-8 w-8" onClick={() => setActiveThreadId(null)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-bold flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-full",
                        activeThread.type === "CHAT" 
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    )}>
                        {activeThread.type === "CHAT" ? <MessageSquare size={16} /> : <Mail size={16} />}
                    </div>
                    {activeThread.subject || "チャットでのお問い合わせ"}
                    </h2>
                </div>
                <span className="text-xs font-medium bg-muted px-3 py-1 rounded-full text-muted-foreground">
                  {activeThread.status}
                </span>
             </div>
             
             {isLoadingMessages ? (
                 <div className="flex-1 flex items-center justify-center">
                     <Loader2 className="animate-spin text-muted-foreground" />
                 </div>
             ) : (
                <ScrollArea className="flex-1 p-4 sm:p-6 bg-muted/30">
                    <div className="space-y-6 pb-4">
                        {activeDetails?.messages.map((msg) => {
                            const isMe = msg.userId === userId;
                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                    <Avatar className="h-8 w-8 mt-1 border border-border shadow-sm">
                                        <AvatarImage src={msg.user?.avatarUrl || undefined} />
                                        <AvatarFallback className="text-xs">{msg.user?.displayName?.slice(0,2) || "??"}</AvatarFallback>
                                    </Avatar>
                                    <div className={cn(
                                      "group relative p-4 rounded-2xl max-w-[85%] sm:max-w-[70%] whitespace-pre-wrap text-sm leading-relaxed shadow-sm",
                                      isMe 
                                        ? "bg-blue-600 text-white rounded-tr-sm" 
                                        : "bg-card text-card-foreground border border-border rounded-tl-sm"
                                    )}>
                                        {msg.content}
                                        <div className={cn(
                                          "text-[10px] mt-2 opacity-0 group-hover:opacity-70 transition-opacity absolute bottom-1 right-3",
                                          isMe ? "text-blue-100" : "text-muted-foreground"
                                        )}>
                                            {format(new Date(msg.createdAt), "MM/dd HH:mm")}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
             )}
             
             <div className="mt-auto border-t border-border p-4 bg-card">
                <div className="flex gap-2 items-end max-w-3xl mx-auto">
                  <Textarea 
                     value={input} 
                     onChange={e => setInput(e.target.value)}
                     placeholder="メッセージを入力..."
                     onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                     className="min-h-[50px] max-h-32 bg-muted/50 resize-none py-3"
                  />
                  <Button size="icon" className="h-[50px] w-[50px] shrink-0 rounded-xl" onClick={handleSend} disabled={!input.trim()}>
                     <Send className="h-5 w-5" />
                  </Button>
                </div>
             </div>
          </div>
        ) : (
          <div className="m-auto text-center space-y-3 p-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">お問い合わせを選択</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              左側のリストから履歴を選択するか、「新しい問い合わせ」ボタンから新規作成してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
