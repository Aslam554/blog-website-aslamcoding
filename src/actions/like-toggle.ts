"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { likes, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleLike(articleId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("You must be logged in to like");
  }

  // Ensure the user exists in the database
  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error("User does not exist in the database.");
  }

  // Check if the user has already liked the article
  const existingLike = await db.query.likes.findFirst({
    where: and(eq(likes.articleId, articleId), eq(likes.userId, user.id)),
  });

  if (existingLike) {
    // Unlike the article
    await db.delete(likes).where(eq(likes.id, existingLike.id));
  } else {
    // Like the article
    await db.insert(likes).values({
      id: crypto.randomUUID(),
      articleId,
      userId: user.id,
    });
  }

  // Return updated like count
  revalidatePath(`/article/${articleId}`);
}
