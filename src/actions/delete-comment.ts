"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Find the comment to check ownership
  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
    with: {
      article: true,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  // Authorization: User must be the author of the comment OR the author of the article
  const isCommentAuthor = comment.authorId === userId;
  const isArticleAuthor = comment.article?.authorId === userId;

  if (!isCommentAuthor && !isArticleAuthor) {
    throw new Error("You are not authorized to delete this comment");
  }

  await db.delete(comments).where(eq(comments.id, commentId));

  revalidatePath("/dashboard/comments");
  revalidatePath(`/articles/${comment.articleId}`);
  
  return { success: true };
}
