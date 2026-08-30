import { users } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

//ADMIN USER ACTIONS
export async function banUser(userId: string) {
  try {
    await db
      .update(users)
      .set({ status: "banned" })
      .where(eq(users.id, userId));

    revalidatePath("/control-panel/user-management");
    return { success: true };
  } catch (error) {
    console.error("[USER_BANNING_ERROR]:", error);
    return { success: false, data: [], error: "Failed to banned user" };
  }
}

export async function reactivateUser(userId: string) {
  try {
    await db
      .update(users)
      .set({ status: "active" })
      .where(eq(users.id, userId));

    revalidatePath("/control-panel/user-management");
  } catch (error) {
    console.error("[USER_REACTIVATING_ERROR]:", error);
    return { success: false, data: [], error: "Failed to reactivate user" };
  }
}
