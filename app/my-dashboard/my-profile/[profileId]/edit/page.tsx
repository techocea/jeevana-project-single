import { db } from "@/lib/db";
import { partnerPreferences, profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase";
import EditProfile from "./page.client";

interface PageProps {
    params: Promise<{ profileId: string }>;
}

const EditProfilePage = async ({ params }: PageProps) => {
    const { profileId } = await params;
    const supabase = await createClient();
    const {
        data: { user: authedUser },
    } = await supabase.auth.getUser();

    if (!authedUser) {
        redirect("/auth?mode=login");
    }

    const joinedResult = await db
        .select()
        .from(profiles)
        .leftJoin(
            partnerPreferences,
            eq(profiles.userId, partnerPreferences.userId),
        )
        .where(eq(profiles.id, profileId));

    if (!joinedResult || joinedResult.length === 0) {
        redirect("/my-dashboard");
    }

    const row = joinedResult[0];

    if (row.profiles.userId !== authedUser.id) {
        redirect("/my-dashboard");
    }

    const flatProfileData = {
        ...row.profiles,
        ...(row.partner_preferences || {}),
    };

    // console.log("Flattened user profile & preferences:", flatProfileData);

    return (
        <EditProfile initialData={flatProfileData as any} profileId={profileId} />
    );
};

export default EditProfilePage;
