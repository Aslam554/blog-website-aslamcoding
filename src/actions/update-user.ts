"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  await db.update(users)
    .set({ 
        name,
        bio,
    })
    .where(eq(users.id, userId));

  revalidatePath("/dashboard/settings");
  
  return { success: true };
}
