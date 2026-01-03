"use server";

import { prisma } from "@/lib/db/prisma";
import { getCurrentProfile } from "@/app/_actions/user";
import { RequestType } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";

export async function submitDevelopmentRequest(data: {
  type: RequestType;
  background: string;
  requirements?: string;
  deadline?: string;
  budget?: string;
}) {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Unauthorized");

  const request = await prisma.developmentRequest.create({
    data: {
      userId: profile.id,
      type: data.type,
      background: data.background,
      requirements: data.requirements,
      deadline: data.deadline,
      budget: data.budget,
      status: "PENDING",
    },
  });

  // TODO: Notify admin via email
  console.log(`New development request created: ${request.id}`);

  revalidatePath("/admin/requests");
  return request;
}

