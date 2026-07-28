import { getFavoriteProfiles } from "@/app/actions/favorite-actions";
import { db } from "@/lib/db";
import { profiles as profilesSchema } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase";

const MyFavorites = async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-100 text-red-500 font-medium">
                <p>User not authenticated</p>
            </div>
        );
    }

    const currentProfile = await db.query.profiles.findFirst({
        where: eq(profilesSchema.userId, user.id),
        columns: { id: true },
    });

    const myFavorites = await getFavoriteProfiles(currentProfile?.id ?? "");
    console.log("My Favorites:", myFavorites.data);

    return <div>MyFavorites</div>;
};

export default MyFavorites;
