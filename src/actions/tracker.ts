"use server";

import { db } from "@/db";
import { trackers, trackerLogs } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTracker(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) return { error: "Title is required" };

  try {
    await db.insert(trackers).values({
      userId: session.user.id,
      title,
      description,
    });

    revalidatePath("/dashboard/tracker");
    return { success: "Tracker created successfully" };
  } catch (error) {
    console.error("Error creating tracker:", error);
    return { error: "Failed to create tracker" };
  }
}

export async function addTrackerLog(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const trackerId = formData.get("trackerId") as string;
  const leetcodeCount = parseInt(formData.get("leetcodeCount") as string) || 0;
  const codeforcesCount = parseInt(formData.get("codeforcesCount") as string) || 0;
  const devProgress = formData.get("devProgress") as string;
  const description = formData.get("description") as string;

  if (!trackerId) return { error: "Tracker ID is required" };

  try {
    await db.insert(trackerLogs).values({
      trackerId,
      leetcodeCount,
      codeforcesCount,
      devProgress,
      description,
    });

    revalidatePath("/dashboard/tracker");
    return { success: "Progress logged successfully" };
  } catch (error) {
    console.error("Error logging progress:", error);
    return { error: "Failed to log progress" };
  }
}

export async function getTrackers() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.query.trackers.findMany({
    where: eq(trackers.userId, session.user.id),
    with: {
      logs: {
        orderBy: [desc(trackerLogs.date)],
      },
    },
    orderBy: [desc(trackers.createdAt)],
  });
}

export async function deleteTrackerLog(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await db.delete(trackerLogs).where(eq(trackerLogs.id, id));
    revalidatePath("/dashboard/tracker");
    return { success: "Log deleted" };
  } catch {
    return { error: "Failed to delete log" };
  }
}
