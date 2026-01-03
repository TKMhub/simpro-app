"use client";

import { useState, useRef, useEffect } from "react";
import { ContactThread, ContactMessage, Profile } from "@/lib/generated/prisma";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "@/app/_actions/contact";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type FullThread = ContactThread & {
    messages: (ContactMessage & { user: Profile | null })[];
    user: Profile | null;
};

export default function AdminChatClient({ thread, adminId }: { thread: FullThread, adminId: string }) {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (scrollRef.current) {
             const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
             if (scrollContainer) {
                 scrollContainer.scrollTop = scrollContainer.scrollHeight;
             }
        }
    }, [thread.messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        try {
            await sendMessage(thread.id, input);
            setInput("");
            router.refresh();
        } catch (e) {
            toast.error("Failed to send message");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-6">
                    {thread.messages.map((msg) => {
                        const isAdmin = msg.isAdminResponse;
                        // Use msg.user for user info, or fallback to thread user/name
                        const name = isAdmin ? "Admin" : (msg.user?.displayName || thread.name || "User");
                        const avatar = isAdmin ? null : (msg.user?.avatarUrl || null);

                        return (
                            <div key={msg.id} className={cn("flex gap-3", isAdmin ? "flex-row-reverse" : "flex-row")}>
                                <Avatar className="h-8 w-8 mt-1 border">
                                    <AvatarImage src={avatar || undefined} />
                                    <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                    "flex flex-col max-w-[70%]",
                                    isAdmin ? "items-end" : "items-start"
                                )}>
                                    <div className="text-xs text-gray-500 mb-1 px-1">{name} • {format(new Date(msg.createdAt), "MM/dd HH:mm")}</div>
                                    <div className={cn(
                                        "p-4 rounded-2xl whitespace-pre-wrap text-sm shadow-sm",
                                        isAdmin 
                                            ? "bg-blue-600 text-white rounded-tr-sm" 
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-950">
                <div className="flex gap-2 items-end max-w-4xl mx-auto">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Reply as Admin..."
                        className="bg-white dark:bg-gray-900 min-h-[60px]"
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-[60px] px-6">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

