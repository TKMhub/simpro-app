import { prisma } from "@/lib/db/prisma";
import { getCurrentProfile } from "@/app/_actions/user";
import { notFound, redirect } from "next/navigation";
import AdminChatClient from "./client";

type Props = { params: Promise<{ threadId: string }> };

export default async function AdminContactDetailPage({ params }: Props) {
  const { threadId } = await params;
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN")) {
      redirect("/");
  }

  const thread = await prisma.contactThread.findUnique({
    where: { id: threadId },
    include: {
      user: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
           user: true
        }
      },
    },
  });

  if (!thread) return notFound();

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="mb-4">
          <h1 className="text-2xl font-bold">{thread.subject || "No Subject"}</h1>
          <div className="flex gap-4 text-sm text-gray-500 mt-1">
             <span>User: {thread.user?.displayName || thread.name || "Anonymous"}</span>
             <span>Email: {thread.user?.email || thread.email || "N/A"}</span>
             <span>Type: {thread.type}</span>
          </div>
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden">
        <AdminChatClient thread={thread as any} adminId={profile.id} />
      </div>
    </div>
  );
}

