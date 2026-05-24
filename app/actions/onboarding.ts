import { profiles, users } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }
  return user.id;
}

export async function saveBasicInfo(data: {
  fullName: string;
  email: string;
  contact: string;
  gender: string;
  dob: string;
}) {
  try {
    const userId = await getAuthenticatedUser();

    //create if missing or update if existing
    await db
      .insert(profiles)
      .values({
        id: userId,
        fullName: data.fullName,
        contact: data.contact,
        gender: data.gender,
        dob: data.dob,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          fullName: data.fullName,
          contact: data.contact,
          gender: data.gender,
          dob: data.dob,
        },
      });
    await db
      .update(users)
      .set({ onboardingStep: "RELIGION" })
      .where(eq(users.id, userId));

    revalidatePath("/onboarding");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
