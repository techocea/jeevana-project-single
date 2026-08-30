"use server";

import { db } from "@/lib/db";
import {
  favorites,
  partnerPreferences,
  profiles,
  users,
} from "@/drizzle/schema";
import { createClient } from "@/utils/supabase";
import { and, eq, gte, lte, desc, ilike, ne, sql } from "drizzle-orm";
import { SearchFilters } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const NEXT_STEP_POINTER = {
  1: "RELIGION",
  2: "ACHIEVEMENTS",
  3: "LOCATION",
  4: "PERSONAL",
  5: "HOBBIES",
  6: "PREFERENCES",
  7: "COMPLETED",
} as const;

const TARGET_GENDER_MAP: Record<string, string> = {
  bride: "female",
  groom: "male",
};

type CombinedUpdateInput = Partial<typeof profiles.$inferInsert> &
  Partial<typeof partnerPreferences.$inferInsert>;

// USER PROFILE ACTIONS
export async function createProfileByUser(
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
        age: payload.age ? parseInt(String(payload.age), 10) : null,
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
    } else if (stepNumber === 7) {
      const minAge = payload.preferredMinAge;
      const maxAge = payload.preferredMaxAge;

      updatePayload = {
        preferredMinAge: minAge ? Number(minAge) : 18,
        preferredMaxAge: maxAge ? Number(maxAge) : 50,
        preferredMaritalStatus:
          payload.preferredMaritalStatus || "never_married",
        preferredEducationLevels: Array.isArray(
          payload.preferredEducationLevels,
        )
          ? payload.preferredEducationLevels
          : [],
        preferredProfessions: Array.isArray(payload.preferredProfessions)
          ? payload.preferredProfessions
          : [],
        preferredAnnualIncomeRanges: Array.isArray(
          payload.preferredAnnualIncomeRanges,
        )
          ? payload.preferredAnnualIncomeRanges
          : [],
      };
    }

    let returnedProfileId = "";

    if (stepNumber <= 6) {
      const existingRecord = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userIdToUpdate),
      });

      if (existingRecord) {
        await db
          .update(profiles)
          .set({ ...updatePayload, updatedAt: new Date() })
          .where(eq(profiles.userId, userIdToUpdate));
        returnedProfileId = existingRecord.id;
      } else {
        const [insertedRow] = await db
          .insert(profiles)
          .values({
            userId: userIdToUpdate,
            ...updatePayload,
            status: "pending",
          })
          .returning({ id: profiles.id });

        if (!insertedRow)
          throw new Error("Failed to capture returned inserted row ID.");
        returnedProfileId = insertedRow.id;
      }
    } else if (stepNumber === 7) {
      const existingPrefs = await db.query.partnerPreferences.findFirst({
        where: eq(partnerPreferences.userId, userIdToUpdate),
      });

      if (existingPrefs) {
        await db
          .update(partnerPreferences)
          .set({ ...updatePayload, updatedAt: new Date() })
          .where(eq(partnerPreferences.userId, userIdToUpdate));
      } else {
        await db.insert(partnerPreferences).values({
          userId: userIdToUpdate,
          preferredMaxAge: updatePayload.preferredMaxAge,
          preferredMinAge: updatePayload.preferredMinAge,
          preferredMaritalStatus:
            updatePayload.preferredMaritalStatus || "never_married",
          preferredEducationLevels: Array.isArray(
            updatePayload.preferredEducationLevels,
          )
            ? updatePayload.preferredEducationLevels
            : [],
          preferredProfessions: Array.isArray(
            updatePayload.preferredProfessions,
          )
            ? updatePayload.preferredProfessions
            : [],
          preferredAnnualIncomeRanges: Array.isArray(
            updatePayload.preferredAnnualIncomeRanges,
          )
            ? updatePayload.preferredAnnualIncomeRanges
            : [],
        });
      }

      const userProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userIdToUpdate),
      });
      returnedProfileId = userProfile?.id || "";
    }

    const nextProgressString =
      NEXT_STEP_POINTER[stepNumber as keyof typeof NEXT_STEP_POINTER] ||
      "COMPLETED";

    const isFinished = stepNumber === 7;

    await db
      .update(users)
      .set({
        onboardingStep: nextProgressString,
        onboardingStatus: isFinished ? "COMPLETED" : "INCOMPLETED",
      })
      .where(eq(users.id, userIdToUpdate));

    revalidatePath("/onboarding");

    return {
      success: true,
      nextStep: stepNumber + 1,
      isFinished,
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

export async function addProfileToFavorite(
  currentProfileId: string,
  targetProfileId: string,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, error: "Unauthorized access" };
    }

    const ownedProfile = await db.query.profiles.findFirst({
      where: and(
        eq(profiles.id, currentProfileId),
        eq(profiles.userId, user.id),
      ),
    });

    if (!ownedProfile) {
      return { success: false, error: "Unauthorized profile action" };
    }

    if (currentProfileId === targetProfileId) {
      return { success: false, error: "Cannot favorite your own profile" };
    }

    const existingFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.favoritedByProfileId, currentProfileId),
        eq(favorites.targetProfileId, targetProfileId),
      ),
    });

    if (existingFavorite) {
      // Unfavorite
      await db.delete(favorites).where(eq(favorites.id, existingFavorite.id));

      revalidatePath("/search", "page");
      revalidatePath("/my-dashboard/favorites");
      revalidatePath("/my-dashboard/best-proposals", "page");
      return {
        success: true,
        message: "Profile un-favorited",
        isFavorited: false,
      };
    } else {
      // Favorite
      await db.insert(favorites).values({
        favoritedByProfileId: currentProfileId,
        targetProfileId: targetProfileId,
      });

      revalidatePath("/search", "page");
      revalidatePath("/my-dashboard/favorites");
      revalidatePath("/my-dashboard/best-proposals", "page");
      return { success: true, message: "Profile favorited", isFavorited: true };
    }
  } catch (error) {
    console.error("[ADD_PROFILE_FAVORITE_ERROR]:", error);
    return { success: false, error: "Failed to update favorite status" };
  }
}

export async function getFavoriteProfiles(currentProfileId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { success: false, error: "Unauthorized access", data: [] };
    }

    if (!currentProfileId) {
      return { success: false, error: "Profile ID required", data: [] };
    }

    const favoritedProfiles = await db
      .select({
        id: profiles.id,
        fullName: profiles.fullName,
        profilePic: profiles.profilePic,
        age: profiles.age,
        height: profiles.height,
        country: profiles.country,
        profession: profiles.profession,
        religion: profiles.religion,
        caste: profiles.caste,
        educationLevel: profiles.educationLevel,
        isFavorited: sql<boolean>`true`,
      })
      .from(favorites)
      .innerJoin(profiles, eq(favorites.targetProfileId, profiles.id))
      .where(eq(favorites.favoritedByProfileId, currentProfileId))
      .orderBy(desc(favorites.createdAt));

    return {
      success: true,
      message:
        favoritedProfiles.length > 0
          ? "FAVORITES_PROFILES_FOUND"
          : "FAVORITES_PROFILES_NOT_FOUND",
      data: favoritedProfiles,
    };
  } catch (error) {
    console.error("[GET_FAVORITES_ERROR]:", error);
    return { success: false, data: [] };
  }
}

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
      preferredMinAge,
      preferredMaxAge,
      preferredMaritalStatus,
      preferredEducationLevels,
      preferredProfessions,
      preferredAnnualIncomeRanges,

      // --- Immutable/System Fields (Ignored from update data for security) ---
      id,
      profileID,
      userId,
      createdAt,
      updatedAt,

      // --- Everything else belongs to the Profile Table ---
      ...profilePayload
    } = updateData;

    const rawPreferencesPayload = {
      preferredMinAge,
      preferredMaxAge,
      preferredMaritalStatus,
      preferredEducationLevels,
      preferredProfessions,
      preferredAnnualIncomeRanges,
    };

    const preferencesPayload = Object.fromEntries(
      Object.entries(rawPreferencesPayload).filter(([_, v]) => v !== undefined),
    );

    const cleanProfilePayload = Object.fromEntries(
      Object.entries(profilePayload).filter(([_, v]) => v !== undefined),
    );

    const finalData = await db.transaction(async (tx) => {
      let updatedProfile = currentProfile;

      if (Object.keys(cleanProfilePayload).length > 0) {
        const [res] = await tx
          .update(profiles)
          .set({
            ...cleanProfilePayload,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profileId))
          .returning();
        updatedProfile = res;
      }

      let updatedPreferences = {};

      if (Object.keys(preferencesPayload).length > 0 && currentProfile.userId) {
        const existingPref = await tx.query.partnerPreferences.findFirst({
          where: eq(partnerPreferences.userId, currentProfile.userId),
        });

        let prefRes;

        if (existingPref) {
          [prefRes] = await tx
            .update(partnerPreferences)
            .set({
              ...preferencesPayload,
              updatedAt: new Date(),
            })
            .where(eq(partnerPreferences.userId, currentProfile.userId))
            .returning();
        } else {
          [prefRes] = await tx
            .insert(partnerPreferences)
            .values({
              userId: currentProfile.userId,
              ...preferencesPayload,
              updatedAt: new Date(),
            })
            .returning();
        }

        updatedPreferences = prefRes || {};
      } else if (currentProfile.userId) {
        const existingPref = await tx.query.partnerPreferences.findFirst({
          where: eq(partnerPreferences.userId, currentProfile.userId),
        });
        updatedPreferences = existingPref || {};
      }

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
        error: "Unauthorized",
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

export async function getProfilesByFilters(
  filters: SearchFilters,
  currentProfileId?: string,
) {
  try {
    const { minAge, maxAge } = filters;

    const rawLookingFor = String(filters.lookingFor || "")
      .trim()
      .toLowerCase();
    const targetGender = TARGET_GENDER_MAP[rawLookingFor] || undefined;
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

    const conditions = [
      gte(profiles.age, parsedMinAge),
      lte(profiles.age, parsedMaxAge),
    ];

    if (currentProfileId) {
      conditions.push(ne(profiles.id, currentProfileId));
    }

    if (targetGender) conditions.push(eq(profiles.gender, targetGender));
    if (rawReligion) conditions.push(eq(profiles.religion, rawReligion));
    if (rawCaste) conditions.push(eq(profiles.caste, rawCaste));
    if (rawMotherTongue)
      conditions.push(eq(profiles.motherTongue, rawMotherTongue));
    if (rawEducationLevel)
      conditions.push(eq(profiles.educationLevel, rawEducationLevel));
    if (rawProfession) conditions.push(eq(profiles.profession, rawProfession));
    if (rawIncomeRange)
      conditions.push(eq(profiles.annualIncomeRange, rawIncomeRange));
    if (rawCountry) conditions.push(eq(profiles.country, rawCountry));
    if (rawState) conditions.push(eq(profiles.state, rawState));

    const searchedProfiles = await db
      .select({
        id: profiles.id,
        fullName: profiles.fullName,
        profilePic: profiles.profilePic,
        age: profiles.age,
        height: profiles.height,
        country: profiles.country,
        profession: profiles.profession,
        religion: profiles.religion,
        caste: profiles.caste,
        educationLevel: profiles.educationLevel,
        isFavorited: sql<boolean>`COALESCE(${favorites.id} IS NOT NULL, false)`,
      })
      .from(profiles)
      .leftJoin(
        favorites,
        and(
          eq(favorites.targetProfileId, profiles.id),
          // If currentProfileId is undefined/null, this condition won't match any row
          currentProfileId
            ? eq(favorites.favoritedByProfileId, currentProfileId)
            : sql`1 = 0`,
        ),
      )
      .where(and(...conditions))
      .orderBy(desc(profiles.createdAt))
      .limit(5);

    return { success: true, data: searchedProfiles };
  } catch (error) {
    console.error("[DATABASE_SEARCH_CRASH]:", error);
    return { success: false, data: [], error: "Failed to retrieve profiles." };
  }
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

export async function deleteProfile(id: string) {
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
        error: "Unauthorized",
      };
    }

    await db.delete(profiles).where(eq(profiles.id, id));

    revalidatePath("/control-panel");
    return { success: true };
  } catch (error) {
    console.error("[PROFILE_DELETION_ERROR]:", error);
    return { success: false, error: "Failed to delete profile" };
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
        error: "Unauthorized",
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

export async function createProfileByAdmin(
  payload: Record<string, any>,
  targetUserId: string,
  profileIdToUpdate?: string,
) {
  try {
    if (!targetUserId) {
      return {
        success: false,
        error: "A registered user must be selected before saving.",
      };
    }

    // 1. Parse Date of Birth & Numbers cleanly
    const parsedDate =
      payload.dob && !isNaN(Date.parse(payload.dob))
        ? new Date(payload.dob)
        : null;

    const ageNum = payload.age ? parseInt(String(payload.age), 10) : null;

    // 2. Prepare Profile Payload (Strictly profiles table columns)
    const profilePayload = {
      userId: targetUserId,
      createdBy: payload.createdBy || null,
      fullName: payload.fullName || null,
      contact: payload.contact || null,
      gender: payload.gender || null,
      dob: parsedDate,
      age: isNaN(ageNum as number) ? null : ageNum,
      profilePic: payload.profilePic || null,
      religion: payload.religion || null,
      caste: payload.caste || null,
      motherTongue: payload.motherTongue || null,
      educationLevel: payload.educationLevel || null,
      profession: payload.profession || null,
      annualIncomeRange: payload.annualIncomeRange || null,
      country: payload.country || null,
      state: payload.state || null,
      city: payload.city || null,
      residencyStatus: payload.residencyStatus || null,
      height: payload.height || null,
      weight: payload.weight || null,
      narrative: payload.narrative || null,
      smoking: payload.smoking || null,
      drinking: payload.drinking || null,
      foodPreferences: payload.foodPreferences || null,
      isDifferentlyAbled:
        payload.isDifferentlyAbled === true ||
        payload.isDifferentlyAbled === "yes",
      differentlyAbledDetails: payload.differentlyAbledDetails || null,
      hobbies: Array.isArray(payload.hobbies) ? payload.hobbies : [],
      mailRoutingTarget: payload.mailRoutingTarget || "owner",
      secondaryEmail: payload.secondaryEmail || null,
      status: payload.status || "approved",
      updatedAt: new Date(),
    };

    // 3. Prepare Partner Preferences Payload (Strictly partner_preferences table columns)
    const minAge = payload.preferredMinAge ?? payload.minAge;
    const maxAge = payload.preferredMaxAge ?? payload.maxAge;

    const partnerPreferencesPayload = {
      userId: targetUserId,
      preferredMinAge: minAge ? Number(minAge) : 18,
      preferredMaxAge: maxAge ? Number(maxAge) : 50,
      preferredMaritalStatus: payload.preferredMaritalStatus || "never_married",
      preferredEducationLevels: Array.isArray(payload.preferredEducationLevels)
        ? payload.preferredEducationLevels
        : [],
      preferredProfessions: Array.isArray(payload.preferredProfessions)
        ? payload.preferredProfessions
        : [],
      preferredAnnualIncomeRanges: Array.isArray(
        payload.preferredAnnualIncomeRanges,
      )
        ? payload.preferredAnnualIncomeRanges
        : [],
      updatedAt: new Date(),
    };

    let finalProfileId: string;

    // 4. Upsert Profiles Table
    if (profileIdToUpdate) {
      await db
        .update(profiles)
        .set(profilePayload)
        .where(eq(profiles.id, profileIdToUpdate));

      finalProfileId = profileIdToUpdate;
    } else {
      const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, targetUserId),
      });

      if (existingProfile) {
        await db
          .update(profiles)
          .set(profilePayload)
          .where(eq(profiles.userId, targetUserId));
        finalProfileId = existingProfile.id;
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
    }

    // 5. Upsert Partner Preferences Table (Explicit find & update/insert to avoid constraint issues)
    const existingPrefs = await db.query.partnerPreferences.findFirst({
      where: eq(partnerPreferences.userId, targetUserId),
    });

    if (existingPrefs) {
      await db
        .update(partnerPreferences)
        .set(partnerPreferencesPayload)
        .where(eq(partnerPreferences.userId, targetUserId));
    } else {
      await db.insert(partnerPreferences).values(partnerPreferencesPayload);
    }

    // 6. Complete Onboarding Status for Target User
    await db
      .update(users)
      .set({ onboardingStatus: "COMPLETED", onboardingStep: "COMPLETED" })
      .where(eq(users.id, targetUserId));

    revalidatePath("/control-panel");
    revalidatePath("/control-panel/approval-queues");

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

