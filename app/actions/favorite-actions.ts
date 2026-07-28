"use server";

import { favorites, profiles } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase";
import { eq, and, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
