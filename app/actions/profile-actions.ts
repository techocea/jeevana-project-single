"use server";

import {db} from "@/lib/db";
import {
    favorites,
    partnerPreferences, profileMatches, verifications,
    profiles, profileViews, users,
} from "@/drizzle/schema";
import {createClient} from "@/utils/supabase";
import {and, eq, gte, lte, desc, ilike, ne, sql, count} from "drizzle-orm";
import {SearchFilters} from "@/types";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {calculateUserMatchesAction} from "@/app/actions/matchmaking-action";

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
export async function getCurrentUser() {
    try {
        const supabase = await createClient();
        const {
            data: {user: authedUser},
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authedUser) {
            return {
                success: false,
                data: null,
                error: "Unauthorized",
            };
        }

        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, authedUser.id),
        });

        if (!dbUser) {
            return {
                success: false,
                data: null,
                error: "User record not found",
            }
        }
        return {
            success: true,
            data: {
                ...dbUser,
                role: dbUser.role,
                email: authedUser.email,
            },
            error: null,
        };
    } catch (error) {
        console.error("[FAILED_FETCHING_CURRENT_USER]:", error);
        return {
            success: false,
            data: null,
            error: "Internal Server Error",
        };
    }
}

export async function getMatchingProfilesCount(userId: string): Promise<number> {
    if (!userId) return 0;

    try {
        const [result] = await db
            .select({total: count()})
            .from(profileMatches)
            .where(eq(profileMatches.userId, userId));

        return result?.total ?? 0;
    } catch (error) {
        console.error("Error fetching matching profiles count:", error);
        return 0;
    }
}

export async function createProfileByUser(
    stepNumber: number,
    payload: Record<string, any>
) {
    try {
        const {success, data: currentUser} = await getCurrentUser();

        if (!success || !currentUser) {
            return {success: false, error: "Unauthorized"};
        }

        const userIdToUpdate = currentUser.id;

        let updatePayload: CombinedUpdateInput = {};

        if (stepNumber === 1) {
            const rawDob = payload.dob;
            const parsedDate =
                rawDob && !isNaN(Date.parse(rawDob)) ? new Date(rawDob) : null;

            const parsedAge = payload.age !== undefined && payload.age !== null && payload.age !== ""
                ? parseInt(String(payload.age), 10)
                : null;

            updatePayload = {
                createdBy: payload.createdBy,
                fullName: payload.fullName,
                contact: payload.contact,
                gender: payload.gender,
                maritalStatus: payload.maritalStatus,
                dob: parsedDate,
                age: parsedAge,
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

        const isFinished = stepNumber === 7;
        const nextProgressString =
            NEXT_STEP_POINTER[stepNumber as keyof typeof NEXT_STEP_POINTER] ||
            "COMPLETED";

        const {savedProfile, savedPrefs} = await db.transaction(async (tx) => {
            let savedProfile: typeof profiles.$inferSelect | undefined;
            let savedPrefs: typeof partnerPreferences.$inferSelect | undefined;

            if (stepNumber <= 6) {
                const [row] = await tx
                    .insert(profiles)
                    .values({
                        userId: userIdToUpdate,
                        ...updatePayload,
                        status: "pending",
                    })
                    .onConflictDoUpdate({
                        target: profiles.userId,
                        set: {...updatePayload, updatedAt: new Date()},
                    })
                    .returning();
                savedProfile = row;
            } else if (stepNumber === 7) {
                const prefsToInsert = {
                    preferredMinAge: updatePayload.preferredMinAge,
                    preferredMaxAge: updatePayload.preferredMaxAge,
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
                };

                const [prefRow] = await tx
                    .insert(partnerPreferences)
                    .values({
                        userId: userIdToUpdate,
                        ...prefsToInsert,
                    })
                    .onConflictDoUpdate({
                        target: partnerPreferences.userId,
                        set: {...prefsToInsert, updatedAt: new Date()},
                    })
                    .returning();
                savedPrefs = prefRow;

                savedProfile = await tx.query.profiles.findFirst({
                    where: eq(profiles.userId, userIdToUpdate),
                });
            }

            await tx
                .update(users)
                .set({
                    onboardingStep: nextProgressString,
                    onboardingStatus: isFinished ? "COMPLETED" : "INCOMPLETED",
                })
                .where(eq(users.id, userIdToUpdate));

            return {savedProfile, savedPrefs};
        });

        await calculateUserMatchesAction(userIdToUpdate);

        revalidatePath("/onboarding");

        return {
            success: true,
            nextStep: stepNumber + 1,
            isFinished,
            profileId: savedProfile?.id || "",
            profile: savedProfile || null,
            partnerPreferences: savedPrefs || null,
        };
    } catch (error) {
        console.error(`[WIZARD_SYNC_STEP_${stepNumber}_CRASH]:`, error);
        return {
            success: false,
            error: "Progress transmission failed",
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
            data: {user},
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return {success: false, error: "Unauthorized access"};
        }

        const ownedProfile = await db.query.profiles.findFirst({
            where: and(
                eq(profiles.id, currentProfileId),
                eq(profiles.userId, user.id),
            ),
        });

        if (!ownedProfile) {
            return {success: false, error: "Unauthorized profile action"};
        }

        if (currentProfileId === targetProfileId) {
            return {success: false, error: "Cannot favorite your own profile"};
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
            return {success: true, message: "Profile favorited", isFavorited: true};
        }
    } catch (error) {
        console.error("[ADD_PROFILE_FAVORITE_ERROR]:", error);
        return {success: false, error: "Failed to update favorite status"};
    }
}

export async function getFavoriteProfiles(currentProfileId: string) {
    try {
        const supabase = await createClient();
        const {
            data: {user},
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return {success: false, error: "Unauthorized access", data: []};
        }

        if (!currentProfileId) {
            return {success: false, error: "Profile ID required", data: []};
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
        return {success: false, data: []};
    }
}

export async function updateProfile(
    profileId: string,
    updateData: CombinedUpdateInput,
) {
    try {
        const {success, data: currentUser} = await getCurrentUser();

        if (!success || !currentUser) {
            return {success: false, error: "Unauthorized"};
        }

        const currentProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, profileId),
        });

        if (!currentProfile) {
            return {success: false, error: "Profile not found"};
        }

        if (currentProfile.userId !== currentUser.id) {
            return {success: false, error: "Unauthorized"};
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

        await calculateUserMatchesAction(currentProfile.userId);

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
        const {success, data: currentUser} = await getCurrentUser();

        if (!success || !currentUser) {
            return {success: false, error: "Unauthorized"};
        }

        const profile = await db.query.profiles.findFirst({
            where: eq(profiles.userId, currentUser.id),
        });

        if (!profile) {
            return {success: false, data: null, error: "Profile not found."};
        }

        return {success: true, data: profile};
    } catch (error) {
        console.error("[USER:CURRENT_PROFILE_FETCH_ERROR]:", error);
        return {
            success: false,
            data: null,
            error: "Failed to retrieve profile details.",
        };
    }
}

export async function getMatchedProfile(profileId: string) {
    try {
        const {success, data: currentUser} = await getCurrentUser();

        if (!success || !currentUser) {
            return {success: false, error: "Unauthorized"};
        }

        const [row] = await db
            .select({
                matchId: profileMatches.id,
                viewerUserId: profileMatches.userId,
                score: profileMatches.score,
                matchReasons: profileMatches.matchReasons,
                viewedAt: profileMatches.viewedAt,
                profile: profiles,
            })
            .from(profileMatches)
            .innerJoin(profiles, eq(profileMatches.matchedProfileId, profiles.id))
            .where(eq(profileMatches.id, profileId))
            .limit(1);

        if (!row) {
            return {success: false, error: "Match not found."};
        }

        //others cannot view the mathcing profiles unless its the current User
        if (row.viewerUserId !== currentUser.id) {
            return {success: false, error: "You do not have access to this match."};
        }

        if (!row.viewedAt) {
            await db
                .update(profileMatches)
                .set({viewedAt: new Date()})
                .where(eq(profileMatches.id, profileId));
        }

        try {
            await recordProfileView(row.profile.id);
        } catch (viewError) {
            console.error("[RECORD_PROFILE_VIEW_FROM_MATCH_CRASH]:", viewError);
        }

        return {
            success: true,
            data: {
                matchId: row.matchId,
                score: row.score,
                matchReasons: row.matchReasons,
                viewedAt: row.viewedAt ?? new Date(), // reflect the just-now write in the response
                profile: row.profile,
            },
        };
    } catch (error) {
        console.error("[GET_MATCHED_PROFILE_CRASH]:", error);
        return {
            success: false,
            error: "Failed to load matched profile.",
        };
    }
}

const VIEW_COOLDOWN_HOURS = 6;

/**
 * Records that the current user viewed `viewedProfileId`. Safe to call on
 * every profile-detail page load — it silently no-ops on self-views and
 * within the cooldown window rather than erroring, so callers don't need
 * to special-case those.
 */
export async function recordProfileView(viewedProfileId: string) {
    try {
        const {success, data: currentUser} = await getCurrentUser();
        if (!success || !currentUser) {
            return {success: false, error: "Unauthorized"};
        }

        const targetProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, viewedProfileId),
        });

        if (!targetProfile) {
            return {success: false, error: "Profile not found."};
        }

        // Don't count someone viewing their own profile.
        if (targetProfile.userId === currentUser.id) {
            return {success: true, recorded: false, reason: "self-view"};
        }

        const cooldownCutoff = new Date(Date.now() - VIEW_COOLDOWN_HOURS * 60 * 60 * 1000);

        const recentView = await db.query.profileViews.findFirst({
            where: and(
                eq(profileViews.viewerUserId, currentUser.id),
                eq(profileViews.viewedProfileId, viewedProfileId),
                gte(profileViews.viewedAt, cooldownCutoff),
            ),
            orderBy: desc(profileViews.viewedAt),
        });

        if (recentView) {
            return {success: true, recorded: false, reason: "cooldown"};
        }

        await db.insert(profileViews).values({
            viewerUserId: currentUser.id,
            viewedProfileId,
        });

        return {success: true, recorded: true};
    } catch (error: any) {
        // A failed view-tracking write should never break the profile page
        // itself — log it and let the caller carry on.
        console.error("[RECORD_PROFILE_VIEW_CRASH]:", error);
        return {success: false, error: "Failed to record view."};
    }
}

/**
 * Total view count for a profile. Public-ish — safe to show on the
 * profile owner's own dashboard, or even on their public card if you
 * want a "X views" badge. Returns both total events and unique viewers
 * since they can differ meaningfully (one person opening your profile
 * five times vs. five different people opening it once).
 */
export async function getProfileViewCount(profileId: string) {
    try {
        const [row] = await db
            .select({
                totalViews: sql<number>`count(*)`,
                uniqueViewers: sql<number>`count(distinct ${profileViews.viewerUserId})`,
            })
            .from(profileViews)
            .where(eq(profileViews.viewedProfileId, profileId));

        return {
            success: true,
            data: {
                totalViews: Number(row?.totalViews ?? 0),
                uniqueViewers: Number(row?.uniqueViewers ?? 0),
            },
        };
    } catch (error: any) {
        console.error("[GET_PROFILE_VIEW_COUNT_CRASH]:", error);
        return {success: false, error: "Failed to load view count."};
    }
}

/**
 * "Who viewed your profile" — deduped to one row per viewer (their most
 * recent view time), most recent first. Owner-only: this is private data
 * about your own profile, not something any logged-in user should be able
 * to pull for anyone's profileId.
 */
export async function getProfileViewers(profileId: string) {
    try {
        const {success, data: currentUser} = await getCurrentUser();

        if (!success || !currentUser) {
            return {success: false, error: "Unauthorized"};
        }

        const targetProfile = await db.query.profiles.findFirst({
            where: eq(profiles.id, profileId),
        });

        if (!targetProfile) {
            return {success: false, error: "Profile not found."};
        }

        if (targetProfile.userId !== currentUser.id) {
            return {success: false, error: "You can only view your own profile's viewers."};
        }

        // One row per viewer, using their latest view timestamp, joined with
        // the viewer's own profile so the UI has a name/photo to show.
        const latestViewPerViewer = db
            .select({
                viewerUserId: profileViews.viewerUserId,
                lastViewedAt: sql<Date>`max(${profileViews.viewedAt})`.as("last_viewed_at"),
            })
            .from(profileViews)
            .where(eq(profileViews.viewedProfileId, profileId))
            .groupBy(profileViews.viewerUserId)
            .as("latest_view_per_viewer");

        const viewers = await db
            .select({
                viewerUserId: latestViewPerViewer.viewerUserId,
                lastViewedAt: latestViewPerViewer.lastViewedAt,
                viewerProfile: profiles,
            })
            .from(latestViewPerViewer)
            .innerJoin(profiles, eq(profiles.userId, latestViewPerViewer.viewerUserId))
            .orderBy(desc(latestViewPerViewer.lastViewedAt));

        return {success: true, data: viewers};
    } catch (error: any) {
        console.error("[GET_PROFILE_VIEWERS_CRASH]:", error);
        return {success: false, error: "Failed to load viewers."};
    }
}

export async function getProfilesByFilters(
    filters: SearchFilters,
    currentProfileId?: string,
) {
    try {
        const {minAge, maxAge} = filters;

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

        return {success: true, data: searchedProfiles};
    } catch (error) {
        console.error("[DATABASE_SEARCH_CRASH]:", error);
        return {success: false, data: [], error: "Failed to retrieve profiles."};
    }
}

// ADMIN ACTIONS
export async function validateAdmin() {
    try {
        const result = await getCurrentUser();
        if (!result.success || !result.data) {
            return {isAuthorized: false, error: "Unauthorized access."};
        }

        const role = (result.data.role || "").toLowerCase();

        if (role !== "admin") {
            return {isAuthorized: false, error: "Forbidden: Admin privileges required."};
        }

        return {isAuthorized: true, user: result.data, error: null};
    } catch (error) {
        console.error("[VALIDATE_ADMIN_CRITICAL_ERROR]:", error);
        return {
            isAuthorized: false,
            error: "Internal Server Error during validation.",
            data: null,
        };
    }
}

export async function approveProfile(verificationId: string, profileId: string) {
    try {
        const {isAuthorized, error} = await validateAdmin();

        if (!isAuthorized) {
            return { success: false, error};
        }

        await db
            .update(verifications)
            .set({
                status: "verified",
                rejectionReason: null,
                updatedAt: new Date(),
            })
            .where(eq(verifications.id, verificationId));
        // 2. Grant verified badge on the profile
        await db
            .update(profiles)
            .set({
                status: "approved",
                updatedAt: new Date(),
            })
            .where(eq(profiles.id, profileId));

        revalidatePath(`/control-panel/approval-queues/${profileId}`);
        return {success: true, message: "Profile successfully verified!"};
    } catch (error) {
        console.error("[PROFILE_APPROVAL_ERROR]:", error);
        return {success: false, error: "Failed to approve profile"};
    }
}

export async function rejectProfile(verificationId: string, profileId: string, reason: string) {
    try {
        const {isAuthorized, error} = await validateAdmin();

        if (!isAuthorized) {
            return { success: false, error};
        }

        await db
            .update(verifications)
            .set({
                status: "rejected",
                rejectionReason: reason,
                updatedAt: new Date(),
            })
            .where(eq(verifications.id, verificationId));

        // 2. Remove verified badge if previously verified
        await db
            .update(profiles)
            .set({
                status: "rejected",
                updatedAt: new Date(),
            })
            .where(eq(profiles.id, profileId));

        revalidatePath(`/control-panel/approval-queues/${profileId}`);
        return {success: true, message: "Profile verification rejected"};
    } catch (error) {
        console.error("[PROFILE_REJECTED_ERROR]:", error);
        return {success: false, error: "Failed to reject profile"};
    }
}

export async function deleteProfile(id: string) {
    try {
        const {isAuthorized, error} = await validateAdmin();

        if (!isAuthorized) {
            return { success: false, error};
        }

        await db.delete(profiles).where(eq(profiles.id, id));

        revalidatePath("/control-panel/approval-queues");
        return {success: true};
    } catch (error) {
        console.error("[PROFILE_DELETION_ERROR]:", error);
        return {success: false, error: "Failed to delete profile"};
    }
}

export async function getUserProfile(profileId: string) {
    let joinedResult;
    let authedUser;

    try {
        const supabase = await createClient();
        const {
            data: {user},
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
            .leftJoin(
                verifications,
                eq(profiles.id, verifications.profileId)
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
        partnerPreferences: row.partner_preferences || null,
        verification: row.verifications
            ? {
                verificationId: row.verifications.id,
                idNumber: row.verifications.idNumber,
                documentFrontUrl: row.verifications.documentFrontUrl,
                documentBackUrl: row.verifications.documentBackUrl,
                verificationStatus: row.verifications.status,
                rejectionReason: row.verifications.rejectionReason,
            }
            : null,
    };

    return {success: true, data: flatProfileData};
}

export async function getUsersByEmail(query: string) {
    try {
        const {isAuthorized, error} = await validateAdmin();

        if (!isAuthorized) {
            return { success: false, error};
        }

        const registeredUsers = await db
            .select({
                id: users.id,
                email: users.email,
            })
            .from(users)
            .where(ilike(users.email, `%${query}%`))
            .limit(5);

        return {success: true, data: registeredUsers};
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
        const {isAuthorized, error} = await validateAdmin();

        if (!isAuthorized) {
            return { success: false, error};
        }

        if (!targetUserId) {
            return {
                success: false,
                error: "A registered user must be selected before saving.",
            };
        }

        const parsedDate =
            payload.dob && !isNaN(Date.parse(payload.dob))
                ? new Date(payload.dob)
                : null;

        const parsedAge = payload.age !== undefined && payload.age !== null && payload.age !== ""
            ? parseInt(String(payload.age), 10)
            : null;

        const profilePayload = {
            userId: targetUserId,
            createdBy: payload.createdBy || null,
            fullName: payload.fullName || null,
            contact: payload.contact || null,
            gender: payload.gender || null,
            maritalStatus: payload.maritalStatus || null,
            dob: parsedDate,
            age: parsedAge,
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

        const {savedProfile, savedPrefs} = await db.transaction(async (tx) => {
            let rowProfile: typeof profiles.$inferSelect | undefined;

            if (profileIdToUpdate) {
                const [updated] = await tx
                    .update(profiles)
                    .set(profilePayload)
                    .where(eq(profiles.id, profileIdToUpdate))
                    .returning();
                rowProfile = updated;
            } else {
                const [inserted] = await tx
                    .insert(profiles)
                    .values(profilePayload)
                    .onConflictDoUpdate({
                        target: profiles.userId,
                        set: {...profilePayload, updatedAt: new Date()},
                    })
                    .returning();
                rowProfile = inserted;
            }

            if (!rowProfile) {
                throw new Error("Failed to create or update profile record.");
            }

            const [rowPrefs] = await tx
                .insert(partnerPreferences)
                .values(partnerPreferencesPayload)
                .onConflictDoUpdate({
                    target: partnerPreferences.userId,
                    set: {...partnerPreferencesPayload, updatedAt: new Date()},
                })
                .returning();

            await tx
                .update(users)
                .set({onboardingStatus: "COMPLETED", onboardingStep: "COMPLETED"})
                .where(eq(users.id, targetUserId));

            return {savedProfile: rowProfile, savedPrefs: rowPrefs};
        });

        await calculateUserMatchesAction(targetUserId);

        revalidatePath("/control-panel");
        revalidatePath("/control-panel/approval-queues");

        return {
            success: true,
            profileId: savedProfile.id,
            profile: savedProfile,
            partnerPreferences: savedPrefs,
        };
    } catch (error) {
        console.error("[ADMIN_PROFILE_CREATE_CRASH]:", error);
        return {
            success: false,
            error: "Profile creation failed.",
        }
    }
}
