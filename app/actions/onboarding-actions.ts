"use server";

import { db } from "@/lib/db";
import { users, profiles } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const NEXT_STEP_POINTER = {
  1: "RELIGION",
  2: "ACHIEVEMENTS",
  3: "LOCATION",
  4: "PERSONAL",
  5: "HOBBIES",
  6: "COMPLETED",
} as const;

// type OnboardingStepPointerValue =
//   (typeof NEXT_STEP_POINTER)[keyof typeof NEXT_STEP_POINTER];

export async function syncOnboardingProgressAction(
  stepNumber: number,
  payload: Record<string, any>,
  targetUserId?: string,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authedUser },
    } = await supabase.auth.getUser();

    if (!authedUser) throw new Error("Unauthorized mutations rejected");

    let userIdToUpdate = authedUser.id;

    if (targetUserId) {
      // Security Check: Optional step to check if authedUser has role === 'admin'
      // if (authedUser.user_metadata?.role !== "admin") throw new Error("Forbidden");
      userIdToUpdate = targetUserId;
    }
    let updatePayload: Record<string, any> = {};

    if (stepNumber === 1) {
      const rawDob = payload.dob;
      const parsedDate =
        rawDob && !isNaN(Date.parse(rawDob)) ? new Date(rawDob) : null;

      updatePayload = {
        createdBy: payload.createdBy,
        fullName: payload.fullName,
        contact: payload.contact,
        gender: payload.gender,
        dob: parsedDate,
        age: payload.age,
        profilePic: payload.profilePic,
      };
    } else if (stepNumber === 2) {
      updatePayload = {
        religion: payload.religion,
        caste: payload.caste,
        motherTongue: payload.motherTongue,
      };
    } else if (stepNumber === 3) {
      updatePayload = {
        educationLevel: payload.educationLevel,
        profession: payload.profession,
        annualIncomeRange: payload.annualIncomeRange,
      };
    } else if (stepNumber === 4) {
      updatePayload = {
        country: payload.country,
        state: payload.state,
        city: payload.city,
        residencyStatus: payload.residencyStatus,
      };
    } else if (stepNumber === 5) {
      updatePayload = {
        height: payload.height,
        weight: payload.weight,
        narrative: payload.narrative,
        smoking: payload.smoking,
        drinking: payload.drinking,
        foodPreferences: payload.foodPreferences,
        isDifferentlyAbled:
          payload.isDifferentlyAbled === true ||
          payload.isDifferentlyAbled === "yes",
        differentlyAbledDetails: payload.differentlyAbledDetails,
      };
    } else if (stepNumber === 6) {
      updatePayload = {
        hobbies: Array.isArray(payload.hobbies) ? payload.hobbies : [],
      };
    }

    const existingRecord = await db.query.profiles.findFirst({
      where: and(eq(profiles.userId, userIdToUpdate)),
    });

    let returnedProfileId = existingRecord?.id;

    if (existingRecord) {
      await db
        .update(profiles)
        .set({ ...updatePayload, updatedAt: new Date() })
        .where(and(eq(profiles.userId, userIdToUpdate)));
    } else {
      const [insertedRow] = await db
        .insert(profiles)
        .values({
          userId: userIdToUpdate,
          ...updatePayload,
          status: "pending",
        })
        .returning({ id: profiles.id });

      if (!insertedRow) {
        throw new Error("Failed to capture returned inserted row ID.");
      }

      returnedProfileId = insertedRow.id;
    }

    const nextProgressString =
      NEXT_STEP_POINTER[stepNumber as keyof typeof NEXT_STEP_POINTER] ||
      "COMPLETED";
    await db
      .update(users)
      .set({ onboardingStep: nextProgressString })
      .where(eq(users.id, userIdToUpdate));

    revalidatePath("/onboarding");
    if (targetUserId) revalidatePath("/control-panel");
    return {
      success: true,
      nextStep: stepNumber + 1,
      isFinished: nextProgressString === "COMPLETED",
      profileId: returnedProfileId,
    };
  } catch (error: any) {
    console.error(`[WIZARD_SYNC_STEP_${stepNumber}_CRASH]:`, error);
    return {
      success: false,
      error: error.message || "Progress transmission failed",
    };
  }
}

export async function createAdminProfileAction(
  payload: Record<string, any>,
  targetUserId: string,
  profileIdToUpdate?: string,
) {
  try {
    if (!targetUserId) {
      throw new Error("A registered user must be selected before saving.");
    }

    const parsedDate =
      payload.dob && !isNaN(Date.parse(payload.dob))
        ? new Date(payload.dob)
        : null;

    const profilePayload = {
      userId: targetUserId,
      createdBy: payload.createdBy,
      fullName: payload.fullName,
      contact: payload.contact,
      gender: payload.gender,
      dob: parsedDate,
      age: payload.age,
      profilePic: payload.profilePic,
      religion: payload.religion,
      caste: payload.caste,
      motherTongue: payload.motherTongue,
      educationLevel: payload.educationLevel,
      profession: payload.profession,
      annualIncomeRange: payload.annualIncomeRange,
      country: payload.country,
      state: payload.state,
      city: payload.city,
      residencyStatus: payload.residencyStatus,
      height: payload.height,
      weight: payload.weight,
      narrative: payload.narrative,
      smoking: payload.smoking,
      drinking: payload.drinking,
      foodPreferences: payload.foodPreferences,
      isDifferentlyAbled:
        payload.isDifferentlyAbled === true ||
        payload.isDifferentlyAbled === "yes",
      differentlyAbledDetails: payload.differentlyAbledDetails,
      hobbies: Array.isArray(payload.hobbies) ? payload.hobbies : [],
      mailRoutingTarget: payload.mailRoutingTarget,
      secondaryEmail: payload.secondaryEmail,
      status: payload.status || "pending",
      updatedAt: new Date(),
    };

    let finalProfileId: string;

    if (profileIdToUpdate) {
      await db
        .update(profiles)
        .set(profilePayload)
        .where(eq(profiles.id, profileIdToUpdate));

      finalProfileId = profileIdToUpdate;
    } else {
      const [insertedRow] = await db
        .insert(profiles)
        .values(profilePayload)
        .returning({ id: profiles.id });

      if (!insertedRow) {
        throw new Error("Failed to create the profile record.");
      }
      finalProfileId = insertedRow.id;
    }

    await db
      .update(users)
      .set({ onboardingStatus: "COMPLETED", onboardingStep: "COMPLETED" })
      .where(eq(users.id, targetUserId));

    revalidatePath("/control-panel");

    return {
      success: true,
      profileId: finalProfileId,
    };
  } catch (error: any) {
    console.error("[ADMIN_PROFILE_CREATE_CRASH]:", error);
    return {
      success: false,
      error: error.message || "Profile creation failed.",
    };
  }
}
