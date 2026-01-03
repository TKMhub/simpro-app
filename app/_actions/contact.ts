"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { ContactType, ContactStatus } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/mail";

// --- Contact Actions ---

type CreateContactData = {
  type: ContactType;
  subject?: string;
  email?: string;
  name?: string;
};

export async function createContactThread(data: CreateContactData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Chat requires login
  if (data.type === "CHAT" && !user) {
    throw new Error("Login required for chat");
  }

  const thread = await prisma.contactThread.create({
    data: {
      userId: user?.id || null, // Optional
      type: data.type,
      subject: data.subject,
      email: data.email,
      name: data.name,
      status: "OPEN",
    },
  });

  // Notify Admin
  const adminEmail = process.env.ADMIN_EMAIL || "simpro201010@gmail.com";
  
  // For new thread creation
  const subjectText = data.subject || "No Subject";
  const typeText = data.type === "CHAT" ? "チャット" : "メールフォーム";
  
  await sendMail({
    to: adminEmail,
    subject: `[Simplo] 新しいお問い合わせ (${typeText}): ${subjectText}`,
    text: `
新しいお問い合わせがありました。

タイプ: ${typeText}
件名: ${subjectText}
名前: ${data.name || "N/A"}
メール: ${data.email || "N/A"}
ID: ${thread.id}

管理画面で確認:
${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts/${thread.id}
    `,
  });

  revalidatePath("/admin/contacts");
  return thread;
}

export async function sendMessage(threadId: string, content: string, attachments: string[] = []) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // For now, only logged in users can reply in chat. 
  // Email forms are one-off or handled via email client (admin -> user email).
  // But if we want anonymous replies, we need a session token or similar.
  // Assuming this action is mainly for CHAT or Admin replies.
  
  // If user is not logged in, they can't send messages to an existing thread via this action currently.
  // Except if we implement a token based access for email threads, but that's complex.
  // For anonymous email form, the initial creation includes the message content usually.
  
  // Let's modify createContactThread to accept initial message content for email forms.
  
  if (!user) throw new Error("Unauthorized to reply");

  // Check if user is owner or admin
  const thread = await prisma.contactThread.findUnique({
    where: { id: threadId },
    include: { user: true },
  });

  if (!thread) throw new Error("Thread not found");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  const isAdmin = profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN";

  if (thread.userId !== user.id && !isAdmin) {
    throw new Error("Unauthorized");
  }

  const message = await prisma.contactMessage.create({
    data: {
      threadId,
      userId: user.id,
      content,
      attachments,
      isAdminResponse: isAdmin,
    },
  });

  // Notify (Email)
  const adminEmail = process.env.ADMIN_EMAIL || "simpro201010@gmail.com";
  
  if (!isAdmin) {
      // User sent a message -> Notify Admin
      await sendMail({
        to: adminEmail,
        subject: `[Simplo] 新着メッセージ: ${thread.subject || "チャット"}`,
        text: `
ユーザーから新しいメッセージが届きました。

内容:
${content}

スレッドID: ${threadId}
管理画面で確認:
${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts/${threadId}
        `,
      });
  } else {
      // Admin sent a message -> Notify User (if email exists)
      // Check if thread has email or associated user has email
      let userEmail = thread.email;
      if (!userEmail && thread.userId) {
          const threadUser = await prisma.profile.findUnique({ where: { id: thread.userId } });
          userEmail = threadUser?.email;
      }

      if (userEmail) {
          await sendMail({
            to: userEmail,
            subject: `[Simplo] お問い合わせへの返信`,
            text: `
お問い合わせありがとうございます。
以下のメッセージが届きました。

----------------
${content}
----------------

ご確認はこちら:
${process.env.NEXT_PUBLIC_APP_URL}/contact
            `,
          });
      }
  }

  revalidatePath(`/contact`);
  revalidatePath(`/admin/contacts/${threadId}`);
  
  return message;
}

// Helper to create thread AND message for anonymous users
export async function createContactWithFirstMessage(
  data: CreateContactData, 
  content: string
) {
   const thread = await createContactThread(data);
   
   // Create message without userId if anonymous
   await prisma.contactMessage.create({
     data: {
       threadId: thread.id,
       userId: thread.userId, // null if anonymous
       content,
       isAdminResponse: false,
     }
   });
   
   return thread;
}

export async function getMyThreads() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return await prisma.contactThread.findMany({
    where: { userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getThreadDetails(threadId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const thread = await prisma.contactThread.findUnique({
    where: { id: threadId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { user: true },
      },
      user: true,
    },
  });

  if (!thread) return null;

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  const isAdmin = profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN";

  if (thread.userId !== user.id && !isAdmin) {
    return null; // Unauthorized
  }

  return thread;
}
