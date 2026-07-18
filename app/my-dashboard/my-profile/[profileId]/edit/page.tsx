import { db } from "@/lib/db";
import { profiles } from "@/drizzle/schema";
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

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, profileId),
    });

    if (!profile) {
        redirect("/my-dashboard");
    }

    if (profile.userId !== authedUser.id) {
        redirect("/my-dashboard");
    }

    return (
        <EditProfile
            initialData={
                profile as unknown as Parameters<typeof EditProfile>[0]["initialData"]
            }
            profileId={profileId}
        />
    );
};

export default EditProfilePage;
