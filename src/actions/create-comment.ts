"use server"
import { auth } from "@/auth";
import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCommentSchema = z.object({
    body: z.string().min(1)
});

type CreateCommentFormState = {
    errors: {
        body?: string[];
        formErrors?: string[];
    };
};

export const createComments = async (
    articleId: string,
    prevState: CreateCommentFormState,
    formData: FormData
): Promise<CreateCommentFormState> => {
    const result = createCommentSchema.safeParse({
        body: formData.get('body') as string
    });
    
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const session = await auth();
    if (!session?.user?.email) {
        return {
            errors: {
                formErrors: ['You have to login first']
            }
        }
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, session.user.email)
    });

    if (!existingUser) {
        return {
            errors: {
                formErrors: ["User not found. Please register before adding comment."],
            },
        };
    }

    try {
        await db.insert(comments).values({
            id: crypto.randomUUID(),
            body: result.data.body,
            authorId: existingUser.id,
            articleId: articleId,
            parentId: formData.get('parentId') as string | undefined
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                errors: {
                    formErrors: [error.message]
                }
            }
        } else {
            return {
                errors: {
                    formErrors: ['Some internal server error while creating comment']
                }
            }
        }
    }
    
    revalidatePath(`/articles/${articleId}`);
    return { errors: {} }
}