"use server";

import { favorites, profiles } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase";
import { eq, and } from "drizzle-orm";
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
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, data: [] };
    }

    const favList = await db.query.favorites.findMany({
      where: eq(favorites.favoritedByProfileId, currentProfileId),
      with: {
        // Requires relation defined in drizzle config or manual lookup
      },
    });

    // Alternatively fetch full profile details
    const favoritedIds = favList.map((f) => f.targetProfileId);

    if (favoritedIds.length === 0) {
      return { success: true, data: [] };
    }

    // Fetch favorited profiles
    const favProfiles = await db.query.profiles.findMany({
      where: (table, { inArray }) => inArray(table.id, favoritedIds),
    });

    return { success: true, data: favProfiles };
  } catch (error) {
    console.error("[GET_FAVORITES_ERROR]:", error);
    return { success: false, data: [] };
  }
}
