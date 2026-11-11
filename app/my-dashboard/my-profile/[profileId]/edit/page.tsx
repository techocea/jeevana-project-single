import {db} from "@/lib/db";
import {partnerPreferences, profiles} from "@/drizzle/schema";
import {eq} from "drizzle-orm";
import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase";
import EditProfile from "./page.client";
import TitleHeader from "@/components/dashboard/title-header";
import {CancelButton} from "@/components/dashboard/cancel-button";
import { Separator } from "@/components/ui/separator";

interface PageProps {
    params: Promise<{ profileId: string }>;
}

const EditProfilePage = async ({params}: PageProps) => {
    const {profileId} = await params;
    const supabase = await createClient();
    const {
        data: {user: authedUser},
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

    // console.log("JOINED_RESULT:", joinedResult);

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
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-x-52 w-full">
                <TitleHeader title={"Edit Matrimonial Profile"}
                             description={"Update your profile information inside the dashboard. Approved profiles will generate a review request while the live advertisement remains active."}/>
                <CancelButton/>
            </div>

            <Separator/>

            <EditProfile initialData={flatProfileData as any} profileId={profileId}/>
        </div>

    );
};

export default EditProfilePage;
