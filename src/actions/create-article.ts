"use server";
import { db } from "@/db";
import { articles, users, articleImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createArticleSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(3).max(50),
  content: z.string().min(10),
});

type CreateArticleFormState = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
};

export const createArticles = async (
  prevState: CreateArticleFormState,
  formData: FormData
): Promise<CreateArticleFormState> => {
  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // ✅ Get Session and check authentication
  const session = await auth();

  if (!session?.user?.email) {
    return {
      errors: {
        formErrors: ["You have to login first"],
      },
    };
  }

  // ✅ Find the actual user using `email`
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!existingUser) {
    return {
      errors: {
        formErrors: [
          "User not found. Please register before creating an article.",
        ],
      },
    };
  }

  // ✅ Handle main image upload properly (Supports File or URL)
  const imageFile = formData.get("featuredImage") as File | null;
  const featuredImageUrlInput = formData.get("featuredImageUrl") as string | null;
  let imageUrl = "";

  if (imageFile && imageFile.name !== "undefined" && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      }
    );
    imageUrl = uploadResult?.secure_url || "";
  } else if (featuredImageUrlInput && featuredImageUrlInput.startsWith("http")) {
    // Fetch image from URL and upload to Cloudinary
    try {
      const response = await fetch(featuredImageUrlInput);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: UploadApiResponse | undefined = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        }
      );
      imageUrl = uploadResult?.secure_url || "";
    } catch (error) {
      console.error("Failed to fetch/upload image from URL:", error);
    }
  }

  if (!imageUrl) {
    return {
      errors: {
        featuredImage: ["Image file or valid URL is required."],
      },
    };
  }

  try {
    const articleId = crypto.randomUUID();
    // ✅ Use Drizzle to create the article
    await db.insert(articles).values({
      id: articleId,
      title: result.data.title,
      category: result.data.category,
      content: result.data.content,
      featuredImage: imageUrl,
      authorId: existingUser.id,
    });

    // ✅ Handle additional images (LinkedIn-style)
    const additionalImages = formData.getAll("additionalImages") as File[];
    
    for (const file of additionalImages) {
      if (file && file.size > 0 && file.name !== "undefined") {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult: UploadApiResponse | undefined = await new Promise(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(buffer);
          }
        );

        if (uploadResult?.secure_url) {
          await db.insert(articleImages).values({
            id: crypto.randomUUID(),
            articleId: articleId,
            imageUrl: uploadResult.secure_url,
          });
        }
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["Some internal server error occurred."],
        },
      };
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
};
