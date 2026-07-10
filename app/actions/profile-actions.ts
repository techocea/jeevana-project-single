"use server";

import { db } from "@/lib/db";
import { profiles, users } from "@/drizzle/schema";
import { createClient } from "@/utils/supabase";
import { and, eq, gte, lte, desc, ilike } from "drizzle-orm";
import { Profile, SearchFilters } from "@/types";
import { revalidatePath } from "next/cache";

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
    console.error("[CURRENT_PROFILE_FETCH_ERROR]:", error);
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

export async function approveProfile(adId: string) {
  try {
    await db
      .update(profiles)
      .set({ status: "approved" })
      .where(eq(profiles.profileID, adId));

    revalidatePath("/control-panel");
    return { success: true };
  } catch (error) {
    console.error("[PROFILE_APPROVAL_ERROR]:", error);
    return { success: false, data: [], error: "Failed to approve profile" };
  }
}

export async function rejectProfile(adId: string) {
  try {
    await db
      .update(profiles)
      .set({ status: "rejected" })
      .where(eq(profiles.profileID, adId));

    revalidatePath("/control-panel");
    return { success: true };
  } catch (error) {
    console.error("[PROFILE_REJECTED_ERROR]:", error);
    return { success: false, data: [], error: "Failed to reject profile" };
  }
}

export async function updateProfile(
  profileId: string,
  updateData: Partial<Profile>,
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

    // Verify ownership
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, profileId),
    });

    if (profile?.userId !== authedUser.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Update profile
    await db
      .update(profiles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(profiles.id, profileId));

    revalidatePath("/my-dashboard");

    return {
      success: true,
      data: "Profile updated successfully",
    };
  } catch (error) {
    console.error("[UPDATE_PROFILE_ERROR]:", error);
    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}
