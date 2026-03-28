"use server"

import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
 
export const deleteArticle = async (articleId: string) => {
    await db.delete(articles).where(eq(articles.id, articleId));
    revalidatePath("/dashboard");
}