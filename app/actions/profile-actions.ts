"use server";

import { db } from "@/lib/db";
import { partnerPreferences, profiles, users } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase";
import { and, eq, gte, lte, desc, ilike } from "drizzle-orm";
import { SearchFilters } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const targetGenderMap: Record<string, string> = {
  bride: "female",
  groom: "male",
};

export async function getUsersByEmail(query: string) {
  try {
    const registeredUsers = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(ilike(users.email, `%${query}%`))
      .limit(5);

    return { success: true, data: registeredUsers };
  } catch (error) {
    console.error("[DATABASE_SEARCH_REGISTERED_USERS_CRASH]:", error);
    return {
      success: false,
      data: [],
      error: "Failed to retrieve registered users.",
    };
  }
}

export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient();
    const {
      data: { user: authedUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authedUser) {
      return {
        success: false,
        data: null,
        error: "Unable to resolve the current user.",
      };
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, authedUser.id),
    });

    if (!profile) {
      return { success: false, data: null, error: "Profile not found." };
    }

    return { success: true, data: profile };
  } catch (error) {
    console.error("[USER:CURRENT_PROFILE_FETCH_ERROR]:", error);
    return {
      success: false,
      data: null,
      error: "Failed to retrieve profile details.",
    };
  }
}

export async function getProfilesByFilters(filters: SearchFilters) {
  try {
    const { minAge, maxAge } = filters;

    const rawLookingFor = String(filters.lookingFor || "")
      .trim()
      .toLowerCase();
    const targetGender = targetGenderMap[rawLookingFor] || undefined;
    const rawReligion = String(filters.religion || "").trim();
    const rawCaste = String(filters.caste || "").trim();
    const rawMotherTongue = String(filters.motherTongue || "").trim();
    const rawEducationLevel = String(filters.educationLevel || "").trim();
    const rawProfession = String(filters.profession || "").trim();
    const rawIncomeRange = String(filters.annualIncomeRange || "").trim();
    const rawCountry = String(filters.country || "").trim();
    const rawState = String(filters.state || "").trim();

    const parsedMinAge = minAge ? parseInt(minAge, 10) : 18;
    const parsedMaxAge = maxAge ? parseInt(maxAge, 10) : 100;

    // console.log("[SERVER_ACTION_FETCH]: Executing lookup for", {
    //   rawLookingFor,
    //   rawReligion,
    //   rawCaste,
    //   rawMotherTongue,
    //   rawEducationLevel,
    //   rawProfession,
    //   rawIncomeRange,
    //   rawCountry,
    //   rawState,
    //   parsedMinAge,
    //   parsedMaxAge,
    // });

    const conditions = [
      gte(profiles.age, parsedMinAge),
      lte(profiles.age, parsedMaxAge),
    ];

    if (targetGender) {
      conditions.push(eq(profiles.gender, targetGender));
    }
    if (rawReligion) {
      conditions.push(eq(profiles.religion, rawReligion));
    }
    if (rawCaste) {
      conditions.push(eq(profiles.caste, rawCaste));
    }
    if (rawMotherTongue) {
      conditions.push(eq(profiles.motherTongue, rawMotherTongue));
    }
    if (rawEducationLevel) {
      conditions.push(eq(profiles.educationLevel, rawEducationLevel));
    }
    if (rawProfession) {
      conditions.push(eq(profiles.profession, rawProfession));
    }
    if (rawIncomeRange) {
      conditions.push(eq(profiles.annualIncomeRange, rawIncomeRange));
    }
    if (rawCountry) {
      conditions.push(eq(profiles.country, rawCountry));
    }
    if (rawState) {
      conditions.push(eq(profiles.state, rawState));
    }

    const searchedProfiles = await db
      .select()
      .from(profiles)
      .where(and(...conditions))
      .orderBy(desc(profiles.createdAt))
      .limit(5);

    return { success: true, data: searchedProfiles };
  } catch (error) {
    console.error("[DATABASE_SEARCH_CRASH]:", error);
    return { success: false, data: [], error: "Failed to retrieve profiles." };
  }
}

export async function getUserProfile(profileId: string) {
  let joinedResult;
  let authedUser;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        success: false,
        data: null,
        error: "Unable to resolve the current user.",
      };
    }
    authedUser = user;

    joinedResult = await db
      .select()
      .from(profiles)
      .leftJoin(
        partnerPreferences,
        eq(profiles.userId, partnerPreferences.userId),
      )
      .where(eq(profiles.id, profileId));
  } catch (error) {
    console.error("[ADMIN:USER_PROFILE_FETCH_ERROR]:", error);
    return {
      success: false,
      data: null,
      error: "Failed to retrieve profile details.",
    };
  }

  if (!joinedResult || joinedResult.length === 0) {
    redirect("/control-panel/approval-queues");
  }

  const row = joinedResult[0];
  const currentRole = authedUser.user_metadata?.role;

  const isOwner = row.profiles.userId === authedUser.id;
  const isAdmin = currentRole === "admin";

  if (!isOwner && !isAdmin) {
    redirect("/control-panel/approval-queues");
  }

  const flatProfileData = {
    ...row.profiles,
    ...(row.partner_preferences || {}),
  };

  return { success: true, data: flatProfileData };
}

// ADMIN PROFILE ACTIONS
export async function approveProfile(id: string) {
  try {
    await db
      .update(profiles)
      .set({ status: "approved" })
      .where(eq(profiles.id, id));

    revalidatePath("/control-panel");
    return { success: true };
  } catch (error) {
    console.error("[PROFILE_APPROVAL_ERROR]:", error);
    return { success: false, error: "Failed to approve profile" };
  }
}

export async function rejectProfile(id: string) {
  try {
    await db
      .update(profiles)
      .set({ status: "rejected" })
      .where(eq(profiles.id, id));

    revalidatePath("/control-panel");
    return { success: true };
  } catch (error) {
    console.error("[PROFILE_REJECTED_ERROR]:", error);
    return { success: false, error: "Failed to reject profile" };
  }
}

export type CombinedUpdateInput = Partial<typeof profiles.$inferInsert> &
  Partial<typeof partnerPreferences.$inferInsert>;

export async function updateProfile(
  profileId: string,
  updateData: CombinedUpdateInput,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authedUser },
    } = await supabase.auth.getUser();

    if (!authedUser) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const currentProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, profileId),
    });

    if (!currentProfile) {
      return { success: false, error: "Profile not found" };
    }

    if (currentProfile.userId !== authedUser.id) {
      return { success: false, error: "Unauthorized" };
    }

    const {
      // --- Partner Preference Fields ---
      minAge,
      maxAge,
      maritalStatus,
      educationLevels,
      professions,
      annualIncomeRanges,

      // --- Immutable/System Fields (Ignored from update data for security) ---
      id,
      profileID,
      userId,
      createdAt,
      updatedAt,

      // --- Everything else belongs to the Profile Table ---
      ...profilePayload
    } = updateData;

    const preferencesPayload = {
      minAge,
      maxAge,
      maritalStatus,
      educationLevels,
      professions,
      annualIncomeRanges,
    };

    const finalData = await db.transaction(async (tx) => {
      const [updatedProfile] = await tx
        .update(profiles)
        .set({
          ...profilePayload,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, profileId))
        .returning();

      if (!currentProfile.userId) {
        return {
          success: false,
          error: "Profile is not linked to a valid user account",
        };
      }
      // Update partner preferences linked by the verified user ID
      const [updatedPreferences] = await tx
        .update(partnerPreferences)
        .set(preferencesPayload)
        .where(eq(partnerPreferences.userId, currentProfile.userId))
        .returning();

      // Re-stitch them together for a flat object response
      return {
        ...updatedProfile,
        ...updatedPreferences,
      };
    });

    revalidatePath("/my-dashboard");
    revalidatePath(`/my-dashboard/my-profile/${profileId}/edit`);

    return {
      success: true,
      data: finalData,
    };
  } catch (error) {
    console.error("[UPDATE_PROFILE_ERROR]:", error);
    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}
