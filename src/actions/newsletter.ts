"use server";

import { db } from "@/db";
import { newsletters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const EmailSchema = z.string().email("Invalid email address");

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  
  try {
    const validatedEmail = EmailSchema.parse(email);
    
    // Check if already subscribed
    const existing = await db.query.newsletters.findFirst({
        where: eq(newsletters.email, validatedEmail)
    });

    if (existing) {
        return { error: "You're already subscribed! 🚀" };
    }

    await db.insert(newsletters).values({
        email: validatedEmail
    });

    return { success: "Welcome to the squad! Check your inbox soon. ✨" };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        return { error: error.errors[0].message };
    }
    return { error: "Something went wrong. Please try again." };
  }
}
