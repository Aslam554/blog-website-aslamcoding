"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { commentLikes, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleCommentLike(commentId: string, articleId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("You must be logged in to like a comment");
  }

  // Ensure the user exists in the database
  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error("User does not exist in the database.");
  }

  // Check if the user has already liked the comment
  const existingLike = await db.query.commentLikes.findFirst({
    where: and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, user.id)),
  });

  if (existingLike) {
    // Unlike the comment
    await db.delete(commentLikes).where(eq(commentLikes.id, existingLike.id));
  } else {
    // Like the comment
    await db.insert(commentLikes).values({
      id: crypto.randomUUID(),
      commentId,
      userId: user.id,
    });
  }

  revalidatePath(`/articles/${articleId}`);
}
