import { users } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function flagUser(userId: string) {
  try {
    await db
      .update(users)
      .set({ status: "flagged" })
      .where(eq(users.id, userId));

    revalidatePath("/control-panel");
    return { success: true };
  } catch (error) {
    console.error("[USER_FLAGGING_ERROR]:", error);
    return { success: false, data: [], error: "Failed to flag user" };
  }
}

export async function suspendUser(userId: string) {
  try {
    await db
      .update(users)
      .set({ status: "suspended" })
      .where(eq(users.id, userId));

    revalidatePath("/control-panel");
    return { success: true };
  } catch (error) {
    console.error("[USER_SUSPENDING_ERROR]:", error);
    return { success: false, data: [], error: "Failed to suspend user" };
  }
}

export async function reactivateUser(userId: string) {
  try {
    await db
      .update(users)
      .set({ status: "active" })
      .where(eq(users.id, userId));

    revalidatePath("/control-panel");
    return { success: true };
  } catch (error) {
    console.error("[USER_REACTIVATING_ERROR]:", error);
    return { success: false, data: [], error: "Failed to reactivate user" };
  }
}
